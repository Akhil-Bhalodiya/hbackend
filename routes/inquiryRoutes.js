const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createInquiry)
  .get(protect, getInquiries);

module.exports = router;
