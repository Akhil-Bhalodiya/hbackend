const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    timestamp: { type: String },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String },
    industry: { type: String },
    department: { type: String },
    appliedJobTitle: { type: String, default: 'General Application' },
    currentCTC: { type: String },
    expectedCTC: { type: String },
    notice: { type: String },
    cvFileLink: { type: String },
    cvFileName: { type: String },
    status: { type: String, default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
