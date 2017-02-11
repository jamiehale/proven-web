const express = require('express');
const router = express.Router();
const controller = require('../controllers/depositions');

router.get('/deposition/:id', controller.getDeposition);
router.get('/depositions', controller.getDepositions);

module.exports = router;
