const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,

    runtimeCompiler: true,
    filenameHashing: false,
    configureWebpack: {
        optimization: {
            splitChunks: false,
        }
    },
    css: {
        extract: {
            filename: '[name].css',
            chunkFilename: '[name].css'
        },
    },
    chainWebpack: config => {
        config.output.chunkFilename(`[name].js`),
        config.output.filename(`[name].js`),
        config.plugin("copy").tap(([options]) => {
            options.patterns[0].globOptions.ignore.push("**/ajax/**")
            console.log(JSON.stringify(options.patterns[0].globOptions))
            return [options]
        })
    }
})
