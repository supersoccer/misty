const path = require('path')
/**
 * Admin control panel package
 */
class Misty {
  static get Express () {
    return require('express')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-bifrost|Bifrost documentation}
   * @example
   * const { Bifrost } = require('@supersoccer/misty')
   */
  static get Bifrost () {
    return Misty.require('bifrost')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-path|Path documentation}
   * @example
   * const { Path } = require('@supersoccer/misty')
   */
  static get Path () {
    return Misty.require('path')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-dwarfs|Dwarfs documentation}
   * @example
   * const { Dwarfs } = require('@supersoccer/misty')
   */
  static get Dwarfs () {
    return Misty.require('dwarfs')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-heimdallr|Heimdallr documentation}
   * @example
   * const { Heimdallr } = require('@supersoccer/misty')
   */
  static get Heimdallr () {
    return Misty.require('heimdallr')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-mystique|Mystique documentation}
   * @example
   * const { Mystique } = require('@supersoccer/misty')
   */
  static get Mystique () {
    return Misty.require('mystique')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-template|Template documentation}
   * @example
   * const { Template } = require('@supersoccer/misty')
   */
  static get Template () {
    return Misty.require('template')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-tools|Tools documentation}
   * @example
   * const { Tools } = require('@supersoccer/misty')
   */
  static get Tools () {
    return Misty.require('tools')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-yggdrasil|Yggdrasil documentation}
   * @example
   * const { Yggdrasil } = require('@supersoccer/misty')
   */
  static get Yggdrasil () {
    return Misty.require('yggdrasil')
  }

  /**
   * @see {@link https://supersoccer.github.io/node-config|Config documentation}
   * @example
   * const { Config } = require('@supersoccer/misty')
   */
  static get Config () {
    return require('config')
  }

  static get Cookie () {
    return require('cookie-parser')
  }

  static get CDN () {
    return require('serve-static')
  }

  static get CSRF () {
    return require('csurf')
  }

  static get MarkoExpress () {
    return require('marko/express')
  }

  boot () {
    if (typeof this.App === 'undefined') {
      this.App = Misty.Express()
    }
  }

  /**
   * Wrapper of node native `require` method to load misty core module on development
   * @param {string} moduleName - Misty module to require
   * @return {object} - Required object
   */
  static require (moduleName) {
    if (process.env.MISTY_ENV === 'development') {
      return require(path.resolve(__dirname, `../node-${moduleName}`))
    }

    return require(`@supersoccer/${moduleName}`)
  }

  /**
   * Wrapper of express' `use` method
   * @param {*} params - Express `use` params
   */
  use (...params) {
    this.boot()
    this.App.use(...params)
  }

  /**
   * Start Express app
   * @async
   * @example
   * const Misty = require('@supersoccer/misty')
   * Misty.start()
   */
  async start () {
    this.boot()
    this.use(Misty.Cookie())
    this.use(Misty.MarkoExpress())
    this.use(Misty.CSRF({cookie: true}))
    this.use('/assets', Misty.CDN(Misty.Path.join(__dirname, 'assets')))

    await Misty.Bifrost.routes(this.App)
  
    let configSources = []
  
    for (let configSource of Misty.Config.util.getConfigSources()) {
      configSources.push(configSource.name)
    }
  
    this.App.listen(Misty.Config.app.port, () => {
      console.log(`${Misty.Config.app.name} app listening on port ${Misty.Config.app.port}!`)
      console.log(configSources)
    })
  }
}

module.exports = Misty
