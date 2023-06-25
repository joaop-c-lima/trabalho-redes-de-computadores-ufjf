const { hostname, port, client, maxRetransmissions, packetTimeout } = require('./config/const')

const packets = [
    { id: 0, data: 'Olá, servidor!' },
    { id: 1, data: 'Como você está?' },
    { id: 2, data: 'Aqui está o meu terceiro pacote.' }
];

/* Funções: Auxiliares */
function send(message) {
    client.send(message, port, hostname, (err) => {
        if (err) {
            console.error('Erro ao enviar pacote: ', err);
        } else console.log("Pacote enviado: ", message.toString())
    });
}

function generatePacketTimer(packet) {
    return setTimeout(() => {
        if (packet.transmissions < maxRetransmissions) {
            packet.transmissions++;
            console.log(`Timeout. Reenviando pacote: ${packet.data}`);
            sendPacket(packet);
        } else {
            console.log(`Limite de retransmissões atingido para o pacote: ${packet.data}`);
        }
    }, packetTimeout);;
}

/* Funções: Principais */

function sendPacket(packet) {
    const packetInfo = {
        id: packet.id,
        data: packet.data
    };
    const message = Buffer.from(JSON.stringify(packetInfo));
    send(message);
}

function startTransmission() {
    packets.forEach((packet) => {
        packet.transmissions = 0; // Número de retransmissões para o pacote
        packet.timer = generatePacketTimer(packet);
        sendPacket(packet);
    });
}

/* Eventos */

client.on('message', (message) => {
    const ackPacket = JSON.parse(message);
    console.log('ACK recebido: ', ackPacket);

    const index = packets.findIndex((packet) => packet.id === ackPacket.ack);
    if (index !== -1) {
        const packet = packets[index];
        clearTimeout(packet.timer);
    }
});

/* Uso */
startTransmission();
