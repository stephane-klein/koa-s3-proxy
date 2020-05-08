const util = require('util');
const assert = require('assert');
const Minio = require('minio');
const mime = require('mime');

Minio.Client.prototype.getObject = util.promisify(Minio.Client.prototype.getObject);

const serve = ({endPoint, port, useSSL, accessKey, secretKey, bucketName}) => {
    const minioClient = new Minio.Client(Object.assign(
        {
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: 'admin',
            secretKey: 'password'
        },
        {
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey
        }
    ));

    return async function serve(ctx, next) {
        await next();
        if (ctx.request.method === 'GET') {
            var dataStream;
            try {
                dataStream = await minioClient.getObject(
                    bucketName,
                    ctx.request.url
                );
            } catch (e) {
                if (e.code === 'NoSuchKey') {
                    ctx.status = 404;
                    ctx.body = `Error: ${ctx.request.url} not found`;
                } else {
                    ctx.status = 500;
                    ctx.body = `Internal Error: ${e.code}`;
                }
                return
            }
            ctx.response.set(
                'content-type',
                mime.getType(ctx.request.url)
            );
            ctx.body = dataStream;
        }
    }
};

module.exports = serve;