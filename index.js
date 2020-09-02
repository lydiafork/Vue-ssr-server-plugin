/* eslint-disable no-multi-assign */
/* eslint-disable func-names */
'use strict';

/*  */

let isJS = function (file) {
    return /\.js(\?[^.]+)?$/.test(file);
};

let ref = require('chalk');
let red = ref.red;
let yellow = ref.yellow;

let prefix = '[vue-server-renderer-webpack-plugin]';
let warn = exports.warn = function (msg) {
    return console.error(red((`${prefix} ${msg}\n`)));
};
let tip = exports.tip = function (msg) {
    return console.log(yellow((`${prefix} ${msg}\n`)));
};

let validate = function (compiler) {
    if (compiler.options.target !== 'node') {
        warn('webpack config `target` should be "node".');
    }

    if (compiler.options.output && compiler.options.output.libraryTarget !== 'commonjs2') {
        warn('webpack config `output.libraryTarget` should be "commonjs2".');
    }

    if (!compiler.options.externals) {
        tip(
            'It is recommended to externalize dependencies in the server build for ' +
      'better build performance.'
        );
    }
};

// tabpack提供了同步&异步绑定钩子的方法，并且他们都有绑定事件和执行事件对应的方法。
let onEmit = function (compiler, name, hook) {
    if (compiler.hooks) {
    // Webpack >= 4.0.0
        compiler.hooks.emit.tapAsync(name, hook);
    } else {
    // Webpack < 4.0.0
        compiler.plugin('emit', hook);
    }
};

let VueSSRServerPlugin = function VueSSRServerPlugin(options) {
    if (options === undefined) {
        options = {};
    }

    this.options = Object.assign({
        filename: 'vue-ssr-server-bundle.json',
    }, options);
};

VueSSRServerPlugin.prototype.apply = function apply(compiler) {
    let this$1 = this;

    validate(compiler);

    onEmit(compiler, 'vue-server-plugin', (compilation, cb) => {
        let stats = compilation.getStats().toJson();
        // 能得到生产文件以及chunkhash的一些信息
        // 修改点：获取配置的所有路径
        let entryNames = Object.keys(stats.entrypoints);
        console.log('entryNames====', entryNames)
        let bundles = []; // 最后输出以数组形式
        for (let i = 0; i < entryNames.length; i++) {
            let entryName = entryNames[i];
            let entryInfo = stats.entrypoints[entryName];
           
            if (!entryInfo) {
                // #5553
                return cb();
            }
            let entryAssets = entryInfo.assets.filter(isJS);

            if (entryAssets.length > 1) {
                throw new Error(
                    'Server-side bundle should have one single entry file. ' +
            'Avoid using CommonsChunkPlugin in the server config.'
                );
            }

            let entry = entryAssets[0];
            if (!entry || typeof entry !== 'string') {
                throw new Error(
                    (`Entry "${entryName}" not found. Did you specify the correct entry option?`)
                );
            }

            let bundle = {
                entry,
                files: {},
                maps: {},
            };
            // stats 选项让你更精确地控制 bundle 信息该怎么显示
            // console.log('stats====', stats.assets)
            stats.assets.forEach((asset) => {
                if (asset.name.indexOf(entryName) === -1) {
                    return;
                }
                if (isJS(asset.name)) {
                    bundle.files[asset.name] = compilation.assets[asset.name].source();
                } else if (asset.name.match(/\.js\.map$/)) {
                    bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(compilation.assets[asset.name].source());
                }
                // do not emit anything else for server
                delete compilation.assets[asset.name];
            });

            let json = JSON.stringify(bundle, null, 2);
            let filename = `${entryName}.json`;
            // 把多个文件打包在一起而不是不同文件
            bundles.push({
                filename,
                json,
            });
        }
        
        bundles.forEach(({filename,json}) => {
            // 创建模块阶段
            compilation.assets[filename] = {
                source() {
                    return json;
                },
                size() {
                    return json.length;
                },
            };
        });
        cb();
    });
};

module.exports = VueSSRServerPlugin;
