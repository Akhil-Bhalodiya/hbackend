const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    cvUploadUrl: {
      type: String,
      default: '',
      trim: true,
    },
    inquiryUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
