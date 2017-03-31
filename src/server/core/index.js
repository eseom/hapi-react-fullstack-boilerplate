// @flow

import Hapi from 'hapi'
import Fs from 'fs'
import Inert from 'inert'
import Vision from 'vision'
import Path from 'path'
import SocketIo from 'socket.io'

import logger from '../logger'
import settings from './settings'
import { sequelize } from './db'

const handlers = []
const models = {}
const commands = {}
const command = {}

command.route = (mod: string, identifier: string, callback: () => {}) => {
  if (typeof commands[mod] === 'undefined') commands[mod] = {}
  commands[mod][identifier] = callback
}

command.execute = (mod: string, identifier: string) => {
  commands[mod][identifier]()
}

const apps = [...settings.apps, 'core']
const modules = {
  items: [],
  push: (item: string) => {
    modules.items.push(item)
  },
  install: () => {
    modules.items.forEach(it => require(it)) // eslint-disable-line import/no-dynamic-require
  },
}

apps.forEach((app) => {
  ['model', 'view', 'api', 'command'].forEach((mod) => {
    // TODO load command separately
    const file = `../${app}/${mod}`
    try {
      Fs.statSync(`${__dirname}/${file}.js`)
    } catch (e) {
      return
    }
    try {
      if (mod === 'model') {
        const importedModels = sequelize.import(file)
        Object.keys(importedModels).forEach((it) => {
          models[it] = importedModels[it]
        })
      } else {
        modules.push(Path.resolve(`${__dirname}/../${app}/${mod}`))
      }
    } catch (e) { logger.error(e) }
  })
})

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) models[modelName].associate(models)
})

const server = new Hapi.Server()

server.init = async () => {
  let port

  if (process.env.PORT) {
    port = process.env.PORT
  } else if (process.env.NODE_ENV !== 'production') {
    port = 3000
  } else {
    port = 8080
  }

  server.connection({
    port,
  })

  try {
    await (new Promise((resolve, reject) => {
      server.register([
        Inert,
        Vision,
        {
          register: require('yar'),
          options: {
            storeBlank: false,
            cookieOptions: {
              password: 'the-password-must-be-at-least-32-characters-long',
              isSecure: false,
            },
          },
        },
        {
          register: require('hapi-es7-async-handler'),
          options: {
            server,
          },
        },
        {
          register: require('hapi-swagger'),
          options: {
            info: {
              title: 'Test API Documentation',
              version: '0.1',
            },
          },
          grouping: 'tags',
        },
      ], (err) => {
        if (err) reject(err)
        resolve(true)
      })
    }))
  } catch (e) {
    logger.error(e, e.stack)
  }

  /* socket io */

  const io = new SocketIo(server.connections[0].listener, { path: '/ws' })
  const bufferSize = 100
  const messageBuffer = new Array(bufferSize)
  let messageIndex = 0

  io.on('connection', (socket) => {
    socket.emit('news', { msg: '\'Hello World!\' from server' })

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index += 1) {
        const msgNo = (messageIndex + index) % bufferSize
        const msg = messageBuffer[msgNo]
        if (msg) {
          socket.emit('msg', msg)
        }
      }
    })

    socket.on('msg', (data) => {
      data.id = messageIndex // eslint-disable-line no-param-reassign
      messageBuffer[messageIndex % bufferSize] = data
      messageIndex += 1
      io.emit('msg', data)
    })
  })

  /* end socket io */

  try {
    modules.install()
    handlers.forEach(handler => server.route(handler))
  } catch (e) {
    logger.error('module install error', e)
  }
}

const makeRoutes = (prefix = '') => {
  const innerRoute = {}
  const methods = ['get', 'post', 'put', 'del', 'any']
  methods.forEach((hm) => {
    let method = hm.toUpperCase()
    if (hm === 'any') method = '*'
    if (hm === 'del') method = 'delete'
    innerRoute[hm] = (path, config, handler) => handlers.push({
      path: `${prefix}${path}`,
      method,
      handler,
      config,
    })
  })
  innerRoute.nested = (prefixNested: string) => makeRoutes(prefix + prefixNested)
  return innerRoute
}
const route = makeRoutes()

export {
  modules,
  route,
  command,
  models,
  sequelize,
  logger,
  server,
}
