module.exports = {
  development: {
    version: '0.1',
    modules: [
      'core',
      'user',
      'todo',
      'items',
    ],
    broker: {
      url: 'redis://localhost:6379/10',
    },
    redis: {
      url: 'redis://localhost:6379/10',
    },
    schedules: [
      // ['1 1 * * * *', 'kuejs.test'],
    ],
    database: {
      storage: 'test.database',
      dialect: 'sqlite',
    },
  },
  production: {
    version: '0.1',
    modules: [
      'core',
      'user',
      'todo',
      'items',
    ],
    broker: {
      url: 'redis://localhost:6379/10',
    },
    redis: {
      url: 'redis://localhost:6379/10',
    },
    schedules: [
      // ['1 1 * * * *', 'kuejs.test'],
    ],
    database: {
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
