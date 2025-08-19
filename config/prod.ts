import type { UserConfigExport } from "@tarojs/cli";

export default {
  mini: {
    webpackChain(chain, webpack) {
      // 关闭 244 KiB 警告
      chain.performance.merge({
        hints: false, // 关闭警告
      });
      // 按需拆包配置
      chain.optimization.splitChunks({
        chunks: "async", // 只拆异步模块，不拆同步自定义组件
        minSize: 30000, // 小于 30KB 的模块不拆分
        maxSize: 500000, // 尝试拆分大于 500KB 的模块
        minChunks: 1, // 被引用至少 1 次就考虑拆分
        automaticNameDelimiter: "~", // 打包文件命名分隔符
        cacheGroups: {
          // 缓存组
          vendors: {
            // node_modules 的第三方库
            test: /[\\/]node_modules[\\/]/,
            name: "vendors", // 生成 vendors.js
            priority: 10, // 优先级高于 common
            reuseExistingChunk: true,
          },
          common: {
            // 项目公共模块
            name: "common", // 生成 common.js
            minChunks: 2, // 至少被两个模块引用
            priority: 5, // 优先级低于 vendors
            reuseExistingChunk: true,
          },
        },
      });
    },
    terser: {
      enable: true,
      config: {
        compress: {
          drop_console: true, // 删除 console
          drop_debugger: true, // 删除 debugger
        },
        mangle: true, // 混淆变量名
      },
    },
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
    //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
    //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
    //    */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(new Prerender({
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
    //     }))
    // }
  },
} satisfies UserConfigExport;
