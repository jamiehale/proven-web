const express = require('express');
const router = express.Router();
const controller = require('../controllers/depositions');

router.post('/depositions', controller.postDepositions);

module.exports = router;
