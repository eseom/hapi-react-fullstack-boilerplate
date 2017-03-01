import * as git from 'gift'
import * as pm2 from 'pm2'
import * as Joi from 'joi'
import { route } from '../core'


const nestedRoute = route.nested('/api/manager')

interface IPm2Process {
  name: string
  pm2_env: {
    versioning: {
      repo_path: string
    }
  }
}

const pm2connect = async () => {
  return await new Promise((resolve, reject) => {
    pm2.connect(function (err) {
      if (err) { reject(err) }
      resolve(true)
    })
  })
}

const pm2list = async () => {
  return await new Promise((resolve, reject) => {
    pm2.list(function (err, list: Array<IPm2Process>) {
      if (err) { reject(err) }
      resolve(list)
    })
  })
}

const pm2start = async (name) => {
  return await new Promise((resolve, reject) => {
    pm2.start(name, function (err, proc) {
      if (err) { reject(err) }
      resolve(proc)
    })
  })
}

const pm2stop = async (name) => {
  return await new Promise((resolve, reject) => {
    pm2.stop(name, function (err, proc) {
      if (err) { reject(err) }
      resolve(proc)
    })
  })
}

nestedRoute.get('/list', async (request, reply) => {
  await pm2connect()
  reply({ result: (await pm2list()) as Array<IPm2Process> })
  pm2.disconnect()
}, {
    tags: ['api'],
  }
)

nestedRoute.get('/start/{name}', async (request, reply) => {
  await pm2connect()
  reply(await pm2start(request.params.name))
  pm2.disconnect()
}, {
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    tags: ['api'],
  }
)

nestedRoute.get('/stop/{name}', async (request, reply) => {
  await pm2connect()
  reply(await pm2stop(request.params.name))
  pm2.disconnect()
}, {
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    tags: ['api'],
  }
)

nestedRoute.get('/sync_and_restart/{name}', async (request, reply) => {
  await pm2connect()
  const list: Array<IPm2Process> = (await pm2list()) as Array<IPm2Process>
  const proc: Array<IPm2Process> = list.filter((it) => {
    return it.name === request.params.name
  })
  git.init(proc[0].pm2_env.versioning.repo_path, (err, repo) => {
    repo.sync((syncResult) => {
      pm2.restart(request.params.name, (err, proc) => {
        if (err) { throw err }
        reply(proc)
        pm2.disconnect() // Disconnects from PM2
      })
    })
  })
}, {
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    tags: ['api'],
  }
)
