const router = require('express').Router();
const controller = require('../controllers/depositions');

router.get('/', controller.getLatestDepositions);
router.get('/deposition/:id', controller.getDeposition);
router.get('/depositions', controller.getDepositions);

router.get('/about', function(req, res) {
    res.render('about', { title: 'About' });
});

module.exports = router;
