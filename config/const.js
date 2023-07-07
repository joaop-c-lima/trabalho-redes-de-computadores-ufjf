const UDP = require('dgram')

module.exports = {
    port: 2222,
    hostname: 'localhost',
    client: UDP.createSocket('udp4'),
    server: UDP.createSocket('udp4'),
    timeout: 1000000, // Tempo (ms) para fechar conexão
    timereset: 8000, // Tempo (ms) sem requisição para zerar variáveis,
    maxRetransmissions: 30, // Maximo de restransmissões,
    packetTimeout: 5000, // Tempo (ms) de retransmissão,
    windowSize: 3, // Tamanho da Janela
}