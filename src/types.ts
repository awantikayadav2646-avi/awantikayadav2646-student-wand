export type UserRole = 'current_student' | 'prospective_student' | 'college_admin';

export type SupportedLanguage =
  | 'en' // English
  | 'hi' // हिन्दी (Hindi)
  | 'bn' // বাংলা (Bengali)
  | 'mr' // मराठी (Marathi)
  | 'te' // తెలుగు (Telugu)
  | 'ta' // தமிழ் (Tamil)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'ml' // മലയാളം (Malayalam)
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'ur'; // اردو (Urdu)

export interface OnboardingData {
  language: SupportedLanguage;
  country: string;
  state: string;
  city?: string;
  studentStatus: 'current_student' | 'prospective_student';
  collegeId?: string;
  collegeName?: string;
  isCustomCollege?: boolean;
  customCollegeUniversity?: string;
  customCollegeWebsite?: string;
  verificationStatus?: 'Verified' | 'Pending Verification';
  interestedColleges?: string[];
  course?: string;
  branch?: string;
  year?: string;
  semester?: string | number;
  onboardingCompleted: boolean;
}

export interface IndianStateInfo {
  name: string;
  type: 'State' | 'Union Territory';
  code: string;
  capital?: string;
}

export interface DirectoryCollege {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  universityAffiliation: string;
  website?: string;
  accreditation?: string;
  nirfRank?: string;
  category: 'Engineering & Tech' | 'Comprehensive University' | 'Medical' | 'Management' | 'Arts & Science' | 'Law' | 'Pharmacy & Health' | 'Agriculture' | 'Polytechnic';
  logo?: string;
  isVerified: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;
  country?: string;
  state?: string;
  city?: string;
  collegeId: string;
  collegeName: string;
  isCustomCollege?: boolean;
  customCollegeUniversity?: string;
  customCollegeWebsite?: string;
  verificationStatus?: 'Verified' | 'Pending Verification';
  interestedColleges?: string[];
  course: string;
  department: string;
  branch?: string;
  semester: number;
  year: number;
  rollNumber: string;
  interests: string[];
  careerGoals: string[];
  targetBudget?: number;
  preferredCity?: string;
  language?: SupportedLanguage;
  onboardingCompleted?: boolean;
}

export interface VerificationBadge {
  type: 'official' | 'student_report' | 'ai_summary' | 'verified' | 'unverified';
  label: string;
  description: string;
}

export interface CollegeCourse {
  id: string;
  name: string;
  degree: string;
  duration: string;
  annualFee: number;
  eligibility: string;
  seats: number;
  cutOffRankOrPercentile: string;
  placementRate: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
}

export interface CollegeFacility {
  name: string;
  iconName: string;
  description: string;
  rating: number; // 1-5
  isAvailable: boolean;
  status: 'Verified' | 'Student Report' | 'Unverified';
}

export interface PlacementStat {
  year: number;
  placementPercentage: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  topRecruiters: string[];
  internshipOffersCount: number;
}

export interface CampusLifeDetail {
  cultureOverview: string;
  studentCommunityVibe: string;
  annualFests: { name: string; type: string; month: string; description: string }[];
  activeClubsCount: number;
  featuredClubs: { name: string; category: string; description: string }[];
  sportsFacilities: string[];
  canteenFoodRating: number; // 1-5
  canteenSpecialties: string[];
  hostelLifeRating: number; // 1-5
  hostelCurfewTime: string;
  academicPressureLevel: 'Low' | 'Moderate' | 'High' | 'Intense';
  attendanceCultureRating: number; // e.g. 75% strictly enforced
  attendanceMandatoryPercentage: number;
  raggingFreeCertified: boolean;
  generalEnvironmentNotes: string;
}

export interface CollegeReview {
  id: string;
  collegeId: string;
  authorName?: string;
  authorRole?: string;
  studentName?: string;
  reviewerType?: 'current_student' | 'alumnus' | 'prospective_visitor' | string;
  isVerifiedStudent: boolean;
  graduationYear?: number;
  course?: string;
  category?: string;
  rating: number;
  categoryRatings?: {
    faculty?: number;
    hostel?: number;
    canteen?: number;
    campus?: number;
    administration?: number;
    placements?: number;
  };
  title?: string;
  comment?: string;
  content?: string;
  pros: string[];
  cons: string[];
  date: string;
  helpfulCount: number;
  isReported?: boolean;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  badgeText?: string;
  location: {
    city: string;
    state: string;
    address: string;
    nearestMetroOrStation: string;
    distanceKmFromCenter: number;
  };
  establishedYear: number;
  affiliation: string;
  accreditation: string;
  rankings: { agency: string; rank: number; year: number }[];
  overview: string;
  bannerImage: string;
  logoImage: string;
  contact: {
    phone: string;
    email: string;
    website: string;
    admissionHelpline: string;
  };
  courses: CollegeCourse[];
  departments: string[];
  admissionProcess: {
    examAccepted: string[];
    applicationDeadlines: string;
    counsellingProcess: string;
    applicationFee: number;
  };
  feeStructure: {
    tuitionFeePerYear: number;
    hostelFeePerYear: number;
    examFeePerYear: number;
    otherCharges: number;
    refundableDeposit: number;
    paymentOptions: string[];
    refundPolicy: string;
  };
  scholarships: {
    name: string;
    eligibility: string;
    amountOrDiscount: string;
    deadline: string;
    source: 'Government' | 'Merit-Based' | 'Need-Based' | 'Institutional';
  }[];
  facilities: CollegeFacility[];
  placementHistory: PlacementStat[];
  campusLife: CampusLifeDetail;
  hostelInfo: {
    availableForBoys: boolean;
    availableForGirls: boolean;
    acAvailable: boolean;
    wifiAvailable: boolean;
    roomTypes: string[];
    feeRange: string;
  };
  transportation: {
    collegeBusesAvailable: boolean;
    routesCovered: string[];
    nearestAirportKm: number;
    nearestRailwayKm: number;
  };
  managementInfo: {
    directorName: string;
    directorQualification: string;
    deanAcademics: string;
    deanStudentAffairs: string;
    grievanceOfficer: string;
  };
  verificationStatus: 'Official Verified' | 'Community Driven' | 'Pending Review';
  overallRating: number;
  totalReviewsCount: number;
}

export interface FacultyMember {
  id: string;
  collegeId: string;
  name: string;
  title: string;
  department: string;
  subjectsTaught: string[];
  qualification: string;
  experienceYears: number;
  areasOfExpertise: string[];
  officeRoom: string;
  officialEmail: string;
  consultationHours: string;
  teachingStyleSummary: string;
  studentRating: number; // 1-5
  feedbackTags: string[];
  researchPublicationsCount: number;
  isAvailableForMentorship: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
}

export interface AttendanceSubject {
  subjectCode: string;
  subjectName: string;
  attendedClasses: number;
  totalClasses: number;
  targetPercentage: number;
  facultyName: string;
  lastUpdated: string;
}

export interface AssignmentItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  grade?: string;
  maxMarks: number;
  submissionLinkOrFile?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unitOrTopic: string;
  author: string;
  fileSize: string;
  type: 'PDF' | 'Slides' | 'Notes' | 'Question Bank';
  uploadDate: string;
  downloadsCount: number;
  summary: string;
}

export interface ExamScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  examType: 'Mid-Sem' | 'End-Sem' | 'Practical' | 'Quiz';
  date: string;
  time: string;
  room: string;
  syllabusCovered: string;
  maxMarks: number;
}

export interface NoticeItem {
  id: string;
  collegeId?: string;
  title: string;
  category: 'Academic' | 'Academics' | 'Fees' | 'Fee' | 'Fee & Accounts' | 'Examination' | 'Placement' | 'Events' | 'Urgent' | 'Administrative' | string;
  issuedBy?: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low' | 'Normal' | 'Urgent' | string;
  content: string;
  attachmentName?: string;
  isRead?: boolean;
}

export interface EventItem {
  id: string;
  collegeId?: string;
  title: string;
  category: 'Cultural Fest' | 'Tech Hackathon' | 'Workshop' | 'Sports' | 'Seminar' | string;
  date: string;
  time?: string;
  venue?: string;
  organizedBy?: string;
  registrationOpen?: boolean;
  registrationFee?: string;
  bannerGradient?: string;
  description: string;
}

export interface AdminDepartmentContact {
  id: string;
  departmentName: string;
  headName: string;
  designation: string;
  phone: string;
  email: string;
  officeLocation: string;
  timings: string;
  servicesProvided: string[];
}

export interface AdminProcedure {
  id: string;
  title: string;
  category?: 'Certificates' | 'Finance' | 'Examinations' | 'Hostel' | 'ID Cards' | 'Grievance' | string;
  summary?: string;
  department?: string;
  steps: string[];
  requiredDocuments: string[];
  processingDays?: string;
  estimatedProcessingDays?: number;
  feeRequired?: string;
  concernedDepartment?: string;
  downloadableFormName?: string;
}

export interface AdminFAQ {
  id: string;
  question: string;
  category: string;
  answer: string;
  department: string;
  helpfulCount: number;
}

export interface ProblemSolverQuery {
  query: string;
  collegeId?: string;
  studentContext?: {
    course: string;
    semester: number;
    attendanceRate?: number;
  };
}

export interface ProblemSolverResponse {
  directAnswer: string;
  stepByStepSolution: string[];
  relevantDepartment: string;
  contactPersonOrOffice: string;
  requiredDocuments: string[];
  importantDeadlinesOrRules: string;
  suggestedNextAction: string;
  officialConfirmationDisclaimer: string;
  isVerifiedPolicy: boolean;
}

export interface AdminOfficer {
  id: string;
  name: string;
  designation: string;
  department: string;
  room: string;
  email: string;
  phone: string;
  officeHours: string;
  responsibilities: string[];
}

export interface ScholarshipItem {
  name: string;
  eligibility: string;
  amountOrDiscount: string;
  deadline: string;
  source: 'Government' | 'Merit-Based' | 'Need-Based' | 'Institutional' | string;
}

export type StudyMaterialItem = StudyMaterial;
export type CollegeComparisonMatrix = CollegeComparisonAnalysis;
export type ProblemSolution = ProblemSolverResponse;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'ai';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  referenceType?: string;
}


export interface CollegeFitEvaluation {
  fitScorePercentage: number;
  verdict: 'Strong Match' | 'Moderate Match' | 'Alternative Recommended';
  executiveSummary: string;
  prosForUser: string[];
  potentialChallenges: string[];
  budgetAnalysis: string;
  academicAndCareerAlignment: string;
  campusCultureFit: string;
  suggestedQuestionsToAskFaculty: string[];
}

export interface CollegeComparisonAnalysis {
  bestForBudget: string;
  bestForPlacements: string;
  bestForCampusLife: string;
  bestForAcademics: string;
  summaryRecommendation: string;
  matrixInsights: {
    metric: string;
    leader: string;
    details: string;
  }[];
}

// Senior & Alumni Hub Interfaces
export interface AlumniMentor {
  id: string;
  name: string;
  avatar?: string;
  collegeId: string;
  collegeName: string;
  gradYear: number;
  degree: string;
  branch: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  isVerifiedAlumnus: boolean;
  linkedinUrl?: string;
  bio: string;
  expertiseTags: string[];
  mentorshipTopics: string[];
  totalMenteesHelped: number;
  rating: number;
  availableFor1on1: boolean;
  preferredContact: 'In-App Chat' | 'Google Meet' | 'Email';
}

export interface SeniorDiscussionReply {
  id: string;
  authorName: string;
  authorRole: 'Alumnus' | 'Final Year Senior' | 'Pre-Final Senior' | 'Student';
  authorCollege: string;
  authorBatch?: string;
  authorCompany?: string;
  isVerified: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
  isAcceptedSolution?: boolean;
}

export interface SeniorDiscussionPost {
  id: string;
  title: string;
  content: string;
  category: 'Placement & SDE' | 'Core Engineering' | 'GATE & Higher Studies' | 'Off-Campus & Referrals' | 'College Exams & Professors' | 'Branch Change & CGPA' | 'Internship Advice' | 'General Guidance';
  collegeId?: string;
  collegeName?: string;
  targetBranch?: string;
  authorName: string;
  authorRole: string;
  authorYearOrBatch: string;
  isVerified: boolean;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  replies: SeniorDiscussionReply[];
  isSolved?: boolean;
  viewsCount: number;
}

// Internship & Training Interfaces
export interface InternshipListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workMode: 'Remote' | 'On-Site' | 'Hybrid';
  type: 'Summer Internship' | 'Winter Internship' | 'Industrial Training' | 'Research Fellowship' | 'Part-Time' | 'Full-Time Trainee';
  stipend: string;
  stipendAmountMonthly?: number;
  duration: string;
  postedDate: string;
  applicationDeadline: string;
  isUrgentHiring?: boolean;
  isAicteApproved?: boolean;
  isVerifiedCompany: boolean;
  eligibleCourses: string[];
  eligibleBranches: string[];
  eligibleYears: string[];
  minCgpaRequired?: number;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  perks: string[];
  openingsCount: number;
  applicantsCount: number;
  applyUrl?: string;
  contactEmail?: string;
  affiliatedCollegeIds?: string[]; // e.g. specially tied to IITK, CSJMU, HBTU, Axis Colleges, etc.
}

export interface TrainingProgram {
  id: string;
  title: string;
  provider: string; // e.g. 'NPTEL / IIT Kanpur', 'MSME Technology Centre', 'AWS Academy', 'AKTU Industry Cell', 'Google Cloud Skill'
  category: 'AI / Machine Learning' | 'Web & Full Stack' | 'Core Engineering (CAD/VLSI/Robotics)' | 'Cloud & DevOps' | 'Data Analytics' | 'Civil & Structural QA' | 'Embedded & IoT';
  duration: string; // e.g. '6 Weeks (Summer 2025)'
  hoursPerWeek: number;
  mode: 'Online (Self-Paced + Live)' | 'Hands-on Lab' | 'Hybrid';
  certificationType: 'AICTE Mandatory Summer Training Approved' | 'Govt MSME Certified' | 'Global Industry Recognized' | 'University Credit Eligible';
  rating: number;
  enrolledStudentsCount: number;
  feeText: string; // e.g. 'Free / ₹0' or '₹1,499 (Student Subsidy)'
  isGovernmentFunded: boolean;
  prerequisites: string;
  syllabusModules: string[];
  keyHighlights: string[];
  certificateSampleUrl?: string;
  enrollmentDeadline: string;
}

export interface InternshipApplicationTrackerItem {
  id: string;
  internshipId?: string;
  companyName: string;
  roleTitle: string;
  location: string;
  stipend: string;
  workMode: string;
  appliedDate: string;
  status: 'Wishlist' | 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offer Received' | 'Rejected' | 'Completed';
  interviewDate?: string;
  notes?: string;
  certificateReceived?: boolean;
}

// Student Care, Mental Health & Anti-Harassment Cell Interfaces
export interface AntiHarassmentCommitteeMember {
  id: string;
  name: string;
  designation: string; // e.g. 'Presiding Officer (Internal Complaints Committee)', 'Proctor & Chief Warden', 'Student Welfare Dean', 'External NGO Legal Member'
  department: string;
  phone: string;
  email: string;
  officeLocation: string;
  availability: string;
  isExternalMember?: boolean;
}

export interface HelplineContact {
  id: string;
  title: string;
  category: 'National 24x7 Emergency' | 'Mental Health & Suicide Prevention' | 'Anti-Ragging Govt Hotline' | 'Women Safety & POSH' | 'Campus Medical & Ambulance';
  number: string;
  tollFree: boolean;
  availableHours: string;
  description: string;
  managedBy: string;
  actionType: 'call' | 'whatsapp' | 'web';
  badgeColor?: string;
}

export interface CampusCounselor {
  id: string;
  name: string;
  title: string; // e.g. 'Lead Clinical Psychologist', 'Student Wellness Counsellor', 'Psychiatric Consultant'
  qualifications: string;
  specializations: string[];
  languages: string[];
  experienceYears: number;
  consultationMode: 'In-Person (Health Centre)' | 'Confidential Video Call' | 'Anonymous Chat' | 'Both In-Person & Online';
  availableDays: string;
  officeRoom: string;
  isFreeForStudents: boolean;
  avatarUrl?: string;
}

export interface ConfidentialIncidentReportItem {
  id: string;
  trackingToken: string; // e.g. 'SW-SAFE-849204'
  category: 'Ragging & Physical Intimidation' | 'Sexual Harassment (POSH / UGC)' | 'Cyberbullying & Online Stalking' | 'Hostel / Mess Harassment' | 'Severe Mental Crisis / Self-Harm Risk' | 'Academic Coercion / Blackmail' | 'Discrimination / Caste / Gender Bias' | 'Other Urgent Concern';
  severityLevel: 'Critical / Immediate Threat' | 'High' | 'Moderate';
  incidentDate: string;
  incidentTime?: string;
  location: string; // e.g. 'Hostel Block 3, 2nd Floor Corridor', 'Library basement', 'Online Group'
  isAnonymous: boolean;
  reporterName?: string;
  reporterRollOrBranch?: string;
  reporterContact?: string;
  suspectDetails?: string; // Names, hostel rooms or descriptions of individuals involved
  detailedDescription: string;
  evidenceNotes?: string;
  witnesses?: string;
  requestedAction: 'Formal Enquiry & Disciplinary Action' | 'Immediate Safe Intervention & Protection' | 'Confidential Mediation' | 'Mental Health Rescue & Support';
  submissionDate: string;
  status: 'Submitted & Encrypted' | 'Under Confidential Proctorial Review' | 'Enquiry Committee Constituted' | 'Action Taken & Safe Resolution' | 'Closed with Support';
  adminRemarks?: string;
  lastUpdatedDate: string;
}

export interface CounsellingAppointmentBooking {
  id: string;
  counselorId: string;
  counselorName: string;
  studentName: string;
  studentRollOrEmail: string;
  studentBranch: string;
  preferredDate: string;
  preferredSlot: string;
  mode: 'In-Person (Health Centre)' | 'Confidential Video Call' | 'Anonymous Chat';
  concernsList: string[]; // e.g. 'Exam Anxiety', 'Depression/Low Mood', 'Homesickness', 'Peer Pressure', 'Trauma/Harassment'
  additionalNotes?: string;
  isUrgentSOS: boolean;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled';
}

