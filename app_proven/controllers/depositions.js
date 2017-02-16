const fs = require('fs');
const path = require('path');
const bs58 = require('bs58');

const provenAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../res/proven.abi'), 'utf8'));
const provenAddress = '0xc34bf56a27ceab53e795eba55b9f1503eea6a771';
const fromAddress = '0x00F28F9B9692E00feAB5A53469FC3e2972574619';

function ipfsHashToHexString(ipfsHash) {
    let ipfsHashAsHex = new Buffer(bs58.decode(ipfsHash)).toString('hex');
    return '0x' + ipfsHashAsHex;
}

function queueTransaction(ipfsHash) {
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const Proven = web3.eth.contract(provenAbi);
    const proven = Proven.at(provenAddress);
    proven.publishDeposition.sendTransaction(ipfsHash, {from: fromAddress}, function(error, txHash) {
        if (error) {
            console.log(error);
        } else {
            const filter = web3.eth.filter('latest');
            filter.watch(function(error, blockHash) {
                if (error) {
                    filter.stopWatching();
                    console.log(error);
                } else {
                    const tx = web3.eth.getTransaction(txHash);
                    if (tx.blockHash) {
                        console.log('Transaction mined: ' + tx.blockHash);
                        filter.stopWatching();
                    }
                }
            });
        }
    });
}

module.exports.postDepositions = function(req, res) {
    if (!req.body.ipfsHash) {
        res.status(400);
        res.json({"status": "No ipfsHash"});
    } else {
        queueTransaction(ipfsHashToHexString(req.body.ipfsHash));
        console.log('Transaction sent: ' + req.body.ipfsHash);
        res.status(200);
        res.json({"status": "OK"});
    }
};

