const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports.getDeposition = function(req, res, next) {
    MongoClient.connect('mongodb://localhost:27017/proven', function(error, db) {
        if (error) {
            res.status(400);
            res.json({"status": error});
        } else {
            const collection = db.collection('depositions');
            collection.find({"_id": new ObjectId(req.params.id)}).toArray(function(error, docs) {
                if (error) {
                    res.status(400);
                    res.json({"status": error});
                } else {
                    if (docs.length != 1) {
                    } else {
                        let deposition = docs[0];
                        res.render('deposition-details', {
                            title: `Deposition ${deposition._id}`,
                            deposition: deposition
                        });
                    }
                }
            });
        }
        db.close();
    });
};

module.exports.getDepositions = function(req, res, next) {
    MongoClient.connect('mongodb://localhost:27017/proven', function(error, db) {
        if (error) {
            res.status(400);
            res.json({"status": error});
        } else {
            const collection = db.collection('depositions');
            collection.find().toArray(function(error, docs) {
                if (error) {
                    res.status(400);
                    res.json({"status": error});
                } else {
                    res.render('deposition-list', {
                        title: "Depositions",
                        depositions: docs
                    });
                }
            });
        }
        db.close();
    });
};

