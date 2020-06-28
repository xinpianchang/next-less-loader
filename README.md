# next-less-loader

基于业务完善版本的 less loader for nextjs

## 差异

对比官方提供的 [next-less](https://github.com/vercel/next-plugins/blob/master/packages/next-less/index.js)，多了从 `next.config.js` 中读取了一个配置项 `cssModulesExclude`(数组类型)


## 配置方式

在 `next.config.js` 中的配置信息如下：

```
cssModulesExclude: [
  /node_modules/,
  /assets/
]
```

如果配置了（只要 cssModulesExclude 对应的数组值长度大于 0），`next-less-loader` 内部会关闭指定规则的 cssModules（设置 `false`）

内部代码设计：

```
const globlaCssWithoutCssModuleLoader = cssLoaderConfig(config, {
  cssModules: false,
  ...
})

const globalLessWithoutCssModuleLoader = cssLoaderConfig(config, {
  cssModules: false,
  ...
})


config.module.rules.push({
  test: /\.less$/,
  include: cssModulesExclude,
  use: globalLessWithoutCssModuleLoader,
})
```

其他配置项：

* cssModules
* cssLoaderOptions
* postcssLoaderOptions
* lessLoaderOptions


## 依赖

* [@zeit/next-css](https://github.com/vercel/next-plugins/blob/master/packages/next-css/index.js)
* [webpack-filter-warnings-plugin](https://github.com/mattlewis92/webpack-filter-warnings-plugin#readme)
