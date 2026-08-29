const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSettings)
  .put(protect, updateSettings)
  .post(protect, updateSettings);

module.exports = router;
