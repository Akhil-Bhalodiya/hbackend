const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      default: 'Ahmedabad (Hybrid / Travel)',
    },
    type: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-Time',
    },
    postedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    experience: {
      type: String,
      required: [true, 'Experience requirement is required'],
      default: '3 - 5 Years',
    },
    desc: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
    postingDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted JSON output matching frontend schema
jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Job', jobSchema);
