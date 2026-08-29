const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const Admin = require('../models/Admin');
const Job = require('../models/Job');

const DEPARTMENTS = [
  'Quality Assurance',
  'Regulatory Affairs',
  'CSV & Validation',
  'Turnkey Engineering',
  'USFDA Audit Compliance',
  'R&D Clinical Research',
  'Production & Operations',
  'Executive Recruitment',
];

const LOCATIONS = [
  'Ahmedabad (HQ / Hybrid)',
  'Vadodara (On-Site Plant)',
  'Mumbai (Corporate Office)',
  'Hyderabad (Biotech Hub)',
  'Bengaluru (R&D Center)',
  'Remote / Global Travel',
];

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Remote'];

const EXPERIENCES = ['1 - 3 Years', '3 - 5 Years', '5 - 8 Years', '8 - 12 Years', '12+ Years'];

const JOB_TITLES = [
  { title: 'Senior QA / QC Compliance Auditor (USFDA / MHRA)', dept: 'Quality Assurance' },
  { title: 'Turnkey Cleanroom & HVAC Project Engineer', dept: 'Turnkey Engineering' },
  { title: 'Computer System Validation (CSV) & Pharma 4.0 Lead', dept: 'CSV & Validation' },
  { title: 'Regulatory Affairs Manager - US & EU Submissions', dept: 'Regulatory Affairs' },
  { title: 'Senior Formulation & Development (F&D) Scientist', dept: 'R&D Clinical Research' },
  { title: 'Medical Writing Specialist - Clinical Evaluation', dept: 'R&D Clinical Research' },
  { title: 'Global Supply Chain & GxP Logistics Manager', dept: 'Production & Operations' },
  { title: 'Analytical Method Development (AMD) Specialist', dept: 'Quality Assurance' },
  { title: 'Micro-Biology Lab Manager & Sterility Assurance', dept: 'Quality Assurance' },
  { title: 'EHS & Environmental Safety Manager (API Plant)', dept: 'Production & Operations' },
  { title: 'Pharmacovigilance & Drug Safety Associate', dept: 'Regulatory Affairs' },
  { title: 'Process Engineering Manager - API Synthesis', dept: 'Turnkey Engineering' },
  { title: 'Quality Control (QC) Manager - HPLC / LC-MS', dept: 'Quality Assurance' },
  { title: 'Production Supervisor - Parenteral & Injectables', dept: 'Production & Operations' },
  { title: 'Clinical Operations Manager - Phase I-III Trials', dept: 'R&D Clinical Research' },
  { title: 'Calibration & Maintenance Lead Specialist', dept: 'Turnkey Engineering' },
  { title: 'Packaging Development Engineer (OSD / Blister)', dept: 'Production & Operations' },
  { title: 'Bioprocess Development Scientist - mAb Purification', dept: 'R&D Clinical Research' },
  { title: 'GxP Training & Quality Systems Compliance Lead', dept: 'USFDA Audit Compliance' },
  { title: 'Site Engineering & Reliability Specialist', dept: 'Turnkey Engineering' },
  { title: 'Regulatory Submissions Specialist - eCTD Dossiers', dept: 'Regulatory Affairs' },
  { title: 'Stability Study Coordinator (ICH Guidelines)', dept: 'Quality Assurance' },
  { title: 'Tech Transfer Specialist - Oral Solid Dosage', dept: 'Production & Operations' },
  { title: 'Validation Lead - Automated Inspection Systems', dept: 'CSV & Validation' },
  { title: 'Quality Assurance Executive - In-Process Checks', dept: 'Quality Assurance' },
  { title: 'Chemical Synthesis R&D Lead Chemist', dept: 'R&D Clinical Research' },
  { title: 'Cleanroom Facility Operations Supervisor', dept: 'Turnkey Engineering' },
  { title: 'Document Control & QMS System Executive', dept: 'USFDA Audit Compliance' },
  { title: 'Safety Data Management Associate', dept: 'Regulatory Affairs' },
  { title: 'Executive Talent Acquisition Lead - Lifesciences', dept: 'Executive Recruitment' },
];

const seed30Jobs = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hibiscus_db';
    console.log(`Connecting to MongoDB database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    // Get admin ID
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({
        name: 'Hibiscus Admin',
        email: 'admin@hibiscus.com',
        password: 'admin123',
        role: 'superadmin',
      });
    }

    // Clear existing jobs to ensure clean 30 jobs
    await Job.deleteMany({});
    console.log('Cleared existing job records...');

    const jobsToInsert = JOB_TITLES.map((item, index) => {
      const location = LOCATIONS[index % LOCATIONS.length];
      const type = JOB_TYPES[index % JOB_TYPES.length];
      const experience = EXPERIENCES[index % EXPERIENCES.length];
      const postingDate = new Date(Date.now() - index * 86400000); // spread dates back over 30 days

      return {
        title: item.title,
        location: location,
        type: type,
        experience: experience,
        postingDate: postingDate,
        postedDate: postingDate.toISOString().split('T')[0],
        desc: `Drive compliance, engineering precision, and operational excellence for ${item.title}. Responsible for audit readiness, quality oversight, and cross-functional project execution in accordance with USFDA, MHRA, and EU-GMP regulatory guidelines.`,
        requirements: [
          'B.Pharm / M.Pharm / B.E. / M.Sc in relevant Life Sciences stream',
          `Minimum ${experience} of hands-on industry experience in pharmaceutical/biotech domain`,
          'In-depth knowledge of cGMP, ICH guidelines, and regulatory standards',
          'Proven problem-solving skills and team leadership capability',
        ],
        status: 'Active',
        createdBy: admin._id,
      };
    });

    const created = await Job.insertMany(jobsToInsert);
    console.log(`[SUCCESS] Successfully created ${created.length} jobs in MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed 30 jobs:', error.message);
    process.exit(1);
  }
};

seed30Jobs();
