import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Plus,
  ArrowUpRight,
  FileText,
  DollarSign,
  Zap,
  BookOpen,
  UserCheck,
  X,
  Send,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  InternshipListing,
  TrainingProgram,
  InternshipApplicationTrackerItem,
  StudentProfile,
  College,
} from '../types';
import {
  MOCK_INTERNSHIPS,
  MOCK_TRAINING_PROGRAMS,
  INITIAL_APPLICATION_TRACKER,
} from '../data/seniorsAndInternshipsData';

interface InternshipsTrainingHubProps {
  studentProfile: StudentProfile;
  activeCollege?: College;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const InternshipsTrainingHub: React.FC<InternshipsTrainingHubProps> = ({
  studentProfile,
  activeCollege,
  onOpenWandAIWithPrompt,
}) => {
  // Main view tabs: 'internships' | 'training' | 'tracker' | 'ai-matcher'
  const [activeTab, setActiveTab] = useState<'internships' | 'training' | 'tracker' | 'ai-matcher'>('internships');

  // Internships data & filters
  const [internshipsList] = useState<InternshipListing[]>(MOCK_INTERNSHIPS);
  const [internshipSearch, setInternshipSearch] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  const [selectedInternshipDetail, setSelectedInternshipDetail] = useState<InternshipListing | null>(null);

  // Apply Modal state
  const [applyModalInternship, setApplyModalInternship] = useState<InternshipListing | null>(null);
  const [applicantResumeNote, setApplicantResumeNote] = useState<string>('');
  const [applySuccessModal, setApplySuccessModal] = useState<boolean>(false);

  // Training programs data & filters
  const [trainingList] = useState<TrainingProgram[]>(MOCK_TRAINING_PROGRAMS);
  const [trainingCategoryFilter, setTrainingCategoryFilter] = useState<string>('All');
  const [selectedTrainingDetail, setSelectedTrainingDetail] = useState<TrainingProgram | null>(null);

  // Tracker state
  const [applications, setApplications] = useState<InternshipApplicationTrackerItem[]>(() => {
    const saved = localStorage.getItem('studentwand_internship_tracker');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_APPLICATION_TRACKER;
      }
    }
    return INITIAL_APPLICATION_TRACKER;
  });

  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState<boolean>(false);
  const [newTrackCompany, setNewTrackCompany] = useState<string>('');
  const [newTrackRole, setNewTrackRole] = useState<string>('');
  const [newTrackStipend, setNewTrackStipend] = useState<string>('₹15,000 / month');
  const [newTrackStatus, setNewTrackStatus] = useState<InternshipApplicationTrackerItem['status']>('Applied');
  const [newTrackNotes, setNewTrackNotes] = useState<string>('');

  // AI Matcher input state
  const [matcherBranch, setMatcherBranch] = useState<string>(studentProfile.branch || 'Computer Science & Engineering');
  const [matcherSkills, setMatcherSkills] = useState<string>('JavaScript, React, Python, Data Structures, Git');
  const [matcherTargetRole, setMatcherTargetRole] = useState<string>('Software Engineer Intern');

  // Save tracker to localStorage
  const saveApplications = (newApps: InternshipApplicationTrackerItem[]) => {
    setApplications(newApps);
    localStorage.setItem('studentwand_internship_tracker', JSON.stringify(newApps));
  };

  // Filtered internships
  const filteredInternships = useMemo(() => {
    return internshipsList.filter((item) => {
      // Type filter
      if (selectedTypeFilter !== 'All') {
        if (selectedTypeFilter === 'AICTE Approved' && !item.isAicteApproved) return false;
        if (selectedTypeFilter === 'Summer' && !item.type.includes('Summer')) return false;
        if (selectedTypeFilter === 'Industrial' && !item.type.includes('Industrial')) return false;
        if (selectedTypeFilter === 'Research' && !item.type.includes('Research')) return false;
      }
      // Mode filter
      if (selectedModeFilter !== 'All' && item.workMode !== selectedModeFilter) {
        return false;
      }
      // Location filter
      if (selectedLocationFilter !== 'All') {
        if (selectedLocationFilter === 'Kanpur / UP' && !item.location.toLowerCase().includes('kanpur') && !item.location.toLowerCase().includes('up') && !item.location.toLowerCase().includes('noida')) {
          return false;
        }
        if (selectedLocationFilter === 'Remote' && item.workMode !== 'Remote') {
          return false;
        }
      }
      // Search text
      if (internshipSearch.trim()) {
        const q = internshipSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);
        const matchesSkills = item.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesDesc) return false;
      }
      return true;
    });
  }, [internshipsList, selectedTypeFilter, selectedModeFilter, selectedLocationFilter, internshipSearch]);

  // Filtered training programs
  const filteredTraining = useMemo(() => {
    return trainingList.filter((prog) => {
      if (trainingCategoryFilter !== 'All' && prog.category !== trainingCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [trainingList, trainingCategoryFilter]);

  // Handle Quick Apply
  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalInternship) return;

    // Add to Tracker automatically
    const newTrackItem: InternshipApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      internshipId: applyModalInternship.id,
      companyName: applyModalInternship.company,
      roleTitle: applyModalInternship.title,
      location: applyModalInternship.location,
      stipend: applyModalInternship.stipend,
      workMode: applyModalInternship.workMode,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      notes: applicantResumeNote || 'Applied through Student Wand Verified Portal with automatic ATS profile verification.',
      certificateReceived: false,
    };

    saveApplications([newTrackItem, ...applications]);
    setApplyModalInternship(null);
    setApplicantResumeNote('');
    setApplySuccessModal(true);
  };

  // Handle Add custom tracker item
  const handleAddTrackerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackCompany.trim() || !newTrackRole.trim()) return;

    const newTrackItem: InternshipApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      companyName: newTrackCompany.trim(),
      roleTitle: newTrackRole.trim(),
      location: 'On-File',
      stipend: newTrackStipend.trim(),
      workMode: 'Hybrid',
      appliedDate: new Date().toISOString().split('T')[0],
      status: newTrackStatus,
      notes: newTrackNotes.trim(),
      certificateReceived: newTrackStatus === 'Completed',
    };

    saveApplications([newTrackItem, ...applications]);
    setNewTrackCompany('');
    setNewTrackRole('');
    setNewTrackNotes('');
    setIsAddTrackerModalOpen(false);
  };

  // Handle update status in tracker
  const handleUpdateStatus = (appId: string, nextStatus: InternshipApplicationTrackerItem['status']) => {
    const updated = applications.map((a) => {
      if (a.id === appId) {
        return {
          ...a,
          status: nextStatus,
          certificateReceived: nextStatus === 'Completed' ? true : a.certificateReceived,
        };
      }
      return a;
    });
    saveApplications(updated);
  };

  // Handle delete tracker item
  const handleDeleteTrackerItem = (appId: string) => {
    const updated = applications.filter((a) => a.id !== appId);
    saveApplications(updated);
  };

  return (
    <div id="internships-training-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2D2A4A] via-[#1e1b38] to-[#141226] text-white p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>AICTE Approved Summer Internships & Industrial Training</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
            Internships & Mandatory Training Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover verified summer internships, defense PSU industrial trainings (HAL, BHEL, RDSO), AICTE approved 6-week certifications, and track your application pipeline seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('internships')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Verified Internships</span>
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>My Application Tracker ({applications.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'internships'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Summer & Industrial Internships</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {internshipsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'training'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Industrial Training & Certifications</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
              {trainingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tracker'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Application Kanban Tracker</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {applications.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-matcher')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai-matcher'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Resume & Fit Matcher</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERNSHIP OPPORTUNITIES */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={internshipSearch}
                  onChange={(e) => setInternshipSearch(e.target.value)}
                  placeholder="Search by company (TCS, HAL, IITK, Zomato), role, or required skills (React, Python, CAD)..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="AICTE Approved">⭐ AICTE Approved Only</option>
                  <option value="Summer">Summer Internships</option>
                  <option value="Industrial">Industrial Trainings (PSU/Core)</option>
                  <option value="Research">Research Fellowships</option>
                </select>

                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                >
                  <option value="All">All Locations</option>
                  <option value="Kanpur / UP">🏛️ Kanpur / UP Regional</option>
                  <option value="Remote">🌐 Remote / Work from Home</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((internship) => (
              <div
                key={internship.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Company & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{internship.company}</span>
                        {internship.isVerifiedCompany && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {internship.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {internship.isAicteApproved && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                          AICTE Approved
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{internship.postedDate}</span>
                    </div>
                  </div>

                  {/* Stipend & Location Tags */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{internship.stipend}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium col-span-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{internship.duration} • <strong className="text-amber-800">Deadline: {internship.applicationDeadline}</strong></span>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Required Skills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {internship.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onOpenWandAIWithPrompt(
                        `Evaluate my eligibility for the "${internship.title}" at "${internship.company}". My branch is ${studentProfile.branch || 'B.Tech CSE'}, Year: ${studentProfile.year || 3}. Give me 3 tips to get shortlisted and a customized cover letter.`
                      );
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    title="Check fit with Wand AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInternshipDetail(internship)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setApplyModalInternship(internship)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Apply</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: INDUSTRIAL TRAINING & CERTIFICATIONS */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-700">
              Government & University Approved Summer Training Programs
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'Web & Full Stack', 'AI / Machine Learning', 'Core Engineering (CAD/VLSI/Robotics)', 'Cloud & DevOps'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTrainingCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    trainingCategoryFilter === cat
                      ? 'bg-[#2D2A4A] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Training Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTraining.map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {prog.certificationType}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{prog.duration}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {prog.title}
                  </h3>

                  <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Conducted by: <strong>{prog.provider}</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Fee Structure: <span className="text-emerald-700 font-extrabold">{prog.feeText}</span></span>
                      <span>Mode: {prog.mode}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Prerequisites: {prog.prerequisites}
                    </div>
                  </div>

                  {/* Syllabus Highlights */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Course Modules & Syllabus
                    </span>
                    <div className="space-y-1 text-xs text-slate-600">
                      {prog.syllabusModules.slice(0, 3).map((mod, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{mod}</span>
                        </div>
                      ))}
                      {prog.syllabusModules.length > 3 && (
                        <div className="text-[11px] text-indigo-600 font-bold pl-5">
                          + {prog.syllabusModules.length - 3} more modules in full syllabus
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    👥 <strong>{prog.enrolledStudentsCount.toLocaleString()}</strong> students enrolled
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onOpenWandAIWithPrompt(
                          `Generate the official College Industrial Training Synopsis and Logbook submission template for "${prog.title}" offered by ${prog.provider}.`
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>AI Logbook Template</span>
                    </button>
                    <button
                      onClick={() => setSelectedTrainingDetail(prog)}
                      className="px-4 py-1.5 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 text-xs font-bold cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: APPLICATION TRACKER (KANBAN / LIST) */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Header & Add Action */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Internship Application Pipeline</h2>
              <p className="text-xs text-slate-500">
                Track your active applications, scheduled interviews, and university training certificates
              </p>
            </div>

            <button
              onClick={() => setIsAddTrackerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#2D2A4A] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Application</span>
            </button>
          </div>

          {/* Pipeline Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Wishlist', 'Applied', 'Interview Scheduled', 'Offer Received'] as const).map((stage) => {
              const stageApps = applications.filter((a) => a.status === stage);
              return (
                <div key={stage} className="rounded-2xl bg-slate-100/80 p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        stage === 'Offer Received'
                          ? 'bg-emerald-500'
                          : stage === 'Interview Scheduled'
                          ? 'bg-amber-500'
                          : stage === 'Applied'
                          ? 'bg-indigo-500'
                          : 'bg-slate-400'
                      }`} />
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 font-bold text-[10px]">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageApps.length === 0 ? (
                      <div className="p-4 text-center rounded-xl bg-white/60 border border-dashed border-slate-300 text-[11px] text-slate-400">
                        No applications in {stage}
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-extrabold text-slate-900 leading-tight">{app.companyName}</h4>
                              <p className="text-[11px] text-slate-600 font-medium">{app.roleTitle}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteTrackerItem(app.id)}
                              className="text-slate-300 hover:text-rose-500 text-xs p-0.5"
                              title="Remove from tracker"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-emerald-700 font-bold">
                            {app.stipend}
                          </div>

                          {app.interviewDate && (
                            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-bold flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{app.interviewDate}</span>
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                              "{app.notes}"
                            </p>
                          )}

                          {/* Quick Move Status Selector */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-semibold">Move:</span>
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                              className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 font-bold focus:outline-none"
                            >
                              <option value="Wishlist">Wishlist</option>
                              <option value="Applied">Applied</option>
                              <option value="Interview Scheduled">Interview</option>
                              <option value="Offer Received">Offer Received</option>
                              <option value="Completed">Completed</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: AI RESUME & FIT MATCHER */}
      {activeTab === 'ai-matcher' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="max-w-2xl space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Wand AI Career Match Engine</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                Instant Internship ATS & Resume Fit Checker
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check whether your current technical skills, coursework, and projects match top internships and get actionable suggestions to guarantee an interview callback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Branch / Stream</label>
                <input
                  type="text"
                  value={matcherBranch}
                  onChange={(e) => setMatcherBranch(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Internship Role</label>
                <input
                  type="text"
                  value={matcherTargetRole}
                  onChange={(e) => setMatcherTargetRole(e.target.value)}
                  placeholder="e.g. SDE Intern, Embedded Trainee, Data Analyst"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Skills & Projects</label>
                <input
                  type="text"
                  value={matcherSkills}
                  onChange={(e) => setMatcherSkills(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Analyze my ATS Resume Fit for "${matcherTargetRole}". My branch is ${matcherBranch}, enrolled at ${studentProfile.collegeName || 'my college'}. My current skills: ${matcherSkills}. Provide: 1. Match score out of 100%, 2. Missing high-value keywords to add to my resume, 3. Two mini project ideas that will make my application stand out, 4. A 3-line cover note for recruiters.`
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Wand AI Matcher & Optimization</span>
              </button>

              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Generate a standardized college No Objection Certificate (NOC) request letter for Summer Industrial Internship to submit to my HOD/Dean at ${studentProfile.collegeName || 'my college'}. My branch is ${matcherBranch}, Year: ${studentProfile.year || 3}.`
                  );
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Generate College NOC Request Letter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLY TO INTERNSHIP */}
      {applyModalInternship && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Quick Application</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Apply for {applyModalInternship.title}
                </h3>
                <p className="text-xs text-slate-500">{applyModalInternship.company} • {applyModalInternship.stipend}</p>
              </div>
              <button
                onClick={() => setApplyModalInternship(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApply} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-800">
                  Applicant: {studentProfile.name || 'Current Student'} ({studentProfile.branch || 'B.Tech'}, Year {studentProfile.year || 3})
                </div>
                <div className="text-[11px] text-slate-500">
                  College: {studentProfile.collegeName || 'Student Wand Verified Member'}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cover Note / Why are you a good fit for this role?
                </label>
                <textarea
                  rows={3}
                  value={applicantResumeNote}
                  onChange={(e) => setApplicantResumeNote(e.target.value)}
                  placeholder="Mention your relevant projects, GitHub link, or why this internship aligns with your career goals..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  This application will be automatically logged in your <strong>Application Pipeline Tracker</strong> with status marked as Applied.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyModalInternship(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM TRACKER ITEM */}
      {isAddTrackerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Application to Tracker</h3>
              <button
                onClick={() => setIsAddTrackerModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrackerItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={newTrackCompany}
                  onChange={(e) => setNewTrackCompany(e.target.value)}
                  placeholder="e.g. Google India, DRDO, RDSO Lucknow"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Position *</label>
                <input
                  type="text"
                  required
                  value={newTrackRole}
                  onChange={(e) => setNewTrackRole(e.target.value)}
                  placeholder="e.g. Summer Research Intern, Frontend Trainee"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={newTrackStipend}
                    onChange={(e) => setNewTrackStipend(e.target.value)}
                    placeholder="₹20,000 / mo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Status</label>
                  <select
                    value={newTrackStatus}
                    onChange={(e) => setNewTrackStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Reminders</label>
                <textarea
                  rows={2}
                  value={newTrackNotes}
                  onChange={(e) => setNewTrackNotes(e.target.value)}
                  placeholder="e.g. Applied on career portal. Referral by Alumnus Shashwat."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTrackerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D2A4A] text-white font-bold text-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INTERNSHIP DETAILS VIEW */}
      {selectedInternshipDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {selectedInternshipDetail.type}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedInternshipDetail.title}
                </h3>
                <p className="text-xs font-bold text-slate-700">{selectedInternshipDetail.company} • {selectedInternshipDetail.location}</p>
              </div>
              <button
                onClick={() => setSelectedInternshipDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                <div>Stipend: <strong className="text-emerald-700">{selectedInternshipDetail.stipend}</strong></div>
                <div>Duration: {selectedInternshipDetail.duration}</div>
                <div>Work Mode: {selectedInternshipDetail.workMode}</div>
                <div>Deadline: <strong className="text-amber-800">{selectedInternshipDetail.applicationDeadline}</strong></div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">Job Description & Overview</h4>
                <p className="text-slate-600 leading-relaxed">{selectedInternshipDetail.description}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">Key Responsibilities</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedInternshipDetail.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">Perks & Recognition</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInternshipDetail.perks.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedInternshipDetail(null);
                  onOpenWandAIWithPrompt(
                    `Give me a 5-step preparation checklist for the "${selectedInternshipDetail.title}" at "${selectedInternshipDetail.company}".`
                  );
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Prepare with AI</span>
              </button>

              <button
                onClick={() => {
                  const item = selectedInternshipDetail;
                  setSelectedInternshipDetail(null);
                  setApplyModalInternship(item);
                }}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your application has been received and added to your <strong>Pipeline Tracker</strong>. Check back for interview call updates!
            </p>
            <button
              onClick={() => setApplySuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2D2A4A] text-white font-bold text-xs"
            >
              View Application Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
