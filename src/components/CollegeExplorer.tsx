import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  BookOpen,
  Building,
  CreditCard,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Trophy,
  Utensils,
  Wifi,
  HeartPulse,
  Laptop,
  Lightbulb,
  Phone,
  Mail,
  Globe,
  HelpCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { College, CollegeFitEvaluation } from '../types';

interface CollegeExplorerProps {
  colleges: College[];
  onCompareCollege: (college: College) => void;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const CollegeExplorer: React.FC<CollegeExplorerProps> = ({
  colleges,
  onCompareCollege,
  onOpenWandAIWithPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [maxBudget, setMaxBudget] = useState<number>(300000);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<string>('overview');

  // "Is This College Right For Me?" AI Evaluator State
  const [fitBudget, setFitBudget] = useState('200000');
  const [fitCourse, setFitCourse] = useState('B.Tech in Computer Science');
  const [fitCareerGoal, setFitCareerGoal] = useState('Software Engineer in Top Tech');
  const [fitHostel, setFitHostel] = useState('Hostel with AC required');
  const [fitPriorities, setFitPriorities] = useState('High placements, coding culture, active clubs');
  const [isEvaluatingFit, setIsEvaluatingFit] = useState(false);
  const [fitResult, setFitResult] = useState<CollegeFitEvaluation | null>(null);

  const cities = ['All', ...Array.from(new Set(colleges.map((c) => c.location.city)))];

  // Filter colleges
  const filteredColleges = colleges.filter((clg) => {
    const matchesSearch =
      clg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clg.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clg.courses.some((crs) => crs.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = selectedCity === 'All' || clg.location.city === selectedCity;
    const matchesBudget = clg.feeStructure.tuitionFeePerYear <= maxBudget;

    const matchesDegree =
      selectedDegree === 'All' ||
      clg.courses.some((crs) => crs.degree.toLowerCase().includes(selectedDegree.toLowerCase()));

    return matchesSearch && matchesCity && matchesBudget && matchesDegree;
  });

  const handleEvaluateFit = async () => {
    if (!selectedCollege) return;
    setIsEvaluatingFit(true);
    setFitResult(null);

    try {
      const res = await fetch('/api/gemini/college-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college: selectedCollege,
          preferences: {
            budget: fitBudget,
            course: fitCourse,
            careerGoal: fitCareerGoal,
            hostelPreference: fitHostel,
            priorities: fitPriorities,
          },
        }),
      });
      const data = await res.json();
      if (data.fitAnalysis) {
        setFitResult(data.fitAnalysis);
      }
    } catch (err) {
      console.error('Fit eval error:', err);
    } finally {
      setIsEvaluatingFit(false);
    }
  };

  const renderFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-amber-600" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-rose-600" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-emerald-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-red-600" />;
      case 'Lightbulb':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-indigo-600" />;
      default:
        return <Building className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div id="college-explorer-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search & Filter Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            College Explorer & Admission Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Search verified colleges, inspect real campus reports, compare cut-offs, and run AI personalized suitability checks.
          </p>
        </div>

        {/* Search Bar & City Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by college name, city, course (e.g. 'B.Tech CSE', 'Bengaluru')..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Locations' : city}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Degrees & Streams</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="BBA">BBA / Management</option>
              <option value="B.Com">B.Com / Finance</option>
              <option value="B.A.">B.A. / Humanities</option>
            </select>
          </div>
        </div>

        {/* Quick City & Category Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick City:</span>
          {['All', 'Kanpur', 'Delhi NCR', 'Bengaluru', 'Mumbai', 'Chennai', 'Pune'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : c === 'Kanpur'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c === 'Kanpur' ? '🏛️ Kanpur' : c === 'All' ? 'All Locations' : c}
            </button>
          ))}
        </div>

        {/* Budget Filter & Quick Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-bold text-slate-700 whitespace-nowrap">
              Max Annual Tuition: Rs. {maxBudget.toLocaleString()}
            </span>
            <input
              type="range"
              min="30000"
              max="300000"
              step="10000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-32 sm:w-48 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="text-slate-500 font-medium">
            Showing <strong className="text-indigo-700">{filteredColleges.length}</strong> accredited colleges
          </div>
        </div>
      </div>

      {/* College Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((clg) => (
          <div
            key={clg.id}
            id={`college-card-${clg.id}`}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* College Banner & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={clg.bannerImage}
                  alt={clg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                    <ShieldCheck className="w-3 h-3" />
                    {clg.verificationStatus}
                  </span>
                  {clg.rankings?.[0] && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-xs">
                      #{clg.rankings[0].rank} {clg.rankings[0].agency.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-indigo-200 block uppercase tracking-wider">
                    {clg.affiliation}
                  </span>
                  <h3 className="text-base font-extrabold font-['Outfit'] leading-snug drop-shadow-xs line-clamp-1">
                    {clg.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {clg.location.city}, {clg.location.state}
                  </span>
                  <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {clg.overallRating} ({clg.totalReviewsCount})
                  </span>
                </div>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tuition / Year</span>
                    <span className="font-extrabold text-slate-900">
                      Rs. {clg.feeStructure.tuitionFeePerYear.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Avg Placement</span>
                    <span className="font-extrabold text-emerald-600">
                      {clg.placementHistory[0]?.avgPackageLPA || '9.8'} LPA
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Cut-Off</span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {clg.courses[0]?.cutOffRankOrPercentile.split(':')[1] || '88%+'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Hostel Curfew</span>
                    <span className="font-semibold text-slate-700">
                      {clg.campusLife.hostelCurfewTime}
                    </span>
                  </div>
                </div>

                {/* Courses Offered Chips */}
                <div className="flex flex-wrap gap-1">
                  {clg.courses.slice(0, 3).map((crs) => (
                    <span
                      key={crs.id}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {crs.name.split(' in ')[1] || crs.name}
                    </span>
                  ))}
                  {clg.courses.length > 3 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      +{clg.courses.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCollege(clg);
                  setActiveDetailTab('overview');
                  setFitResult(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Full Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSelectedCollege(clg);
                  setActiveDetailTab('fit-evaluator');
                  setFitResult(null);
                }}
                className="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-200 transition-colors flex items-center gap-1"
                title="Is this college right for me?"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Fit Check</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deep College Detail Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white p-6 shrink-0">
              <button
                onClick={() => setSelectedCollege(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pr-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      {selectedCollege.verificationStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-bold">
                      Est. {selectedCollege.establishedYear}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] mt-1">
                    {selectedCollege.name}
                  </h2>
                  <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{selectedCollege.location.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onOpenWandAIWithPrompt(
                        `Tell me all key admission requirements and placement insights about ${selectedCollege.name}`
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI About This College</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs inside Modal */}
              <div className="flex items-center gap-1 overflow-x-auto mt-5 pt-3 border-t border-white/10 text-xs no-scrollbar">
                {[
                  { id: 'overview', label: 'Overview & Facilities' },
                  { id: 'courses', label: 'Courses & Cut-offs' },
                  { id: 'campus', label: 'Campus Life & Vibe' },
                  { id: 'placements', label: 'Placements & CTC' },
                  { id: 'fees', label: 'Fees & Scholarships' },
                  { id: 'fit-evaluator', label: '✨ Is This Right For Me?' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      activeDetailTab === tab.id
                        ? 'bg-white text-indigo-950 shadow-sm'
                        : 'text-indigo-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body with Scroll */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">
              {/* TAB 1: OVERVIEW */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider font-['Outfit']">
                      About Institution
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {selectedCollege.overview}
                    </p>
                  </div>

                  {/* Accreditations & Key Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Accreditation</span>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">{selectedCollege.accreditation}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Affiliation</span>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">{selectedCollege.affiliation}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Nearest Transit</span>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                        {selectedCollege.location.nearestMetroOrStation}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Helpline</span>
                      <p className="text-xs font-extrabold text-indigo-700 mt-0.5">{selectedCollege.contact.admissionHelpline}</p>
                    </div>
                  </div>

                  {/* Facilities Grid */}
                  <div>
                    <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider font-['Outfit'] mb-3">
                      Campus Facilities & Infrastructure
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedCollege.facilities.map((fac, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                            {renderFacilityIcon(fac.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">{fac.name}</h4>
                              <span className="text-[10px] font-bold text-amber-700">★ {fac.rating}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{fac.description}</p>
                            <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700">
                              {fac.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Management & Leadership */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                    <h3 className="text-xs font-bold uppercase text-indigo-900 tracking-wider font-['Outfit'] mb-2">
                      Leadership & Academic Administration
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <p>
                        <strong>Director / VC:</strong> {selectedCollege.managementInfo.directorName}
                      </p>
                      <p>
                        <strong>Dean Academics:</strong> {selectedCollege.managementInfo.deanAcademics}
                      </p>
                      <p>
                        <strong>Dean Student Affairs:</strong> {selectedCollege.managementInfo.deanStudentAffairs}
                      </p>
                      <p>
                        <strong>Grievance Redressal:</strong> {selectedCollege.managementInfo.grievanceOfficer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeDetailTab === 'courses' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider font-['Outfit']">
                    Undergraduate & Postgraduate Degree Programs
                  </h3>
                  <div className="space-y-3">
                    {selectedCollege.courses.map((crs) => (
                      <div key={crs.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                              {crs.degree} • {crs.duration}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 mt-1 font-['Outfit']">
                              {crs.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">Annual Tuition</span>
                            <span className="text-sm font-extrabold text-indigo-700">
                              Rs. {crs.annualFee.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Eligibility</span>
                            <span className="text-slate-700">{crs.eligibility}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Cut-Off Requirement</span>
                            <span className="font-semibold text-slate-800">{crs.cutOffRankOrPercentile}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Placement & Avg Package</span>
                            <span className="font-bold text-emerald-600">
                              {crs.placementRate}% Placed ({crs.avgPackageLPA} LPA Avg)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CAMPUS LIFE */}
              {activeDetailTab === 'campus' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 font-['Outfit'] mb-1">
                      Campus Culture & Atmosphere Report
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedCollege.campusLife.cultureOverview}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      <strong>Community Vibe:</strong> {selectedCollege.campusLife.studentCommunityVibe}
                    </p>
                  </div>

                  {/* Vitals Grid: Pressure, Attendance, Curfew, Food */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="text-[10px] font-bold text-purple-700 uppercase">Academic Pressure</span>
                      <p className="text-xs font-extrabold text-purple-900 mt-1">
                        {selectedCollege.campusLife.academicPressureLevel}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">Attendance Policy</span>
                      <p className="text-xs font-extrabold text-blue-900 mt-1">
                        {selectedCollege.campusLife.attendanceMandatoryPercentage}% Strictly Checked
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Hostel Curfew</span>
                      <p className="text-xs font-extrabold text-amber-900 mt-1">
                        {selectedCollege.campusLife.hostelCurfewTime}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Canteen Food Score</span>
                      <p className="text-xs font-extrabold text-emerald-900 mt-1">
                        ★ {selectedCollege.campusLife.canteenFoodRating} / 5.0
                      </p>
                    </div>
                  </div>

                  {/* Annual Fests */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-['Outfit'] mb-2">
                      Annual Fests & Celebrations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedCollege.campusLife.annualFests.map((fest, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                            {fest.month} • {fest.type}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 mt-1">{fest.name}</h5>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">{fest.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PLACEMENTS */}
              {activeDetailTab === 'placements' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                      <span className="text-xs font-bold text-emerald-800 uppercase">Highest CTC (2024)</span>
                      <p className="text-2xl font-extrabold text-emerald-900 mt-1 font-['Outfit']">
                        {selectedCollege.placementHistory[0]?.highestPackageLPA} LPA
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                      <span className="text-xs font-bold text-blue-800 uppercase">Average CTC (2024)</span>
                      <p className="text-2xl font-extrabold text-blue-900 mt-1 font-['Outfit']">
                        {selectedCollege.placementHistory[0]?.avgPackageLPA} LPA
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                      <span className="text-xs font-bold text-indigo-800 uppercase">Overall Placement Rate</span>
                      <p className="text-2xl font-extrabold text-indigo-900 mt-1 font-['Outfit']">
                        {selectedCollege.placementHistory[0]?.placementPercentage}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-['Outfit'] mb-2">
                      Top Recurring Recruiters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollege.placementHistory[0]?.topRecruiters.map((rec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FEES & SCHOLARSHIPS */}
              {activeDetailTab === 'fees' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider font-['Outfit'] mb-3">
                      Official Fee Schedule
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Tuition (Yearly)</span>
                        <span className="font-extrabold text-slate-900">
                          Rs. {selectedCollege.feeStructure.tuitionFeePerYear.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Hostel & Mess</span>
                        <span className="font-extrabold text-slate-900">
                          Rs. {selectedCollege.feeStructure.hostelFeePerYear.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Examination Fee</span>
                        <span className="font-extrabold text-slate-900">
                          Rs. {selectedCollege.feeStructure.examFeePerYear.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Caution Deposit (Refundable)</span>
                        <span className="font-extrabold text-slate-900">
                          Rs. {selectedCollege.feeStructure.refundableDeposit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scholarships Available */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-['Outfit'] mb-2">
                      Scholarships & Financial Aid
                    </h4>
                    <div className="space-y-2">
                      {selectedCollege.scholarships.map((sch, i) => (
                        <div key={i} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-200 text-amber-900">
                              {sch.source}
                            </span>
                            <h5 className="font-bold text-slate-900 mt-1">{sch.name}</h5>
                            <p className="text-[11px] text-slate-600 mt-0.5">Eligibility: {sch.eligibility}</p>
                          </div>
                          <span className="font-extrabold text-amber-800 text-right shrink-0">
                            {sch.amountOrDiscount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: "IS THIS COLLEGE RIGHT FOR ME?" AI EVALUATOR */}
              {activeDetailTab === 'fit-evaluator' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 p-5 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h3 className="text-base font-extrabold font-['Outfit']">
                        Personalized AI Compatibility Analyzer
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Tell Wand AI your target budget, career aspirations, and preferences. The AI will evaluate whether{' '}
                      <strong>{selectedCollege.name}</strong> is the optimal investment for your future.
                    </p>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Your Max Target Budget / Year (Rs.)</label>
                        <input
                          type="number"
                          value={fitBudget}
                          onChange={(e) => setFitBudget(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Preferred Field / Course</label>
                        <input
                          type="text"
                          value={fitCourse}
                          onChange={(e) => setFitCourse(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Career Goal</label>
                        <input
                          type="text"
                          value={fitCareerGoal}
                          onChange={(e) => setFitCareerGoal(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Hostel Preference</label>
                        <input
                          type="text"
                          value={fitHostel}
                          onChange={(e) => setFitHostel(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="font-bold text-slate-700 block mb-1 text-xs">What matters most to you?</label>
                      <input
                        type="text"
                        value={fitPriorities}
                        onChange={(e) => setFitPriorities(e.target.value)}
                        placeholder="e.g. Startup incubation, high average CTC, sports facilities, lenient attendance"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      onClick={handleEvaluateFit}
                      disabled={isEvaluatingFit}
                      className="mt-4 w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isEvaluatingFit ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyzing College Data & Compatibility...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Generate My Personalized Verdict</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Evaluation Output */}
                  {fitResult && (
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white border-2 border-indigo-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider">
                            AI Compatibility Verdict
                          </span>
                          <h4 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                            {fitResult.verdict} ({fitResult.fitScorePercentage}% Fit Score)
                          </h4>
                          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                            {fitResult.executiveSummary}
                          </p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center font-extrabold font-['Outfit'] shrink-0 shadow-md">
                          <span className="text-xl">{fitResult.fitScorePercentage}%</span>
                          <span className="text-[9px] uppercase">Match</span>
                        </div>
                      </div>

                      {/* Pros vs Challenges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                          <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Why This Fits You Well</span>
                          </h5>
                          <ul className="space-y-1.5 text-slate-700">
                            {fitResult.prosForUser.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                          <h5 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Potential Challenges & Watchouts</span>
                          </h5>
                          <ul className="space-y-1.5 text-slate-700">
                            {fitResult.potentialChallenges.map((c, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Detailed Analyses */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-800 block mb-1">💰 Budget Breakdown</span>
                          <p className="text-slate-600">{fitResult.budgetAnalysis}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-800 block mb-1">🎯 Career Alignment</span>
                          <p className="text-slate-600">{fitResult.academicAndCareerAlignment}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-800 block mb-1">🏫 Campus Culture Fit</span>
                          <p className="text-slate-600">{fitResult.campusCultureFit}</p>
                        </div>
                      </div>

                      {/* Suggested Questions to Ask Faculty */}
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                        <span className="font-bold text-indigo-900 block mb-2 font-['Outfit']">
                          💡 Smart Questions to Ask During Your Campus Visit / Admission Enquiry:
                        </span>
                        <ul className="space-y-1 text-slate-700">
                          {fitResult.suggestedQuestionsToAskFaculty.map((q, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-indigo-600 font-bold">{i + 1}.</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Official information verified via college registry.
              </span>
              <button
                onClick={() => setSelectedCollege(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
