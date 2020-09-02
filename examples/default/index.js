// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// runtime 打包的是 /node_modules/vue/dist/vue.common.js
// standalone 打包的是 /node_modules/vue/dist/vue.js
// import Vue from 'vue/dist/vue.common.js'
import Vue from 'vue';

import App from './index.vue';
// import './index.less';
// import toastRegistry from 'src/common/component/toast/index';

const createApp = (context) => {
    const app = new Vue({
        components: {
            App,
        },
        template: '<App/>',
    });

    return {
        app,
    };
};

export default (context) =>
// 返回Promise 等待异步路由钩子函数或组件
    new Promise((resolve, reject) => {
        const {app} = createApp();
        resolve(app);
    });

