const redisDSN = 'redis://:dev@localhost:16379/10'

module.exports = {
  development: {
    version: '0.0.1',
    connection: {
      port: 3000,
    },
    modules: [
      'core',
      'user',
      'todo',
      'items',
    ],
    viewEngine: {
      type: 'nunjucks',
    },
    scheduler: {
      enable: true,
      broker: {
        redis: redisDSN,
      },
      schedules: [
        ['*/10 * * * * *', 'user.test'],
      ],
    },
    redis: redisDSN,
    useSequelize: true,
    database: {
      storage: 'test.database',
      dialect: 'sqlite',
    },
    database_pgsql: {
      url: process.env.DATABASE_URL,
      options: {
        logging: false,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: false,
        },
      },
      use_env_variable: 'DATABASE_URL',
      migrationStorageTableName: 'sequelize_meta',
    },
    database_test: {
      storage: ':memory:',
      dialect: 'sqlite',
    },
    exportToClient: { // export to browser
      gacode: 'UA-000000000-1',
      mockObject: {
        test: 1,
      },
    },
  },
}
