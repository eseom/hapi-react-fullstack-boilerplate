import Joi from 'joi'
import Boom from 'boom'
import { server, models } from 'hails'

const { User } = models
const nestedRoute = server.route.nested('/api')

nestedRoute.get('/load-auth', {
  tags: ['api'],
}, async (request, reply) => {
  reply(request.yar.get('user') || null)
})

nestedRoute.post('/login', {
  tags: ['api'],
  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
}, async (request, reply) => {
  const email = request.payload.email
  const user = await User.find({
    where: {
      email,
    },
  })
  if (!user) {
    setTimeout(() => { // delay 2 second for testing
      reply(Boom.unauthorized(`no such user: ${email}`))
    }, 2000)
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
})

nestedRoute.get('/logout', {
  tags: ['api'],
}, async (request, reply) => {
  request.yar.clear('user')
  reply({ result: true })
})
