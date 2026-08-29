const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const Admin = require('../models/Admin');
const Job = require('../models/Job');

dotenv.config({ path: '../.env' });
dotenv.config();

const DEFAULT_ADMIN = {
  name: 'Hibiscus Admin',
  email: 'admin@hibiscus.com',
  password: 'admin123', // Will be automatically hashed by Admin model pre-save hook
  role: 'superadmin',
};

const SAMPLE_JOBS = [
  {
    title: 'Senior QA / QC Compliance Auditor (USFDA / MHRA)',
    location: 'Ahmedabad (Hybrid / Travel)',
    type: 'Full-Time',
    experience: '5 - 8 Years',
    postingDate: new Date(),
    desc: 'Lead mock audit inspections, CAPA remediations, and data integrity compliance programs across client formulation facilities in India and overseas.',
    requirements: [
      'B.Pharm / M.Pharm / M.Sc Chemistry',
      'Proven experience leading USFDA / MHRA / EU-GMP audit preparedness',
      'Strong knowledge of ICH guidelines, 21 CFR Part 210/211',
      'Willingness to travel for on-site facility audits',
    ],
    status: 'Active',
  },
  {
    title: 'Turnkey Cleanroom & HVAC Project Engineer',
    location: 'Ahmedabad / On-Site Client Plants',
    type: 'Full-Time',
    experience: '3 - 6 Years',
    postingDate: new Date(),
    desc: 'Manage engineering design review, equipment qualification (DQ/IQ/OQ/PQ), cleanroom HVAC validation, and commissioning for sterile & oral solid dosage plants.',
    requirements: [
      'B.E. / B.Tech in Mechanical or Chemical Engineering',
      'Experience in pharmaceutical facility HVAC design and DQ/IQ/OQ/PQ protocols',
      'Proficiency in AutoCAD and P&ID diagrams',
    ],
    status: 'Active',
  },
  {
    title: 'Computer System Validation (CSV) & Pharma 4.0 Lead',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    experience: '4 - 7 Years',
    postingDate: new Date(),
    desc: 'Perform 21 CFR Part 11 and GAMP 5 compliance validation for LIMS, eQMS, PLC/SCADA automated equipment, and enterprise cloud software.',
    requirements: [
      'B.Tech / B.E. / M.Sc in Computer Science or Lifescience Technology',
      'Deep understanding of GAMP 5, 21 CFR Part 11, and Annex 11',
      'Hands-on experience writing URS, FRS, VMP, and Validation Summary Reports',
    ],
    status: 'Active',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hibiscus_db';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    // Check if admin already exists
    let admin = await Admin.findOne({ email: DEFAULT_ADMIN.email });
    if (!admin) {
      admin = await Admin.create(DEFAULT_ADMIN);
      console.log(`[Seed Success] Created default admin account: ${DEFAULT_ADMIN.email} (Password: ${DEFAULT_ADMIN.password})`);
    } else {
      admin.password = DEFAULT_ADMIN.password;
      await admin.save();
      console.log(`[Seed Success] Admin account updated/verified: ${DEFAULT_ADMIN.email} (Password: ${DEFAULT_ADMIN.password})`);
    }

    // Seed sample jobs if DB is empty
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      const jobsWithAdmin = SAMPLE_JOBS.map(job => ({ ...job, createdBy: admin._id }));
      await Job.insertMany(jobsWithAdmin);
      console.log(`[Seed Success] Seeded ${SAMPLE_JOBS.length} sample job openings.`);
    } else {
      console.log(`[Seed Info] Database already contains ${jobCount} job openings.`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Failed] Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
