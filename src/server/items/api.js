import Boom from 'boom'
import { server } from 'hails'
import getItems from './getter'

const nestedRoute = server.route.nested('/api')

nestedRoute.get('/items', {
  tags: ['api'],
}, async (request, reply) => {
  const items = await getItems()
  if (items) {
    reply(items)
  } else {
    reply(Boom.serverUnavailable('Widget load fails 33% of the time. You were unlucky.', {}))
  }
})

nestedRoute({
  config: {
    tags: ['api'],
  },
  path: '/items2',
  method: 'get',
  handler: (request, reply) => {
    reply({})
  },
})
