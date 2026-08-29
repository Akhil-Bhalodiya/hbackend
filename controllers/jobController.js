const Job = require('../models/Job');

// @desc    Get all job openings
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(filter);

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 6);
      const skip = (pageNum - 1) * limitNum;

      const jobs = await Job.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        count: jobs.length,
        data: jobs,
      });
    }

    const jobs = await Job.find(filter).sort({ isFeatured: -1, createdAt: -1 });

    res.json({
      success: true,
      total,
      page: 1,
      pages: 1,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job opening by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job opening not found with id ${req.params.id}`,
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job opening
// @route   POST /api/jobs
// @access  Private (Admin)
const createJob = async (req, res, next) => {
  try {
    const { title, location, type, experience, postingDate, postedDate, desc, requirements, status } = req.body;

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required fields',
      });
    }

    let reqArray = requirements;
    if (typeof requirements === 'string') {
      reqArray = requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    }

    const job = await Job.create({
      title,
      location: location || 'Ahmedabad (Hybrid / Travel)',
      type: type || 'Full-Time',
      experience: experience || '3 - 5 Years',
      postingDate: postingDate || postedDate || new Date(),
      desc,
      requirements: reqArray || [],
      status: status || 'Active',
      createdBy: req.admin?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job opening
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job opening not found with id ${req.params.id}`,
      });
    }

    if (req.body.requirements && typeof req.body.requirements === 'string') {
      req.body.requirements = req.body.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Job opening updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job opening
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job opening not found with id ${req.params.id}`,
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job opening deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
