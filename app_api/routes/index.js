const router = require('express').Router();
const depositionsController = require('../controllers/depositionRequests');
const assetHashesController = require('../controllers/assetHashes');

router.get('/deposition/:id', depositionsController.getDeposition);
router.get('/depositions', depositionsController.getDepositions);
router.get('/assetHashes', assetHashesController.getAssetHashes);

module.exports = router;
