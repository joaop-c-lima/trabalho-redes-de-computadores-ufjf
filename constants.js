const fs = require("fs");
module.exports = Object.freeze({
    DGRAM: require('dgram'),
    SERVER_PORT: 3333,
    SERVER_HOST: '127.0.0.1',
    PACKAGE_SIZE: 1024,
    TIMEOUT: 2000,
    LOREM_5_PARAGRAPHS: fs.readFileSync("./lorem5paragraphs.txt", { encoding: 'utf8', flag: 'r' }),
    LOREM_10_PARAGRAPHS: fs.readFileSync("./lorem10paragraphs.txt", { encoding: 'utf8', flag: 'r' }),
    LOREM_20_PARAGRAPHS: fs.readFileSync("./lorem20paragraphs.txt",{ encoding: 'utf8', flag: 'r' }),
    LOREM_40_PARAGRAPHS: fs.readFileSync("./lorem40paragraphs.txt", { encoding: 'utf8', flag: 'r' }),
});