const mongoose = require('mongoose');
const DepositionRequest = mongoose.model('DepositionRequest');
const AssetHash = mongoose.model('AssetHash');
const depositionQueue = require('../../lib/deposition_queue.js');

function jsonOk(response) {
    response.status(200);
    response.json({"status": "OK"});
}

function jsonStatus(response, status, message) {
    response.status(status);
    response.json({"status": message});
}

function remoteAddressFromRequest(request) {
    return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
}

function requestToDeposition(request) {
    return new DepositionRequest({
        ipfsHash: request.body.ipfsHash,
        remoteAddress: remoteAddressFromRequest(request),
        submittedAt: Date()
    });
}

function validateRequest(request) {
    return new Promise(function(resolve, reject) {
        if (!request.body.ipfsHash) {
            reject(new Error('No ipfsHash'));
        }
        resolve();
    });
}

function queueDeposition(deposition) {
    return new Promise(function(resolve, reject) {
        depositionQueue.push(deposition).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function storeAssetHash(ipfsHash) {
    return new Promise((resolve, reject) => {
        AssetHash.find({ipfsHash: ipfsHash}, (error, assetHashes) => {
            if (error) {
                reject(error);
            } else {
                if (assetHashes.length === 0) {
                    let assetHash = new AssetHash({ipfsHash: ipfsHash, hashType: "enclosure"});
                    assetHash.save((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    let assetHash = assetHashes[0];
                    console.log(`Duplicate asset hash submitted (${ipfsHash})`);
                    if (assetHash.hashType !== "enclosure") {
                        console.log(`Duplicate asset hash type mismatch (new: enclosure, old: ${assetHash.hashType})`);
                    }
                    resolve();
                }
            }
        });
    });
}

module.exports.postDeposition = function(req, res) {
    validateRequest(req).then(() => {
        return Promise.all([
            queueDeposition(requestToDeposition(req)),
            storeAssetHash(req.body.ipfsHash)
        ]);
    }).then(() => {
        jsonOk(res);
    }).catch((error) => {
        jsonStatus(res, 400, error.toString());
    });
};

