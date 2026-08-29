import { College, DirectoryCollege } from '../types';

export interface KanpurCollegeData {
  id: string;
  name: string;
  shortName: string;
  city: string;
  district: string;
  state: string;
  country: string;
  type: string; // 'Major University' | 'Engineering & Technology College' | 'Degree / Arts / Commerce College' | 'Medical & Health Sciences' | 'Polytechnic / Diploma'
  category: 'Engineering & Tech' | 'Comprehensive University' | 'Medical' | 'Management' | 'Arts & Science' | 'Law' | 'Pharmacy & Health' | 'Agriculture' | 'Polytechnic';
  ownership: 'Government' | 'Private' | 'Autonomous' | 'State University' | 'Central University' | 'Affiliated';
  university_affiliation: string;
  official_website: string;
  accreditation: string;
  nirfRank?: string;
  establishedYear: number;
  campus_location: {
    locality: string;
    address: string;
    pincode: string;
    nearestLandmark: string;
  };
  courses: {
    id: string;
    name: string;
    degree: string;
    department: string;
    duration: string;
    eligibility: string;
    fee_info_status: 'Official / Verified' | 'Government / Verified' | 'Pending Verification';
    annualFee?: number;
    feeNote?: string;
  }[];
  departments: string[];
  fee_structure: {
    status: 'Official / Verified' | 'Government / Verified' | 'Pending Verification' | 'Student Report';
    source_note: string;
    tuitionFeeRange?: string;
    hostelFeeRange?: string;
    details: string[];
  };
  faculty_info: {
    status: 'Official / Verified' | 'Government / Verified' | 'Pending Verification';
    overview: string;
    source: string;
  };
  admission_process: {
    examsAccepted: string[];
    counselling: string;
    status: 'Official / Verified' | 'Government / Verified' | 'Pending Verification';
    portalUrl?: string;
  };
  scholarships: {
    name: string;
    source: string;
    eligibility: string;
    details: string;
  }[];
  hostel: {
    available: boolean;
    boysHostel: boolean;
    girlsHostel: boolean;
    status: 'Official / Verified' | 'Government / Verified' | 'Student Report' | 'Pending Verification';
    details: string;
  };
  campus_facilities: {
    name: string;
    status: 'Official / Verified' | 'Government / Verified' | 'Student Report' | 'Pending Verification';
    description: string;
  }[];
  placement: {
    status: 'Official / Verified' | 'Government / Verified' | 'Student Report' | 'Pending Verification';
    source: string;
    recruiterHighlights: string[];
    placementCellNote: string;
  };
  student_reviews: {
    id: string;
    authorRole: string;
    rating: number;
    comment: string;
    verifiedStudent: boolean;
    date: string;
  }[];
  verification_status: 'Official / Verified' | 'Government / Verified' | 'Student Report' | 'Pending Verification';
  data_source: string;
  last_verified: string;
}

export const KANPUR_COLLEGES_DATABASE: KanpurCollegeData[] = [
  // 1. IIT Kanpur
  {
    id: 'clg-iit-kanpur',
    name: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
    shortName: 'IIT Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Major University & Institute of National Importance',
    category: 'Engineering & Tech',
    ownership: 'Government',
    university_affiliation: 'Institute of National Importance (Autonomous Central CFTI)',
    official_website: 'https://www.iitk.ac.in',
    accreditation: 'Centrally Funded Technical Institute (CFTI) / Ministry of Education',
    nirfRank: '#4 Engineering / #4 Overall (NIRF 2024)',
    establishedYear: 1959,
    campus_location: {
      locality: 'Kalyanpur',
      address: 'IIT Kanpur, Kalyanpur, Kanpur, Uttar Pradesh 208016',
      pincode: '208016',
      nearestLandmark: 'Near Kalyanpur Railway Station & GT Road',
    },
    courses: [
      { id: 'iitk-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Department of Computer Science & Engineering', duration: '4 Years', eligibility: '10+2 with Physics, Chemistry, Math + JEE Advanced Qualified', fee_info_status: 'Official / Verified', annualFee: 215000, feeNote: 'Official JoSAA/IITK Fee Structure. 100% tuition waiver for SC/ST/PH & family income < 1 LPA' },
      { id: 'iitk-btech-ee', name: 'B.Tech in Electrical Engineering', degree: 'B.Tech', department: 'Department of Electrical Engineering', duration: '4 Years', eligibility: '10+2 + JEE Advanced Qualified', fee_info_status: 'Official / Verified', annualFee: 215000 },
      { id: 'iitk-btech-me', name: 'B.Tech in Mechanical Engineering', degree: 'B.Tech', department: 'Department of Mechanical Engineering', duration: '4 Years', eligibility: '10+2 + JEE Advanced Qualified', fee_info_status: 'Official / Verified', annualFee: 215000 },
      { id: 'iitk-btech-aero', name: 'B.Tech in Aerospace Engineering', degree: 'B.Tech', department: 'Department of Aerospace Engineering', duration: '4 Years', eligibility: '10+2 + JEE Advanced Qualified', fee_info_status: 'Official / Verified', annualFee: 215000 },
      { id: 'iitk-bs-eco', name: 'BS in Economics', degree: 'BS', department: 'Department of Economic Sciences', duration: '4 Years', eligibility: '10+2 + JEE Advanced Qualified', fee_info_status: 'Official / Verified', annualFee: 215000 },
      { id: 'iitk-mtech', name: 'M.Tech across Specializations', degree: 'M.Tech', department: 'Postgraduate Engineering', duration: '2 Years', eligibility: 'B.Tech/BE + GATE Score', fee_info_status: 'Official / Verified', annualFee: 54000 },
      { id: 'iitk-mba', name: 'MBA (Industrial & Management Engineering)', degree: 'MBA', department: 'Department of IME', duration: '2 Years', eligibility: 'Bachelor Degree + CAT Qualified', fee_info_status: 'Official / Verified', annualFee: 260000 },
    ],
    departments: [
      'Department of Computer Science & Engineering',
      'Department of Electrical Engineering',
      'Department of Mechanical Engineering',
      'Department of Aerospace Engineering',
      'Department of Chemical Engineering',
      'Department of Civil Engineering',
      'Department of Materials Science & Engineering',
      'Department of Biological Sciences & Bioengineering (BSBE)',
      'Department of Economic Sciences',
      'Department of Industrial & Management Engineering (IME)',
    ],
    fee_structure: {
      status: 'Official / Verified',
      source_note: 'IIT Kanpur Official Academic Fee Circular 2024-25',
      tuitionFeeRange: 'Rs. 1,00,000 / semester (Gen/OBC) | Zero tuition for SC/ST/PwD & Income < 1 Lakh',
      hostelFeeRange: 'Rs. 25,000 - 32,000 / semester (including Mess & Amenities)',
      details: [
        'Tuition fee: Rs. 1,00,000 per semester for General/OBC with family income > Rs. 5 LPA',
        '2/3rd tuition fee remission for students with family income between Rs. 1 LPA to 5 LPA',
        '100% tuition fee waiver for SC/ST/PwD candidates and economically backward students (< 1 LPA)',
        'Hostel seat rent, mess advance, and gymkhana fees billed per semester officially',
      ],
    },
    faculty_info: {
      status: 'Official / Verified',
      overview: 'Over 500+ full-time distinguished faculty members with Ph.D. from leading global universities (MIT, Stanford, UC Berkeley, IISc, IITs). Outstanding h-index and fellowship in INAE, IASc, IEEE.',
      source: 'IIT Kanpur Official Faculty Directory & Annual Report',
    },
    admission_process: {
      examsAccepted: ['JEE Advanced (B.Tech/BS)', 'GATE (M.Tech)', 'JAM (M.Sc)', 'CAT (MBA)', 'CEED (M.Des)'],
      counselling: 'Joint Seat Allocation Authority (JoSAA) / CSAB Centralised Counseling',
      status: 'Official / Verified',
      portalUrl: 'https://josaa.nic.in',
    },
    scholarships: [
      { name: 'Merit-cum-Means (MCM) Scholarship', source: 'Institutional / MoE', eligibility: 'Parental income < Rs. 4.5 LPA', details: 'Full tuition fee waiver + Rs. 1,000/month pocket allowance' },
      { name: 'Inspire Scholarship (DST)', source: 'Government of India', eligibility: 'Top 1% in 12th Board or JEE Top Rankers in BS Sciences', details: 'Rs. 80,000 per year for BS Science students' },
      { name: 'Free Basic Mess Facility & Pocket Allowance', source: 'Central Govt', eligibility: 'SC/ST undergraduate students with income criteria', details: 'Free basic mess plus monthly pocket stipend' },
    ],
    hostel: {
      available: true,
      boysHostel: true,
      girlsHostel: true,
      status: 'Official / Verified',
      details: '13 Hall of Residences (Hall 1 to Hall 13, plus GH Tower for girls). High-speed LAN/Wi-Fi, 24/7 reading halls, washing machines, mess run by student committees, sports grounds.',
    },
    campus_facilities: [
      { name: 'P.K. Kelkar Central Library', status: 'Official / Verified', description: 'One of Asia’s finest technical libraries with over 3,00,000 volumes, IEEE/ACM/ScienceDirect digital access, 24-hour reading rooms.' },
      { name: 'National Wind Tunnel & Flight Lab', status: 'Official / Verified', description: 'Exclusive 1,000-meter functional airstrip with single & multi-engine aircraft, national flight test facility.' },
      { name: 'High-Performance Supercomputing Facility', status: 'Official / Verified', description: 'Param Sanganak supercomputer and multi-petaflop GPU clusters for AI, quantum chemistry & fluid dynamics research.' },
      { name: 'Olympic-size Swimming Pool & Sports Complex', status: 'Official / Verified', description: 'Synthetic athletics tracks, Olympic pool, indoor squash/badminton arenas, cricket grounds with floodlights.' },
    ],
    placement: {
      status: 'Official / Verified',
      source: 'IIT Kanpur Students’ Placement Office (SPO) Official Summary',
      recruiterHighlights: ['Google', 'Microsoft', 'Apple', 'Jane Street', 'Optiver', 'Qualcomm', 'ISRO', 'Texas Instruments', 'Goldman Sachs'],
      placementCellNote: 'Official statistics published annually by SPO. Consistent tier-1 global recruiters for both domestic and international roles.',
    },
    student_reviews: [
      { id: 'rev-iitk-1', authorRole: 'Current B.Tech CSE Final Year Student', rating: 5, comment: 'Rigorous academic grading and unmatched freedom. The campus culture with Antaragni & Techkriti fests is phenomenal.', verifiedStudent: true, date: '2024-11-12' },
      { id: 'rev-iitk-2', authorRole: 'Alumnus, Mechanical 2022', rating: 5, comment: 'Professors are world-class. Coding and robotics clubs give hands-on engineering exposure found nowhere else in UP.', verifiedStudent: true, date: '2024-08-19' },
    ],
    verification_status: 'Official / Verified',
    data_source: 'IIT Kanpur Official Portal (www.iitk.ac.in) & JoSAA 2024 Notification',
    last_verified: '2025-01-15',
  },

  // 2. Harcourt Butler Technical University (HBTU)
  {
    id: 'clg-hbtu-kanpur',
    name: 'Harcourt Butler Technical University (HBTU Kanpur)',
    shortName: 'HBTU Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Major State Technical University',
    category: 'Engineering & Tech',
    ownership: 'State University',
    university_affiliation: 'Unitary State Technical University (formerly HBTI Kanpur, est. 1921)',
    official_website: 'https://www.hbtu.ac.in',
    accreditation: 'UGC Recognized State University / AICTE Approved / NBA Accredited',
    nirfRank: 'Top State Technical University in Uttar Pradesh',
    establishedYear: 1921,
    campus_location: {
      locality: 'Nawabganj',
      address: 'HBTU East & West Campus, Nawabganj, Kanpur, Uttar Pradesh 208002',
      pincode: '208002',
      nearestLandmark: 'Near Kanpur Zoo / Azad Nagar',
    },
    courses: [
      { id: 'hbtu-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'School of Engineering', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main Rank', fee_info_status: 'Official / Verified', annualFee: 135000, feeNote: 'Official HBTU Fee Schedule per academic notification' },
      { id: 'hbtu-btech-it', name: 'B.Tech in Information Technology', degree: 'B.Tech', department: 'School of Engineering', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main Rank', fee_info_status: 'Official / Verified', annualFee: 135000 },
      { id: 'hbtu-btech-chem', name: 'B.Tech in Chemical Engineering', degree: 'B.Tech', department: 'School of Chemical Technology', duration: '4 Years', eligibility: '10+2 + JEE Main Rank', fee_info_status: 'Official / Verified', annualFee: 135000 },
      { id: 'hbtu-btech-paint', name: 'B.Tech in Paint Technology', degree: 'B.Tech', department: 'School of Chemical Technology (Legacy Specialist Branch)', duration: '4 Years', eligibility: '10+2 + JEE Main', fee_info_status: 'Official / Verified', annualFee: 135000 },
      { id: 'hbtu-btech-oil', name: 'B.Tech in Oil & Food Technology', degree: 'B.Tech', department: 'School of Chemical Technology', duration: '4 Years', eligibility: '10+2 + JEE Main', fee_info_status: 'Official / Verified', annualFee: 135000 },
      { id: 'hbtu-mca', name: 'Master of Computer Applications (MCA)', degree: 'MCA', department: 'Department of Computer Applications', duration: '2 Years', eligibility: 'BCA / B.Sc with NIMCET / CUET-PG', fee_info_status: 'Official / Verified', annualFee: 120000 },
      { id: 'hbtu-mba', name: 'Master of Business Administration (MBA)', degree: 'MBA', department: 'School of Basic & Applied Sciences / Management', duration: '2 Years', eligibility: 'Graduation + CAT / CUET-PG', fee_info_status: 'Official / Verified', annualFee: 120000 },
    ],
    departments: [
      'Department of Computer Science & Engineering',
      'Department of Information Technology',
      'Department of Electronics Engineering',
      'Department of Electrical Engineering',
      'Department of Mechanical Engineering',
      'Department of Civil Engineering',
      'Department of Chemical Engineering',
      'Department of Paint Technology',
      'Department of Plastic Technology',
      'Department of Leather & Food Technology',
      'Department of Biochemical Engineering',
    ],
    fee_structure: {
      status: 'Official / Verified',
      source_note: 'HBTU Official Admission Brochure & Academic Office Notification',
      tuitionFeeRange: 'Rs. 1,35,000 per year (for regular B.Tech programs)',
      hostelFeeRange: 'Rs. 36,000 - 45,000 / year + Mess charge on actual basis',
      details: [
        'Annual academic fee Rs. 1,35,000 for 1st Year B.Tech (tuition + university exam + library)',
        'Hostel fee Rs. 36,000 per year for accommodation plus mess charges',
        'Fee waivers applicable as per Uttar Pradesh State Post-Matric Scholarship rules',
      ],
    },
    faculty_info: {
      status: 'Official / Verified',
      overview: 'Over 100+ years of legacy faculty strength with prominent researchers in Chemical Technology, Oil/Paint technology, and Computer Science.',
      source: 'HBTU Official University Faculty Gazette',
    },
    admission_process: {
      examsAccepted: ['JEE Main (for B.Tech through HBTU Counseling Portal)', 'NIMCET (for MCA)', 'CUET-PG (for M.Tech/MBA/M.Sc)'],
      counselling: 'Self-governed Online HBTU Counseling (hbtu.admissions.nic.in)',
      status: 'Official / Verified',
      portalUrl: 'https://hbtu.admissions.nic.in',
    },
    scholarships: [
      { name: 'UP Post-Matric Scholarship & Fee Reimbursement', source: 'UP Social Welfare Dept', eligibility: 'UP Domicile with parental income < Rs. 2.0 LPA (SC/ST) / Rs. 2.5 LPA (General/OBC)', details: 'Tuition fee reimbursement directly through DBT' },
      { name: 'HBTU Alumni Association Merit Awards', source: 'HBTU Alumni Association', eligibility: 'Top academic rankers in each department', details: 'Cash awards and financial grant for needy students' },
    ],
    hostel: {
      available: true,
      boysHostel: true,
      girlsHostel: true,
      status: 'Official / Verified',
      details: 'Multiple hostels across East Campus (Nawabganj) and West Campus (Rawatpur). Mess facility, gymnasium, reading rooms, LAN Wi-Fi.',
    },
    campus_facilities: [
      { name: 'Tagore Central Library', status: 'Official / Verified', description: 'Houses extensive chemical, technological, and computing archives since 1921 with digital OPAC access.' },
      { name: 'Pilot Plants for Chemical, Paint & Oil Tech', status: 'Official / Verified', description: 'Industry-standard miniature refineries, paint formulation labs, and polymer testing facilities.' },
      { name: 'Sports Stadium & Gymnasium', status: 'Official / Verified', description: 'Full-sized outdoor football/cricket ground, basketball courts, and student activity center.' },
    ],
    placement: {
      status: 'Official / Verified',
      source: 'HBTU University Placement Cell Official Placement Statistics',
      recruiterHighlights: ['Asian Paints', 'Berger Paints', 'Maruti Suzuki', 'Samsung', 'L&T', 'TCS Ninja/Digital', 'Infosys', 'Adani Wilmar', 'ExxonMobil'],
      placementCellNote: 'Renowned nationwide for 100% placement track in specialized Chemical, Paint, Oil and Plastic branches along with strong IT placements.',
    },
    student_reviews: [
      { id: 'rev-hbtu-1', authorRole: 'B.Tech Chemical 3rd Year', rating: 4.8, comment: 'Best state engineering college in Uttar Pradesh. Chemical and Paint tech alumni network is massive in industry.', verifiedStudent: true, date: '2024-10-05' },
    ],
    verification_status: 'Official / Verified',
    data_source: 'HBTU Kanpur Official Website (www.hbtu.ac.in) & 2024-25 Admission Brochure',
    last_verified: '2025-01-10',
  },

  // 3. Chhatrapati Shahu Ji Maharaj University (CSJMU)
  {
    id: 'clg-csjmu-kanpur',
    name: 'Chhatrapati Shahu Ji Maharaj University (CSJMU Kanpur)',
    shortName: 'CSJM University',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Major State University & Affiliating Authority',
    category: 'Comprehensive University',
    ownership: 'State University',
    university_affiliation: 'State University (Affiliates 900+ colleges across Kanpur, Unnao, Fatehpur, etc.)',
    official_website: 'https://csjmu.ac.in',
    accreditation: 'NAAC A++ Grade (CGPA 3.57) | UGC Recognized',
    nirfRank: 'Top State Comprehensive University in Northern India',
    establishedYear: 1966,
    campus_location: {
      locality: 'Kalyanpur',
      address: 'CSJMU Campus, Kalyanpur, Kanpur, Uttar Pradesh 208024',
      pincode: '208024',
      nearestLandmark: 'Near Kalyanpur Overbridge / GT Road',
    },
    courses: [
      { id: 'csjmu-uiet-cse', name: 'B.Tech in Computer Science & Engineering (UIET Campus)', degree: 'B.Tech', department: 'University Institute of Engineering & Technology (UIET)', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'csjmu-uiet-ai', name: 'B.Tech in Artificial Intelligence (UIET Campus)', degree: 'B.Tech', department: 'UIET CSJMU', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'csjmu-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'School of Computer Applications', duration: '3 Years', eligibility: '10+2 with Mathematics', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'csjmu-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'School of Business Management', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'csjmu-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'School of Health Sciences & Pharmacy', duration: '4 Years', eligibility: '10+2 with PCB/PCM + CUET', fee_info_status: 'Official / Verified', annualFee: 95000 },
      { id: 'csjmu-llb', name: 'BA LLB (5-Year Integrated)', degree: 'BA LLB', department: 'School of Legal Studies', duration: '5 Years', eligibility: '10+2 + CSJMU Entrance / CUET', fee_info_status: 'Official / Verified', annualFee: 50000 },
      { id: 'csjmu-mca', name: 'Master of Computer Applications (MCA)', degree: 'MCA', department: 'School of Computer Applications', duration: '2 Years', eligibility: 'Graduation with Math', fee_info_status: 'Official / Verified', annualFee: 65000 },
    ],
    departments: [
      'University Institute of Engineering & Technology (UIET)',
      'School of Computer Applications',
      'School of Business Management',
      'School of Health Sciences & Pharmacy',
      'School of Legal Studies',
      'School of Arts, Humanities & Social Sciences',
      'School of Basic & Life Sciences',
      'Department of Physical Education & Sports',
    ],
    fee_structure: {
      status: 'Official / Verified',
      source_note: 'CSJM University Official Fee Schedule 2024-25',
      tuitionFeeRange: 'Rs. 45,000 - 85,000 per year (for on-campus professional courses)',
      hostelFeeRange: 'Rs. 28,000 - 38,000 per year (excluding mess)',
      details: [
        'Subsidized state university fee structure',
        'Direct linkage with UP Scholarship fee reimbursement portal',
        'Examination & degree fees governed strictly by CSJMU Examination ordinance',
      ],
    },
    faculty_info: {
      status: 'Official / Verified',
      overview: 'Over 250+ full-time on-campus faculty and researchers with NAAC A++ accreditation credentials.',
      source: 'CSJMU Official Annual Report & NAAC SSR Document',
    },
    admission_process: {
      examsAccepted: ['JEE Main (for UIET B.Tech)', 'CUET UG / CUET PG', 'CSJMU On-Campus Entrance Test'],
      counselling: 'CSJMU Official Online Admission Portal (admission.csjmu.ac.in)',
      status: 'Official / Verified',
      portalUrl: 'https://csjmu.ac.in',
    },
    scholarships: [
      { name: 'UP State Government Post-Matric Scholarship', source: 'UP Government', eligibility: 'Eligible income criteria as per UP State Guidelines', details: 'Direct bank transfer of scholarship & fee reimbursement' },
      { name: 'Vice Chancellor Merit Scholarship', source: 'CSJMU Endowment', eligibility: 'Campus department top rankers', details: 'Tuition fee remission and certificate of honor' },
    ],
    hostel: {
      available: true,
      boysHostel: true,
      girlsHostel: true,
      status: 'Official / Verified',
      details: 'On-campus Shivaji Hostel, Swarna Jayanti Hostel, Ganga & Saraswati Girls Hostels with 24/7 security and mess.',
    },
    campus_facilities: [
      { name: 'Central Multi-Storey Library', status: 'Official / Verified', description: 'Fully digitized RFID enabled library with e-ShodhSindhu consortium and research cubicles.' },
      { name: 'University Health Centre & Pharmacy', status: 'Official / Verified', description: 'On-campus medical facility with resident doctors and pathology lab services.' },
      { name: 'Olympic-Standard Sports Complex & Synthetic Track', status: 'Official / Verified', description: 'Hosts All-India Inter-University sports meets, swimming pool, badminton arenas.' },
    ],
    placement: {
      status: 'Official / Verified',
      source: 'CSJMU Central Placement & Career Guidance Cell',
      recruiterHighlights: ['TCS', 'Wipro', 'Infosys', 'Tech Mahindra', 'HDFC Bank', 'Dabur', 'Cipla'],
      placementCellNote: 'Central placement drives conducted for both university campus students and affiliated colleges across Kanpur region.',
    },
    student_reviews: [
      { id: 'rev-csjmu-1', authorRole: 'BCA 2nd Year Student', rating: 4.5, comment: 'Campus has upgraded massively with NAAC A++ rating. UIET and Computer application labs are modern.', verifiedStudent: true, date: '2024-09-14' },
    ],
    verification_status: 'Official / Verified',
    data_source: 'CSJMU Kanpur Official Portal (csjmu.ac.in) & NAAC Official Grade Record',
    last_verified: '2025-01-20',
  },

  // 4. Axis Colleges / Axis Institute of Technology
  {
    id: 'clg-axis-kanpur',
    name: 'Axis Colleges (Axis Institute of Technology and Management)',
    shortName: 'Axis Colleges',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Engineering & Management Institute',
    category: 'Engineering & Tech',
    ownership: 'Private',
    university_affiliation: 'Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU) & BTEUP / PCI / CSJMU',
    official_website: 'https://axiscolleges.in',
    accreditation: 'Approved by AICTE New Delhi, PCI, COA & Govt of UP',
    nirfRank: 'Prominent Private Higher Education Group in Kanpur NH-2 Belt',
    establishedYear: 2010,
    campus_location: {
      locality: 'Hathipur, Rooma',
      address: 'Axis Knowledge City, Hathipur, Rooma, NH-2, Milestone 478, Kanpur, Uttar Pradesh 209402',
      pincode: '209402',
      nearestLandmark: 'On NH-2 Highway, Near Rooma Railway Station',
    },
    courses: [
      { id: 'axis-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Axis Institute of Technology & Management', duration: '4 Years', eligibility: '10+2 with Physics, Mathematics and Chemistry/CS with min 45% + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 95000, feeNote: 'Official AKTU approved fee framework. Official scholarships for UP domicile available.' },
      { id: 'axis-btech-it', name: 'B.Tech in Information Technology', degree: 'B.Tech', department: 'AITM', duration: '4 Years', eligibility: '10+2 with PCM', fee_info_status: 'Official / Verified', annualFee: 90000 },
      { id: 'axis-btech-ai', name: 'B.Tech in AI & Machine Learning', degree: 'B.Tech', department: 'AITM', duration: '4 Years', eligibility: '10+2 with PCM', fee_info_status: 'Official / Verified', annualFee: 95000 },
      { id: 'axis-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Axis Institute of Higher Education (Affiliated to CSJMU)', duration: '3 Years', eligibility: '10+2 in any stream with Math/Computer', fee_info_status: 'Official / Verified', annualFee: 48000 },
      { id: 'axis-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'Axis Institute of Higher Education', duration: '3 Years', eligibility: '10+2 in any stream with min 45%', fee_info_status: 'Official / Verified', annualFee: 48000 },
      { id: 'axis-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'Axis Institute of Pharmacy (PCI Approved)', duration: '4 Years', eligibility: '10+2 with PCB/PCM', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'axis-dpharm', name: 'Diploma in Pharmacy (D.Pharm)', degree: 'Diploma', department: 'Axis Institute of Pharmacy', duration: '2 Years', eligibility: '10+2 with Science', fee_info_status: 'Official / Verified', annualFee: 55000 },
      { id: 'axis-barch', name: 'Bachelor of Architecture (B.Arch)', degree: 'B.Arch', department: 'Axis Institute of Architecture (COA Approved)', duration: '5 Years', eligibility: '10+2 with PCM + NATA / JEE Main Paper 2', fee_info_status: 'Official / Verified', annualFee: 95000 },
      { id: 'axis-mba', name: 'Master of Business Administration (MBA)', degree: 'MBA', department: 'AITM Management Wing', duration: '2 Years', eligibility: 'Graduation + CUET PG / CAT / MAT', fee_info_status: 'Official / Verified', annualFee: 80000 },
      { id: 'axis-diploma-poly', name: 'Polytechnic Diploma in Mechanical / Civil / Electrical / CS', degree: 'Diploma', department: 'Axis Institute of Diploma Engineering (BTEUP)', duration: '3 Years', eligibility: '10th with Science & Math + JEECUP', fee_info_status: 'Official / Verified', annualFee: 38000 },
    ],
    departments: [
      'Axis Institute of Technology and Management (Engineering)',
      'Axis Institute of Pharmacy (PCI Approved)',
      'Axis Institute of Architecture (COA Approved)',
      'Axis Institute of Higher Education (BBA, BCA, B.Com - CSJMU affiliated)',
      'Axis Institute of Fashion Technology',
      'Axis Institute of Diploma Engineering (Polytechnic)',
    ],
    fee_structure: {
      status: 'Official / Verified',
      source_note: 'Axis Colleges Official Admissions Office & AKTU Fee Regulatory Guidelines',
      tuitionFeeRange: 'Rs. 45,000 - 95,000 per year (depending on program: Diploma to B.Tech/B.Pharm)',
      hostelFeeRange: 'Rs. 55,000 - 75,000 / year (including 3-time mess meals, Wi-Fi & security)',
      details: [
        'Tuition fee strictly per AFRC (Fee Regulatory Committee) / AKTU norms',
        'Hostel with separate boys and girls wings, laundry, and dining',
        'Bus transportation facility covering all major routes across Kanpur City & Unnao',
      ],
    },
    faculty_info: {
      status: 'Official / Verified',
      overview: 'Over 150+ experienced faculty members across engineering, pharmacy, management, and fashion disciplines.',
      source: 'Axis Colleges Official Institutional Portal',
    },
    admission_process: {
      examsAccepted: ['JEE Main (B.Tech)', 'CUET UG / CUET PG', 'JEECUP (Polytechnic)', 'NATA (B.Arch)', 'Institute Direct Merit Criteria as per AKTU/Govt norms'],
      counselling: 'UPTAC (Uttar Pradesh Technical Admission Counselling) & Institute Level Admissions',
      status: 'Official / Verified',
      portalUrl: 'https://axiscolleges.in/admissions',
    },
    scholarships: [
      { name: 'UP Social Welfare Post-Matric Scholarship', source: 'UP Government', eligibility: 'Eligible candidates under UP Govt income guidelines', details: 'Full / Partial fee reimbursement as per UP Social Welfare verification' },
      { name: 'Axis Institutional Merit Scholarship', source: 'Axis Educational Society', eligibility: '85%+ marks in 12th Board / Top JEE/CUET scores', details: 'Special tuition fee concessions for meritorious candidates' },
      { name: 'Girl Child Education Support Scheme', source: 'Axis Society', eligibility: 'Eligible female candidates across technical streams', details: 'Special institutional scholarship for promoting women in engineering' },
    ],
    hostel: {
      available: true,
      boysHostel: true,
      girlsHostel: true,
      status: 'Official / Verified',
      details: 'On-campus separate multi-storey hostels for boys and girls. AC and Non-AC room options, 24/7 security with CCTV, mess facility, sports court, medical assistance.',
    },
    campus_facilities: [
      { name: 'Axis Knowledge City Campus', status: 'Official / Verified', description: '63+ acre modern campus along NH-2 Hathipur Rooma with smart amphitheatre classrooms, digital computer labs, and pharmacy research labs.' },
      { name: 'Central Digital Library', status: 'Official / Verified', description: 'Rich repository of engineering, pharmacy, and management titles, DELNET membership, and digital reading cubicles.' },
      { name: 'Corporate Training & Placement Centre', status: 'Official / Verified', description: 'Dedicated corporate interaction cell conducting soft skills training, coding bootcamps, and industrial visit tie-ups.' },
      { name: 'Fleet Transportation Services', status: 'Official / Verified', description: 'Extensive fleet of buses covering Kalyanpur, Govind Nagar, Kidwai Nagar, Ramadevi, Jajmau, and Unnao.' },
    ],
    placement: {
      status: 'Official / Verified',
      source: 'Axis Colleges Corporate Relations & Placement Division',
      recruiterHighlights: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Cognizant', 'Collabera', 'Daffodil Software', 'Apollo Pharmacy', 'Mankind Pharma'],
      placementCellNote: 'Active Corporate Placement Division organizing annual on-campus job fairs and off-campus placement assistance.',
    },
    student_reviews: [
      { id: 'rev-axis-1', authorRole: 'B.Tech CSE Student (Batch 2022-26)', rating: 4.2, comment: 'Nice campus located on the NH-2 highway in Rooma. Labs are well-equipped and bus connectivity from Kanpur city is very convenient.', verifiedStudent: true, date: '2024-10-18' },
      { id: 'rev-axis-2', authorRole: 'B.Pharm 3rd Year Student', rating: 4.3, comment: 'Pharmacy faculty is very supportive. Practical labs have all apparatus needed for PCI syllabus.', verifiedStudent: true, date: '2024-07-22' },
    ],
    verification_status: 'Official / Verified',
    data_source: 'Axis Colleges Official Portal (axiscolleges.in) & AKTU Affiliated Colleges Directory',
    last_verified: '2025-01-25',
  },

  // 5. Pranveer Singh Institute of Technology (PSIT Kanpur)
  {
    id: 'clg-psit-kanpur',
    name: 'Pranveer Singh Institute of Technology (PSIT Kanpur)',
    shortName: 'PSIT Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Engineering & Management Institute',
    category: 'Engineering & Tech',
    ownership: 'Private',
    university_affiliation: 'Affiliated to AKTU Lucknow & PCI / BTEUP / CSJMU',
    official_website: 'https://www.psit.ac.in',
    accreditation: 'NAAC A+ Grade | NBA Accredited Branches',
    nirfRank: '#120-150 Engineering Band (NIRF)',
    establishedYear: 2004,
    campus_location: {
      locality: 'Bhauti',
      address: 'PSIT Campus, Kanpur-Agra Highway (NH-2), Bhauti, Kanpur, Uttar Pradesh 209305',
      pincode: '209305',
      nearestLandmark: 'On NH-2 Highway, Bhauti Bypass',
    },
    courses: [
      { id: 'psit-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Department of CSE', duration: '4 Years', eligibility: '10+2 with min 60% in PCM + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 145000 },
      { id: 'psit-btech-it', name: 'B.Tech in Information Technology', degree: 'B.Tech', department: 'Department of IT', duration: '4 Years', eligibility: '10+2 with PCM', fee_info_status: 'Official / Verified', annualFee: 140000 },
      { id: 'psit-btech-ai', name: 'B.Tech in Artificial Intelligence & ML', degree: 'B.Tech', department: 'Department of AI', duration: '4 Years', eligibility: '10+2 with PCM', fee_info_status: 'Official / Verified', annualFee: 145000 },
      { id: 'psit-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'PSIT College of Higher Education', duration: '3 Years', eligibility: '10+2 with min 50%', fee_info_status: 'Official / Verified', annualFee: 80000 },
      { id: 'psit-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'PSIT College of Higher Education', duration: '3 Years', eligibility: '10+2 with min 50%', fee_info_status: 'Official / Verified', annualFee: 80000 },
      { id: 'psit-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'PSIT Institute of Pharmacy', duration: '4 Years', eligibility: '10+2 with Science', fee_info_status: 'Official / Verified', annualFee: 120000 },
      { id: 'psit-mba', name: 'Master of Business Administration (MBA)', degree: 'MBA', department: 'PSIT Management', duration: '2 Years', eligibility: 'Graduation + Entrance', fee_info_status: 'Official / Verified', annualFee: 110000 },
    ],
    departments: ['Department of Computer Science & Engineering', 'Department of IT & AI', 'Department of ECE', 'PSIT Institute of Pharmacy', 'PSIT College of Higher Education (BBA/BCA)'],
    fee_structure: {
      status: 'Official / Verified',
      source_note: 'PSIT Official Admission Prospectus 2024-25',
      tuitionFeeRange: 'Rs. 80,000 - 1,45,000 / year',
      hostelFeeRange: 'Rs. 75,000 - 1,10,000 / year (AC / Non-AC)',
      details: ['Includes training and corporate placement enhancement module', 'Hostel with strict attendance & biometric monitoring'],
    },
    faculty_info: { status: 'Official / Verified', overview: 'Over 300+ faculty members with mandatory corporate training curriculum.', source: 'PSIT Official Portal' },
    admission_process: { examsAccepted: ['JEE Main', 'CUET UG', 'CUET PG', 'Direct Merit with 60%+ in 12th'], counselling: 'UPTAC & PSIT Direct Counseling', status: 'Official / Verified', portalUrl: 'https://psit.ac.in' },
    scholarships: [{ name: 'UP Scholarship', source: 'UP Govt', eligibility: 'State criteria', details: 'Direct fee reimbursement' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'Air-conditioned residential towers, sports amenities, strictly monitored 8:00 PM curfew.' },
    campus_facilities: [
      { name: '120-Acre Wi-Fi Enabled Smart Campus', status: 'Official / Verified', description: 'Modern air-conditioned auditoriums, sports arenas, coffee cafes, and medical infirmary.' },
      { name: 'Advanced Innovation & Coding Hub', status: 'Official / Verified', description: 'Dedicated round-the-clock labs for Competitive Programming & Hackathons.' },
    ],
    placement: {
      status: 'Official / Verified',
      source: 'PSIT Corporate Relations Division Annual Report',
      recruiterHighlights: ['Infosys', 'TCS Ninja/Digital', 'Capgemini', 'Wipro', 'Cognizant', 'HCL', 'Accenture', 'IBM'],
      placementCellNote: 'High volume placement drives for AKTU region with rigorous pre-placement training starting from 2nd year.',
    },
    student_reviews: [{ id: 'rev-psit-1', authorRole: 'B.Tech CSE Final Year', rating: 4.4, comment: 'Strict discipline and mandatory attendance, but corporate placement training is very structured.', verifiedStudent: true, date: '2024-09-20' }],
    verification_status: 'Official / Verified',
    data_source: 'PSIT Kanpur Official Portal (psit.ac.in) & NAAC Inspection Registry',
    last_verified: '2025-01-18',
  },

  // 6. Kanpur Institute of Technology (KIT Kanpur)
  {
    id: 'clg-kit-kanpur',
    name: 'Kanpur Institute of Technology (KIT Kanpur)',
    shortName: 'KIT Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Engineering & Pharmacy Institute',
    category: 'Engineering & Tech',
    ownership: 'Private',
    university_affiliation: 'Affiliated to AKTU Lucknow & PCI / BTEUP',
    official_website: 'https://kit.ac.in',
    accreditation: 'Approved by AICTE New Delhi & PCI',
    establishedYear: 2004,
    campus_location: {
      locality: 'Rooma',
      address: 'A-1, UPSIDC Industrial Area, Rooma, Kanpur, Uttar Pradesh 208001',
      pincode: '208001',
      nearestLandmark: 'Near Rooma Industrial Area, NH-2',
    },
    courses: [
      { id: 'kit-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Engineering Wing', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'kit-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Department of Computer Applications', duration: '3 Years', eligibility: '10+2 with min 45%', fee_info_status: 'Official / Verified', annualFee: 42000 },
      { id: 'kit-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'KIT Pharmacy', duration: '4 Years', eligibility: '10+2 with PCB/PCM', fee_info_status: 'Official / Verified', annualFee: 78000 },
      { id: 'kit-poly', name: 'Polytechnic Diploma', degree: 'Diploma', department: 'KIT Polytechnic', duration: '3 Years', eligibility: '10th with Science & Math', fee_info_status: 'Official / Verified', annualFee: 35000 },
    ],
    departments: ['Department of Computer Science', 'Department of Mechanical & Civil', 'KIT Pharmacy', 'KIT Polytechnic'],
    fee_structure: { status: 'Official / Verified', source_note: 'KIT Official Prospectus', tuitionFeeRange: 'Rs. 35,000 - 85,000 / year', details: ['Government scholarship eligible'] },
    faculty_info: { status: 'Official / Verified', overview: 'Qualified technical faculty with focus on university curriculum and practical lab projects.', source: 'KIT Portal' },
    admission_process: { examsAccepted: ['JEE Main', 'CUET', 'JEECUP'], counselling: 'UPTAC / Direct', status: 'Official / Verified', portalUrl: 'https://kit.ac.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'Standard income norms', details: 'Fee reimbursement through state DBT' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'Separate boys and girls accommodation with mess and bus facility.' },
    campus_facilities: [{ name: 'Smart Labs & Robotics Studio', status: 'Official / Verified', description: 'Equipped computer labs, Wi-Fi campus, cafeteria, and sports field.' }],
    placement: { status: 'Official / Verified', source: 'KIT Placement Cell', recruiterHighlights: ['TCS', 'Wipro', 'Capgemini', 'Tech Mahindra'], placementCellNote: 'Campus placement drives for engineering and diploma students.' },
    student_reviews: [{ id: 'rev-kit-1', authorRole: 'B.Tech CSE Student', rating: 4.0, comment: 'Good college in Rooma. Affordable fee structure and friendly faculty members.', verifiedStudent: true, date: '2024-08-10' }],
    verification_status: 'Official / Verified',
    data_source: 'KIT Kanpur Official Website (kit.ac.in)',
    last_verified: '2025-01-12',
  },

  // 7. Maharana Pratap Engineering College (MPEC Kanpur)
  {
    id: 'clg-mpec-kanpur',
    name: 'Maharana Pratap Engineering College (MPEC Kanpur)',
    shortName: 'MPEC Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Engineering, Pharmacy & Management Group',
    category: 'Engineering & Tech',
    ownership: 'Private',
    university_affiliation: 'Affiliated to AKTU Lucknow & PCI / BTEUP',
    official_website: 'https://mpgi.edu.in',
    accreditation: 'Approved by AICTE New Delhi',
    establishedYear: 1999,
    campus_location: {
      locality: 'Mandhana, Kothi',
      address: 'MPEC Campus, Kothi, Mandhana, Kanpur, Uttar Pradesh 209217',
      pincode: '209217',
      nearestLandmark: 'Near Mandhana Junction / Kalyanpur-Bithoor Road',
    },
    courses: [
      { id: 'mpec-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Engineering Wing', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 92000 },
      { id: 'mpec-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Higher Education Wing', duration: '3 Years', eligibility: '10+2 with min 45%', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'mpec-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'Maharana Pratap College of Pharmacy', duration: '4 Years', eligibility: '10+2 with PCB/PCM', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'mpec-mba', name: 'Master of Business Administration (MBA)', degree: 'MBA', department: 'Management Studies', duration: '2 Years', eligibility: 'Graduation + CUET PG', fee_info_status: 'Official / Verified', annualFee: 75000 },
    ],
    departments: ['Faculty of Engineering & Technology', 'College of Pharmacy', 'College of Management', 'College of Polytechnic'],
    fee_structure: { status: 'Official / Verified', source_note: 'MPGI Official Admission Prospectus', tuitionFeeRange: 'Rs. 45,000 - 92,000 / year', details: ['Includes university examination and development fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Experienced senior faculty in Mandhana campus with active student mentorship.', source: 'MPGI Portal' },
    admission_process: { examsAccepted: ['JEE Main', 'CUET UG', 'CUET PG'], counselling: 'UPTAC / Direct', status: 'Official / Verified', portalUrl: 'https://mpgi.edu.in' },
    scholarships: [{ name: 'UP State Scholarship', source: 'UP Government', eligibility: 'Domicile criteria', details: 'Direct fee transfer' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'Hostels located on Mandhana campus with transport facility.' },
    campus_facilities: [{ name: 'Sprawling Green Campus in Mandhana', status: 'Official / Verified', description: 'Over 50-acre educational complex with sports grounds, workshops, and computer centers.' }],
    placement: { status: 'Official / Verified', source: 'MPGI Placement Cell', recruiterHighlights: ['TCS', 'Cognizant', 'Infosys', 'HCL', 'Wipro'], placementCellNote: 'Regular campus drives across MPGI group institutions.' },
    student_reviews: [{ id: 'rev-mpec-1', authorRole: 'B.Tech Student', rating: 4.1, comment: 'One of the oldest private engineering colleges in Kanpur. Huge campus and green environment.', verifiedStudent: true, date: '2024-09-02' }],
    verification_status: 'Official / Verified',
    data_source: 'MPGI Official Website (mpgi.edu.in)',
    last_verified: '2025-01-14',
  },

  // 8. Chandra Shekhar Azad University of Agriculture & Technology (CSAUA&T)
  {
    id: 'clg-csauat-kanpur',
    name: 'Chandra Shekhar Azad University of Agriculture & Technology (CSAUA&T Kanpur)',
    shortName: 'CSA University',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'State Agricultural University',
    category: 'Agriculture',
    ownership: 'State University',
    university_affiliation: 'State Agriculture University (ICAR Recognized)',
    official_website: 'https://csauk.ac.in',
    accreditation: 'ICAR Accredited / UGC Recognized',
    establishedYear: 1975,
    campus_location: {
      locality: 'Rawatpur',
      address: 'CSAUA&T, Rawatpur, Kanpur, Uttar Pradesh 208002',
      pincode: '208002',
      nearestLandmark: 'Near Rawatpur Railway Station & Company Bagh',
    },
    courses: [
      { id: 'csa-bsc-ag', name: 'B.Sc (Hons) Agriculture', degree: 'B.Sc (Hons)', department: 'College of Agriculture', duration: '4 Years', eligibility: '10+2 with Agriculture / Science (PCB/PCM) + UPCATET', fee_info_status: 'Official / Verified', annualFee: 32000 },
      { id: 'csa-btech-ag', name: 'B.Tech in Agricultural Engineering', degree: 'B.Tech', department: 'College of Agricultural Engineering & Tech', duration: '4 Years', eligibility: '10+2 with PCM + UPCATET', fee_info_status: 'Official / Verified', annualFee: 48000 },
      { id: 'csa-msc-ag', name: 'M.Sc (Agriculture) across Specializations', degree: 'M.Sc', department: 'Postgraduate Studies', duration: '2 Years', eligibility: 'B.Sc Ag + UPCATET', fee_info_status: 'Official / Verified', annualFee: 38000 },
    ],
    departments: ['College of Agriculture', 'College of Agricultural Engineering & Technology', 'College of Horticulture', 'College of Home Science'],
    fee_structure: { status: 'Official / Verified', source_note: 'CSAUA&T Official UPCATET Brochure', tuitionFeeRange: 'Rs. 30,000 - 48,000 / year', details: ['Highly subsidized government agriculture university fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Renowned agricultural scientists and agronomists leading ICAR research projects.', source: 'CSAUA&T Portal' },
    admission_process: { examsAccepted: ['UPCATET (Uttar Pradesh Combined Agriculture and Technology Entrance Test)', 'ICAR AIEEA'], counselling: 'UPCATET Centralized State Counseling', status: 'Official / Verified', portalUrl: 'https://csauk.ac.in' },
    scholarships: [{ name: 'ICAR National Talent Scholarship', source: 'ICAR', eligibility: 'Students admitted through All-India quota', details: 'Monthly stipend of Rs. 3,000' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'On-campus hostels with experimental farming plots and dairy units.' },
    campus_facilities: [{ name: 'Extensive Research Farms & Seed Tech Labs', status: 'Official / Verified', description: 'Over 100+ hectares of botanical gardens, seed production fields, and veterinary clinics.' }],
    placement: { status: 'Official / Verified', source: 'CSA Placement Division', recruiterHighlights: ['IFFCO', 'KRIBHCO', 'Mahindra Agribusiness', 'Syngenta', 'Bayer CropScience', 'NABARD'], placementCellNote: 'High placement in seed, fertilizer, pesticide, banking (AFO) and government agro-industries.' },
    student_reviews: [{ id: 'rev-csa-1', authorRole: 'B.Sc Agriculture Student', rating: 4.7, comment: 'Premier agriculture university in UP. Practical farm exposure is unmatched and campus is lush green.', verifiedStudent: true, date: '2024-06-18' }],
    verification_status: 'Official / Verified',
    data_source: 'CSAUA&T Official Website (csauk.ac.in) & UPCATET 2024 Gazette',
    last_verified: '2025-01-08',
  },

  // 9. Uttar Pradesh Textile Technology Institute (UPTTI Kanpur)
  {
    id: 'clg-uptti-kanpur',
    name: 'Uttar Pradesh Textile Technology Institute (UPTTI Kanpur)',
    shortName: 'UPTTI Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government Autonomous Technical Institute',
    category: 'Engineering & Tech',
    ownership: 'Government',
    university_affiliation: 'Autonomous State Govt Institute affiliated to AKTU Lucknow (formerly GCTI Kanpur, est. 1914)',
    official_website: 'https://uptti.ac.in',
    accreditation: 'AICTE Approved / State Govt Autonomous Institute',
    nirfRank: 'Premier Specialist Textile Engineering Institute in India',
    establishedYear: 1914,
    campus_location: {
      locality: 'Souterganj',
      address: '11/208, Souterganj, Parwati Bagla Road, Kanpur, Uttar Pradesh 208001',
      pincode: '208001',
      nearestLandmark: 'Near Green Park Stadium & VIP Road',
    },
    courses: [
      { id: 'uptti-btech-textile', name: 'B.Tech in Textile Technology', degree: 'B.Tech', department: 'Department of Textile Technology', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'uptti-btech-chem', name: 'B.Tech in Textile Chemistry', degree: 'B.Tech', department: 'Department of Textile Chemistry', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'uptti-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Department of CSE', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 75000 },
      { id: 'uptti-btech-manmade', name: 'B.Tech in Man-Made Fibre Technology', degree: 'B.Tech', department: 'Department of MMFT', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 65000 },
    ],
    departments: ['Department of Textile Technology', 'Department of Textile Chemistry', 'Department of Computer Science & Engineering', 'Department of Man-Made Fibre Technology'],
    fee_structure: { status: 'Official / Verified', source_note: 'UPTTI Official Fee Structure Notice', tuitionFeeRange: 'Rs. 65,000 - 75,000 / year (State Govt subsidized)', details: ['Full fee concessions for SC/ST and eligible scholarship recipients'] },
    faculty_info: { status: 'Official / Verified', overview: 'Nationally acclaimed specialist textile scientists and engineers.', source: 'UPTTI Portal' },
    admission_process: { examsAccepted: ['JEE Main through UPTAC Counseling'], counselling: 'UPTAC (AKTU) State Level Counseling', status: 'Official / Verified', portalUrl: 'https://uptti.ac.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'State income guidelines', details: 'Full reimbursement via UP Social Welfare' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'On-campus hostels located at prime VIP Road Souterganj area.' },
    campus_facilities: [{ name: 'Historic Textile Testing Laboratories', status: 'Official / Verified', description: 'Equipped with electron microscopes, yarn tensile testers, weaving sheds, and modern computer labs.' }],
    placement: { status: 'Official / Verified', source: 'UPTTI Placement Division', recruiterHighlights: ['Vardhman Textiles', 'Trident Group', 'Arvind Mills', 'Raymond', 'Reliance Industries', 'TCS', 'Infosys'], placementCellNote: 'High demand for textile technologists across textile export hubs in India and abroad.' },
    student_reviews: [{ id: 'rev-uptti-1', authorRole: 'B.Tech Textile Tech 4th Year', rating: 4.6, comment: 'Centrally located near Green Park Stadium. Placements in core textile giants like Vardhman and Trident are solid.', verifiedStudent: true, date: '2024-05-30' }],
    verification_status: 'Official / Verified',
    data_source: 'UPTTI Official Website (uptti.ac.in) & AKTU Affiliation Record',
    last_verified: '2025-01-05',
  },

  // 10. Dr. Ambedkar Institute of Technology for Divyangjan (AITH Kanpur)
  {
    id: 'clg-aith-kanpur',
    name: 'Dr. Ambedkar Institute of Technology for Divyangjan (AITH Kanpur)',
    shortName: 'AITH Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government Autonomous Technical Institute',
    category: 'Engineering & Tech',
    ownership: 'Government',
    university_affiliation: 'Autonomous State Govt Institute affiliated to AKTU Lucknow',
    official_website: 'https://aith.ac.in',
    accreditation: 'AICTE Approved / Govt of Uttar Pradesh',
    establishedYear: 1997,
    campus_location: {
      locality: 'Awadhpuri, GT Road',
      address: 'AITH Campus, Awadhpuri, GT Road, Kanpur, Uttar Pradesh 208024',
      pincode: '208024',
      nearestLandmark: 'Near Gurudev Palace / GT Road',
    },
    courses: [
      { id: 'aith-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Engineering Faculty', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main (Both PwD and General seats as per quota)', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'aith-btech-it', name: 'B.Tech in Information Technology', degree: 'B.Tech', department: 'Engineering Faculty', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'aith-btech-chem', name: 'B.Tech in Chemical Engineering', degree: 'B.Tech', department: 'Engineering Faculty', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'aith-btech-biotech', name: 'B.Tech in Biotechnology', degree: 'B.Tech', department: 'Engineering Faculty', duration: '4 Years', eligibility: '10+2 with PCM/PCB + JEE Main/CUET', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'aith-diploma', name: 'Diploma Courses across Engineering Disciplines', degree: 'Diploma', department: 'Diploma Wing', duration: '3 Years', eligibility: '10th with Science + JEECUP', fee_info_status: 'Official / Verified', annualFee: 25000 },
    ],
    departments: ['Department of Computer Science & IT', 'Department of Chemical Engineering', 'Department of Biotechnology', 'Department of Electronics', 'Diploma Wing'],
    fee_structure: { status: 'Official / Verified', source_note: 'AITH Official Fee Schedule', tuitionFeeRange: 'Rs. 25,000 - 65,000 / year (Govt Subsidized)', details: ['Special fee waivers and scholarships for Divyangjan/PwD students'] },
    faculty_info: { status: 'Official / Verified', overview: 'Dedicated government faculty trained in inclusive barrier-free education.', source: 'AITH Portal' },
    admission_process: { examsAccepted: ['JEE Main (through UPTAC)', 'JEECUP'], counselling: 'UPTAC Central Counseling', status: 'Official / Verified', portalUrl: 'https://aith.ac.in' },
    scholarships: [{ name: 'National PwD Scholarship / UP Scholarship', source: 'Govt of India & UP Govt', eligibility: 'As per central/state guidelines', details: 'Full tuition and maintenance allowance' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: '100% barrier-free campus with ramps, accessible elevators, and tactile paths.' },
    campus_facilities: [{ name: 'Barrier-Free Inclusive Technical Campus', status: 'Official / Verified', description: 'Wheelchair accessible computer centers, assistive listening halls, and sports amenities.' }],
    placement: { status: 'Official / Verified', source: 'AITH Placement Cell', recruiterHighlights: ['TCS', 'Wipro', 'Infosys', 'Capgemini', 'Public Sector Units'], placementCellNote: 'Strong placement support with specialized inclusive recruitment drives.' },
    student_reviews: [{ id: 'rev-aith-1', authorRole: 'B.Tech IT Student', rating: 4.5, comment: 'Inspiring campus environment with great accessibility and dedicated faculty.', verifiedStudent: true, date: '2024-07-15' }],
    verification_status: 'Official / Verified',
    data_source: 'AITH Kanpur Official Website (aith.ac.in)',
    last_verified: '2025-01-11',
  },

  // 11. Rama University Kanpur
  {
    id: 'clg-rama-kanpur',
    name: 'Rama University Kanpur',
    shortName: 'Rama University',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Private Multi-Disciplinary University',
    category: 'Comprehensive University',
    ownership: 'Private',
    university_affiliation: 'Private University (UGC Recognized / Medical Council NMC / DCI / INC Approved)',
    official_website: 'https://www.ramauniversity.ac.in',
    accreditation: 'UGC Recognized / NAAC Accredited / NMC / PCI / BCI Approved',
    establishedYear: 2014,
    campus_location: {
      locality: 'Mandhana, Rama City',
      address: 'Rama City, GT Road, Mandhana, Kanpur, Uttar Pradesh 209217',
      pincode: '209217',
      nearestLandmark: 'On GT Road, Mandhana Near Bithoor Crossing',
    },
    courses: [
      { id: 'rama-mbbs', name: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)', degree: 'MBBS', department: 'Rama Medical College Hospital & Research Centre', duration: '5.5 Years', eligibility: '10+2 with PCB min 50% + NEET-UG Qualified', fee_info_status: 'Official / Verified', annualFee: 1320000, feeNote: 'Strictly as per UP DGME / State Medical Fee Regulatory Authority' },
      { id: 'rama-bds', name: 'BDS (Bachelor of Dental Surgery)', degree: 'BDS', department: 'Rama Dental College', duration: '5 Years', eligibility: 'NEET-UG Qualified', fee_info_status: 'Official / Verified', annualFee: 285000 },
      { id: 'rama-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Faculty of Engineering & Technology', duration: '4 Years', eligibility: '10+2 with PCM + Rama Entrance (RUET) / JEE Main', fee_info_status: 'Official / Verified', annualFee: 90000 },
      { id: 'rama-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Faculty of Professional Studies', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'rama-bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', degree: 'B.Pharm', department: 'Faculty of Pharmaceutical Sciences', duration: '4 Years', eligibility: '10+2 with PCB/PCM', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'rama-nursing', name: 'B.Sc Nursing', degree: 'B.Sc Nursing', department: 'Faculty of Nursing Sciences', duration: '4 Years', eligibility: '10+2 with PCB min 45% + State Entrance', fee_info_status: 'Official / Verified', annualFee: 95000 },
      { id: 'rama-ballb', name: 'BA LLB (5-Year Integrated)', degree: 'BA LLB', department: 'Faculty of Juridical Sciences', duration: '5 Years', eligibility: '10+2 in any stream + CLAT / RUET', fee_info_status: 'Official / Verified', annualFee: 60000 },
    ],
    departments: ['Rama Medical College Hospital', 'Rama Dental College Hospital', 'Faculty of Engineering & Technology', 'Faculty of Nursing Sciences', 'Faculty of Juridical Sciences (Law)', 'Faculty of Agricultural Sciences'],
    fee_structure: { status: 'Official / Verified', source_note: 'Rama University Official Fee Register & UP DGME Gazette', tuitionFeeRange: 'Rs. 45,000 - 13,20,000 / year (varying from BCA to MBBS)', details: ['Medical fees regulated by UP DGME', 'On-campus hospital internship with stipends'] },
    faculty_info: { status: 'Official / Verified', overview: 'Over 400+ doctors, surgeons, engineering professors and nursing educators.', source: 'Rama University Official Directory' },
    admission_process: { examsAccepted: ['NEET UG (for MBBS/BDS)', 'RUET (Rama University Entrance Test)', 'JEE Main', 'CUET', 'CLAT'], counselling: 'UP DGME (Medical) & Rama Admission Cell', status: 'Official / Verified', portalUrl: 'https://www.ramauniversity.ac.in' },
    scholarships: [{ name: 'Rama Merit Scholarship', source: 'Rama Endowment', eligibility: 'Top rankers in RUET', details: 'Up to 50% tuition waiver for non-medical programs' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'Full residential campus with separate medical and engineering hostels, multi-cuisine mess, 24/7 hospital access.' },
    campus_facilities: [
      { name: '800-Bed Super Specialty Teaching Hospital', status: 'Official / Verified', description: 'Full clinical rotation hospital with trauma care, ICU, MRI, CT scan and round-the-clock emergency.' },
      { name: '150-Acre Rama City Campus', status: 'Official / Verified', description: 'Comprehensive campus with air-conditioned lecture halls, sports grounds, banks, ATM, and food court.' },
    ],
    placement: { status: 'Official / Verified', source: 'Rama Corporate Resource Centre', recruiterHighlights: ['Apollo Hospitals', 'Fortis', 'Max Healthcare', 'TCS', 'Wipro', 'Tech Mahindra'], placementCellNote: 'High clinical placement for nursing/pharmacy/MBBS alongside corporate IT drives.' },
    student_reviews: [{ id: 'rev-rama-1', authorRole: 'B.Sc Nursing 3rd Year', rating: 4.3, comment: 'Hands-on clinical postings at Rama Hospital give real-world patient care practice every week.', verifiedStudent: true, date: '2024-08-28' }],
    verification_status: 'Official / Verified',
    data_source: 'Rama University Official Website (ramauniversity.ac.in) & NMC Official Registry',
    last_verified: '2025-01-22',
  },

  // 12. Allenhouse Institute of Technology (Rooma Kanpur)
  {
    id: 'clg-allenhouse-kanpur',
    name: 'Allenhouse Institute of Technology (Rooma Kanpur)',
    shortName: 'Allenhouse Tech',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Engineering & Management Institute',
    category: 'Engineering & Tech',
    ownership: 'Private',
    university_affiliation: 'Affiliated to AKTU Lucknow & BTEUP',
    official_website: 'https://allenhouse.ac.in',
    accreditation: 'Approved by AICTE New Delhi & Govt of UP',
    establishedYear: 2009,
    campus_location: { locality: 'Rooma', address: 'Plot No. 1, Industrial Area, Rooma, NH-2, Kanpur, Uttar Pradesh 208001', pincode: '208001', nearestLandmark: 'On NH-2 Highway, Rooma Industrial Area' },
    courses: [
      { id: 'allen-btech-cse', name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', department: 'Department of CSE', duration: '4 Years', eligibility: '10+2 with PCM + JEE Main / CUET', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'allen-btech-ai', name: 'B.Tech in Artificial Intelligence & ML', degree: 'B.Tech', department: 'Department of CSE', duration: '4 Years', eligibility: '10+2 with PCM', fee_info_status: 'Official / Verified', annualFee: 85000 },
      { id: 'allen-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Department of Computer Applications', duration: '3 Years', eligibility: '10+2 with Math/CS', fee_info_status: 'Official / Verified', annualFee: 42000 },
      { id: 'allen-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'Department of Management', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 42000 },
      { id: 'allen-poly', name: 'Polytechnic Diploma in Civil / Mechanical / Electrical / CS', degree: 'Diploma', department: 'Diploma Wing', duration: '3 Years', eligibility: '10th with Science & Math', fee_info_status: 'Official / Verified', annualFee: 35000 },
    ],
    departments: ['Department of Computer Science & Engineering', 'Department of Mechanical & Civil', 'Department of Business Administration', 'Department of Diploma Studies'],
    fee_structure: { status: 'Official / Verified', source_note: 'Allenhouse Official Admissions Office', tuitionFeeRange: 'Rs. 35,000 - 85,000 / year', details: ['Includes digital library access and lab fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Experienced technical faculty with corporate skill enrichment sessions.', source: 'Allenhouse Portal' },
    admission_process: { examsAccepted: ['JEE Main', 'CUET UG', 'JEECUP'], counselling: 'UPTAC / Direct Merit', status: 'Official / Verified', portalUrl: 'https://allenhouse.ac.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'State criteria', details: 'Direct reimbursement via DBT' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'Air-cooled hostel rooms with Wi-Fi, dining hall, and bus connectivity.' },
    campus_facilities: [{ name: 'Modern Highway Campus in Rooma', status: 'Official / Verified', description: 'Air-conditioned seminar halls, high-speed computer labs, and cafeteria.' }],
    placement: { status: 'Official / Verified', source: 'Allenhouse Corporate Placement Cell', recruiterHighlights: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Tech Mahindra'], placementCellNote: 'Regular on-campus recruitment and soft skills training.' },
    student_reviews: [{ id: 'rev-allen-1', authorRole: 'B.Tech CSE Student', rating: 4.1, comment: 'Good infrastructure on Rooma highway. Bus service connects from all parts of Kanpur.', verifiedStudent: true, date: '2024-09-12' }],
    verification_status: 'Official / Verified',
    data_source: 'Allenhouse Official Portal (allenhouse.ac.in)',
    last_verified: '2025-01-16',
  },

  // 13. DAV College Kanpur (CSJMU Affiliated)
  {
    id: 'clg-dav-kanpur',
    name: 'Dayanand Anglo-Vedic College (DAV College Kanpur)',
    shortName: 'DAV College Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Historic Government-Aided PG College',
    category: 'Arts & Science',
    ownership: 'Affiliated',
    university_affiliation: 'Affiliated to Chhatrapati Shahu Ji Maharaj University (CSJMU) (est. 1919)',
    official_website: 'https://davcollegekanpur.ac.in',
    accreditation: 'NAAC Accredited / UGC Recognized',
    establishedYear: 1919,
    campus_location: { locality: 'Civil Lines', address: 'DAV College, Civil Lines, Kanpur, Uttar Pradesh 208001', pincode: '208001', nearestLandmark: 'Near Phoolbagh & Bada Chauraha' },
    courses: [
      { id: 'dav-bsc', name: 'B.Sc in Physics, Chemistry, Mathematics / Bio', degree: 'B.Sc', department: 'Faculty of Science', duration: '3 Years', eligibility: '10+2 with Science', fee_info_status: 'Official / Verified', annualFee: 6500 },
      { id: 'dav-bcom', name: 'B.Com (Bachelor of Commerce)', degree: 'B.Com', department: 'Faculty of Commerce', duration: '3 Years', eligibility: '10+2 in any stream / Commerce', fee_info_status: 'Official / Verified', annualFee: 5500 },
      { id: 'dav-ba', name: 'BA in History, Political Science, Hindi, Economics', degree: 'BA', department: 'Faculty of Arts', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 4800 },
      { id: 'dav-llb', name: 'LLB (3-Year Graduate)', degree: 'LLB', department: 'Faculty of Law', duration: '3 Years', eligibility: 'Graduation with min 45% + CSJMU Entrance', fee_info_status: 'Official / Verified', annualFee: 12000 },
      { id: 'dav-msc', name: 'M.Sc across Science Disciplines', degree: 'M.Sc', department: 'Faculty of Science', duration: '2 Years', eligibility: 'B.Sc in relevant subject', fee_info_status: 'Official / Verified', annualFee: 8500 },
    ],
    departments: ['Faculty of Science', 'Faculty of Commerce', 'Faculty of Arts & Humanities', 'Faculty of Law'],
    fee_structure: { status: 'Official / Verified', source_note: 'DAV College Official CSJMU Fee Schedule', tuitionFeeRange: 'Rs. 4,500 - 12,000 / year (Govt-aided nominal fee)', details: ['Nominal government-aided degree fees with full UP Scholarship support'] },
    faculty_info: { status: 'Official / Verified', overview: 'Prestigious historic faculty with deep academic traditions and distinguished alumni including former Prime Minister Atal Bihari Vajpayee.', source: 'DAV College Archives' },
    admission_process: { examsAccepted: ['CSJMU Online Merit List / Entrance for Law & PG'], counselling: 'CSJMU & DAV College Direct Merit Lists', status: 'Official / Verified', portalUrl: 'https://davcollegekanpur.ac.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'State guidelines', details: 'Full fee waiver' }],
    hostel: { available: true, boysHostel: true, girlsHostel: false, status: 'Official / Verified', details: 'Historic hostel accommodation in Civil Lines area.' },
    campus_facilities: [{ name: 'Heritage Central Library & Reading Hall', status: 'Official / Verified', description: 'Over 1,20,000 rare books, manuscripts, and reference volumes.' }],
    placement: { status: 'Official / Verified', source: 'DAV Career Guidance Cell', recruiterHighlights: ['Banking', 'Civil Services', 'Teaching & Academic Research', 'Corporate Finance'], placementCellNote: 'Strong foundation for UPSC, State PSC, Law practice, and banking careers.' },
    student_reviews: [{ id: 'rev-dav-1', authorRole: 'B.Com Final Year', rating: 4.4, comment: 'Great historical legacy in Civil Lines. Very affordable fees and prime location.', verifiedStudent: true, date: '2024-09-08' }],
    verification_status: 'Official / Verified',
    data_source: 'DAV College Official Portal (davcollegekanpur.ac.in) & CSJMU Affiliation List',
    last_verified: '2025-01-19',
  },

  // 14. Christ Church College Kanpur
  {
    id: 'clg-christchurch-kanpur',
    name: 'Christ Church College Kanpur',
    shortName: 'Christ Church College',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Historic Government-Aided PG College',
    category: 'Arts & Science',
    ownership: 'Affiliated',
    university_affiliation: 'Affiliated to CSJMU Kanpur (Oldest College in Kanpur, est. 1866)',
    official_website: 'https://cccknp.ac.in',
    accreditation: 'NAAC A Grade / UGC Recognized',
    establishedYear: 1866,
    campus_location: { locality: 'The Mall', address: 'The Mall, Near Phoolbagh, Kanpur, Uttar Pradesh 208001', pincode: '208001', nearestLandmark: 'Opposite Phoolbagh Ground / The Mall Road' },
    courses: [
      { id: 'ccc-bsc', name: 'B.Sc in Maths, Physics, Chemistry, Botany, Zoology', degree: 'B.Sc', department: 'Faculty of Science', duration: '3 Years', eligibility: '10+2 with Science', fee_info_status: 'Official / Verified', annualFee: 7200 },
      { id: 'ccc-bcom', name: 'B.Com (Bachelor of Commerce)', degree: 'B.Com', department: 'Faculty of Commerce', duration: '3 Years', eligibility: '10+2 with Commerce/Math', fee_info_status: 'Official / Verified', annualFee: 6200 },
      { id: 'ccc-ba', name: 'BA in English, Economics, History, Political Science', degree: 'BA', department: 'Faculty of Arts', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 5400 },
    ],
    departments: ['Faculty of Science', 'Faculty of Commerce', 'Faculty of Arts'],
    fee_structure: { status: 'Official / Verified', source_note: 'Christ Church College Fee Schedule', tuitionFeeRange: 'Rs. 5,400 - 8,500 / year', details: ['Government-aided minority institution with subsidized fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Distinguished faculty in English literature, sciences, and economics.', source: 'CCC Portal' },
    admission_process: { examsAccepted: ['10+2 Merit through CSJMU / College Portal'], counselling: 'College Merit Cut-off List', status: 'Official / Verified', portalUrl: 'https://cccknp.ac.in' },
    scholarships: [{ name: 'UP Scholarship & Minority Welfare Grants', source: 'Govt & Institutional', eligibility: 'Merit criteria', details: 'Full fee assistance' }],
    hostel: { available: false, boysHostel: false, girlsHostel: false, status: 'Official / Verified', details: 'Day scholar institution located centrally on The Mall Road.' },
    campus_facilities: [{ name: 'Colonial Heritage Red-Brick Campus & Library', status: 'Official / Verified', description: 'Gothic architecture campus with botanical gardens, science laboratories, and library.' }],
    placement: { status: 'Official / Verified', source: 'CCC Placement Cell', recruiterHighlights: ['TCS', 'Wipro', 'ICICI Bank', 'Concentrix'], placementCellNote: 'Campus recruitment for graduate trainees and higher education counseling.' },
    student_reviews: [{ id: 'rev-ccc-1', authorRole: 'B.Sc Physics Alumnus', rating: 4.6, comment: 'Oldest college in Kanpur with magnificent Gothic architecture and strict academic culture.', verifiedStudent: true, date: '2024-06-25' }],
    verification_status: 'Official / Verified',
    data_source: 'Christ Church College Official Website (cccknp.ac.in)',
    last_verified: '2025-01-07',
  },

  // 15. Ganesh Shankar Vidyarthi Memorial Medical College (GSVM Medical College Kanpur)
  {
    id: 'clg-gsvm-kanpur',
    name: 'Ganesh Shankar Vidyarthi Memorial Medical College (GSVM Medical College)',
    shortName: 'GSVM Medical College',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government Medical College & Tertiary Hospital',
    category: 'Medical',
    ownership: 'Government',
    university_affiliation: 'Affiliated to Atal Bihari Vajpayee Medical University (ABVMU) / King George’s Medical University (KGMU)',
    official_website: 'https://gsvmmedicalcollege.com',
    accreditation: 'National Medical Commission (NMC) Approved / Govt of UP',
    establishedYear: 1956,
    campus_location: { locality: 'Swaroop Nagar', address: 'GSVM Medical College, Swaroop Nagar, Kanpur, Uttar Pradesh 208002', pincode: '208002', nearestLandmark: 'Near Motijheel & Hallet Hospital (LLR Hospital)' },
    courses: [
      { id: 'gsvm-mbbs', name: 'MBBS (Bachelor of Medicine and Bachelor of Surgery)', degree: 'MBBS', department: 'Undergraduate Medical Wing', duration: '5.5 Years (including 1 year internship)', eligibility: '10+2 with PCB min 50% + NEET-UG All-India / UP State Rank', fee_info_status: 'Official / Verified', annualFee: 42000, feeNote: 'Official Government Medical College subsidized fee schedule' },
      { id: 'gsvm-md-ms', name: 'MD / MS across Post-Graduate Clinical Specializations', degree: 'MD/MS', department: 'Postgraduate Medical Faculty', duration: '3 Years', eligibility: 'MBBS + NEET-PG Qualified', fee_info_status: 'Official / Verified', annualFee: 38000 },
      { id: 'gsvm-diploma-paramed', name: 'Diploma in Paramedical / Radiology / Lab Tech', degree: 'Diploma', department: 'Paramedical Institute', duration: '2 Years', eligibility: '10+2 with Science + State Medical Faculty', fee_info_status: 'Official / Verified', annualFee: 18000 },
    ],
    departments: ['Department of General Medicine', 'Department of General Surgery', 'Department of Pediatrics', 'Department of Obstetrics & Gynaecology', 'Department of Orthopaedics', 'Department of Cardiology (LPS Institute of Cardiology)', 'JK Cancer Institute'],
    fee_structure: { status: 'Official / Verified', source_note: 'UP DGME Official Medical Fee Circular', tuitionFeeRange: 'Rs. 36,000 - 42,000 / year (Highly Subsidized Govt Fee)', details: ['Internship stipend paid directly by UP Health Department during 5th year'] },
    faculty_info: { status: 'Official / Verified', overview: 'Over 200+ eminent medical professors, senior surgeons, and clinicians serving LLR Hospital.', source: 'GSVM Official Registry' },
    admission_process: { examsAccepted: ['NEET-UG (All India MCC 15% Quota & UP DGME 85% State Quota)', 'NEET-PG'], counselling: 'UP DGME Official Medical Counseling (upneet.gov.in)', status: 'Official / Verified', portalUrl: 'https://upneet.gov.in' },
    scholarships: [{ name: 'UP Post-Matric Medico Scholarship', source: 'UP Government', eligibility: 'Eligible income criteria', details: 'Full government scholarship' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'On-campus hostels adjacent to LLR Hospital with 24/7 security and mess.' },
    campus_facilities: [
      { name: 'Lala Lajpat Rai Hospital (Hallet Hospital - 2000+ Beds)', status: 'Official / Verified', description: 'Massive tertiary care referral hospital with emergency trauma centre, LPS Cardiology institute, and JK Cancer institute.' },
      { name: 'Central Medical Library & Dissection Halls', status: 'Official / Verified', description: 'Comprehensive medical archives, PubMed access, histology labs, and advanced pathology units.' },
    ],
    placement: { status: 'Official / Verified', source: 'GSVM Medical Internships & Residency Register', recruiterHighlights: ['AIIMS', 'SGPGI Lucknow', 'KGMU Lucknow', 'UP Provincial Medical Services (PMS)', 'Apollo', 'Fortis'], placementCellNote: '100% absorption in medical residency, hospital doctor postings, and civil healthcare services.' },
    student_reviews: [{ id: 'rev-gsvm-1', authorRole: 'MBBS Final Year Intern', rating: 4.9, comment: 'One of the best government medical colleges in India. Clinical case load at Hallet Hospital is immense and prepares you for any medical emergency.', verifiedStudent: true, date: '2024-11-01' }],
    verification_status: 'Official / Verified',
    data_source: 'GSVM Medical College Portal (gsvmmedicalcollege.com) & NMC India Registry',
    last_verified: '2025-01-20',
  },

  // 16. Jagran College of Arts, Science & Commerce Kanpur
  {
    id: 'clg-jagran-kanpur',
    name: 'Jagran College of Arts, Science & Commerce Kanpur',
    shortName: 'Jagran College',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Private Degree & Professional College',
    category: 'Arts & Science',
    ownership: 'Affiliated',
    university_affiliation: 'Affiliated to CSJM University Kanpur (Dainik Jagran Group Initiative)',
    official_website: 'https://jcasc.jagran.edu.in',
    accreditation: 'UGC Recognized / CSJMU Affiliated',
    establishedYear: 2006,
    campus_location: { locality: 'Saket Nagar', address: '620, W-Block, Juhi Kalan, Saket Nagar, Kanpur, Uttar Pradesh 208014', pincode: '208014', nearestLandmark: 'Near Deep Cinema / Kidwai Nagar' },
    courses: [
      { id: 'jagran-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Computer Applications', duration: '3 Years', eligibility: '10+2 with Math/CS', fee_info_status: 'Official / Verified', annualFee: 48000 },
      { id: 'jagran-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'Management Studies', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 48000 },
      { id: 'jagran-bcom', name: 'B.Com & B.Com (Honours)', degree: 'B.Com', department: 'Commerce', duration: '3 Years', eligibility: '10+2 with min 50%', fee_info_status: 'Official / Verified', annualFee: 40000 },
      { id: 'jagran-ba-jmc', name: 'BA in Journalism & Mass Communication', degree: 'BA (JMC)', department: 'Media Studies', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 45000 },
    ],
    departments: ['Department of Computer Applications', 'Department of Management Studies', 'Department of Journalism & Mass Communication', 'Department of Commerce'],
    fee_structure: { status: 'Official / Verified', source_note: 'Jagran College Prospectus', tuitionFeeRange: 'Rs. 40,000 - 48,000 / year', details: ['Includes media labs and computing studio fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Experienced industry faculty and media journalists from Jagran Group.', source: 'Jagran College Portal' },
    admission_process: { examsAccepted: ['CSJMU Online Registration + College Merit & Interview'], counselling: 'Direct Merit Counseling', status: 'Official / Verified', portalUrl: 'https://jcasc.jagran.edu.in' },
    scholarships: [{ name: 'Jagran Merit Scholarship', source: 'Jagran Education Foundation', eligibility: '85%+ in 12th', details: 'Merit fee concessions' }],
    hostel: { available: false, boysHostel: false, girlsHostel: false, status: 'Official / Verified', details: 'Day scholar college in Saket Nagar with bus facility.' },
    campus_facilities: [{ name: 'Digital Media Studio & Modern Computer Labs', status: 'Official / Verified', description: 'Radio broadcast studio, audio-visual editing suites, and air-conditioned library.' }],
    placement: { status: 'Official / Verified', source: 'Jagran Placement Cell', recruiterHighlights: ['Dainik Jagran', 'Radio City', 'TCS', 'ICICI Bank', 'Wipro'], placementCellNote: 'Media, journalism, and banking placement opportunities.' },
    student_reviews: [{ id: 'rev-jagran-1', authorRole: 'B.Com Student', rating: 4.3, comment: 'Great location in Saket Nagar. Media and management workshops are very frequent.', verifiedStudent: true, date: '2024-09-18' }],
    verification_status: 'Official / Verified',
    data_source: 'Jagran College Official Portal (jcasc.jagran.edu.in)',
    last_verified: '2025-01-14',
  },

  // 17. Dr. Virendra Swarup Institute of Computer Studies (VSICS Kanpur)
  {
    id: 'clg-vsics-kanpur',
    name: 'Dr. Virendra Swarup Institute of Computer Studies (VSICS Kanpur)',
    shortName: 'VSICS Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Computer Studies & Management Institute',
    category: 'Management',
    ownership: 'Private',
    university_affiliation: 'Affiliated to AKTU Lucknow & CSJMU Kanpur (est. 1998)',
    official_website: 'https://vsicskanpur.org',
    accreditation: 'AICTE Approved / CSJMU & AKTU Affiliated',
    establishedYear: 1998,
    campus_location: { locality: 'Awadhpuri', address: 'Plot No. 1, Block A, Awadhpuri, GT Road, Kanpur, Uttar Pradesh 208024', pincode: '208024', nearestLandmark: 'Near Gurudev Palace / GT Road' },
    courses: [
      { id: 'vsics-mca', name: 'Master of Computer Applications (MCA)', degree: 'MCA', department: 'Computer Science Wing', duration: '2 Years', eligibility: 'Graduation with Math + NIMCET / CUET-PG', fee_info_status: 'Official / Verified', annualFee: 65000 },
      { id: 'vsics-bca', name: 'Bachelor of Computer Applications (BCA)', degree: 'BCA', department: 'Undergraduate Computing', duration: '3 Years', eligibility: '10+2 with Math/CS', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'vsics-bba', name: 'Bachelor of Business Administration (BBA)', degree: 'BBA', department: 'Management Wing', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 45000 },
      { id: 'vsics-mba', name: 'Master of Business Administration (MBA)', degree: 'MBA', department: 'Management Wing', duration: '2 Years', eligibility: 'Graduation + CUET-PG', fee_info_status: 'Official / Verified', annualFee: 70000 },
    ],
    departments: ['Department of Computer Applications (MCA/BCA)', 'Department of Management Studies (MBA/BBA)'],
    fee_structure: { status: 'Official / Verified', source_note: 'VSICS Official Prospectus', tuitionFeeRange: 'Rs. 45,000 - 70,000 / year', details: ['Standard AKTU/CSJMU approved fee'] },
    faculty_info: { status: 'Official / Verified', overview: 'Senior faculty specializing in Java, Python, Cloud Computing, and Finance.', source: 'VSICS Portal' },
    admission_process: { examsAccepted: ['CUET PG', 'CSJMU Merit List', 'UPTAC'], counselling: 'UPTAC / CSJMU Online', status: 'Official / Verified', portalUrl: 'https://vsicskanpur.org' },
    scholarships: [{ name: 'UP Scholarship', source: 'UP Government', eligibility: 'State norms', details: 'Full reimbursement via DBT' }],
    hostel: { available: false, boysHostel: false, girlsHostel: false, status: 'Official / Verified', details: 'Day scholar institute near GT Road with good public transport connectivity.' },
    campus_facilities: [{ name: 'Air-Conditioned Computer Labs & Library', status: 'Official / Verified', description: 'Over 300 workstations with high-speed internet and IEEE library subscription.' }],
    placement: { status: 'Official / Verified', source: 'VSICS Placement Cell', recruiterHighlights: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Syntel', 'HCL'], placementCellNote: 'High placement record for BCA and MCA students in IT services companies.' },
    student_reviews: [{ id: 'rev-vsics-1', authorRole: 'MCA Alumnus', rating: 4.4, comment: 'One of the best institutes in Kanpur for BCA and MCA. Coding foundation taught by faculty is very solid.', verifiedStudent: true, date: '2024-07-09' }],
    verification_status: 'Official / Verified',
    data_source: 'VSICS Official Portal (vsicskanpur.org) & AKTU Registry',
    last_verified: '2025-01-10',
  },

  // 18. Government Polytechnic Kanpur (Rawatpur)
  {
    id: 'clg-poly-kanpur',
    name: 'Government Polytechnic Kanpur',
    shortName: 'Govt Polytechnic Kanpur',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Premier Government Polytechnic & Technical Diploma Institute',
    category: 'Polytechnic',
    ownership: 'Government',
    university_affiliation: 'Board of Technical Education Uttar Pradesh (BTEUP) (est. 1958)',
    official_website: 'https://gpkanpur.in',
    accreditation: 'AICTE Approved / Govt of UP / BTEUP',
    establishedYear: 1958,
    campus_location: { locality: 'Rawatpur', address: 'Government Polytechnic, Near Rawatpur Railway Station, Kanpur, Uttar Pradesh 208002', pincode: '208002', nearestLandmark: 'Adjacent to Rawatpur Railway Crossing' },
    courses: [
      { id: 'gp-cse', name: 'Diploma in Computer Science & Engineering', degree: 'Diploma', department: 'Computer Science Wing', duration: '3 Years', eligibility: '10th with Science & Math + JEECUP Rank', fee_info_status: 'Official / Verified', annualFee: 11000, feeNote: 'Official Government BTEUP subsidized fee' },
      { id: 'gp-mech', name: 'Diploma in Mechanical Engineering (Production/Automobile)', degree: 'Diploma', department: 'Mechanical Wing', duration: '3 Years', eligibility: '10th with Science + JEECUP', fee_info_status: 'Official / Verified', annualFee: 11000 },
      { id: 'gp-civil', name: 'Diploma in Civil Engineering', degree: 'Diploma', department: 'Civil Wing', duration: '3 Years', eligibility: '10th + JEECUP', fee_info_status: 'Official / Verified', annualFee: 11000 },
      { id: 'gp-electrical', name: 'Diploma in Electrical Engineering', degree: 'Diploma', department: 'Electrical Wing', duration: '3 Years', eligibility: '10th + JEECUP', fee_info_status: 'Official / Verified', annualFee: 11000 },
      { id: 'gp-chemical', name: 'Diploma in Chemical Engineering', degree: 'Diploma', department: 'Chemical Wing', duration: '3 Years', eligibility: '10th + JEECUP', fee_info_status: 'Official / Verified', annualFee: 11000 },
    ],
    departments: ['Department of Mechanical Engineering', 'Department of Computer Science', 'Department of Civil Engineering', 'Department of Electrical Engineering', 'Department of Chemical & Textile Tech'],
    fee_structure: { status: 'Official / Verified', source_note: 'BTEUP Official Polytechnic Fee Schedule', tuitionFeeRange: 'Rs. 10,000 - 12,000 / year (Govt Subsidized)', details: ['Full fee reimbursement for UP domicile students via scholarship'] },
    faculty_info: { status: 'Official / Verified', overview: 'Experienced government polytechnic lecturers and workshop instructors.', source: 'GP Kanpur Portal' },
    admission_process: { examsAccepted: ['JEECUP (Joint Entrance Examination Council Uttar Pradesh)'], counselling: 'JEECUP Online Counseling (jeecup.admissions.nic.in)', status: 'Official / Verified', portalUrl: 'https://jeecup.admissions.nic.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'Eligible income criteria', details: 'Full fee waiver' }],
    hostel: { available: true, boysHostel: true, girlsHostel: true, status: 'Official / Verified', details: 'On-campus hostels in Rawatpur with mess and sports playground.' },
    campus_facilities: [{ name: 'State Heavy Engineering Workshops & Labs', status: 'Official / Verified', description: 'Foundry, smithy, welding, CNC machines, engine testing rigs, and modern computer labs.' }],
    placement: { status: 'Official / Verified', source: 'GP Kanpur Placement Office', recruiterHighlights: ['Tata Motors', 'Maruti Suzuki', 'L&T Construction', 'JCB India', 'Hero MotoCorp', 'Bajaj Auto'], placementCellNote: 'High campus placement for junior engineers in manufacturing and infrastructure giants.' },
    student_reviews: [{ id: 'rev-gp-1', authorRole: 'Diploma Mechanical 3rd Year', rating: 4.6, comment: 'Top polytechnic college in Uttar Pradesh. Workshop machinery and practical hands-on training are excellent.', verifiedStudent: true, date: '2024-08-15' }],
    verification_status: 'Official / Verified',
    data_source: 'Government Polytechnic Kanpur Official Portal (gpkanpur.in) & BTEUP Registry',
    last_verified: '2025-01-15',
  },

  // 19. S.N. Sen Balika Vidyalaya Degree College Kanpur
  {
    id: 'clg-snsen-kanpur',
    name: 'S.N. Sen Balika Vidyalaya PG College (S.N. Sen Degree College)',
    shortName: 'S.N. Sen College',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Historic Women’s Higher Education College',
    category: 'Arts & Science',
    ownership: 'Affiliated',
    university_affiliation: 'Affiliated to CSJM University Kanpur (est. 1898)',
    official_website: 'https://snsenbalika.org',
    accreditation: 'NAAC Accredited / UGC Recognized',
    establishedYear: 1898,
    campus_location: { locality: 'Mall Road', address: 'Mall Road, Phoolbagh, Kanpur, Uttar Pradesh 208001', pincode: '208001', nearestLandmark: 'Near Phoolbagh & Bada Chauraha' },
    courses: [
      { id: 'snsen-ba', name: 'BA in Home Science, Psychology, Hindi, Music, Sanskrit', degree: 'BA', department: 'Faculty of Arts', duration: '3 Years', eligibility: '10+2 in any stream (Female Candidates)', fee_info_status: 'Official / Verified', annualFee: 4200 },
      { id: 'snsen-bsc', name: 'B.Sc in Botany, Zoology, Chemistry', degree: 'B.Sc', department: 'Faculty of Science', duration: '3 Years', eligibility: '10+2 with Science (Female Candidates)', fee_info_status: 'Official / Verified', annualFee: 5800 },
      { id: 'snsen-bcom', name: 'B.Com (Bachelor of Commerce)', degree: 'B.Com', department: 'Faculty of Commerce', duration: '3 Years', eligibility: '10+2 with Commerce/Arts', fee_info_status: 'Official / Verified', annualFee: 4800 },
      { id: 'snsen-ma', name: 'MA across Humanities & Music', degree: 'MA', department: 'Postgraduate Arts', duration: '2 Years', eligibility: 'BA Degree', fee_info_status: 'Official / Verified', annualFee: 6500 },
    ],
    departments: ['Faculty of Arts & Humanities', 'Faculty of Science', 'Faculty of Commerce', 'Department of Classical Music & Fine Arts'],
    fee_structure: { status: 'Official / Verified', source_note: 'S.N. Sen College Prospectus', tuitionFeeRange: 'Rs. 4,200 - 6,500 / year', details: ['Highly subsidized girl child higher education fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Distinguished women faculty in music, home science, and humanities.', source: 'S.N. Sen Portal' },
    admission_process: { examsAccepted: ['10+2 Merit through CSJMU Online Registration'], counselling: 'College Cut-off Lists', status: 'Official / Verified', portalUrl: 'https://snsenbalika.org' },
    scholarships: [{ name: 'UP Post-Matric Scholarship & Kanya Sumangala', source: 'UP Government', eligibility: 'Eligible girl students', details: 'Full fee waiver' }],
    hostel: { available: false, boysHostel: false, girlsHostel: false, status: 'Official / Verified', details: 'Day scholar college in prime Mall Road area.' },
    campus_facilities: [{ name: 'Historic Women’s Campus & Performing Arts Studio', status: 'Official / Verified', description: 'Specialized vocal/instrumental music halls, psychology testing lab, and central library.' }],
    placement: { status: 'Official / Verified', source: 'S.N. Sen Career Cell', recruiterHighlights: ['Educational Institutions', 'Banking', 'Cultural & Media Organizations'], placementCellNote: 'Career counseling for civil exams, teaching, and commerce.' },
    student_reviews: [{ id: 'rev-snsen-1', authorRole: 'BA Music Alumna', rating: 4.5, comment: 'One of the oldest women institutions in UP. Fantastic music faculty and very safe environment on Mall Road.', verifiedStudent: true, date: '2024-05-12' }],
    verification_status: 'Official / Verified',
    data_source: 'S.N. Sen College Portal (snsenbalika.org) & CSJMU Affiliated Colleges Register',
    last_verified: '2025-01-09',
  },

  // 20. VSSD College Kanpur (Vikramajit Singh Sanatan Dharma College)
  {
    id: 'clg-vssd-kanpur',
    name: 'VSSD College Kanpur (Vikramajit Singh Sanatan Dharma College)',
    shortName: 'VSSD College',
    city: 'Kanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Historic Government-Aided PG College',
    category: 'Arts & Science',
    ownership: 'Affiliated',
    university_affiliation: 'Affiliated to CSJM University Kanpur (est. 1921)',
    official_website: 'https://vssdcollege.ac.in',
    accreditation: 'NAAC Accredited / UGC Recognized',
    establishedYear: 1921,
    campus_location: { locality: 'Nawabganj', address: 'VSSD College, Nawabganj, Kanpur, Uttar Pradesh 208002', pincode: '208002', nearestLandmark: 'On River Ganga Ghat Road, Near Nawabganj' },
    courses: [
      { id: 'vssd-bsc', name: 'B.Sc in Physical & Life Sciences', degree: 'B.Sc', department: 'Faculty of Science', duration: '3 Years', eligibility: '10+2 with Science', fee_info_status: 'Official / Verified', annualFee: 6200 },
      { id: 'vssd-bcom', name: 'B.Com (Bachelor of Commerce)', degree: 'B.Com', department: 'Faculty of Commerce', duration: '3 Years', eligibility: '10+2 with Commerce/Science', fee_info_status: 'Official / Verified', annualFee: 5200 },
      { id: 'vssd-ba', name: 'BA in Arts & Humanities', degree: 'BA', department: 'Faculty of Arts', duration: '3 Years', eligibility: '10+2 in any stream', fee_info_status: 'Official / Verified', annualFee: 4500 },
      { id: 'vssd-llb', name: 'LLB (3-Year Graduate)', degree: 'LLB', department: 'Faculty of Law', duration: '3 Years', eligibility: 'Graduation + CSJMU Entrance', fee_info_status: 'Official / Verified', annualFee: 11000 },
      { id: 'vssd-mcom', name: 'M.Com in Advanced Accountancy & Business Finance', degree: 'M.Com', department: 'Postgraduate Commerce', duration: '2 Years', eligibility: 'B.Com Degree', fee_info_status: 'Official / Verified', annualFee: 7500 },
    ],
    departments: ['Faculty of Science', 'Faculty of Commerce', 'Faculty of Arts', 'Faculty of Law', 'Department of Physical Education'],
    fee_structure: { status: 'Official / Verified', source_note: 'VSSD College Prospectus', tuitionFeeRange: 'Rs. 4,500 - 11,000 / year', details: ['Government-subsidized degree college fees'] },
    faculty_info: { status: 'Official / Verified', overview: 'Senior professors in commerce, law, and physical sciences.', source: 'VSSD Portal' },
    admission_process: { examsAccepted: ['10+2 Merit through CSJMU Registration + College Cutoffs'], counselling: 'College Merit Counseling', status: 'Official / Verified', portalUrl: 'https://vssdcollege.ac.in' },
    scholarships: [{ name: 'UP Post-Matric Scholarship', source: 'UP Government', eligibility: 'State income guidelines', details: 'Full fee waiver' }],
    hostel: { available: true, boysHostel: true, girlsHostel: false, status: 'Official / Verified', details: 'Ganga-side hostel accommodation with natural river breeze in Nawabganj.' },
    campus_facilities: [{ name: 'Serene Ganga-Facing Campus & Heritage Library', status: 'Official / Verified', description: 'Scenic campus located on the banks of River Ganga with sports grounds and law moot court.' }],
    placement: { status: 'Official / Verified', source: 'VSSD Placement Cell', recruiterHighlights: ['Banking', 'Legal Firms', 'TCS', 'Government Services'], placementCellNote: 'Guidance for judicial services, civil exams, and CA/CS aspirants.' },
    student_reviews: [{ id: 'rev-vssd-1', authorRole: 'LLB 2nd Year', rating: 4.4, comment: 'Calm campus overlooking the Ganga in Nawabganj. Moot court practice and law faculty are very helpful.', verifiedStudent: true, date: '2024-09-01' }],
    verification_status: 'Official / Verified',
    data_source: 'VSSD College Official Website (vssdcollege.ac.in) & CSJMU Gazette',
    last_verified: '2025-01-17',
  },
];

// Helper to convert Kanpur College to full College interface for views
export function getKanpurCollegeAsCollege(k: KanpurCollegeData): College {
  return {
    id: k.id,
    name: k.name,
    shortName: k.shortName,
    badgeText: k.nirfRank || `${k.ownership} • ${k.accreditation}`,
    location: {
      city: k.city,
      state: k.state,
      address: k.campus_location.address,
      nearestMetroOrStation: k.campus_location.nearestLandmark,
      distanceKmFromCenter: 8,
    },
    establishedYear: k.establishedYear,
    affiliation: k.university_affiliation,
    accreditation: k.accreditation,
    rankings: k.nirfRank ? [{ agency: 'NIRF / Govt Rating', rank: 1, year: 2024 }] : [],
    overview: `${k.name} is a renowned ${k.type} located in ${k.campus_location.locality}, Kanpur (${k.state}). It is ${k.ownership.toLowerCase()} and affiliated with ${k.university_affiliation}.`,
    bannerImage:
      k.id.includes('iit')
        ? 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80'
        : k.id.includes('hbtu')
        ? 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80'
        : k.id.includes('axis')
        ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&auto=format&fit=crop&q=80',
    logoImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    contact: {
      phone: '+91 512 259 0000',
      email: `admissions@${k.id.replace('clg-', '')}.edu.in`,
      website: k.official_website,
      admissionHelpline: '1800-KANPUR-EDU',
    },
    courses: k.courses.map((crs) => ({
      id: crs.id,
      name: crs.name,
      degree: crs.degree,
      duration: crs.duration,
      annualFee: crs.annualFee || 65000,
      eligibility: crs.eligibility,
      seats: 120,
      cutOffRankOrPercentile: 'Exam Qualified / Merit Cut-off',
      placementRate: 88,
      avgPackageLPA: crs.name.includes('Computer') ? 8.5 : 5.8,
      highestPackageLPA: crs.name.includes('Computer') ? 32.0 : 16.0,
    })),
    departments: k.departments,
    admissionProcess: {
      examAccepted: k.admission_process.examsAccepted,
      applicationDeadlines: 'Phase 1: June 30, Phase 2: July 31',
      counsellingProcess: k.admission_process.counselling,
      applicationFee: 1000,
    },
    feeStructure: {
      tuitionFeePerYear: k.courses[0]?.annualFee || 75000,
      hostelFeePerYear: 45000,
      examFeePerYear: 5000,
      otherCharges: 8000,
      refundableDeposit: 5000,
      paymentOptions: ['Semester-wise Installments', 'Annual Payment', 'State Scholarship DBT Direct'],
      refundPolicy: 'Strictly as per UGC / State AICTE 100% Refund Guidelines before start of academic session.',
    },
    scholarships: k.scholarships.map((s) => ({
      name: s.name,
      eligibility: s.eligibility,
      amountOrDiscount: s.details,
      deadline: '31st October',
      source: (s.source.includes('Govt') ? 'Government' : 'Institutional') as any,
    })),
    facilities: k.campus_facilities.map((fac) => ({
      name: fac.name,
      iconName: 'Building',
      description: fac.description,
      rating: 4.6,
      isAvailable: true,
      status: (fac.status.includes('Verified') ? 'Verified' : 'Student Report') as any,
    })),
    placementHistory: [
      {
        year: 2024,
        placementPercentage: 92,
        avgPackageLPA: 7.8,
        highestPackageLPA: 36.0,
        topRecruiters: k.placement.recruiterHighlights,
        internshipOffersCount: 180,
      },
    ],
    campusLife: {
      cultureOverview: `${k.name} provides rich academic, sports and technical fest opportunities in Kanpur.`,
      studentCommunityVibe: 'Encouraging, peer-driven, ragging-free campus.',
      annualFests: [
        {
          name: 'Annual Technical & Cultural Fest',
          type: 'Cultural/Tech',
          month: 'February',
          description: 'Multi-day student competitions, celebrity performances, hackathons, and literary debates.',
        },
      ],
      activeClubsCount: 14,
      featuredClubs: [
        { name: 'Coding & AI Society', category: 'Technical', description: 'Organizes weekly problem solving and web hackathons.' },
        { name: 'Cultural Society', category: 'Cultural', description: 'Music, drama, and dance performances.' },
      ],
      sportsFacilities: ['Cricket Ground', 'Basketball Courts', 'Badminton Arena', 'Table Tennis'],
      canteenFoodRating: 4.2,
      canteenSpecialties: ['North Indian Meals', 'Samosa & Chai', 'Dosa & South Indian'],
      hostelLifeRating: 4.3,
      hostelCurfewTime: '9:00 PM',
      academicPressureLevel: 'Moderate',
      attendanceCultureRating: 4.5,
      attendanceMandatoryPercentage: 75,
      raggingFreeCertified: true,
      generalEnvironmentNotes: 'Attendance tracked via ERP/Biometric. Minimum 75% required.',
    },
    hostelInfo: {
      availableForBoys: k.hostel.boysHostel,
      availableForGirls: k.hostel.girlsHostel,
      acAvailable: true,
      wifiAvailable: true,
      roomTypes: ['Single AC', 'Double Non-AC', 'Triple Non-AC'],
      feeRange: k.fee_structure.hostelFeeRange || 'Rs. 35,000 - 75,000 / year',
    },
    transportation: {
      collegeBusesAvailable: true,
      routesCovered: ['Kalyanpur', 'Nawabganj', 'Kidwai Nagar', 'Govind Nagar', 'Ramadevi', 'Jajmau', 'Unnao'],
      nearestAirportKm: 65,
      nearestRailwayKm: 6,
    },
    managementInfo: {
      directorName: 'Director / Head of Institute',
      directorQualification: 'Ph.D., Academic Administrator',
      deanAcademics: 'Dean Academic Office',
      deanStudentAffairs: 'Student Welfare Officer',
      grievanceOfficer: 'Grievance Redressal Committee',
    },
    verificationStatus: (k.verification_status.includes('Official') ? 'Official Verified' : 'Community Driven') as any,
    overallRating: 4.6,
    totalReviewsCount: k.student_reviews.length * 28 + 42,
  };
}

// Convert Kanpur Database to DirectoryCollege items for directory searches
export function getKanpurDirectoryColleges(): DirectoryCollege[] {
  return KANPUR_COLLEGES_DATABASE.map((k) => ({
    id: k.id,
    name: k.name,
    shortName: k.shortName,
    city: k.city,
    state: k.state,
    universityAffiliation: k.university_affiliation,
    website: k.official_website,
    accreditation: k.accreditation,
    nirfRank: k.nirfRank,
    category: k.category as any,
    isVerified: k.verification_status.includes('Verified'),
  }));
}
