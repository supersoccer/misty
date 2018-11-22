const notifier = require('node-notifier')

if (process.env.NODE_ENV !== 'production') {
  const longjohn = require('longjohn')
  longjohn.empty_frame = 'ASYNC CALLBACK'
  longjohn.async_trace_limit = -1
}

require('pretty-error').start()

const path = require('path')
const loadedModules = []
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

  static get Log () {
    return require('./logger')
  }

  /**
   * Wrapper of node native `require` method to load misty core module on development
   * @param {string} moduleName - Misty module to require
   * @return {object} - Required object
   */
  static require (moduleName) {
    const modulePath = Misty.Config.isDebug
      ? path.resolve(__dirname, `../node-${moduleName}`)
      : `@supersoccer/${moduleName}`
    if (loadedModules.indexOf(moduleName) < 0) {
      loadedModules.push(moduleName)
      Misty.version(moduleName)
    }
    return require(modulePath)
  }

  static version (moduleName) {
    moduleName = moduleName || 'misty'

    let pkgPath = '.'
    if (moduleName !== 'misty') {
      pkgPath = Misty.Config.isDebug
        ? path.resolve(__dirname, `../node-${moduleName}`)
        : path.resolve(__dirname, `../${moduleName}`)
    }

    const pkg = require(`${pkgPath}/package.json`)
    return Misty.Log.Misty(`load ${pkg.name}@${pkg.version}`)
  }

  static get appPath () {
    // TODO: Make configurable
    return path.resolve(__dirname, Misty.Config.isDebug ? '../misty-app' : '../../..')
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
    Misty.Log.Misty(`load config`)
    const configSources = Misty.Config.util.getConfigSources()
    Misty.Log.Misty(`→ path: ${configSources[0].name.replace(/[a-z0-9-_.]+$/, '')}`)
    Misty.Config.util.getConfigSources().forEach((config, idx) => {
      Misty.Log.Misty(`→ ${idx + 1}: ${config.name.replace(/^.+\//, '')}`)
    })

    const csrfWhitelist = Misty.Config.Csrf.whitelist

    this.boot()
    this.use(Misty.Cookie())
    this.use(Misty.MarkoExpress())
    this.use(function(req, res, next) {
      if (csrfWhitelist.indexOf(req.path) !== -1) {
        next();
      } else {
        Misty.CSRF({cookie: true})(req, res, next)
      }
    })

    if (Misty.Config.isDev) {
      this.use(Misty.Log.request)
    }

    if (Misty.Config.isDev) {
      this.use(Misty.Log.request)
    }

    if (Misty.Config.Assets.enabled) {
      let dir = Misty.Config.Assets.dir

      if (typeof dir === 'undefined' || dir === '') {
        dir = 'assets'
      }

      dir = dir.replace(/^\/+/, '')
      this.use(`/${dir}`, Misty.Assets(path.resolve(Misty.appPath, dir)))
    }

    await Misty.Bifrost.routes(this.App)

    this.App.listen(Misty.Config.App.port, () => {
      const pkg = require('./package.json')
      const msg = `${Misty.Config.App.name} listening on port ${Misty.Config.App.port}`
      Misty.Log.Misty(`${msg}`)
      Misty.Log.Misty(`host: ${Misty.Config.App.host}`)
      Misty.Log.Misty(`misty: ${pkg.name}@${pkg.version}`)
      Misty.Log.Misty(`development: ${Misty.Config.isDev}`)
      Misty.Log.Misty(`debug: ${Misty.Config.isDebug}`)

      notifier.notify({
        title: 'Misty',
        message: `${msg}${Misty.Config.isDev ? `\nmode: development${Misty.Config.isDebug ? ', debug' : ''}` : ''}`,
        icon: path.resolve(__dirname, 'icon.png'),
        open: Misty.Config.App.host
      })
    })
  }
}

module.exports = Misty
