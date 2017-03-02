# hapi-react-fullstack-boilerplate

Typescript, Hapi, Sequelize, React, Redux, Reactstrap
react full web stack with SSR (server side rendering) with Hapi echo system.

##Features
* [Typescript](https://www.typescriptlang.org/)
* [HapiJS](https://github.com/hapijs/hapi)
* [ReactJS](https://github.com/reactjs)
* SSR
* Webpack2
* [React-Router](https://github.com/rackt/react-router)
* [Redux](https://github.com/rackt/redux)
* Document Head [React-Helmet](https://github.com/nfl/react-helmet)
* Linting with tslint
* Testing with karma, mocha
* API Documentation [Swagger](https://github.com/glennjones/hapi-swagger)
* [Sequelize](https://github.com/sequelize/sequelize) - cover traditional web apps.
* session based authentication
* [Socket.io](https://github.com/socketio/socket.io)
* sass loader, node sass
* [Reactstrap](https://reactstrap.github.io/)

## Usage
**development**

```
git clone https://github.com/eseom/hapi-react-fullstack-boilerplate.git
yarn
yarn db:upgrade # for db migration
yarn dev
```

**testing**

```
yarn test
yarn test:node
yarn test:node:watch
```

**production**

```
yarn
yarn build
yarn start
open http://localhost:3000
```


**API Interface**

    Path: /documentation


## Todo
* [ ] oauth2 authentication...

## License
The MIT License (MIT)

Copyright (c) 2015 Roberto Ortis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
