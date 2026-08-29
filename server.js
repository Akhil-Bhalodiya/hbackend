const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const settingRoutes = require('./routes/settingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Dynamic CORS origin handling
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in dev mode if needed
      }
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Base Route / Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Hibiscus REST API',
    version: '1.0.0',
    endpoints: {
      authLogin: 'POST /api/auth/login',
      getJobs: 'GET /api/jobs',
      createJob: 'POST /api/jobs (Protected)',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/inquiries', inquiryRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on server`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Only start the server locally or on a standard server (like AWS).
// Vercel handles the listening automatically when it imports the app.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Hibiscus Backend API running on http://localhost:${PORT}`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Promise Rejection] Error: ${err.message}`);
});

module.exports = app;
