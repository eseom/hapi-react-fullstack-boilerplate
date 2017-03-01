import * as PathOnBase from 'path'

export const webpackBaseConfig = {
  context: PathOnBase.resolve(__dirname + '/..'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'awesome-typescript-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', 'css', 'scss'],
  },
}
