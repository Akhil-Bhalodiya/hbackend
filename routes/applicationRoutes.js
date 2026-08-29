const express = require('express');
const router = express.Router();
const { createApplication, getApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createApplication)
  .get(protect, getApplications);

module.exports = router;
