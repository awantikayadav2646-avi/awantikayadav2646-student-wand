import React from 'react';
import {
  Compass,
  Sparkles,
  Search,
  BookOpen,
  CreditCard,
  Users,
  Building2,
  Scale,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  ShieldAlert,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onExploreColleges: () => void;
  onGetStarted: () => void;
  onAskWandAI: () => void;
  onSelectFeatureTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreColleges,
  onGetStarted,
  onAskWandAI,
  onSelectFeatureTab,
  userRole,
  setUserRole,
}) => {
  const featureCards = [
    {
      id: 'explorer',
      title: 'College Discovery',
      icon: Search,
      badge: 'Prospective & Transfer',
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Explore accredited institutions, cut-offs, authentic campus photos, facilities, and AI-powered "Is this college right for me?" analysis.',
    },
    {
      id: 'problems',
      title: 'AI Student Assistant & Problem Solver',
      icon: Sparkles,
      badge: 'Natural Language & Hinglish',
      color: 'from-purple-600 to-indigo-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Ask anything in Hindi, Hinglish, or English. Get step-by-step solutions for attendance shortages, fee extensions, scholarships, and exam queries.',
    },
    {
      id: 'academics',
      title: 'Academics & Study Assistant',
      icon: BookOpen,
      badge: 'Timetable & Grades',
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Interactive weekly timetable, 75% attendance planner, assignment tracking, study notes repository, and AI exam preparation assistant.',
    },
    {
      id: 'fees',
      title: 'Fees & Scholarships',
      icon: CreditCard,
      badge: 'Cost Estimator',
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Official fee breakdown, annual cost calculators, scholarship criteria (NSP, merit waivers), refund policies, and receipt tracker.',
    },
    {
      id: 'faculty',
      title: 'Faculty & Mentors Directory',
      icon: Users,
      badge: 'Research & Office Hours',
      color: 'from-rose-600 to-pink-600',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'Search professors by department and subject. View qualifications, consultation hours, student reviews, and teaching style summaries.',
    },
    {
      id: 'campus',
      title: 'Campus Life & Atmosphere',
      icon: Building2,
      badge: 'Real Experience',
      color: 'from-indigo-600 to-violet-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Honest look at student culture, annual cultural fests, active tech clubs, canteen food ratings, hostel curfew rules, and sports facilities.',
    },
    {
      id: 'compare',
      title: 'College Comparison Matrix',
      icon: Scale,
      badge: 'Multi-College AI Summary',
      color: 'from-cyan-600 to-blue-600',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Compare 2 to 4 colleges side-by-side on fees, average CTC, NIRF rankings, hostel comfort, and AI-generated best-value recommendations.',
    },
    {
      id: 'safe-campus',
      title: 'Anti-Harassment & Mental Health Care',
      icon: ShieldAlert,
      badge: '24x7 Helplines & ICC',
      color: 'from-rose-600 to-red-600',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'Zero-tolerance safety cell, Tele-MANAS & UGC anti-ragging hotlines, free licensed campus psychologists, and encrypted anonymous incident whistleblower reports.',
    },
    {
      id: 'alumni',
      title: 'Seniors & Alumni Mentorship',
      icon: GraduationCap,
      badge: 'Peer-to-Peer Wisdom',
      color: 'from-indigo-600 to-purple-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Connect directly with senior batches and alumni at Google, Microsoft, BHEL & ISRO for 1:1 guidance, interview prep, and career roadmaps.',
    },
    {
      id: 'internships',
      title: 'Internships & Industrial Training',
      icon: Briefcase,
      badge: 'AICTE & Summer Training',
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Verified summer internships, mandatory industrial training programs, stipend tracking, and interactive Kanban application board.',
    },
    {
      id: 'community',
      title: 'Student Community & Verified Reviews',
      icon: MessageSquare,
      badge: 'Peer Authenticity',
      color: 'from-fuchsia-600 to-purple-600',
      textColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      description: 'Read authentic experiences shared by verified current students and alumni with category breakdowns, pros, cons, and anti-abuse moderation.',
    },
  ];

  const journeySteps = [
    { title: 'Before Admission', desc: 'College exploration & fit analysis' },
    { title: 'Admission', desc: 'Eligibility, cut-offs & fee clarity' },
    { title: 'First Year', desc: 'Campus orientation, hostel & clubs' },
    { title: 'Academics', desc: 'Timetables, attendance & AI tutor' },
    { title: 'Campus Life', desc: 'Fests, hackathons & student addas' },
    { title: 'Exams', desc: 'Question banks & study schedules' },
    { title: 'Placements', desc: 'Resume vetting & recruiter stats' },
    { title: 'Graduation', desc: 'Alumni network & transcript requests' },
  ];

  return (
    <div id="landing-page-container" className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#2D2A4A] text-xs font-bold mb-6 shadow-xs">
            <span className="text-amber-500 font-bold">✨</span>
            <span>The All-In-One College Life & Decision Companion</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D2A4A] tracking-tight font-['Outfit'] leading-tight max-w-4xl mx-auto">
            Your College. Your Questions.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
              One Smart Companion.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-3xl mx-auto font-normal leading-relaxed">
            Student Wand brings academics, fees, faculty, campus life, college exploration, and AI-powered student problem solving together in one unified interface.
          </p>

          {/* User Persona Quick Select */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 max-w-md mx-auto">
            <button
              id="hero-select-prospective"
              onClick={() => setUserRole('prospective_student')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                userRole === 'prospective_student'
                  ? 'bg-[#2D2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 Prospective Student
            </button>
            <button
              id="hero-select-current"
              onClick={() => setUserRole('current_student')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                userRole === 'current_student'
                  ? 'bg-[#2D2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Current Student
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              id="hero-explore-colleges-btn"
              onClick={onExploreColleges}
              className="px-6 py-3 rounded-full bg-[#2D2A4A] hover:bg-[#1E1B39] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Colleges</span>
            </button>

            <button
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#2D2A4A] border border-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{userRole === 'prospective_student' ? 'Find Best Fit' : 'Open My Dashboard'}</span>
            </button>

            <button
              id="hero-ask-wand-ai-btn"
              onClick={onAskWandAI}
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-[#2D2A4A] text-xs sm:text-sm font-bold shadow-xs hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#2D2A4A]" />
              <span>Ask Wand AI</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#2D2A4A] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#2D2A4A] block">Verified Data</strong>
                Official rules & fees
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#2D2A4A] block">Peer Reviews</strong>
                Authentic campus buzz
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#2D2A4A] block">AI Problem Solver</strong>
                Hinglish & English assistance
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#2D2A4A] block">Full Lifeline</strong>
                Before & during college
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2A4A] tracking-tight font-['Outfit']">
            Complete Student Life Architecture
          </h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm">
            Everything a student needs to explore, manage, understand, and thrive in college.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={`feature-card-${feat.id}`}
                onClick={() => onSelectFeatureTab(feat.id)}
                className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-[#2D2A4A]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${feat.bgColor} ${feat.textColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#2D2A4A] group-hover:text-indigo-600 transition-colors font-['Outfit']">
                    {feat.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2D2A4A] group-hover:translate-x-1 transition-transform">
                  <span>Open {feat.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Journey Lifeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D2A4A] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Important Product Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 font-['Outfit']">
              Your Companion Throughout The Entire College Journey
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Student Wand doesn't stop after admission. It guides you from day one of college search through attendance tracking, fests, mid-terms, placements, and alumni networking.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-2xl p-3 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-[#2D2A4A] bg-amber-400 px-1.5 py-0.5 rounded-sm">
                    0{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold mt-2 text-white font-['Outfit']">
                    {step.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distinction & Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 font-['Outfit']">
                Clear Transparency & Labeling Standard
              </h4>
              <p className="text-xs text-amber-900/80 mt-0.5 max-w-2xl">
                Student Wand explicitly distinguishes between <strong>Official Verified Data</strong> (statutory fees, exam dates), <strong>Student Community Reports</strong> (canteen food, hostel vibe), and <strong>AI Summaries</strong>. The AI never fabricates official rules.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectFeatureTab('explorer')}
            className="px-5 py-2.5 rounded-full bg-[#2D2A4A] hover:bg-[#1E1B39] text-white text-xs font-bold shadow-xs whitespace-nowrap"
          >
            Explore Verified Colleges
          </button>
        </div>
      </section>
    </div>
  );
};
