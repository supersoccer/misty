const _ = require('lodash')
const defaultConfig = require('./config.default')
const userConfig = require('config')

class Config {
  constructor () {
    this.data = _.mergeWith(defaultConfig, userConfig)
    this.data = this.mixin(this.data)
    return this.data
  }

  mixin (obj) {
    Object.keys(obj).forEach((key) => {
      if (_.isPlainObject(obj[key])) {
        if (['util'].indexOf(key) < 0) {
          obj[key] = this.mixin(obj[key])
        }
      }

      if (_.isFunction(obj[key])) {
        if (['get', 'has'].indexOf(key) < 0) {
          obj[key] = obj[key](this.data)
        }
      }

      if (_.isString(obj[key])) {
        if (obj[key].indexOf('ERR_REQUIRED') >= 0) {
          console.log(obj[key])
          throw new Error(`Missing required config value: ${obj[key].split('#')[1]}`)
        }
      }
    })

    return obj
  }
}

module.exports = new Config()
