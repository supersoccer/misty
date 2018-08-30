const morgan = require('morgan')
const chalk = require('chalk')
const _ = require('lodash')

class Log {
  static get request () {
    return morgan('tiny', { skip: Log._ignoreAssetsRequest })
  }

  static _ignoreAssetsRequest (req, res) {
    let url = req.url
    
    if (url.indexOf('?') > 0) {
      url = url.substr(0, url.indexOf('?'))
    }
      
    if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig)) {
      return true
    }

    return false
  }

  static print (message, app, color) {
    app = app || 'misty'
    color = color || 'cyan'

    if (_.isUndefined(message)) {
      return console.log()
    }

    console.log(chalk[color](`[${app}] ${message}`))
  }

  static debug (...args) {
    if (args.length < 1) {
      return
    }
    
    let message = args[0]
    let name = 'debug'

    if (args.length > 1) {
      name = args[0]
      message = args[1]
    }

    if (typeof message === 'object') {
      message = JSON.stringify(message)
    }
    
    console.log()
    console.log(chalk.bgRed(`${chalk.white(`[${name}]`)}`) + chalk.bgYellow(` ${chalk.black(message)} `))
    console.log()
  }

  static Misty (message) {
    return Log.print(message, 'misty', 'cyan')
  }

  static Bifrost (message) {
    return Log.print(message, 'bifrost', 'green')
  }
}

module.exports = Log
