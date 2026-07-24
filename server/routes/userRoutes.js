const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

// All user routes require admin role
router.use(protect, requireRole('admin'));

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
