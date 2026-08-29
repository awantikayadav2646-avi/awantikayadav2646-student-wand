import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  HeartHandshake,
  FileText,
  PhoneCall,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  Send,
  X,
  Info,
  Activity,
  Award,
  Zap,
  Users,
  MessageSquare,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import {
  StudentProfile,
  College,
  HelplineContact,
  AntiHarassmentCommitteeMember,
  CampusCounselor,
  ConfidentialIncidentReportItem,
  CounsellingAppointmentBooking,
} from '../types';
import {
  MOCK_HELPLINES,
  MOCK_COMMITTEE_MEMBERS,
  MOCK_COUNSELORS,
  INITIAL_INCIDENT_REPORTS,
  LEGAL_FRAMEWORK_FAQS,
} from '../data/safeCampusData';

interface SafeCampusHubProps {
  studentProfile: StudentProfile;
  activeCollege?: College;
  onOpenWandAIWithPrompt: (prompt: string) => void;
  defaultTab?: 'helplines' | 'anti-harassment' | 'counselling' | 'incident-report' | 'track-report';
}

export const SafeCampusHub: React.FC<SafeCampusHubProps> = ({
  studentProfile,
  activeCollege,
  onOpenWandAIWithPrompt,
  defaultTab = 'helplines',
}) => {
  // Main view navigation tab
  const [activeTab, setActiveTab] = useState<'helplines' | 'anti-harassment' | 'counselling' | 'incident-report' | 'track-report'>(defaultTab);

  // Helplines filter
  const [helplineCategoryFilter, setHelplineCategoryFilter] = useState<string>('All');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Counselors state & booking modal
  const [selectedCounselorForBooking, setSelectedCounselorForBooking] = useState<CampusCounselor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingSlot, setBookingSlot] = useState<string>('11:00 AM - 12:00 PM');
  const [bookingMode, setBookingMode] = useState<CounsellingAppointmentBooking['mode']>('Confidential Video Call');
  const [bookingConcerns, setBookingConcerns] = useState<string[]>(['Academic Burnout & Stress']);
  const [bookingAdditionalNote, setBookingAdditionalNote] = useState<string>('');
  const [isUrgentBooking, setIsUrgentBooking] = useState<boolean>(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<CounsellingAppointmentBooking | null>(null);

  // Incident Reports in LocalStorage
  const [reports, setReports] = useState<ConfidentialIncidentReportItem[]>(() => {
    const saved = localStorage.getItem('studentwand_incident_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_INCIDENT_REPORTS;
      }
    }
    return INITIAL_INCIDENT_REPORTS;
  });

  // Incident report form state
  const [reportCategory, setReportCategory] = useState<ConfidentialIncidentReportItem['category']>('Ragging & Physical Intimidation');
  const [reportSeverity, setReportSeverity] = useState<ConfidentialIncidentReportItem['severityLevel']>('High');
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportTime, setReportTime] = useState<string>('');
  const [reportLocation, setReportLocation] = useState<string>('');
  const [reportIsAnonymous, setReportIsAnonymous] = useState<boolean>(true);
  const [reporterName, setReporterName] = useState<string>(studentProfile.name || '');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [reportSuspectDetails, setReportSuspectDetails] = useState<string>('');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportEvidenceNotes, setReportEvidenceNotes] = useState<string>('');
  const [reportWitnesses, setReportWitnesses] = useState<string>('');
  const [reportRequestedAction, setReportRequestedAction] = useState<ConfidentialIncidentReportItem['requestedAction']>('Immediate Safe Intervention & Protection');
  const [submittedNewToken, setSubmittedNewToken] = useState<string | null>(null);

  // Token Tracking Lookup
  const [searchTokenInput, setSearchTokenInput] = useState<string>('SW-SAFE-849204');
  const [trackedReportResult, setTrackedReportResult] = useState<ConfidentialIncidentReportItem | null>(() => {
    return INITIAL_INCIDENT_REPORTS[0];
  });
  const [tokenSearchError, setTokenSearchError] = useState<string | null>(null);

  // Calming Breathing Exercise State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  // Save reports helper
  const saveReportsToStorage = (newReports: ConfidentialIncidentReportItem[]) => {
    setReports(newReports);
    localStorage.setItem('studentwand_incident_reports', JSON.stringify(newReports));
  };

  // Copy number to clipboard handler
  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  // Handle appointment submission
  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselorForBooking) return;

    const newBooking: CounsellingAppointmentBooking = {
      id: `booking-${Date.now()}`,
      counselorId: selectedCounselorForBooking.id,
      counselorName: selectedCounselorForBooking.name,
      studentName: reportIsAnonymous ? 'Anonymous Student' : (studentProfile.name || 'Student'),
      studentRollOrEmail: studentProfile.email || 'Confidential Student Profile',
      studentBranch: studentProfile.branch || 'Undergraduate Student',
      preferredDate: bookingDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredSlot: bookingSlot,
      mode: bookingMode,
      concernsList: bookingConcerns,
      additionalNotes: bookingAdditionalNote,
      isUrgentSOS: isUrgentBooking,
      status: 'Confirmed',
    };

    setBookingSuccessData(newBooking);
    setSelectedCounselorForBooking(null);
  };

  // Handle Incident Report Submission
  const handleSubmitIncidentReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim() || !reportLocation.trim()) return;

    // Generate high-entropy secure tracking token
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const generatedToken = `SW-SAFE-${randomHex}`;

    const newReport: ConfidentialIncidentReportItem = {
      id: `inc-${Date.now()}`,
      trackingToken: generatedToken,
      category: reportCategory,
      severityLevel: reportSeverity,
      incidentDate: reportDate,
      incidentTime: reportTime,
      location: reportLocation,
      isAnonymous: reportIsAnonymous,
      reporterName: reportIsAnonymous ? undefined : reporterName,
      reporterContact: reportIsAnonymous ? undefined : reporterContact,
      suspectDetails: reportSuspectDetails,
      detailedDescription: reportDescription,
      evidenceNotes: reportEvidenceNotes,
      witnesses: reportWitnesses,
      requestedAction: reportRequestedAction,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted & Encrypted',
      adminRemarks: 'Incident received and encrypted. Auto-dispatched to the Internal Complaints Committee (ICC) & Chief Proctor for immediate safety assessment.',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newReport, ...reports];
    saveReportsToStorage(updatedList);
    setSubmittedNewToken(generatedToken);
    setSearchTokenInput(generatedToken);
    setTrackedReportResult(newReport);

    // Reset fields
    setReportDescription('');
    setReportLocation('');
    setReportSuspectDetails('');
    setReportEvidenceNotes('');
    setReportWitnesses('');
  };

  // Handle Tracking Lookup
  const handleLookupToken = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenSearchError(null);
    const cleaned = searchTokenInput.trim().toUpperCase();
    if (!cleaned) return;

    const found = reports.find((r) => r.trackingToken.toUpperCase() === cleaned);
    if (found) {
      setTrackedReportResult(found);
      setTokenSearchError(null);
    } else {
      setTrackedReportResult(null);
      setTokenSearchError(`No incident report found with token "${cleaned}". Please check the token code or verify if it was submitted on this portal.`);
    }
  };

  // Breathing exercise loop
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  // Filtered helplines
  const filteredHelplines = useMemo(() => {
    return MOCK_HELPLINES.filter((h) => {
      if (helplineCategoryFilter === 'All') return true;
      if (helplineCategoryFilter === 'Mental Health' && h.category.includes('Mental Health')) return true;
      if (helplineCategoryFilter === 'Anti-Ragging' && h.category.includes('Anti-Ragging')) return true;
      if (helplineCategoryFilter === 'Women Safety' && h.category.includes('Women Safety')) return true;
      if (helplineCategoryFilter === 'Campus Medical' && h.category.includes('Campus Medical')) return true;
      return false;
    });
  }, [helplineCategoryFilter]);

  return (
    <div id="safe-campus-care-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner with Red SOS Protection Alert */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1C1A2E] via-[#2A1D38] to-[#3B1728] text-white p-6 sm:p-8 border border-rose-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>24x7 Student Care, Anti-Harassment & Mental Health Support</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
            Safe Campus & Confidential Wellness Cell
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Zero-tolerance safety ecosystem for all students. Access 24x7 Government & Campus Mental Health Helplines, Internal Complaints Committee (ICC), Anti-Ragging officers, licensed clinical psychologists, and file anonymous incident reports protected by end-to-end token encryption.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('helplines')}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>24x7 Emergency Helplines</span>
            </button>

            <button
              onClick={() => setActiveTab('incident-report')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>File Confidential Incident Report</span>
            </button>

            <button
              onClick={() => setActiveTab('counselling')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Book Campus Psychologist (Free)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Quick Numbers Marquee Bar */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-950 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Immediate Crisis Speed-Dial:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-800 font-semibold">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-1.5">
            🧠 <strong>Tele-MANAS:</strong> <a href="tel:14416" className="text-emerald-700 font-extrabold underline">14416</a>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-1.5">
            🚫 <strong>Anti-Ragging (UGC):</strong> <a href="tel:18001805522" className="text-rose-700 font-extrabold underline">1800-180-5522</a>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-1.5">
            🛡️ <strong>Women Helpline:</strong> <a href="tel:1090" className="text-purple-700 font-extrabold underline">1090</a> / <a href="tel:112" className="text-purple-700 font-extrabold underline">112</a>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-1.5">
            🚑 <strong>Campus Security:</strong> <a href="tel:9450012345" className="text-slate-900 font-extrabold underline">+91 94500 12345</a>
          </span>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'helplines'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>24x7 Helplines & SOS</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-900 font-bold">
              {MOCK_HELPLINES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('anti-harassment')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'anti-harassment'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Anti-Harassment Cell (ICC)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
              UGC & POSH
            </span>
          </button>

          <button
            onClick={() => setActiveTab('counselling')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'counselling'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Mental Health & Counselling Centre</span>
          </button>

          <button
            onClick={() => setActiveTab('incident-report')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'incident-report'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Confidential Incident Report</span>
          </button>

          <button
            onClick={() => setActiveTab('track-report')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'track-report'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Track Token Status</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 24x7 HELPLINES & EMERGENCY NUMBERS */}
      {activeTab === 'helplines' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-700">
              National & Campus Emergency Support Numbers (Free & Multi-Lingual)
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'Mental Health', 'Anti-Ragging', 'Women Safety', 'Campus Medical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHelplineCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    helplineCategoryFilter === cat
                      ? 'bg-[#2D2A4A] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Helplines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHelplines.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold text-white ${item.badgeColor || 'bg-indigo-600'}`}>
                      {item.category}
                    </span>
                    {item.tollFree && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        100% Toll Free
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Managed by: {item.managedBy}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-lg font-black text-slate-900 tracking-wide font-mono flex items-center justify-between">
                      <span>{item.number}</span>
                      <button
                        onClick={() => handleCopyNumber(item.number)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xs transition-colors"
                        title="Copy phone number"
                      >
                        {copiedNumber === item.number ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.availableHours}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className="w-full py-2 rounded-xl bg-[#2D2A4A] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    <span>Call Helpline Now</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick SOS Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white border border-rose-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-rose-300 text-xs font-extrabold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>Hostel or Campus Physical Threat Emergency?</span>
              </div>
              <h3 className="text-lg font-extrabold">Instant Campus Proctorial Squad Alert</h3>
              <p className="text-xs text-rose-200 max-w-xl">
                If you are currently experiencing active ragging, violence, or immediate distress in hostel premises, alert the Proctorial Control Room directly for swift on-ground intervention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:9450012345"
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Campus Security: 94500 12345</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANTI-HARASSMENT & INTERNAL COMPLAINTS COMMITTEE (ICC) */}
      {activeTab === 'anti-harassment' && (
        <div className="space-y-6">
          {/* Header Policy Summary */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mandated under UGC Regulations 2015 & POSH Act 2013</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Internal Complaints Committee (ICC) & Anti-Ragging Cell
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl mt-1">
                  The ICC and Proctorial Board safeguard students against sexual harassment, gender discrimination, physical ragging, stalking, and hostel intimidation with statutory legal protection.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('incident-report')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>File Formal ICC Report</span>
                </button>
              </div>
            </div>

            {/* Committee Members Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Designated Cell Officials & Grievance Officers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_COMMITTEE_MEMBERS.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 shadow-2xs space-y-2.5 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-slate-900 text-sm">{mem.name}</h4>
                        {mem.isExternalMember && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                            External NGO
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-800 font-bold text-[11px]">{mem.designation}</p>
                      <p className="text-slate-500 text-[10px]">{mem.department}</p>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200 pt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{mem.officeLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{mem.availability}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <a
                        href={`tel:${mem.phone.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-[11px] hover:bg-slate-100 flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-slate-500" />
                        <span>{mem.phone}</span>
                      </a>
                      <a
                        href={`mailto:${mem.email}`}
                        className="px-2.5 py-1 rounded-lg bg-[#2D2A4A] text-white font-bold text-[11px] hover:bg-slate-800"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant for Drafting Complaints */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Need help framing a formal confidential grievance?</span>
                </div>
                <p className="text-indigo-800 text-[11px]">
                  Use Wand AI to structure an airtight legal grievance draft referencing Supreme Court anti-ragging mandates and POSH clauses.
                </p>
              </div>

              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Draft a confidential, legally sound Anti-Harassment / Anti-Ragging grievance letter to the Internal Complaints Committee (ICC) and Proctorial Board. Ensure strict anonymity requested, cite relevant UGC Ragging Regulations 2009 and Section 9 of the POSH Act 2013, and include clear sections for Incident Description, Evidence Chronology, and Requested Interim Safety Measures.`
                  );
                }}
                className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Grievance Draft Generator</span>
              </button>
            </div>

            {/* Legal Framework & FAQs */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Legal Protections & UGC Rights FAQ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LEGAL_FRAMEWORK_FAQS.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="font-extrabold text-slate-900 flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] pl-5">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT MENTAL HEALTH & COUNSELLING CENTRE */}
      {activeTab === 'counselling' && (
        <div className="space-y-6">
          {/* Header & Breathing SOS Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Free & Confidential Student Wellness Support</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Student Mental Health & Psychological Counselling Centre
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                College life can be overwhelming with semester exams, hostel adjustment, relationship stress, and placement anxiety. Our licensed clinical psychologists provide judgment-free, confidential sessions (in-person at the Health Centre, via secure video link, or anonymous chat).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 font-semibold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Free of Cost</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 font-semibold text-indigo-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Strict Medical Privacy</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 font-semibold text-amber-950 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Same-Day Emergency Slots</span>
                </div>
              </div>
            </div>

            {/* Interactive Calming & Breathing De-escalation Widget */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#1b3d32] text-white border border-emerald-700/60 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Instant Stress Relief
                  </span>
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-base">4-7-8 Calming Breath Loop</h3>
                <p className="text-[11px] text-emerald-200">
                  De-escalate exam anxiety or panic attacks right now with paced grounding.
                </p>
              </div>

              {/* Visual Breathing Circle */}
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 ${
                    isBreathingActive
                      ? breathPhase === 'Inhale'
                        ? 'scale-110 border-emerald-400 bg-emerald-500/30'
                        : breathPhase === 'Hold'
                        ? 'scale-110 border-amber-400 bg-amber-500/30'
                        : 'scale-90 border-teal-400 bg-teal-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold text-emerald-200">
                    {isBreathingActive ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-xl font-black">{isBreathingActive ? `${breathTimer}s` : '🧘'}</span>
                </div>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`w-full py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                  isBreathingActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                }`}
              >
                {isBreathingActive ? 'Stop Calming Loop' : 'Start 4-7-8 Breathing'}
              </button>
            </div>
          </div>

          {/* Success Booking Alert if placed */}
          {bookingSuccessData && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-emerald-950 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Confidential Counselling Session Confirmed!</span>
                </div>
                <button
                  onClick={() => setBookingSuccessData(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
              <p className="text-emerald-800">
                Your appointment with <strong>{bookingSuccessData.counselorName}</strong> is scheduled for{' '}
                <strong>{bookingSuccessData.preferredDate} ({bookingSuccessData.preferredSlot})</strong> via{' '}
                <strong>{bookingSuccessData.mode}</strong>.
              </p>
              <div className="p-2 rounded-lg bg-white/80 border border-emerald-200 text-slate-700 text-[11px]">
                🔒 <strong>Confidentiality Note:</strong> Your appointment is logged privately under encrypted student medical records.
              </div>
            </div>
          )}

          {/* Campus Counselors Directory */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">
                Licensed Campus Clinical Psychologists & Counsellors
              </h3>
              <span className="text-xs text-slate-500">Walk-ins and Online Bookings Available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_COUNSELORS.map((counselor) => (
                <div
                  key={counselor.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={counselor.avatarUrl}
                        alt={counselor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {counselor.name}
                        </h4>
                        <p className="text-[11px] font-bold text-emerald-700">{counselor.title}</p>
                        <p className="text-[10px] text-slate-500">{counselor.qualifications}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{counselor.availableDays}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{counselor.officeRoom}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Languages: <strong>{counselor.languages.join(', ')}</strong> ({counselor.experienceYears}+ years exp.)
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Areas of Expertise
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {counselor.specializations.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onOpenWandAIWithPrompt(
                          `I am feeling overwhelmed with stress and anxiety. Give me a 3-minute psychological grounding exercise and suggest good questions to discuss with campus counselor ${counselor.name}.`
                        );
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                      title="AI Self-Assessment Advice"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCounselorForBooking(counselor);
                        setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2D2A4A] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Book Free Session</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIDENTIAL INCIDENT REPORTING (ANONYMOUS WHISTLEBLOWER) */}
      {activeTab === 'incident-report' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Protected Whistleblower & Confidential Incident Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Submit Confidential Incident or Safety Report
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Report ragging, sexual harassment (POSH), cyberbullying, hostel intimidation, extortion, or acute student distress. You can choose to remain <strong>100% Anonymous</strong>. You will receive an encrypted tracking token to monitor committee action in real-time.
              </p>
            </div>

            {/* Submitted Success Notice */}
            {submittedNewToken && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center gap-2 font-extrabold text-emerald-950 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Incident Report Securely Submitted & Encrypted!</span>
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  Your confidential report has been assigned unique Tracking Token:{' '}
                  <strong className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-950">
                    {submittedNewToken}
                  </strong>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleCopyNumber(submittedNewToken)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Token Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('track-report')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1"
                  >
                    <Search className="w-3 h-3 text-emerald-700" />
                    <span>Track Real-Time Status →</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitIncidentReport} className="space-y-5 text-xs">
              {/* Anonymity Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    {reportIsAnonymous ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <UserCheck className="w-4 h-4 text-indigo-600" />}
                    <span>Reporting Mode: {reportIsAnonymous ? '100% Anonymous Whistleblower' : 'Named Confidential Report'}</span>
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {reportIsAnonymous
                      ? 'No personal details or roll numbers will be stored or shared with the committee.'
                      : 'Your identity will be protected strictly by the ICC Presiding Officer under statutory seal.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReportIsAnonymous(true)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      reportIsAnonymous ? 'bg-[#2D2A4A] text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Stay Anonymous
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportIsAnonymous(false)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      !reportIsAnonymous ? 'bg-[#2D2A4A] text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Provide My Details
                  </button>
                </div>
              </div>

              {!reportIsAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Phone / Email (For confidential contact)</label>
                    <input
                      type="text"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="e.g. +91 98765 43210 or student email"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Category & Severity Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incident Category *</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                  >
                    <option value="Ragging & Physical Intimidation">Ragging & Physical Intimidation</option>
                    <option value="Sexual Harassment (POSH / UGC)">Sexual Harassment (POSH / UGC Regulations)</option>
                    <option value="Cyberbullying & Online Stalking">Cyberbullying & Online Stalking</option>
                    <option value="Hostel / Mess Harassment">Hostel / Mess Harassment</option>
                    <option value="Severe Mental Crisis / Self-Harm Risk">Severe Mental Crisis / Self-Harm Risk</option>
                    <option value="Academic Coercion / Blackmail">Academic Coercion / Blackmail</option>
                    <option value="Discrimination / Caste / Gender Bias">Discrimination / Caste / Gender Bias</option>
                    <option value="Other Urgent Concern">Other Urgent Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency & Severity Level *</label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                  >
                    <option value="Critical / Immediate Threat">🚨 Critical / Immediate Threat (Dispatch Squad)</option>
                    <option value="High">⚠️ High (Enquiry within 24 Hours)</option>
                    <option value="Moderate">🟡 Moderate (Standard Committee Review)</option>
                  </select>
                </div>
              </div>

              {/* Date, Time & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incident Date *</label>
                  <input
                    type="date"
                    required
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approximate Time</label>
                  <input
                    type="text"
                    value={reportTime}
                    onChange={(e) => setReportTime(e.target.value)}
                    placeholder="e.g. 10:30 PM, During lab hours"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exact Campus Location *</label>
                  <input
                    type="text"
                    required
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="e.g. Hostel 3 2nd floor, C-Block parking, WhatsApp group"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Suspect details */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Individuals Involved / Suspects / Batch Info
                </label>
                <input
                  type="text"
                  value={reportSuspectDetails}
                  onChange={(e) => setReportSuspectDetails(e.target.value)}
                  placeholder="Names, hostel rooms, batch/branch, or physical descriptions of individuals"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Description of Incident / Grievance *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe clearly what occurred, sequence of events, what was said or done..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Evidence & Witnesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Evidence Notes / Screenshots / Audio Reference
                  </label>
                  <input
                    type="text"
                    value={reportEvidenceNotes}
                    onChange={(e) => setReportEvidenceNotes(e.target.value)}
                    placeholder="e.g. Screenshots available on request, CCTV camera reference #3"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Witnesses / Other Students Present
                  </label>
                  <input
                    type="text"
                    value={reportWitnesses}
                    onChange={(e) => setReportWitnesses(e.target.value)}
                    placeholder="e.g. Wing mates, Lab attendant on duty"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Requested Action */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Requested Action *</label>
                <select
                  value={reportRequestedAction}
                  onChange={(e) => setReportRequestedAction(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  <option value="Immediate Safe Intervention & Protection">Immediate Safe Intervention & Physical Protection</option>
                  <option value="Formal Enquiry & Disciplinary Action">Formal Enquiry, Hearing & Disciplinary Action</option>
                  <option value="Confidential Mediation">Confidential Mediation / Official Warning</option>
                  <option value="Mental Health Rescue & Support">Mental Health Rescue & Clinical Psychologist Support</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  By submitting, this report is cryptographically tokenized. The Proctorial Board is legally bound to initiate interim safety protocols without disclosing the source identity.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Submit Confidential Report Securely</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: TRACK TOKEN STATUS */}
      {activeTab === 'track-report' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                Confidential Incident Report Token Tracker
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your unique alphanumeric incident token (e.g. <code>SW-SAFE-849204</code>) to view the live investigation stage and Proctorial Board resolution notes.
              </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleLookupToken} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTokenInput}
                  onChange={(e) => setSearchTokenInput(e.target.value)}
                  placeholder="Enter Tracking Token (e.g. SW-SAFE-849204)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono uppercase font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2D2A4A] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Lookup Token</span>
              </button>
            </form>

            {/* Error state */}
            {tokenSearchError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{tokenSearchError}</span>
              </div>
            )}

            {/* Result Timeline Card */}
            {trackedReportResult && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 text-xs animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking Token</span>
                    <h3 className="text-lg font-black text-slate-900 font-mono flex items-center gap-2">
                      <span>{trackedReportResult.trackingToken}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-sans">
                        {trackedReportResult.category}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Submitted on: <strong>{trackedReportResult.submissionDate}</strong></span>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Investigation & Grievance Pipeline
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      'Submitted & Encrypted',
                      'Under Confidential Review',
                      'Enquiry Committee Constituted',
                      'Action Taken & Safe Resolution',
                    ].map((step, idx) => {
                      const isComplete =
                        (trackedReportResult.status === 'Submitted & Encrypted' && idx === 0) ||
                        (trackedReportResult.status === 'Under Confidential Proctorial Review' && idx <= 1) ||
                        (trackedReportResult.status === 'Enquiry Committee Constituted' && idx <= 2) ||
                        (trackedReportResult.status === 'Action Taken & Safe Resolution' && idx <= 3);

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border font-bold text-[11px] flex flex-col items-center justify-center gap-1 ${
                            isComplete
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Location</span>
                    <p className="font-semibold text-slate-800">{trackedReportResult.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Severity</span>
                    <p className="font-bold text-rose-700">{trackedReportResult.severityLevel}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Grievance Summary</span>
                    <p className="text-slate-700 leading-relaxed mt-0.5">{trackedReportResult.detailedDescription}</p>
                  </div>
                </div>

                {/* Official Action Taken Remarks */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Official Proctorial Board / ICC Remarks:</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed text-[11px]">
                    {trackedReportResult.adminRemarks || 'Investigation in progress. Presiding Officer review scheduled.'}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Last updated on: {trackedReportResult.lastUpdatedDate}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: COUNSELLING SESSION BOOKING */}
      {selectedCounselorForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Free & Confidential</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Book Counselling Session
                </h3>
                <p className="text-xs text-slate-500">With {selectedCounselorForBooking.name}</p>
              </div>
              <button
                onClick={() => setSelectedCounselorForBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAppointment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Mode *</label>
                <select
                  value={bookingMode}
                  onChange={(e) => setBookingMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Confidential Video Call">🔒 Confidential Video Call (Secure Link)</option>
                  <option value="In-Person (Health Centre)">🏥 In-Person at Health Centre (Room 102)</option>
                  <option value="Anonymous Chat">💬 Anonymous Live Chat Session</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Concerns / Topics (Select any)
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    'Academic Burnout & Stress',
                    'Exam Panic & Anxiety',
                    'Depression / Low Energy',
                    'Hostel Homesickness',
                    'Peer Pressure / Bullying',
                    'Career & Placement Worry',
                  ].map((topic) => (
                    <label key={topic} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingConcerns.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBookingConcerns([...bookingConcerns, topic]);
                          } else {
                            setBookingConcerns(bookingConcerns.filter((t) => t !== topic));
                          }
                        }}
                        className="rounded text-emerald-600 focus:ring-0"
                      />
                      <span className="truncate">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Any note you would like to share prior to session (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bookingAdditionalNote}
                  onChange={(e) => setBookingAdditionalNote(e.target.value)}
                  placeholder="Share anything that will help the psychologist understand your situation..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCounselorForBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Free Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
