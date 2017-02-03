// @flow

import Hapi from 'hapi';
import fs from 'fs';
import joi from 'joi';
import boom from 'boom';
import Inert from 'inert';
import Vision from 'vision';
import SocketIo from 'socket.io';
import Sequelize from 'sequelize';
import logger from '../logger';
import settings from './settings';

const handlers = [];

export { logger, joi, boom };

export const models = {};

const prepare = () => {
  const dbconfig = settings.database[process.env.NODE_ENV];
  const sequelize = new Sequelize(
    dbconfig.database, dbconfig.username,
    dbconfig.password, {
      storage: dbconfig.storage,
      dialect: dbconfig.dialect,
    },
  );
  const apps = [...settings.apps, 'core'];
  apps.forEach((app) => {
    ['models', 'views', 'api'].forEach((mod) => {
      const file = `../${app}/${mod}`;
      try {
        fs.statSync(`${__dirname}/${file}.js`);
      } catch (e) {
        return;
      }
      try {
        if (mod === 'models') {
          const importedModels = sequelize.import(file);
          Object.keys(importedModels).forEach((it) => {
            models[it] = importedModels[it];
          });
        } else {
          require(`../${app}/${mod}`); // eslint-disable-line import/no-dynamic-require
        }
      } catch (e) { logger.error(e); }
    });
  });

  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) models[modelName].associate(models);
  });

  // sequelize.sync();
};

const get = (
  path: string,
  handler: any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'GET',
    handler,
    config,
  });
};

const post = (
  path: string,
  handler: (request: Request, reply: () => {}) => any | any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'POST',
    handler,
    config,
  });
};

const put = (
  path: string,
  handler: Object,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'PUT',
    handler,
    config,
  });
};

const del = (
  path: string,
  handler: any,
  config: Object,
) => {
  handlers.push({
    path,
    method: 'DELETE',
    handler,
    config,
  });
};

const any = (
  path: string,
  handler: any,
  config: Object,
) => {
  handlers.push({
    path,
    method: '*',
    handler,
    config,
  });
};

export const route = {
  get,
  post,
  put,
  del,
  any,
  nested: (prefix: string) => ({
    get: (
      path: string,
      handler: (request: Request, reply: () => {}) => any,
      config: Object,
    ) => {
      get(prefix + path, handler, config);
    },
    post: (
      path: string,
      handler: (request: Request, reply: () => {}) => any,
      config: Object,
    ) => {
      post(prefix + path, handler, config);
    },
    put: (
      path: string,
      handler: (request: Request, reply: () => {}) => any,
      config: Object,
    ) => {
      put(prefix + path, handler, config);
    },
    del: (
      path: string,
      handler: (request: Request, reply: () => {}) => any,
      config: Object,
    ) => {
      del(prefix + path, handler, config);
    },
    any: (
      path: string,
      handler: (request: Request, reply: () => {}) => any,
      config: Object,
    ) => {
      any(prefix + path, handler, config);
    },
  }),
};

export const getServer = () => {
  prepare();

  logger.debug('prepare');

  let port;

  if (process.env.PORT) {
    port = process.env.PORT;
  } else if (DEVELOPMENT) {
    port = 3000;
  } else {
    port = 8080;
  }

  const server = new Hapi.Server();

  server.connection({
    port,
  });

  server.register([
    Inert,
    Vision,
    {
      register: require('yar'),
      options: {
        storeBlank: false,
        cookieOptions: {
          password: 'the-password-must-be-at-least-32-characters-long',
          isSecure: false,
        },
      },
    },
    {
      register: require('./plugins/hapi-async-route'),
      options: {
        server,
      },
    },
    {
      register: require('hapi-swagger'),
      options: {
        info: {
          title: 'Test API Documentation',
          version: '0.1',
        },
      },
    },
  ]);


  /* socket io */

  const io = new SocketIo(server.connections[0].listener, { path: '/ws' });
  const bufferSize = 100;
  const messageBuffer = new Array(bufferSize);
  let messageIndex = 0;

  io.on('connection', (socket) => {
    socket.emit('news', { msg: '\'Hello World!\' from server' });

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index += 1) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex; // eslint-disable-line no-param-reassign
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex += 1;
      io.emit('msg', data);
    });
  });

  /* end socket io */

  handlers.forEach(handler => server.route(handler));

  return server;
};
