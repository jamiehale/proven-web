'use strict';

const mongoose = require('mongoose');
const DepositionRequest = mongoose.model('DepositionRequest');

module.exports.push = (deposition) => {
    return new Promise((resolve, reject) => {
        let depositionRequest = new DepositionRequest(deposition);
        depositionRequest.save((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};
