import Boom from 'boom'
import { route } from '../core'
import getItems from './getter'

const nestedRoute = route.nested('/api')

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
