import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Building2,
  GraduationCap,
  MapPin,
  Globe2,
  Languages,
  BookOpen,
  PlusCircle,
  Info,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import {
  SupportedLanguage,
  OnboardingData,
  StudentProfile,
} from '../types';
import {
  INDIAN_STATES_AND_UTS,
  INDIAN_COLLEGES_DIRECTORY,
  ACADEMIC_COURSES_MAPPING,
  ACADEMIC_YEARS,
  ACADEMIC_SEMESTERS,
  STATE_POPULAR_CITIES,
  DirectoryCollege,
} from '../data/indianStatesAndColleges';
import {
  KANPUR_COLLEGES_DATABASE,
  getKanpurDirectoryColleges,
  KanpurCollegeData,
} from '../data/kanpurColleges';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/i18n';

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
  initialProfile?: Partial<StudentProfile>;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  initialProfile,
}) => {
  // Current active step (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    initialProfile?.language || 'en'
  );
  const [country, setCountry] = useState<string>(initialProfile?.country || 'India');
  const [selectedState, setSelectedState] = useState<string>(initialProfile?.state || 'Uttar Pradesh');
  const [selectedCity, setSelectedCity] = useState<string>(initialProfile?.city || 'Kanpur');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [stateSearch, setStateSearch] = useState<string>('');

  const [studentStatus, setStudentStatus] = useState<'current_student' | 'prospective_student'>(
    initialProfile?.role === 'prospective_student' ? 'prospective_student' : 'current_student'
  );

  // College State
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(
    initialProfile?.collegeId || 'clg-kanpur-iitk'
  );
  const [selectedCollegeName, setSelectedCollegeName] = useState<string>(
    initialProfile?.collegeName || 'Indian Institute of Technology Kanpur (IIT Kanpur)'
  );
  const [collegeSearch, setCollegeSearch] = useState<string>('');
  const [collegeCategoryFilter, setCollegeCategoryFilter] = useState<string>('All');
  const [isCustomCollege, setIsCustomCollege] = useState<boolean>(
    initialProfile?.isCustomCollege || false
  );
  const [customCollegeName, setCustomCollegeName] = useState<string>('');
  const [customCollegeCity, setCustomCollegeCity] = useState<string>('');
  const [customUniversity, setCustomUniversity] = useState<string>('');
  const [customWebsite, setCustomWebsite] = useState<string>('');
  const [showManualCollegeModal, setShowManualCollegeModal] = useState<boolean>(false);

  // Prospective students multi-select
  const [interestedColleges, setInterestedColleges] = useState<string[]>(
    initialProfile?.interestedColleges || ['clg-kanpur-iitk', 'clg-kanpur-hbtu', 'clg-kanpur-csjmu']
  );

  // Academic State
  const [selectedCourse, setSelectedCourse] = useState<string>(
    initialProfile?.course || 'B.Tech'
  );
  const [customCourse, setCustomCourse] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>(
    initialProfile?.branch || 'Computer Science & Engineering (CSE)'
  );
  const [customBranch, setCustomBranch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(
    initialProfile?.year ? `${initialProfile.year}rd Year` : '3rd Year'
  );
  const [selectedSemester, setSelectedSemester] = useState<number>(
    initialProfile?.semester || 5
  );

  // Get active translation dictionary
  const t = getTranslation(selectedLanguage);

  // Filtered States
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return INDIAN_STATES_AND_UTS;
    const query = stateSearch.toLowerCase();
    return INDIAN_STATES_AND_UTS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        (s.capital && s.capital.toLowerCase().includes(query))
    );
  }, [stateSearch]);

  const stateItems = filteredStates.filter((s) => s.type === 'State');
  const utItems = filteredStates.filter((s) => s.type === 'Union Territory');

  // Popular cities for current selected state
  const popularCities = useMemo(() => {
    return STATE_POPULAR_CITIES[selectedState] || ['Capital City', 'City Center'];
  }, [selectedState]);

  // Is Kanpur specifically active?
  const isKanpurActive =
    selectedState.toLowerCase() === 'uttar pradesh' &&
    (selectedCity.toLowerCase() === 'kanpur' || selectedCity.toLowerCase().includes('kanpur'));

  // Filtered Colleges list based on state, city, category, and search query
  const filteredColleges = useMemo(() => {
    let list: DirectoryCollege[] = [];

    if (isKanpurActive) {
      // Use full rich seeded Kanpur database
      list = getKanpurDirectoryColleges();
    } else {
      // General database with Kanpur merged
      const kanpurList = getKanpurDirectoryColleges();
      list = [
        ...kanpurList,
        ...INDIAN_COLLEGES_DIRECTORY.filter((c) => !kanpurList.some((k) => k.id === c.id)),
      ];

      if (selectedState) {
        const stateFiltered = list.filter(
          (c) => c.state.toLowerCase() === selectedState.toLowerCase()
        );
        if (stateFiltered.length > 0) {
          list = stateFiltered;
        }
      }

      if (selectedCity && selectedCity !== 'All') {
        const cityFiltered = list.filter(
          (c) =>
            c.city.toLowerCase() === selectedCity.toLowerCase() ||
            c.city.toLowerCase().includes(selectedCity.toLowerCase())
        );
        if (cityFiltered.length > 0) {
          list = cityFiltered;
        }
      }
    }

    // Filter by category if not 'All'
    if (collegeCategoryFilter !== 'All') {
      list = list.filter((c) => {
        if (collegeCategoryFilter === 'Engineering & Tech') {
          return c.category === 'Engineering & Tech';
        }
        if (collegeCategoryFilter === 'Comprehensive University') {
          return c.category === 'Comprehensive University';
        }
        if (collegeCategoryFilter === 'Medical') {
          return c.category === 'Medical';
        }
        if (collegeCategoryFilter === 'Management') {
          return c.category === 'Management';
        }
        if (collegeCategoryFilter === 'Arts & Science') {
          return c.category === 'Arts & Science';
        }
        if (collegeCategoryFilter === 'Law') {
          return c.category === 'Law';
        }
        return (c.category as string) === collegeCategoryFilter;
      });
    }

    // Filter by text search
    if (collegeSearch.trim()) {
      const query = collegeSearch.toLowerCase();
      return list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.shortName.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.universityAffiliation.toLowerCase().includes(query) ||
          (c.accreditation && c.accreditation.toLowerCase().includes(query)) ||
          (c.nirfRank && c.nirfRank.toLowerCase().includes(query))
      );
    }

    return list;
  }, [isKanpurActive, selectedState, selectedCity, collegeCategoryFilter, collegeSearch]);

  // Current course branches mapping
  const currentCourseMapping = useMemo(() => {
    return (
      ACADEMIC_COURSES_MAPPING.find((c) => c.course === selectedCourse) ||
      ACADEMIC_COURSES_MAPPING[0]
    );
  }, [selectedCourse]);

  // Handle Quick Select "I'm From Kanpur"
  const handleSelectKanpurShortcut = () => {
    setSelectedState('Uttar Pradesh');
    setSelectedCity('Kanpur');
    setSelectedCollegeId('clg-kanpur-iitk');
    setSelectedCollegeName('Indian Institute of Technology Kanpur (IIT Kanpur)');
    setCurrentStep(4); // Move directly to Student Status
  };

  // Handle Manual College Submission
  const handleSaveCustomCollege = () => {
    if (!customCollegeName.trim()) return;
    setIsCustomCollege(true);
    setSelectedCollegeId(`custom-${Date.now()}`);
    setSelectedCollegeName(customCollegeName.trim());
    setShowManualCollegeModal(false);
  };

  // Handle Prospective College Toggle
  const toggleInterestedCollege = (collegeId: string) => {
    if (interestedColleges.includes(collegeId)) {
      setInterestedColleges(interestedColleges.filter((id) => id !== collegeId));
    } else {
      setInterestedColleges([...interestedColleges, collegeId]);
    }
  };

  // Final Submit
  const handleFinish = () => {
    const finalCourseName =
      selectedCourse === 'Other' && customCourse.trim()
        ? customCourse.trim()
        : selectedCourse;

    const finalBranchName =
      selectedBranch === 'Other Engineering Branch' ||
      selectedBranch === 'Other BCA Specialization' ||
      selectedBranch === 'Other BBA Stream' ||
      selectedBranch === 'Other B.Sc Branch' ||
      selectedBranch === 'Other Commerce Stream' ||
      selectedBranch === 'Other Humanities Stream' ||
      selectedBranch === 'Other Medical Stream' ||
      selectedBranch === 'Other Law Stream' ||
      selectedBranch === 'Other MBA Specialization' ||
      selectedBranch === 'Other MCA Stream' ||
      selectedBranch === 'Other M.Tech Stream' ||
      selectedBranch === 'Other Diploma Stream' ||
      selectedBranch === 'General / Custom Field of Study'
        ? customBranch.trim() || selectedBranch
        : selectedBranch;

    const onboardingPayload: OnboardingData = {
      language: selectedLanguage,
      country,
      state: selectedState,
      city: isCustomCollege ? customCollegeCity : selectedCity,
      studentStatus,
      collegeId: isCustomCollege ? `custom-${Date.now()}` : selectedCollegeId,
      collegeName: isCustomCollege ? customCollegeName : selectedCollegeName,
      isCustomCollege,
      customCollegeUniversity: customUniversity,
      customCollegeWebsite: customWebsite,
      verificationStatus: isCustomCollege ? 'Pending Verification' : 'Verified',
      interestedColleges: studentStatus === 'prospective_student' ? interestedColleges : undefined,
      course: finalCourseName,
      branch: finalBranchName,
      year: selectedYear,
      semester: selectedSemester,
      onboardingCompleted: true,
    };

    onComplete(onboardingPayload);
  };

  const totalSteps = 7;

  return (
    <div id="onboarding-container" className="min-h-screen bg-[#1F1D36] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-[#E9A03B] selection:text-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-[#1F1D36]/80 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E9A03B] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black text-xl">
            ✨
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-amber-200 bg-clip-text text-transparent">
              Student Wand
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/10 font-medium">
              India • {selectedCity || selectedState}
            </span>
          </div>
        </div>

        {/* Step Indicator & Quick Language Switch */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-indigo-200/80">
              {t.stepIndicator.replace('{0}', String(currentStep)).replace('{1}', String(totalSteps))}
            </span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#E9A03B] to-indigo-400 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Languages className="w-4 h-4 text-[#E9A03B]" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#2D2A4A] text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-auto z-10">
        {/* Step 1: Language Selection */}
        {currentStep === 1 && (
          <div className="animate-fadeIn space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '1').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.step1Title}
              </h1>
              <p className="text-sm text-slate-300">
                {t.step1Subtitle}
              </p>
            </div>

            {/* Quick English Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSelectedLanguage('en');
                  setCurrentStep(2);
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E9A03B] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.continueInEnglish}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center text-xs text-indigo-300/60 font-medium">
              — or choose your preferred Indian regional language —
            </div>

            {/* 11 Indian Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#2D2A4A] border-[#E9A03B] shadow-lg shadow-amber-500/10 ring-1 ring-[#E9A03B]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E9A03B] text-slate-950 flex items-center justify-center text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{lang.nativeName}</div>
                      <div className="text-xs text-slate-400 font-medium">{lang.name}</div>
                    </div>
                    <div className="text-[10px] text-indigo-300/70 mt-2 font-mono">
                      {lang.region}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5 max-w-xl mx-auto">
              <Info className="w-4 h-4 text-[#E9A03B] shrink-0 mt-0.5" />
              <span>{t.changeLanguageLaterNote}</span>
            </div>
          </div>
        )}

        {/* Step 2: Country Selection */}
        {currentStep === 2 && (
          <div className="animate-fadeIn space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <Globe2 className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '2').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.step2Title}
              </h1>
              <p className="text-sm text-slate-300">
                {t.step2Subtitle}
              </p>
            </div>

            {/* India Primary Option */}
            <div
              onClick={() => setCountry('India')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                country === 'India'
                  ? 'bg-gradient-to-br from-[#2D2A4A] to-[#252240] border-[#E9A03B] shadow-xl shadow-amber-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl p-3 bg-white/10 rounded-2xl shrink-0">
                  🇮🇳
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-white">
                      {t.countryIndia}
                    </h3>
                    {country === 'India' && (
                      <span className="w-6 h-6 rounded-full bg-[#E9A03B] text-slate-950 flex items-center justify-center text-xs font-bold">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.countryIndiaDesc}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/10 text-[#E9A03B] border border-amber-400/20 font-medium">
                      28 States & 8 UTs
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300 border border-indigo-400/20 font-medium">
                      NIRF, NAAC, NBA, CSJMU, AKTU, HBTU & IITK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Countries Option */}
            <div
              onClick={() => setCountry('Other')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                country === 'Other'
                  ? 'bg-[#2D2A4A] border-indigo-400 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-semibold">{t.otherCountriesOption}</span>
              </div>
              {country === 'Other' && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: State & City Selection */}
        {currentStep === 3 && (
          <div className="animate-fadeIn space-y-5">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '3').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.step3Title}
              </h1>
              <p className="text-sm text-slate-300">
                Select your Indian state and city to load verified institutions and regional resources.
              </p>
            </div>

            {/* Quick Select "I'm From Kanpur" Banner */}
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/30 text-amber-300 flex items-center justify-center text-xl shrink-0 font-bold">
                  📍
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>Kanpur Student Fast-Track</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E9A03B] text-slate-950 font-bold">
                      Pre-Loaded
                    </span>
                  </div>
                  <div className="text-xs text-indigo-200">
                    Auto-loads IIT Kanpur, HBTU, CSJMU, Axis Colleges, PSIT, KIT, DAV & 20+ institutions.
                  </div>
                </div>
              </div>
              <button
                onClick={handleSelectKanpurShortcut}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#E9A03B] hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer shrink-0 transition-all transform hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>I&apos;m From Kanpur</span>
              </button>
            </div>

            {/* State Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder={t.searchStatePlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B] focus:ring-1 focus:ring-[#E9A03B] transition-all"
              />
            </div>

            {/* State Selection Grid */}
            <div className="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scrollbar max-w-2xl mx-auto">
              {stateItems.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>{t.statesCategory}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200">
                      {stateItems.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {stateItems.map((state) => {
                      const isSelected = selectedState === state.name;
                      return (
                        <button
                          key={state.code}
                          onClick={() => {
                            setSelectedState(state.name);
                            if (state.name === 'Uttar Pradesh') {
                              setSelectedCity('Kanpur');
                            } else {
                              const cities = STATE_POPULAR_CITIES[state.name];
                              setSelectedCity(cities ? cities[0] : state.capital || 'City Center');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#2D2A4A] border-[#E9A03B] text-white shadow-sm ring-1 ring-[#E9A03B]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{state.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#E9A03B] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Union Territories */}
              {utItems.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>{t.utCategory}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-400/20 text-indigo-200">
                      {utItems.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {utItems.map((ut) => {
                      const isSelected = selectedState === ut.name;
                      return (
                        <button
                          key={ut.code}
                          onClick={() => {
                            setSelectedState(ut.name);
                            const cities = STATE_POPULAR_CITIES[ut.name];
                            setSelectedCity(cities ? cities[0] : ut.name);
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#2D2A4A] border-[#E9A03B] text-white shadow-sm ring-1 ring-[#E9A03B]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{ut.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#E9A03B] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* City Selection Panel for selected state */}
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E9A03B]" />
                  <span>Select City in {selectedState}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Active: <strong className="text-white">{selectedCity}</strong>
                </span>
              </div>

              {/* Popular Cities Chips */}
              <div className="flex flex-wrap gap-2">
                {popularCities.map((city) => {
                  const isCitySelected = selectedCity.toLowerCase() === city.toLowerCase();
                  const isKanpurPill = city === 'Kanpur';
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCitySelected
                          ? 'bg-[#E9A03B] text-slate-950 shadow-md shadow-amber-500/20'
                          : isKanpurPill
                          ? 'bg-amber-400/20 border border-amber-400/40 text-amber-200 hover:bg-amber-400/30'
                          : 'bg-white/10 border border-white/15 text-slate-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {isKanpurPill && <span>⭐</span>}
                      <span>{city}</span>
                      {isCitySelected && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>

              {/* Or Custom City Input */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  placeholder="Other City / Town name..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customCityInput.trim()) {
                      setSelectedCity(customCityInput.trim());
                      setCustomCityInput('');
                    }
                  }}
                  disabled={!customCityInput.trim()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 disabled:opacity-40 text-indigo-200 text-xs font-bold transition-all"
                >
                  Set City
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Status (Current Student vs Planning Admission) */}
        {currentStep === 4 && (
          <div className="animate-fadeIn space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '4').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.step4Title}
              </h1>
              <p className="text-sm text-slate-300">
                {t.step4Subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Current Student */}
              <div
                onClick={() => setStudentStatus('current_student')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  studentStatus === 'current_student'
                    ? 'bg-gradient-to-br from-[#2D2A4A] to-[#242140] border-[#E9A03B] shadow-xl shadow-amber-500/10 ring-1 ring-[#E9A03B]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] flex items-center justify-center text-2xl font-bold">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {t.currentStudentTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {t.currentStudentDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span>Timetable, Attendance, Fees & Faculty</span>
                  {studentStatus === 'current_student' && (
                    <span className="w-5 h-5 rounded-full bg-[#E9A03B] text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Option 2: Planning Admission */}
              <div
                onClick={() => setStudentStatus('prospective_student')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  studentStatus === 'prospective_student'
                    ? 'bg-gradient-to-br from-[#2D2A4A] to-[#242140] border-indigo-400 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-400/10 border border-indigo-400/20 text-indigo-300 flex items-center justify-center text-2xl font-bold">
                    🔍
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {t.prospectiveStudentTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {t.prospectiveStudentDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300 font-medium">
                  <span>Rankings, Cutoffs & Fit Analysis</span>
                  {studentStatus === 'prospective_student' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Smart College Selection (with Kanpur pre-population) */}
        {currentStep === 5 && (
          <div className="animate-fadeIn space-y-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '5').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {studentStatus === 'current_student' ? t.step5CurrentTitle : t.step5ProspectiveTitle}
              </h1>
              <p className="text-sm text-slate-300">
                {isKanpurActive
                  ? `Showing 20 verified higher education institutions in Kanpur, UP.`
                  : `Showing colleges & universities in ${selectedCity}, ${selectedState}.`}
              </p>
            </div>

            {/* Kanpur Database Verified Badge Banner */}
            {isKanpurActive && (
              <div className="max-w-3xl mx-auto p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#2D2A4A] to-indigo-500/15 border border-amber-400/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-[#E9A03B] flex items-center justify-center text-lg font-bold shrink-0">
                    🏛️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Kanpur Higher Education Directory Active</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        ✓ 20 Institutions Pre-Loaded
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Covers CSJMU, HBTU, IITK, CSAUA&T, Axis Colleges, PSIT, KIT, MPEC, DAV, GSVM & more.
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-indigo-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CSJMU & AKTU Aligned</span>
                </div>
              </div>
            )}

            {/* Search & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-3xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  placeholder={`Search ${isKanpurActive ? 'Kanpur colleges (e.g. Axis, HBTU, CSJMU, IIT)' : 'colleges in ' + selectedCity}...`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                <span className="text-xs text-indigo-200 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E9A03B]" />
                  <span>{selectedCity}, {selectedState}</span>
                </span>
                <button
                  onClick={() => setShowManualCollegeModal(true)}
                  className="text-xs font-bold text-[#E9A03B] hover:text-amber-300 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t.notListedButton}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-3xl mx-auto custom-scrollbar text-xs">
              {[
                'All',
                'Engineering & Tech',
                'Comprehensive University',
                'Medical',
                'Management',
                'Arts & Science',
                'Pharmacy & Health',
                'Polytechnic',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCollegeCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-medium transition-all ${
                    collegeCategoryFilter === cat
                      ? 'bg-[#E9A03B] text-slate-950 font-bold'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* If Custom College Added */}
            {isCustomCollege && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-[#E9A03B]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {selectedCollegeName}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-[#E9A03B] border border-amber-400/30 font-medium">
                        Pending Verification
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      {customCollegeCity || selectedCity} • {customUniversity || 'Self-Reported'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomCollege(false)}
                  className="text-xs text-slate-400 hover:text-rose-300 underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Colleges List Grid */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 max-w-3xl mx-auto custom-scrollbar">
              {filteredColleges.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No colleges matching &quot;{collegeSearch}&quot;. Try a different keyword or add your college manually.
                </div>
              ) : (
                filteredColleges.map((college: DirectoryCollege) => {
                  const isSelected =
                    studentStatus === 'current_student'
                      ? selectedCollegeId === college.id && !isCustomCollege
                      : interestedColleges.includes(college.id);

                  return (
                    <div
                      key={college.id}
                      onClick={() => {
                        if (studentStatus === 'current_student') {
                          setIsCustomCollege(false);
                          setSelectedCollegeId(college.id);
                          setSelectedCollegeName(college.name);
                        } else {
                          toggleInterestedCollege(college.id);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#2D2A4A] border-[#E9A03B] shadow-md ring-1 ring-[#E9A03B]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                          isSelected ? 'bg-amber-400/20 text-[#E9A03B]' : 'bg-white/10 text-slate-300'
                        }`}>
                          🏛️
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                            <span className="truncate">{college.name}</span>
                            {college.isVerified && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="text-amber-300/90 font-medium">{college.shortName}</span>
                            <span>•</span>
                            <span>{college.city}</span>
                            <span>•</span>
                            <span className="truncate">{college.universityAffiliation}</span>
                            {college.nirfRank && (
                              <>
                                <span>•</span>
                                <span className="text-[#E9A03B] font-medium shrink-0">{college.nirfRank}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#E9A03B] text-slate-950 flex items-center justify-center text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {studentStatus === 'prospective_student' && (
              <div className="text-center text-xs text-indigo-200">
                Selected <strong className="text-white">{interestedColleges.length}</strong> colleges to compare and explore
              </div>
            )}
          </div>
        )}

        {/* Step 6: Academic Details */}
        {currentStep === 6 && (
          <div className="animate-fadeIn space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[#E9A03B] text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                {t.stepIndicator.replace('{0}', '6').replace('{1}', String(totalSteps))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.step6Title}
              </h1>
              <p className="text-sm text-slate-300">
                {t.step6Subtitle}
              </p>
            </div>

            <div className="space-y-4">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                  {t.courseLabel} *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ACADEMIC_COURSES_MAPPING.map((item) => (
                    <button
                      key={item.course}
                      type="button"
                      onClick={() => {
                        setSelectedCourse(item.course);
                        if (item.branches && item.branches.length > 0) {
                          setSelectedBranch(item.branches[0]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedCourse === item.course
                          ? 'bg-[#2D2A4A] border-[#E9A03B] text-white shadow-sm ring-1 ring-[#E9A03B]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {item.course}
                    </button>
                  ))}
                </div>
                {selectedCourse === 'Other' && (
                  <input
                    type="text"
                    value={customCourse}
                    onChange={(e) => setCustomCourse(e.target.value)}
                    placeholder={t.customCoursePlaceholder}
                    className="w-full mt-2 p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                  />
                )}
              </div>

              {/* Branch / Department Selection */}
              <div>
                <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                  {t.branchLabel} *
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#2D2A4A] border border-white/20 text-xs font-medium text-white focus:outline-none focus:border-[#E9A03B]"
                >
                  {currentCourseMapping.branches.map((branch) => (
                    <option key={branch} value={branch} className="bg-[#2D2A4A] text-white">
                      {branch}
                    </option>
                  ))}
                </select>
                {selectedBranch.toLowerCase().includes('other') && (
                  <input
                    type="text"
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    placeholder={t.customBranchPlaceholder}
                    className="w-full mt-2 p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                  />
                )}
              </div>

              {/* Year and Semester Selection (For current students) */}
              {studentStatus === 'current_student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      {t.yearLabel} *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {ACADEMIC_YEARS.slice(0, 5).map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setSelectedYear(yr)}
                          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                            selectedYear === yr
                              ? 'bg-[#2D2A4A] border-[#E9A03B] text-white ring-1 ring-[#E9A03B]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      {t.semesterLabel} *
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#2D2A4A] border border-white/20 text-xs font-medium text-white focus:outline-none focus:border-[#E9A03B]"
                    >
                      {ACADEMIC_SEMESTERS.map((sem) => (
                        <option key={sem.value} value={sem.value} className="bg-[#2D2A4A] text-white">
                          {sem.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Confirmation & Review */}
        {currentStep === 7 && (
          <div className="animate-fadeIn space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#E9A03B] to-amber-500 text-slate-950 flex items-center justify-center text-3xl font-black mx-auto shadow-xl shadow-amber-500/20">
                ✨
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.confirmationTitle}
              </h1>
              <p className="text-sm text-slate-300">
                {t.confirmationSubtitle}
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2D2A4A] to-[#242140] border border-white/15 shadow-2xl space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {/* Language */}
                <div className="space-y-1">
                  <span className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                    {t.summaryLanguage}
                  </span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#E9A03B]" />
                    <span>
                      {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.nativeName} (
                      {selectedLanguage.toUpperCase()})
                    </span>
                  </div>
                </div>

                {/* Country & State & City */}
                <div className="space-y-1">
                  <span className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                    {t.summaryState} & City
                  </span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E9A03B]" />
                    <span>{selectedCity}, {selectedState}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <span className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                    {t.summaryStatus}
                  </span>
                  <div className="font-bold text-white">
                    {studentStatus === 'current_student' ? '🎓 Current Student' : '🔍 Planning Admission'}
                  </div>
                </div>

                {/* College */}
                <div className="col-span-2 sm:col-span-3 space-y-1 pt-2 border-t border-white/10">
                  <span className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                    {t.summaryCollege}
                  </span>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#E9A03B]" />
                    <span className="truncate">
                      {isCustomCollege
                        ? selectedCollegeName
                        : studentStatus === 'current_student'
                        ? selectedCollegeName
                        : `${interestedColleges.length} Selected Colleges`}
                    </span>
                    {isCustomCollege ? (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400/20 text-[#E9A03B] border border-amber-400/30 shrink-0">
                        Pending Verification
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Course & Branch */}
                <div className="col-span-2 sm:col-span-3 space-y-1 pt-2 border-t border-white/10">
                  <span className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                    {t.summaryCourse} & {t.summaryBranch}
                  </span>
                  <div className="font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#E9A03B]" />
                    <span>
                      {selectedCourse} • {selectedBranch}
                      {studentStatus === 'current_student' && ` (${selectedYear} - Sem ${selectedSemester})`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-300 border-t border-white/10">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-indigo-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.editDetails}</span>
                </button>
                <span className="text-[11px] text-slate-400">🔒 Data saved privately on your device</span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E9A03B] via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] cursor-pointer"
            >
              <span>{t.enterStudentWand}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        {currentStep < 7 && (
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A03B] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Manual Add College Modal */}
      {showManualCollegeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2D2A4A] border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-[#E9A03B]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">{t.manualAddTitle}</h3>
                  <p className="text-xs text-slate-300">Add any university or college in India</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualCollegeModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-amber-300 mb-1">
                  {t.collegeNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={customCollegeName}
                  onChange={(e) => setCustomCollegeName(e.target.value)}
                  placeholder="e.g. Government Engineering College, Meerut"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {t.cityLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={customCollegeCity || selectedCity}
                    onChange={(e) => setCustomCollegeCity(e.target.value)}
                    placeholder="e.g. Kanpur / Lucknow"
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedState}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t.universityAffiliationLabel}
                </label>
                <input
                  type="text"
                  required
                  value={customUniversity}
                  onChange={(e) => setCustomUniversity(e.target.value)}
                  placeholder="e.g. CSJM University / AKTU"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t.websiteOptionalLabel}
                </label>
                <input
                  type="url"
                  value={customWebsite}
                  onChange={(e) => setCustomWebsite(e.target.value)}
                  placeholder="https://mycollege.edu.in"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#E9A03B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-200">
                ⚠️ {t.pendingVerificationNotice}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualCollegeModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-semibold"
              >
                {t.cancelAction}
              </button>
              <button
                type="button"
                onClick={handleSaveCustomCollege}
                disabled={!customCollegeName.trim()}
                className="px-4 py-2 rounded-xl bg-[#E9A03B] hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold"
              >
                {t.addCollegeAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
