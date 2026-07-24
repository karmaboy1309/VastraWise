const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/outfitController');
const { protect, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', requireRole('admin'), remove); // Admin only

module.exports = router;
