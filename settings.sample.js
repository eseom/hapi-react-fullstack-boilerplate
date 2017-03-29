module.exports = {
  version: '0.1',
  apps: [
    'user',
    'ranky',
    'schedule',
    'band',
    'cafe',
  ],
  broker: {
    development: {
      url: 'redis://localhost:6379/10',
    },
    production: {
      url: 'redis://localhost:6379/10',
    },
  },
  redis: {
    development: {
      url: 'redis://localhost:6379/10',
    },
    production: {
      url: 'redis://localhost:6379/10',
    },
  },
  schedules: {
    development: [
      ['1 1 * * * *', 'kuejs.test'],
    ],
  },
  database: {
    development: {
      url: 'postgres://user@localhost/woo1',
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: false,
      },
    },
    development_sqlite3: {
      storage: 'test.database',
      dialect: 'sqlite',
    },
    test: {
      storage: ':memory:',
      dialect: 'sqlite',
    },
    production: {
      url: process.env.DATABASE_URL,
      logging: false,
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: false,
      },
      use_env_variable: 'DATABASE_URL',
    },
  },
}
