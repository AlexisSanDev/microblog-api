const app = require('./app');
const server = require('http').Server(app);
const debug = require('debug')('app:server');
const port = process.env.NODE_PORT || 3000;

server.listen(port,()=>{
    debug(`Servidor corriendo en: ${server.address().port}`);
});