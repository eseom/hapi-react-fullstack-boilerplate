import winston from 'winston'

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
  ],
})

export default logger
