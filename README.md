# hapi-react-fullstack-boilerplate
Hapi, Sequelize, React, Redux, Bootstrap, etc.

react full web stack with rendering server, hapi echosystem

## DEMO

[heroku deployed demo](https://hapi-react-fullstack-bp.herokuapp.com/)

## Features
* [HapiJS](https://github.com/hapijs/hapi)
* [ReactJS](https://github.com/reactjs)
* SSR
* Webpack 2 (new webpack config structure)
* [React-Router](https://github.com/rackt/react-router)
* [Redux](https://github.com/reactjs/redux)
* Document Head [React-Helmet](https://github.com/nfl/react-helmet)
* [BabelJs](https://babeljs.io/)
* Linting with eslint & jscs
* Testing with karma, mocha
* API Documentation [Swagger](https://github.com/glennjones/hapi-swagger)
* [Sequelize](https://github.com/sequelize/sequelize) - cover traditional web apps.
* session based authentication
* react-hapines
* sass loader, node sass
* react-ga

## Extra features
* [hails](https://github.com/eseom/hails) - Django style Hapi module structure
* custom console execution with the context
```bash
yarn hails exec items get # see src/server/items/command.js
```

## Usage
**development**

```bash
git clone https://github.com/eseom/hapi-react-fullstack-boilerplate.git <project>
cd <project>
yarn
cp settings.sample.js settings.js
vim settings.js (edit database connection or something)
yarn hails db:upgrade # for db migration
yarn dev
```

**db**
```bash
yarn hails db:create # create a sequelize migration file in db/migrations/
yarn hails db:up # process pending migrations
yarn hails db:down # revert the last migration
yarn hails db:status # show migration status
```

**testing**

```bash
yarn test
yarn test:node
yarn test:node:watch
```

**production**

```bash
yarn build

# acording to settings.js
[PORT=4000 ] \
  DATABASE_URL=postgres://<username>@<hostname>:<port>/<dbname> \
  REDIS_URL=redis://:<password>@<hostname>:<port>/<database_number> \
  yarn start
```

**API Interface**

    Path: /documentation

## Editor Configuration
- **vscode**
```
code --install-extension dbaeumer.vscode-eslint
```
- **Atom**
```bash
apm install editorconfig es6-javascript atom-ternjs javascript-snippets linter linter-eslint language-babel autocomplete-modules file-icons
```

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

## Reference

** initially forked from**

* [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) by [erikras](https://github.com/erikras)
