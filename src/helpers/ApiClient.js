import superagent from 'superagent'

const methods = ['get', 'post', 'put', 'patch', 'del']

// redundant to server/server.js
let port
if (process.env.PORT) {
  port = process.env.PORT
} else if (DEVELOPMENT) {
  port = 3000
} else {
  port = 8080
}

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path
  if (SERVER) {
    return `http://${process.env.HOST || 'localhost'}:${port}${adjustedPath}`
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return adjustedPath
}

export default class ApiClient {
  constructor(req) {
    methods.forEach(method => (
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path))

        if (params) {
          request.query(params)
        }

        if (SERVER && req.headers.cookie) {
          request.set('cookie', req.headers.cookie)
        }

        if (data) {
          request.send(data)
        }

        request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)))
      })
    ))
  }
  static empty() {}
}
