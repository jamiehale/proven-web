const MongoClient = require('mongodb').MongoClient;

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
    return {
        ipfsHash: request.body.ipfsHash,
        remoteAddress: remoteAddressFromRequest(request),
        submittedAt: Date().toString()
    }
}

function validateRequest(request) {
    return new Promise(function(resolve, reject) {
        if (!request.body.ipfsHash) {
            reject(new Error('No ipfsHash'));
        }
        resolve();
    });
}

function connectToDatabase() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect('mongodb://localhost:27017/proven', function(error, db) {
            if (error) {
                reject(error);
            } else {
                resolve(db);
            }
        });
    });
}

function insertDeposition(db, deposition) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('depositions');
        collection.insertOne(deposition, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.insertedCount != 1) {
                    reject(new Error('Unexpected record count on insert'));
                } else {
                    resolve();
                }
            }
        });
    });
}

function storeDeposition(deposition) {
    return new Promise(function(resolve, reject) {
        connectToDatabase().then((db) => {
            return insertDeposition(db, deposition);
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

module.exports.postDeposition = function(req, res) {
    validateRequest(req).then(() => {
        return storeDeposition(requestToDeposition(req));
    }).then(() => {
        jsonOk(res);
    }).catch((error) => {
        jsonStatus(res, 400, error.toString());
    });
};

