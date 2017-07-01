import { server } from 'hails'

const { scheduler } = server

scheduler.register('/core/testCamelCase', (job, done) => {
  server.broadcast({
    type: 'schedule.requested-alert',
    now: new Date(),
    description: 'see src/server/core/task.js',
  })
  done()
})

setInterval(() => {
  scheduler.now('/core/testCamelCase')
}, 3000)
