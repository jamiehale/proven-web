const router = require('express').Router();
const controller = require('../controllers/depositions');

router.post('/depositions', controller.postDeposition);

module.exports = router;
