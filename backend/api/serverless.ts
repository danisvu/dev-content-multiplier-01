const server = require('../dist/server').default;

module.exports = async (req: any, res: any) => {
  await server.ready();
  server.server.emit('request', req, res);
};

