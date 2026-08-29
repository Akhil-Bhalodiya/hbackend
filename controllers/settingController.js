const Setting = require('../models/Setting');

// @desc    Get global application settings (Webhook URLs, etc.)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne().sort({ createdAt: -1 });
    if (!setting) {
      setting = await Setting.create({ cvUploadUrl: '', inquiryUrl: '' });
    }
    return res.status(200).json({
      success: true,
      data: {
        cvUploadUrl: setting.cvUploadUrl || '',
        inquiryUrl: setting.inquiryUrl || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update global application settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    const { cvUploadUrl, inquiryUrl } = req.body;
    let setting = await Setting.findOne().sort({ createdAt: -1 });

    if (setting) {
      setting.cvUploadUrl = cvUploadUrl !== undefined ? cvUploadUrl : setting.cvUploadUrl;
      setting.inquiryUrl = inquiryUrl !== undefined ? inquiryUrl : setting.inquiryUrl;
      await setting.save();
    } else {
      setting = await Setting.create({
        cvUploadUrl: cvUploadUrl || '',
        inquiryUrl: inquiryUrl || '',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        cvUploadUrl: setting.cvUploadUrl,
        inquiryUrl: setting.inquiryUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
