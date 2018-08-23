const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../public/json/BallotFactory.json');
const compiledBallot = require('../public/json/Ballot.json');

let accounts;
let factory;
let ballotAddress;
let ballot;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode, arguments: [ 2 ] })
        .send({ from: accounts[0], gas: '3000000' });

    await factory.methods.createBallot("Miss Penalty World", 
                                        [12, 23, 35],
                                        ["0x1111", "0x2222", "0x3333"], 
                                        ["0x1112", "0x2223", "0x3334"], 
                                        1000, 
                                        100,
                                        3600)
                            .send({ from: accounts[1], gas: '3000000', value: web3.utils.toWei('2', 'ether') });

    [ballotAddress] = await factory.methods.getDeployedBallots().call();
    ballot = await new web3.eth.Contract(
        JSON.parse(compiledBallot.interface),
        ballotAddress
    );

    
    // ballot = await new web3.eth.Contract(JSON.parse(compiledBallot.interface))
    //     .deploy({ data: compiledBallot.bytecode, 
    //             arguments: ["Miss Penalty World", 
    //                         [12, 23, 35],
    //                         ["0x1111", "0x2222", "0x3333"], 
    //                         ["0x1112", "0x2223", "0x3334"], 
    //                         1000, 
    //                         100,
    //                         3600, 
    //                         accounts[0] ]})
    //     .send({ from: accounts[0], gas: '3000000' });
});

describe('Ballot', () => {
    it('deploy ok', () => {
        assert.ok(ballot.options.address);
    });

    it('get anything as much as we can', async () => {
        var owner = await ballot.methods.owner().call();
        var description = await ballot.methods.description().call();
        var totalTokens = await ballot.methods.totalTokens().call();
        var balanceTokens = await ballot.methods.balanceTokens().call();
        var tokenPrice = await ballot.methods.tokenPrice().call();
        var startTime = await ballot.methods.startTime().call();
        var voteTime = await ballot.methods.voteTime().call();

        assert.equal(owner, accounts[1]);
        assert.equal(description, 'Miss Penalty World');
        assert.equal(totalTokens, 1000);
        assert.equal(balanceTokens, 1000);
        assert.equal(tokenPrice, 100);
        console.log('start time: ', startTime);
        assert.equal(voteTime, 3600);
    });
    /// Too lazy to do more...
});