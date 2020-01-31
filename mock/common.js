const http = require('http');
const httpProxy = require('http-proxy');
// 创建一个 Proxy Server 对象
const proxy = httpProxy.createProxyServer({});

// 捕获异常
proxy.on('error', (err, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end('服务端错误');
});

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

function listen() {
  const server = http.createServer((req, res) => {
    const { host } = req.headers;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    switch (host) {
      case 'xiaoer.aliqin.taobao.net':
        proxy.web(req, res, { target: 'http://127.0.0.1:7001/' });
        break;
      case 'xiaoer.aliqin.tmall.net':
        proxy.web(req, res, { target: 'http://127.0.0.1:7001/' });
        break;
      default:
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
      res.end('welcome to my server');
    }
  });
  server.listen(80);
  return {};
}

export default (noProxy ? {} : listen());
