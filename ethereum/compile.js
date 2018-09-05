const solc = require('solc');
const fs = require('fs-extra');
const path = require('path');

const publicJsonPath = path.resolve(__dirname, '../public/json');

fs.removeSync(publicJsonPath);

const votePath = path.resolve(__dirname, 'contracts', 'Vote.sol');

const source = fs.readFileSync(votePath, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(publicJsonPath);

for (contract in output) {
    fs.outputJsonSync(
        path.resolve(publicJsonPath, contract.replace(':','') + '.json'),//tao duong dan
        output[contract]// cho noi dung vao
    );
}
