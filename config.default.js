const moment = require('moment')
const _ = require('lodash')

function required (key) {
  return `ERR_REQUIRED#${key}`
}

const defaultConfig = {
  // MISTY configuration
  App: {
    // Application name
    name: 'misty',
    port: 3000,
    host: ($) => `http://localhost:${$.App.port}`
  },
  Assets: {
    enabled: true,
    route: '/public',
    dir: 'public',
    url: ($) => `${$.App.host}/${$.Assets.route.replace(/^\/+/, '')}`,
    version: moment().format('X')
  },
  'Csrf': {
    'whitelist': []
  },
  Heimdallr: {
    host: 'https://accounts.supersoccer.tv',
    login: ($) => `${$.App.host}/accounts/login`,
    auth: ($) => `${$.Heimdallr.host}/_/oauth2/v1/authorize`,
    token: ($) => `${$.Heimdallr.host}/_/oauth2/v1/token`,
    identity: ($) => `${$.Heimdallr.host}/_/v1/userinfo`,
    callback: ($) => `${$.App.host}/accounts/login/oauth`,
    loginPath: '/accounts/login',
    callbackPath: '/accounts/login/oauth',
    state: required('Heimdallr.state'),
    scope: required('Heimdallr.scope'),
    cookie: '_mist',
    whitelist: [
      '/accounts/login',
      '/accounts/login/oauth'
    ]
  },
  IAM: {
    roles: [ 'delete', 'update', 'write', 'read' ]
  },
  Bifrost: {
    tables: {
      modules: required('Bifrost.tables.modules'),
      apps: required('Bifrost.tables.apps')
    },
    whitelist: [
      '/accounts/login',
      '/accounts/login/oauth'
    ]
  },
  Dwarfs: {
    misty: {
      host: required('Dwarfs.misty.host'),
      user: required('Dwarfs.misty.user'),
      password: required('Dwarfs.misty.password'),
      database: required('Dwarfs.misty.database'),
      connectionLimit: 10
    }
  },
  Yggdrasil: {
    misty: {
      host: 'localhost',
      port: 6379,
      ttl: 3600,
      prefix: 'videos'
    }
  },
  isDebug: process.env.MISTY_ENV === 'development',
  isDev: ['production', 'staging'].indexOf(process.env.NODE_ENV) < 0
}

module.exports = defaultConfig
