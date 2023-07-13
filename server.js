const { TIMEOUT, LOREM_5_PARAGRAPHS, DGRAM, PACKAGE_SIZE, SERVER_PORT, SERVER_HOST, CHANCE_OF_ERROR} = require('./constants');

const server = DGRAM.createSocket('udp4');
let expected

server.on('listening', () => console.log("UDP server listening"));
server.on('message', (msg, rinfo) => {
    //console.log(`${rinfo.address}:${rinfo.port} - ${msg}`);
    let request = JSON.stringify({
        ack: JSON.parse(msg).id
    })
    if (Math.random() < CHANCE_OF_ERROR) {
        server.send(request, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Erro ao enviar pacote: ', err);
            } else console.log("Pacote enviado: ", request)
        })
    }
});
server.bind(SERVER_PORT, SERVER_HOST);