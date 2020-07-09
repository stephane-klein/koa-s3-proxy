# koa-s3-proxy

[Koa](https://github.com/koajs/koa) S3 proxy middleware.

This library is based on [`minio/minio-js`](https://github.com/minio/minio-js).

## Installation

```
$ npm install koa-s3-proxy
```

## API

```
const Koa = require('koa');
const mount = require('koa-mount');
const KoaS3ProxyServe = require('koa-s3-proxy');

const app = new Koa();

app.use(
    mount(
        '/attachments/',
        KoaS3ProxyServe({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: 'admin',
            secretKey: 'password',
            bucketName: 'attachments'
        })
    )
);

app.listen(3000);
```

## How to execute example.js

```
$ docker-compose up -d
```

```
$ npm install
```

```
$ node example.js
```

Open your browser on http://127.0.0.1:3000/attachments/earth.png

You can use `filename` query parameter to rename the filename:

- http://127.0.0.1:3000/attachments/earth.png?filename=foobar.png

You can put `inline` or `attachment` (default value) in `contentDisposition` query parameter to configure [Content-Disposition response header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)

- http://127.0.0.1:3000/attachments/earth.png?filename=foobar.png&contentDisposition=attachment
- http://127.0.0.1:3000/attachments/earth.png?filename=foobar.png&contentDisposition=inline