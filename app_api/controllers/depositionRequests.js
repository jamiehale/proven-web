const mongoose = require('mongoose');
const DepositionRequest = mongoose.model('DepositionRequest');
const { jsonOk, jsonPayload, jsonStatus } = require('../../lib/json');

module.exports.getDeposition = (req, res, next) => {
    DepositionRequest.find({"_id": req.params.id})
        .then(deposition => { jsonPayload(res, deposition); })
        .catch(error => { jsonStatus(res, 400, error.toString()); });
};

module.exports.getDepositions = (req, res, next) => {
    DepositionRequest.find()
        .then(depositions => { jsonPayload(res, depositions); })
        .catch(error => { jsonStatus(res, 400, error.toString()); });
};
