var constants = require('./constants');

const server = constants.DGRAM.createSocket('udp4');
server.on('listening', () => console.log("UDP server listening"));
server.on('message', (msg,rinfo) => {
    console.log(`${rinfo.address}:${rinfo.port} - ${msg}`);
});
server.bind(constants.SERVER_PORT, constants.SERVER_HOST);