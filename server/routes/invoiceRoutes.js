const express = require('express');
const router = express.Router();
const { getAll, create, update } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

// All invoice routes require authentication (both admin & worker can manage invoices)
router.use(protect);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);

module.exports = router;
