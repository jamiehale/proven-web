const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

function jsonOk(response) {
    response.status(200);
    response.json({"status": "OK"});
}

function jsonStatus(response, status, message) {
    response.status(status);
    response.json({"status": message});
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

function findDeposition(db, id) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('depositions');
        collection.find({"_id": new ObjectId(id)}).toArray(function(error, docs) {
            if (error) {
                reject(error);
            } else {
                db.close();
                if (docs.length != 0) {
                    reject(new Error('No document found'));
                } else {
                    resolve(docs[0]);
                }
            }
        });
    });
}

function findAllDepositions(db) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('depositions');
        collection.find().toArray(function(error, docs) {
            if (error) {
                reject(error);
            } else {
                db.close();
                resolve(docs);
            }
        });
    });
}

module.exports.getDeposition = function(req, res, next) {
    connectToDatabase().then((db) => {
        return findDeposition(db, req.params.id);
    }).then((deposition) => {
        res.status(200);
        res.json(deposition);
    }).catch((error) => {
        jsonStatus(res, 400, error.toString());
    });
};

module.exports.getDepositions = function(req, res, next) {
    connectToDatabase().then((db) => {
        return findAllDepositions(db);
    }).then((depositions) => {
        res.status(200);
        res.json(depositions);
    }).catch((error) => {
        jsonStatus(res, 400, error.toString());
    });
};

