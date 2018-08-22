const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const Factory = require('../public/json/BallotFactory.json');
const Ballot = require('../public/json/Ballot.json');

let accounts;
let ballot;
let factory;


beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    ballot = await new web3.eth.Contract(JSON.parse(Ballot.interface))
        .deploy({ data: Ballot.bytecode, 
                arguments: ["Miss Penalty World", 
                            [12, 23, 35],
                            ["0x1111", "0x2222", "0x3333"], 
                            ["0x1112", "0x2223", "0x3334"], 
                            1000, 
                            100,
                            900, 
                            accounts[0] ]})
        .send({ from: accounts[0], gas: '3000000' });
});

describe('Ballot', ()=>{
    it('deploy ok', ()=>{
        assert.ok(ballot.options.address);
    });

    it('get anything as much as we can', async () => {

    })
});