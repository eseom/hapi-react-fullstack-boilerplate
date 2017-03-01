import * as Hapi from 'hapi'
import * as Path from 'path'
import * as Fs from 'fs'
import * as Sequelize from 'sequelize'
import settings from './settings'

const server = new Hapi.Server()
const host = 'localhost'
const port = 3000

server.connection({
  host,
  port,
  routes: {
    json: {
      space: 2,
    },
  },
})

interface ICommand {
  route: (mod: string, indentifier: string, callback: () => {}) => void
  execute: (mod: string, indentifier: string) => void
}

const handlers = []
const models = {}
const commands = {}
const command: ICommand = {
  route: (mod: string, identifier: string, callback: () => {}) => {
    if (typeof commands[mod] === 'undefined') { commands[mod] = {} }
    commands[mod][identifier] = callback
  },
  execute: (mod: string, identifier: string) => {
    commands[mod][identifier]()
  },
}

// prepare db connection
const dbconfig = settings.database[process.env.NODE_ENV]
let sequelizeWithOption

if (dbconfig.uri) {
  sequelizeWithOption = new Sequelize(dbconfig.uri, {
    dialect: dbconfig.dialect,
    protocol: dbconfig.protocol,
    dialectOptions: dbconfig.dialectOptions,
  })
} else {
  sequelizeWithOption = new Sequelize(
    dbconfig.database, dbconfig.username,
    dbconfig.password, {
      storage: dbconfig.storage,
      dialect: dbconfig.dialect,
    },
  )
}

const apps = [...settings.apps, 'core']
const modules = {
  items: [],
  push: (item: string) => {
    modules.items.push(item)
  },
  install: () => {
    modules.items.forEach((it) => require(it))
  },
}

apps.forEach((app) => {
  ['model', 'view', 'api', 'command'].forEach((mod) => {
    // TODO load command separately
    const file = `../${app}/${mod}`
    try {
      Fs.statSync(`${__dirname}/${file}.ts`)
    } catch (e) {
      return
    }
    try {
      if (mod === 'model') {
        const importedModels = sequelizeWithOption.import(file)
        Object.keys(importedModels).forEach((it) => {
          models[it] = importedModels[it]
        })
      } else {
        modules.push(Path.resolve(`${__dirname}/../${app}/${mod}`))
      }
    } catch (e) { console.error(e) }
  })
})

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) { models[modelName].associate(models) }
})

const getServer = async () => {
  await new Promise((resolve, reject) => {
    const plugins = [
      require('inert'),
      require('vision'),
      require('hapi-swagger'),
      require('hapi-es7-async-handler'),
      {
        register: require('yar'),
        options: {
          storeBlank: false, cookieOptions: {
            password: 'the-password-must-be-at-least-32-characters-long',
            isSecure: true,
          },
        },
      },
    ]
    server.register(plugins, (err) => (
      err ? reject(err) : resolve(true)
    ))
  })

  /* socket io */

  // const io = new SocketIo(server.connections[0].listener, { path: '/ws' })
  // const bufferSize = 100
  // const messageBuffer = new Array(bufferSize)
  // let messageIndex = 0

  // io.on('connection', (socket) => {
  //     socket.emit('news', { msg: '\'Hello World!\' from server' })

  //     socket.on('history', () => {
  //     for (let index = 0; index < bufferSize; index += 1) {
  //         const msgNo = (messageIndex + index) % bufferSize
  //         const msg = messageBuffer[msgNo]
  //         if (msg) {
  //         socket.emit('msg', msg)
  //         }
  //     }
  //     })

  //     socket.on('msg', (data) => {
  //     data.id = messageIndex // eslint-disable-line no-param-reassign
  //     messageBuffer[messageIndex % bufferSize] = data
  //     messageIndex += 1
  //     io.emit('msg', data)
  //     })
  // })

  /* end socket io */

  modules.install()
  handlers.forEach((handler) => server.route(handler))

  return server
}

const get = (
  path: string,
  handler: ((request, reply: Hapi.IReply) => any) | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'GET',
    handler,
    config,
  })
}

const post = (
  path: string,
  handler: ((request, reply: Hapi.IReply) => any) | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'POST',
    handler,
    config,
  })
}

const put = (
  path: string,
  handler: ((request, reply: Hapi.IReply) => any) | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'PUT',
    handler,
    config,
  })
}

const del = (
  path: string,
  handler: ((request, reply: Hapi.IReply) => any) | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'DELETE',
    handler,
    config,
  })
}

const any = (
  path: string,
  handler: ((request, reply: Hapi.IReply) => any) | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: '*',
    handler,
    config,
  })
}

const route = {
  get,
  post,
  put,
  del,
  any,
  nested: (prefix: string) => ({
    get: (
      path: string,
      handler: ((request, reply: Hapi.IReply) => any) | any,
      config: Object,
    ) => {
      get(prefix + path, handler, config)
    },
    post: (
      path: string,
      handler: ((request, reply: Hapi.IReply) => any) | any,
      config: Object,
    ) => {
      post(prefix + path, handler, config)
    },
    put: (
      path: string,
      handler: ((request, reply: Hapi.IReply) => any) | any,
      config: Object,
    ) => {
      put(prefix + path, handler, config)
    },
    del: (
      path: string,
      handler: ((request, reply: Hapi.IReply) => any) | any,
      config: Object,
    ) => {
      del(prefix + path, handler, config)
    },
    any: (
      path: string,
      handler: ((request, reply: Hapi.IReply) => any) | any,
      config: Object,
    ) => {
      any(prefix + path, handler, config)
    },
  }),
}

export {
  getServer,
  modules,
  models,
  route,
}
