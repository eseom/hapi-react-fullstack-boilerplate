import * as Joi from 'joi'
import * as Boom from 'boom'
import { route, models } from '../core'

// const { User } = models
const nestedRoute = route.nested('/api')

nestedRoute.get('/loadAuth', async (request, reply) => {
  reply(request.yar.get('user') || null)
}, {
    tags: ['api'],
  })

nestedRoute.post('/login', async (request, reply) => {
  const username = request.payload.username
  // const user = await User.find({
  //   where: {
  //     username,
  //   },
  // })
  const user = null
  if (!user) {
    reply(Boom.unauthorized(`no such user: ${username}`))
    return
  }
  const authenticated = user.authenticate(request.payload.password)
  if (authenticated) {
    setTimeout(() => { // delay 1 second for testing
      request.yar.set('user', user)
      reply(user)
    }, 1000)
  } else {
    setTimeout(() => { // delay 1 second for testing
      reply(Boom.unauthorized('password mismatch'))
    }, 2000)
  }
}, {
    tags: ['api'],
    validate: {
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
  },
)

nestedRoute.get('/logout', async (request, reply) => {
  request.yar.clear('user')
  reply({ result: true })
}, {
    tags: ['api'],
  })
