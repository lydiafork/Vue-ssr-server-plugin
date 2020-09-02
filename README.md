# vue-server-plugin

Vue-server-render/server-plugin的改写，可以支持多入口打包

### 使用注意

**1. 使用ssr render需要不挂载根节点**
```
const app = new Vue({
      // el: '#app', 这一行注意
      components: {
          App,
      },
      template: '<App/>',
  });
```