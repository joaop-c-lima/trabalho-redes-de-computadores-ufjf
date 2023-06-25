const UDP = require('dgram')

module.exports = {
    port: 2222,
    hostname: 'localhost',
    client: UDP.createSocket('udp4'),
    server: UDP.createSocket('udp4'),
    timeout: 30000, // Tempo (ms) para fechar conexão
    timereset: 8000, // Tempo (ms) sem requisição para zerar variáveis,
    maxRetransmissions: 3, // Maximo de restransmissões,
    packetTimeout: 2000 // Tempo (ms) de retransmissão
}