// @flow

import Sequelize from 'sequelize'

import logger from '../logger'
import settings from '../../../settings'

// prepare db connection
const dbconfig = settings.database[process.env.NODE_ENV]
let sequelizeWithOption

if (typeof dbconfig.logging === 'undefined') dbconfig.logging = logger.info

if (dbconfig.dialect === 'postgres') {
  const pg = require('pg')

  // https://github.com/sequelize/sequelize/issues/4550
  pg.defaults.parseInt8 = true
  // https://github.com/sequelize/sequelize/issues/3768#issuecomment-105055775
  pg.types.setTypeParser(1114, (stringValue) => {
    let suffix = ''
    if (stringValue.indexOf('.') === -1) suffix = '.001' // sequelize bug without miliseconds
    return new Date(`${stringValue}${suffix}UTC`)
  })
}

if (dbconfig.url) {
  sequelizeWithOption = new Sequelize(dbconfig.url, {
    logging: dbconfig.logging,
    dialect: dbconfig.dialect,
    protocol: dbconfig.protocol,
    dialectOptions: dbconfig.dialectOptions,
    timezone: '+00:00',
  })
} else {
  sequelizeWithOption = new Sequelize(
    dbconfig.database, dbconfig.username,
    dbconfig.password, {
      logging: dbconfig.logging,
      storage: dbconfig.storage,
      dialect: dbconfig.dialect,
      timezone: '+00:00',
    },
  )
}

export const sequelize = sequelizeWithOption
