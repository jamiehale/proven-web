const mongoose = require('mongoose');
const AssetHash = mongoose.model('AssetHash');
const { jsonPayload, jsonStatus } = require('../../lib/json');

module.exports.getAssetHash = (req, res, next) => {
    AssetHash.find({"_id": req.params.id})
        .then(assetHash => { jsonPayload(res, assetHash); })
        .catch(error => { jsonStatus(res, 400, error.toString()); });
};

module.exports.getAssetHashes = (req, res, next) => {
    AssetHash.find()
        .then(assetHashes => { jsonPayload(res, assetHashes); })
        .catch(error => { jsonStatus(res, 400, error.toString()); });
};
