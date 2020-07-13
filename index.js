const util = require('util');
const assert = require('assert');
const Minio = require('minio');
const mime = require('mime');
const { parse } = require('querystring');

Minio.Client.prototype.getObject = util.promisify(Minio.Client.prototype.getObject);

const serve = ({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
  bucketName,
  region
}) => {
    const connectionInfos = Object.assign(
      {
        endPoint: '127.0.0.1',
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
    );
    if (port) {
      connectionInfos.port = port;
    }
    if (region) {
      connectionInfos.region = region;
    }

    const minioClient = new Minio.Client(connectionInfos);

    return async function serve(ctx, next) {
        if (ctx.request.method === 'GET') {
            const splittedUrl = ctx.request.url.split('?');
            const fileInBucket = splittedUrl[0];
            const queryParams = splittedUrl.length > 1 ? parse(splittedUrl[1]) : {};

            ctx.set('Content-Disposition', `${queryParams.contentDisposition ||  'attachment' }; filename="${queryParams.filename || fileInBucket}"`);

            let dataStream;
            try {
                dataStream = await minioClient.getObject(
                    bucketName,
                    fileInBucket
                );
            } catch (e) {
                if (e.code === 'NoSuchKey') {
                    ctx.status = 404;
                    ctx.body = `Error: ${fileInBucket} not found`;
                } else {
                    ctx.status = 500;
                    ctx.body = `Internal Error: ${e.code}`;
                }
                return;
            }
            ctx.response.set(
                'content-type',
                mime.getType(fileInBucket)
            );
            ctx.body = dataStream;
        }
        await next();
    }
};

module.exports = serve;