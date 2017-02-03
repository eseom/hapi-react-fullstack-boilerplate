// @flow

import Joi from 'joi';
import { route } from '../core';

const nestedRoute = route.nested('/api');

nestedRoute.get('/loadAuth', async (request, reply) => {
  reply(request.yar.get('user') || null);
}, {
  tags: ['api'],
});

nestedRoute.post('/login', async (request, reply) => {
  const user = {
    name: request.payload.name,
  };
  request.yar.set('user', user);
  reply(user);
}, {
  tags: ['api'],
  validate: {
    payload: {
      name: Joi.string().required(),
    },
  },
});

nestedRoute.get('/logout', async (request, reply) => {
  request.yar.clear('user');
  reply({ result: true });
}, {
  tags: ['api'],
});
