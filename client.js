const { TIMEOUT, LOREM_5_PARAGRAPHS, LOREM_20_PARAGRAPHS, DGRAM, PACKAGE_SIZE, SERVER_PORT, SERVER_HOST, CHANCE_OF_ERROR, WINDOW_LIMIT } = require('./constants');

const client = DGRAM.createSocket('udp4');
let currentExpectedAck = 0;
let subtexts = splitTextIntoSubtexts(LOREM_20_PARAGRAPHS);
let finalFlag = subtexts.length;
let window = 1;
let finalExpectedAck = -1;
let packages;

client.on('message', (msg, rinfo) => {
    const ackPacket = JSON.parse(msg);
    if (currentExpectedAck === ackPacket.ack) {
        currentExpectedAck++
    } else if (currentExpectedAck > ackPacket.ack) {
        currentExpectedAck = ackPacket.ack + 1;
    }
});

const intervalId = setInterval(() => {
    if (currentExpectedAck === finalFlag) {
        client.close();
        clearInterval(intervalId);
        return;
    }
    if (finalExpectedAck != -1) {
        if (currentExpectedAck === finalExpectedAck) {
            process.stdout.write("Aumento aditivo: Before window: " + window);
            window++;
            if(window > WINDOW_LIMIT){
                window = WINDOW_LIMIT;
            }
        } else {
            process.stdout.write("Decrecimento multiplicativo: Before window: " + window);
            window = Math.floor(window / 2);
            if (window === 0) {
                window++;
            }
        }
        console.log(" -> After window: " + window + "\n\n");
    }
    finalExpectedAck = currentExpectedAck + window;
    packages = subtexts.slice(currentExpectedAck, finalExpectedAck);
    sendPackages(packages)
}, TIMEOUT);

function sendPackages(packages) {
    let finalExpectedAck = currentExpectedAck + packages.length;
    packages.forEach(packet => {
        if (Math.random() < CHANCE_OF_ERROR) {
            client.send(packet, SERVER_PORT, SERVER_HOST, (err) => {
                if (err) {
                    console.error('Erro ao enviar pacote: ', err);
                } else console.log("Pacote enviado: ", JSON.parse(packet).id)
            })
        } else {
            console.log("Erro ao enviar pacote: " + JSON.parse(packet).id);
        }
    });

}

function splitTextIntoSubtexts(text) {
    const subtexts = [];
    let startIndex = 0;
    while (startIndex < text.length) {
        let endIndex = startIndex + 1;
        let subtext = '';
        while (endIndex <= text.length) {
            subtext = text.substring(startIndex, endIndex);
            const jsonSize = JSON.stringify({ id: subtexts.length, subtext }).length;
            if (jsonSize > PACKAGE_SIZE) {
                subtext = text.substring(startIndex, endIndex - 1);
                break;
            }
            endIndex++;
        }
        subtexts.push(JSON.stringify({ id: subtexts.length, subtext }));
        startIndex = endIndex - 1;
    }
    return subtexts;
}