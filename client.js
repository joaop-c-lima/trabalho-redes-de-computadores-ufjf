const { hostname, port, client, maxRetransmissions, packetTimeout, windowSize } = require('./config/const')


let windowStart = 0;
let windowEnd = windowSize - 1;
let receiverWindowSize = windowSize; // Tamanho da janela do destinatário

const packets = [
    { id: 0, data: 'Olá, servidor!' },
    { id: 1, data: 'Como você está?' },
    { id: 2, data: 'Aqui está o meu terceiro pacote.' },
    { id: 3, data: 'Aqui está o meu QUARTO pacote.' },
    { id: 4, data: 'Aqui está o meu  QUINTO pacote.' },
    { id: 5, data: 'Aqui está o meu SEXTO  pacote.' }
];

/* Funções: Auxiliares */
function send(message) {
    client.send(message, port, hostname, (err) => {
        if (err) {
            console.error('Erro ao enviar pacote: ', err);
        } else console.log("Pacote enviado: ", message.toString())
    });
}

// Função para retransmitir o pacote em caso de falha na entrega
function generatePacketTimer(packet) {
    return setInterval(() => {
        if (packet.transmissions < maxRetransmissions && !packet.ackReceived) {
            packet.transmissions++;
            console.log(`Timeout. Reenviando pacote: ${packet.data}`);
            sendPacket(packet);
        } else if (!packet.ackReceived) {
            console.log(`Limite de retransmissões atingido para o pacote: ${packet.data}`);
        }
    }, packetTimeout);
}

// recebe pacotes e envia x

//Receber os pacotes
function receivePackets(packets) {
    packets.forEach(() => {
        sendPacket(packets)
    })
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

    //Janela Deslizante
    for (let i = windowStart; i <= windowEnd; i++) {
        if (i < packets.length) {
            const packet = packets[i];
            packet.transmissions = 0;
            packet.ackReceived = false; // Indicador se o pacote recebeu ACK
            packet.timer = generatePacketTimer(packet);
            sendPacket(packet);
        }
    }
}

/* Eventos */

client.on('message', (message) => {
    const ackPacket = JSON.parse(message);
    console.log('ACK recebido: ', ackPacket);

    const index = packets.findIndex((packet) => packet.id === ackPacket.ack);
    if (index !== -1 && index >= windowStart && index <= windowEnd) {
        const packet = packets[index];
        clearTimeout(packet.timer);
        packet.ackReceived = true;

        if (windowStart === index) {
            // Desliza a janela para a direita
            windowStart++;
            windowEnd++;

            if (windowEnd < packets.length) {
                const nextPacket = packets[windowEnd];
                nextPacket.transmissions = 0; // Número de retransmissões para o pacote
                nextPacket.ackReceived = false; // Indicador se o pacote recebeu ACK
                nextPacket.timer = generatePacketTimer(nextPacket);
                sendPacket(nextPacket);
            }
            else if (windowStart >= packets.length) {
                console.log('Todos os pacotes foram entregues. Encerrando a transmissão.');
                client.close();
            }
        }
    }

    /* if (windowStart === packets.length) {
        console.log('Todos os pacotes foram entregues corretamente. Encerrando a transmissão.');
        client.close();
    } */

    /*receiverWindowSize = ackPacket.windowSize; // Atualiza o tamanho da janela disponível

    // Ajusta o tamanho final da janela de acordo com o tamanho do array de pacotes
    windowEnd = Math.min(windowStart + windowSize - 1, packets.length - 1);*/



});

/* Uso */
startTransmission();