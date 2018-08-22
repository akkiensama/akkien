var web3 = require('./web3');
var Vote = require('./build/Vote.json');

const instance = new web3.eth.Contract(
    JSON.parse(Vote.interface),
    '0x4F35bea6557781A34481f5265c2E0181E4F7C435'
);

module.exports = instance;