const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const {createBundleRenderer} = require('vue-server-renderer');
const templatePath = path.resolve(__dirname, './index.template.html');

const indexBundle = require('./dist/index.json');
const pageBundle = require('./dist/page.json');
const indexRenderer = createBundleRenderer(indexBundle, {
    runInNewContext: false,
    template: fs.readFileSync(templatePath, 'utf-8'),
});
const pageRenderer = createBundleRenderer(pageBundle, {
    runInNewContext: false,
    template: fs.readFileSync(templatePath, 'utf-8'),
});

const app =new Koa();

app.use(async ctx => { 
    if (ctx.request.path ==='/index') {
        ctx.set('Content-Type', 'text/html');
        const context = {
            url: ctx.url,
        };
        const html = await indexRenderer.renderToString(context);
        ctx.body = html;
    } else if (ctx.request.path ==='/page') {
        ctx.set('Content-Type', 'text/html');
        const context = {
            url: ctx.url,
        };
        const html = await pageRenderer.renderToString(context);
        ctx.body = html;
    } else {
        ctx.body = 'home';
    }
});
app.listen(3000);
