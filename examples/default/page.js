import Vue from 'vue';

import App from './page.vue';

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

