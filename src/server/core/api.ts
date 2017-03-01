import Boom from 'boom'
import { route } from '../core'

const nestedRoute = route.nested('/api')

nestedRoute.get('/loadInfo', async (request, reply) => {
  reply({
    message: 'This came from the api server',
    time: Date.now(),
  })
}, {
    tags: ['api'],
  })

route.get('/favicon.ico', {
  file: `${__dirname}/assets/favicon.ico`,
}, {})

route.any('/api/{p*}', async (request, reply) => {
  reply(Boom.notFound('NOT FOUND'))
}, {})
