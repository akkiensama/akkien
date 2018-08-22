const HDWalletProvider = require('truffle-hdwallet-provider');//bản 0.0.5 bị lỗi => 0.0.3
const Web3 = require('web3');
const compiledVote = require('./build/Vote.json');

const provider = new HDWalletProvider(
    'climb buyer trash also pull rule pull rapid apart ensure coin spend',
    'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy contract from account ', accounts[0]);
    let result = {};
    try {
        result = await new web3.eth.Contract(JSON.parse(compiledVote.interface))
            .deploy({ data: compiledVote.bytecode, arguments: [1000, 100, ['0x1111', '0x2222', '0x3333']] })
            .send({ gas: '3000000', from: accounts[0] });

        console.log('Contract deploy to address ', result.options.address);
    } catch(err) {
        console.log(err.message);
    }
}

deploy();