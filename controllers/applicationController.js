const Application = require('../models/Application');
const Setting = require('../models/Setting');

const cleanWebhookUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let trimmed = rawUrl.trim();
  const match = trimmed.match(/(https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec)/i);
  if (match) return match[1];
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return '';
};

// @desc    Submit a new candidate job application
// @route   POST /api/applications
// @access  Public
const createApplication = async (req, res, next) => {
  try {
    const {
      name,
      contact,
      email,
      experience,
      industry,
      department,
      appliedJobTitle,
      currentCTC,
      expectedCTC,
      notice,
      cvFileLink,
      cvFileName,
      cvFileBase64,
      timestamp,
    } = req.body;

    if (!name || !contact || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, contact number, and email address.',
      });
    }

    const dateStr = timestamp || new Date().toISOString().split('T')[0];

    // 1. Save to MongoDB Database
    const newApp = await Application.create({
      timestamp: dateStr,
      name,
      contact,
      email,
      experience: experience || '',
      industry: industry || '',
      department: department || '',
      appliedJobTitle: appliedJobTitle || 'General Application',
      currentCTC: currentCTC || '',
      expectedCTC: expectedCTC || '',
      notice: notice || '',
      cvFileLink: cvFileLink || '',
      cvFileName: cvFileName || cvFileLink || '',
    });

    // 2. Safe Server-Side Forwarding to Google Sheets Webhook
    try {
      const setting = await Setting.findOne().sort({ createdAt: -1 });
      const targetUrl = cleanWebhookUrl(setting ? setting.cvUploadUrl : '');

      if (targetUrl) {
        const payload = {
          timestamp: dateStr,
          name,
          contact,
          email,
          experience: experience || '',
          industry: industry || '',
          department: department || '',
          appliedJobTitle: appliedJobTitle || 'General Application',
          currentCTC: currentCTC || '',
          expectedCTC: expectedCTC || '',
          notice: notice || '',
          cvFileLink: cvFileLink || '',
          cvFileName: cvFileName || '',
          cvFileBase64: cvFileBase64 || '',
          formType: 'Candidate CV Application',
        };

        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        }).catch(err => console.log('Sheet forward notice:', err.message));
      }
    } catch (sheetErr) {
      console.warn('Google Sheets candidate forward error (non-fatal):', sheetErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApp,
    });
  } catch (error) {
    console.error('Create application error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing application',
    });
  }
};

// @desc    Get all candidate applications
// @route   GET /api/applications
// @access  Private (Admin)
const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
};
