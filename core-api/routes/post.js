const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');

router.get('/', auth, postCtrl.getAll);
router.post('/', auth, multer, postCtrl.create);
router.get('/:id', auth, postCtrl.getOne);
router.put('/:id', auth, multer, postCtrl.update);
router.delete('/:id', auth, postCtrl.delete);
router.post('/:id/like', auth, postCtrl.likeOrNot)

module.exports = router;