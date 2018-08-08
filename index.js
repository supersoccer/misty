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
   * @see {@link https://supersoccer.github.io/node-utils|Tools documentation}
   * @example
   * const { Utils } = require('@supersoccer/misty')
   */
  static get Utils () {
    return Misty.require('utils')
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
    return require('./config')
  }

  static get Cookie () {
    return require('cookie-parser')
  }

  static get Assets () {
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
    const modulePath = Misty.Config.isDebug
      ? path.resolve(__dirname, `../../../../node-${moduleName}`)
      : `@supersoccer/${moduleName}`
    Misty.version(moduleName)
    return require(modulePath)
  }

  static version (moduleName) {
    moduleName = moduleName || 'misty'

    let pkgPath = '.'

    if (moduleName !== 'misty') {
      pkgPath = Misty.Config.isDebug
        ? path.resolve(__dirname, `../../../../node-${moduleName}`)
        : path.resolve(__dirname, `../${moduleName}`)
    }

    const pkg = require(`${pkgPath}/package.json`)
    return `[misty] load ${pkg.name} ${pkg.version}`
  }

  static get appPath () {
    return path.resolve(__dirname, '../../..')
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

    if (Misty.Config.Assets.enabled) {
      let dir = Misty.Config.Assets.dir

      if (typeof dir === 'undefined' || dir === '') {
        dir = 'assets'
      }

      dir = dir.replace(/^\/+/, '')
      this.use(`/${dir}`, Misty.Assets(path.resolve(Misty.appPath, dir)))
    }

    await Misty.Bifrost.routes(this.App)

    const configSources = Misty.Config.util.getConfigSources().map(config => {
      return config.name
    })

    this.App.listen(Misty.Config.App.port, () => {
      console.log(`[misty] ${Misty.Config.App.name} app listening on port ${Misty.Config.App.port}!`)
      console.log(`[misty] host ${Misty.Config.App.host}`)
      console.log(`[misty] config ${configSources.join(', ')}`)
    })
  }
}

module.exports = Misty
