var constants = require('./constants');

const client = constants.DGRAM.createSocket('udp4');
const msg = Buffer.from(constants.LOREM_10_PARAGRAPHS)

client.send(msg, 0, 1024, constants.SERVER_PORT, constants.SERVER_HOST, (err) => {
    if (err) throw err;
    console.log("Message sent");
    client.close();
})