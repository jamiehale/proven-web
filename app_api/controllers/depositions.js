
module.exports.getDeposition = function(req, res, next) {
    res.status(200);
    res.json({"status": "success"});
};

module.exports.getDepositions = function(req, res, next) {
    res.render('index', { title: 'get all depositions' });
};

