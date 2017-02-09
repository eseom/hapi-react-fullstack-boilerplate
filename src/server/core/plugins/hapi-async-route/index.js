/* eslint no-param-reassign: "off" */

import Boom from 'boom';

let origRoute;

const register = (server: Object, pOptions: Object, next: () => {}) => {
  const innerRoute = (options: Object) => {
    // work with async handler
    if (options.handler) {
      if (options.handler instanceof Function) {
        const t = options.handler;
        options.handler = (request, reply) => {
          const p = t(request, reply);
          if (p && p.catch) {
            p.catch((e) => {
              console.error(e.stack);  // eslint-disable-line no-console
              console.error(e.toString()); // eslint-disable-line no-console
              reply(Boom.badGateway('server error'));
            });
          }
        };
      }
    }
    return origRoute.apply(pOptions.server, [options]);
  };

  origRoute = pOptions.server.route;

  function route(options: Object) {
    if (Array.isArray(options)) {
      return options.map(option => innerRoute(option));
    }
    return innerRoute(options);
  }
  pOptions.server.route = route;
  next();
};

register.attributes = {
  name: 'hapi-async-handler',
  version: '0.0.1',
};

export {
  register, // eslint-disable-line import/prefer-default-export
};
