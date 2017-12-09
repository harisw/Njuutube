var express = require('express');
var router = express.Router();

var VideoController = require('../controllers/video');

/* GET video listing. */
router.get('/', VideoController.getVideos);

router.post('/', VideoController.createVideo);

router.get('/:quality/:id', VideoController.getSingleVideo);
module.exports = router;