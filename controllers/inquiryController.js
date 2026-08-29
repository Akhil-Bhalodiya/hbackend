const Inquiry = require('../models/Inquiry');
const Setting = require('../models/Setting');

const cleanWebhookUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let trimmed = rawUrl.trim();
  const match = trimmed.match(/(https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec)/i);
  if (match) return match[1];
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return '';
};

// @desc    Submit a new Client Inquiry / Hiring Mandate
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const { name, company, designation, contact, email, service, details, timestamp } = req.body;

    if (!name || !company || !contact || !email || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, company name, designation, contact number, email, and service.',
      });
    }

    const dateStr = timestamp || new Date().toISOString().split('T')[0];

    // 1. Save to MongoDB Database
    const newInquiry = await Inquiry.create({
      timestamp: dateStr,
      name,
      company,
      designation: designation || 'Manager / Executive',
      contact,
      email,
      service,
      details: details || '',
    });

    // 2. Safe Server-Side Forwarding to Google Sheets Webhook
    try {
      const setting = await Setting.findOne().sort({ createdAt: -1 });
      const targetUrl =
        cleanWebhookUrl(setting ? setting.inquiryUrl : '') ||
        cleanWebhookUrl(process.env.INQUIRY_WEBHOOK_URL || '');

      if (targetUrl) {
        const payload = {
          timestamp: dateStr,
          name,
          company,
          designation: designation || '',
          contact,
          email,
          service,
          details: details || '',
          formType: 'Client Inquiry Mandate',
        };

        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        }).catch(err => console.log('Sheet inquiry forward notice:', err.message));
      }
    } catch (sheetErr) {
      console.warn('Google Sheets inquiry forward error (non-fatal):', sheetErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry mandate submitted successfully',
      data: newInquiry,
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing inquiry',
    });
  }
};

// @desc    Get all client inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
};
