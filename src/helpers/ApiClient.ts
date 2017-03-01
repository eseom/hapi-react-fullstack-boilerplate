import * as superagent from 'superagent'

const port = 3000

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path
  if (process.env.EXEC_ENV === 'server') {
    return `http://${process.env.HOST || 'localhost'}:${port}${adjustedPath}`
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return adjustedPath
}

export class ApiClient {
  constructor(req?) {
    ['get', 'post', 'put', 'patch', 'del'].forEach((method) => (
      this[method] = (path, { params, data } = { params: {}, data: {} }) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path))

        if (params) {
          request.query(params)
        }
        if (process.env.EXEC_ENV === 'server' && req.headers.cookie) {
          request.set('cookie', req.headers.cookie)
        }
        if (data) {
          request.send(data)
        }

        request.end((err, { body } = { body: '' }) => (err ? reject(body || err) : resolve(body)))
      })
    ))
  }
}