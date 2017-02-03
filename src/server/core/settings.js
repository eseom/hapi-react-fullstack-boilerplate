// @flow

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
      storage: 'production.database',
      dialect: 'sqlite',
    },
  },
};
