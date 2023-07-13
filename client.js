const { TIMEOUT, LOREM_5_PARAGRAPHS, DGRAM, PACKAGE_SIZE } = require('./constants');

const client = DGRAM.createSocket('udp4');

let subtexts = splitTextIntoSubtexts(LOREM_5_PARAGRAPHS);
subtexts.forEach((element) => {
    console.log(element);
})

// client.send(msg, 0, 1024, constants.SERVER_PORT, constants.SERVER_HOST, (err) => {
//     if (err) throw err;
//     console.log("Message sent");
//     client.close();
// })


function sendPackages(packages) {
    setTimeout(() => {
        client.send(msg, 0, 1024, constants.SERVER_PORT, constants.SERVER_HOST, (err) => {
            if (err) throw err;
            console.log("Message sent");
            client.close();
        })
    }, TIMEOUT);
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