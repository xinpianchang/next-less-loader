const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {

      config.plugins.push(new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }))

      const { dev, isServer } = options
      const {
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        lessLoaderOptions = {},
        cssModulesExclude = [],
      } = nextConfig

      // default css loaders with cssModules
      options.defaultLoaders.css = cssLoaderConfig(config, {
        extensions: ['css'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      })

      // default less loaders with cssModules
      options.defaultLoaders.less = cssLoaderConfig(config, {
        extensions: ['less'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      })

      // if excluding cssModule is enabled
      if (cssModulesExclude.length) {
        // we need to disable assets/node_modules's cssModules for css loader
        const globlaCssWithoutCssModuleLoader = cssLoaderConfig(config, {
          extensions: ['css'],
          cssModules: false,
          cssLoaderOptions: {},
          postcssLoaderOptions,
          dev,
          isServer,
        })

        // we need to disable assets/node_modules's cssModules for less loader
        const globalLessWithoutCssModuleLoader = cssLoaderConfig(config, {
          extensions: ['less'],
          cssModules: false,
          cssLoaderOptions: {},
          postcssLoaderOptions,
          dev,
          isServer,
          loaders: [
            {
              loader: 'less-loader',
              options: lessLoaderOptions,
            },
          ],
        })

        // we push that loader rule into css rule
        config.module.rules.push({
          test: /\.css$/,
          issuer(issuer) {
            if (issuer.match(/pages[\\/]_document\.js$/)) {
              throw new Error(
                'You can not import CSS files in pages/_document.js, use pages/_app.js instead.'
              )
            }
            return true
          },
          include: cssModulesExclude,
          use: globlaCssWithoutCssModuleLoader,
        })

        // we push that loader rule into less rule
        config.module.rules.push({
          test: /\.less$/,
          include: cssModulesExclude,
          use: globalLessWithoutCssModuleLoader,
        })
      }

      config.module.rules.push({
        test: /\.css$/,
        issuer(issuer) {
          if (issuer.match(/pages[\\/]_document\.js$/)) {
            throw new Error(
              'You can not import CSS files in pages/_document.js, use pages/_app.js instead.'
            )
          }
          return true
        },
        exclude: cssModulesExclude,
        use: options.defaultLoaders.css,
      })

      config.module.rules.push({
        test: /\.less$/,
        exclude: cssModulesExclude,
        use: options.defaultLoaders.less,
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }
      return config
    },
  })
}
