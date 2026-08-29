const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    timestamp: { type: String },
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    details: { type: String, required: true },
    status: { type: String, default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
