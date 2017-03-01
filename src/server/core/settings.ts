export interface Settings {
  version: string
  apps: Array<string>
  database: Object
}

export default {
  version: '0.1',
  apps: [
    'user',
    'manager',
  ],
  database: {
    test: {
      storage: ':memory:',
      dialect: 'sqlite',
    },
    development: {
      storage: 'pm2web.database',
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
}