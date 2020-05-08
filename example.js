const serve = require('./');
const Koa = require('koa');
const mount = require('koa-mount');
const app = new Koa();

app.use(
    mount(
        '/attachments/',
        serve({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: 'admin',
            secretKey: 'password',
            bucketName: 'attachments'
        })
    )
);

app.use((ctx, next) => {
    return next().then(() => {
        if (ctx.path === '/') {
            ctx.body = 'Try `GET /attachments/earth.png`'
        }
    });
});

app.listen(3000);

console.log('listening on port 3000');