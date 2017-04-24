import Boom from 'boom'
import { server } from 'hails'

const nestedRoute = server.route.nested('/api')

nestedRoute.get('/load-info', {
  tags: ['api'],
}, async (request, reply) => {
  reply({
    message: 'This came from the api server',
    time: Date.now(),
  })
})

server.route.get('/favicon.ico', {}, {
  file: `${__dirname}/../static/favicon.ico`,
})

server.route.get('/static/{p*}', {}, {
  directory: {
    path: '../static',
  },
})

server.route.any('/api/{p*}', {}, async (request, reply) => {
  reply(Boom.notFound('NOT FOUND'))
})
