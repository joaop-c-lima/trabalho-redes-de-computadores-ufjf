const { port, server, timeout, windowSize } = require('./config/const')

let expectedSeqNumber = 0;
let timer;
const receivedPackets = new Map(); // Mapa para armazenar pacotes recebidos
let receiverWindowSize = windowSize; // Tamanho da janela disponível para o remetente

/* Funções Auxiliares */

//Envia mensagem ao cliente
function send(message, info) {
    server.send(message, info.port, info.address, (err) => {
        if (err) {
            console.error('Erro ao enviar ACK: ', err);
        }
    });
}

//Reseta o temporizador que fecha o servidor
const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        console.log('Tempo limite atingido. Fechando a conexão.');
        server.close(); // Fecha a conexão com o cliente
    }, timeout);
};

/* Eventos */

server.on('message', (message, rinfo) => {
    const packet = JSON.parse(message);

    if (packet.id === expectedSeqNumber && receiverWindowSize > 0) {
        console.log('Pacote recebido: ', packet);
        // Processar o pacote recebido

        // Armazenar o pacote recebido no mapa
        receivedPackets.set(packet.id, packet);

        // Verificar se há pacotes subsequentes na sequência
        let nextSeqNumber = expectedSeqNumber + 1;
        while (receivedPackets.has(nextSeqNumber) && receiverWindowSize > 0) {
            const nextPacket = receivedPackets.get(nextSeqNumber);
            console.log('Pacote recebido: ', nextPacket);
            // Processar o pacote recebido

            receivedPackets.delete(nextSeqNumber);
            nextSeqNumber++;
            receiverWindowSize--;
        }

        expectedSeqNumber = nextSeqNumber;
    } else {
        console.log('Pacote fora de ordem. Descartado.');
    }

    //Devolve ack ao cliente com o num. do pacote que deve ser enviado
    const ackPacket = {
        ack: expectedSeqNumber - 1
    };
    const ackMessage = Buffer.from(JSON.stringify(ackPacket));
    send(ackMessage, rinfo);
    resetTimer();
});

server.bind(port, () => {
    console.log('Servidor UDP escutando na porta ', port);

    //Fechar conexão após tempo de inabilidade
    timer = setTimeout(() => {
        console.log('Tempo limite atingido. Fechando a conexão.');
        server.close(); // Fecha a conexão com o cliente
    }, timeout);
});