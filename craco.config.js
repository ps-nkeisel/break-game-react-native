const path = require('path');
const  ThreadsPlugin = require("threads-plugin")

module.exports = {
  webpack: {
    plugins: [
      new ThreadsPlugin()
    ],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@(.*)$': '<rootDir>/src$1',
      },
    },
  },
}