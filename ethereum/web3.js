var Web3 = require('web3');

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    // we are in the browser and has metamask
    web3 = new Web3(window.web3.currentProvider);
} else {
    //we are not in the browser or don't has metamask
    const provider = new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1'
    );

    web3 = new Web3(provider);
}

module.exports = web3;
