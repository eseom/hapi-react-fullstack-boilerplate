// @flow
/* eslint no-param-reassign: "off" */

import Boom from 'boom';

let origRoute;

exports.register = (server: Object, pOptions: Object, next: () => {}) => {
  const innerRoute = (options: Object) => {
    // work with async handler
    if (options.handler) {
      if (options.handler instanceof Function) {
        const t = options.handler;
        options.handler = (request, reply) => {
          const p = t(request, reply);
          if (p && p.catch) {
            p.catch((e) => {
              console.error(e.stack);
              console.error(e.toString());
              reply(Boom.badGateway('server error'));
            });
          }
        };
      }
    }
    return origRoute.apply(pOptions.server, [options]);
  };

  // router = new Call.Router();
  origRoute = pOptions.server.route;
  // pOptions.server.app.namedRoutes = namedRoutes;

  function route(options: Object) {
    if (Array.isArray(options)) {
      return options.map(option => innerRoute(option));
    }
    return innerRoute(options);
  }
  pOptions.server.route = route;
  next();
};

exports.register.attributes = {
  name: 'hapi-async-handler',
  version: '0.0.1',
};
