const { TIMEOUT, LOREM_5_PARAGRAPHS, DGRAM, PACKAGE_SIZE, SERVER_PORT, SERVER_HOST, CHANCE_OF_ERROR} = require('./constants');

const server = DGRAM.createSocket('udp4');
let expectedAck = 0;

server.on('listening', () => console.log("UDP server listening"));
server.on('message', (msg, rinfo) => {
    if(expectedAck == JSON.parse(msg).id){
        expectedAck++;
    }
    let request = JSON.stringify({
        ack: expectedAck - 1
    });
    if (Math.random() < CHANCE_OF_ERROR) {
        server.send(request, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Erro ao enviar pacote: ', err);
            } else console.log("Pacote enviado: ", request)
        })
    } else {
        console.log("Erro ao enviar pacote: " + JSON.parse(request).ack);
    }
});
server.bind(SERVER_PORT, SERVER_HOST);