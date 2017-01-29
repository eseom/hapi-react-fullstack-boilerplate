// @flow
/* eslint global-require: "off" */

import Hapi from 'hapi';
import Inert from 'inert';
import Boom from 'boom';
import Joi from 'joi';
import Vision from 'vision';
import SocketIo from 'socket.io';
import hapiSwagger from 'hapi-swagger';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import logger from '../logger';
import { Todo } from './models'; // eslint-disable-line import/named

const getItems = async () => {
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
  const url = 'https://distrowatch.com/packages.php';

  const body = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
    },
  }).then(b => b.text());

  const $ = cheerio.load(body);
  const ret = [];
  $('.Auto tr').each((i1, tr) => {
    if (i1 === 0) return;
    const nameNode = $('th', tr);
    const name = {
      link: $('a', nameNode).attr('href'),
      text: nameNode.text(),
    };
    const versionNode = $('td', tr);
    let version;
    versionNode.each((i2, td) => {
      if (i2 === 0) {
        version = {
          link: $('a', td).attr('href'),
          text: $('a', td).text(),
        };
      }
    });
    ret.push({
      id: i1,
      name,
      version,
      note: $('.Note1', tr).text(),
    });
  });
  return ret;
};

const server = new Hapi.Server();

let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else if (DEVELOPMENT) {
  port = 3000;
} else {
  port = 8080;
}

server.connection({
  port,
  routes: {
    json: {
      space: 2,
    },
  },
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
    register: hapiSwagger,
    options: {
      info: {
        title: 'Test API Documentation',
        version: '0.1',
      },
    },
  },
  // {
  //   register: hapiOauth2,
  //   options: {
  //     handlers: oauth2Handlers,
  //   },
  // },
]);

server.route({
  method: 'get',
  path: '/favicon.ico',
  handler: {
    file: `${__dirname}/../static/favicon.ico`,
  },
});

server.route({
  method: 'get',
  path: '/static/{p*}',
  handler: {
    directory: {
      path: '../static',
    },
  },
});

server.route({
  path: '/api/loadAuth',
  method: 'get',
  handler: async (request, reply) => {
    reply(request.yar.get('user') || null);
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/api/loadInfo',
  method: 'get',
  handler: async (request, reply) => {
    reply({
      message: 'This came from the api server',
      time: Date.now(),
    });
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/api/login',
  method: 'post',
  handler: async (request, reply) => {
    const user = {
      name: request.payload.name,
    };
    request.yar.set('user', user);
    reply(user);
  },
  config: {
    tags: ['api'],
    validate: {
      payload: {
        name: Joi.string().required(),
      },
    },
  },
});

server.route({
  path: '/api/logout',
  method: 'get',
  handler: async (request, reply) => {
    request.yar.clear('user');
    reply({ result: true });
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/api/items',
  method: 'get',
  handler: async (request, reply) => {
    const items = await getItems();
    if (items) {
      reply(items);
    } else {
      reply(Boom.serverUnavailable('Widget load fails 33% of the time. You were unlucky.', {}));
    }
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/todos',
  method: 'get',
  handler: async (request, reply) => {
    const todos = await Todo.findAll();
    logger.info('todo list %d', todos.length);
    reply({
      url: '/todo',
      todos,
    });
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/todos',
  method: 'post',
  handler: async (request, reply) => {
    const todo = await Todo.create({
      title: request.payload.title,
      userId: 1,
    });
    logger.info('add todo: %d %s', todo.id, todo.title);
    reply({ result: true, id: todo.id });
  },
  config: {
    tags: ['api'],
    validate: {
      payload: {
        title: Joi.string(),
      },
    },
  },
});

server.route({
  path: '/todos/{id}',
  method: 'put',
  handler: async (request, reply) => {
    const todo = await Todo.findOne({
      where: {
        id: request.params.id,
      },
    });
    if (todo === null) {
      return reply(Boom.notFound(`id ${request.params.id}`));
    }
    todo.title = request.payload.title;
    logger.info('put todo: %d %s', todo.id, todo.title);
    await todo.save();
    return reply({ result: true, id: todo.id });
  },
  config: {
    tags: ['api'],
  },
});

server.route({
  path: '/todos/{id}',
  method: 'delete',
  handler: async (request, reply) => {
    const todo = await Todo.findOne({ id: request.params.id });
    logger.info('delete todo: %d %s', todo.id, todo.title);
    await todo.destroy();
    reply({ result: true, id: todo.id });
  },
  config: {
    tags: ['api'],
    validate: {
      params: {
        id: Joi.number(),
      },
    },
  },
});

server.route({
  method: '*',
  path: '/api/{p*}',
  handler: (request, reply) => {
    reply(Boom.notFound('NOT FOUND'));
  },
});

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

export default server;
