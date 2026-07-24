const express = require('express');
const router = express.Router();
const { getAll, create, update, deleteInvoice } = require('../controllers/invoiceController');
const { protect, requireRole } = require('../middleware/auth');

// All invoice routes require authentication (both admin & worker can manage invoices)
router.use(protect);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', requireRole('admin'), deleteInvoice); // Admin-only hard delete

module.exports = router;

