import * as React from 'react'
import * as ReactDOM from 'react-dom/server'
import * as serialize from 'serialize-javascript'

interface IProps {
  dispatch?: Function,
  component?: Object,
  assets: {
    javascript: {
      main: string,
    },
    assets: Object[],
    styles: Object[],
  },
  store: {
    getState: Function,
  },
}

// interface IState { }

export class Html extends React.Component<IProps, {}> {
  render() {
    const { assets, component, store } = this.props
    const content = ReactDOM.renderToString(component)

    return (
      <html>
        <head>
          <link rel="icon" href="favicon.ico?v3" type="image/x-icon" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" />
          {Object.keys(assets.styles).map((style, key) => (
            <link
              href={assets.styles[style]}
              key={key}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
            />
          ))}

          {Object.keys(assets.assets).map((key, index) => {
            return (
              <style
                key={index}
                dangerouslySetInnerHTML={{ __html: assets.assets[key]._style }}
              />
            )
          })}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

          <script dangerouslySetInnerHTML={{ __html: `window.processedStore=${serialize(store.getState())};` }} charSet="UTF-8" />
          <script src={assets.javascript.main} />
        </body>

      </html>
    )
  }
}
