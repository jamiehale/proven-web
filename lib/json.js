module.exports.jsonOk = (response) => {
    response.status(200);
    response.json({"status": "OK"});
};

module.exports.jsonPayload = (response, payload) => {
    response.status(200);
    response.json(payload);
};

module.exports.jsonStatus = (response, status, message) => {
    response.status(status);
    response.json({"status": message});
};
