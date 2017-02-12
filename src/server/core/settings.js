export default {
  version: '0.1',
  apps: [
    'todo',
    'user',
    'items',
  ],
  database: {
    development: {
      storage: 'hrfb.database',
      dialect: 'sqlite',
    },
    test: {
      storage: ':memory:',
      dialect: 'sqlite',
    },
    production: {
      uri: process.env.DATABASE_URL,
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: true,
      },
      use_env_variable: 'DATABASE_URL',
    },
  },
};
