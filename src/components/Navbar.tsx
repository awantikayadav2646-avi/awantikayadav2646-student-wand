import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Bell,
  User,
  Search,
  BookOpen,
  Users,
  CreditCard,
  Building2,
  HelpCircle,
  Scale,
  MessageSquare,
  ShieldCheck,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Languages,
  SlidersHorizontal,
  Briefcase,
  Award,
  ShieldAlert,
  HeartHandshake,
  PhoneCall,
  Database,
  Download,
} from 'lucide-react';
import { UserRole, StudentProfile, NoticeItem, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/i18n';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  studentProfile: StudentProfile;
  unreadNoticesCount: number;
  onOpenNotifications: () => void;
  onOpenWandAI: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenOnboarding?: () => void;
  onChangeLanguage?: (lang: SupportedLanguage) => void;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  studentProfile,
  unreadNoticesCount,
  onOpenNotifications,
  onOpenWandAI,
  onOpenAuth,
  onOpenProfile,
  onOpenOnboarding,
  onChangeLanguage,
  onOpenInstall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = getTranslation(studentProfile.language || 'en');

  const mainNavItems = [
    { id: 'home', label: t.navHome || 'Home', icon: Compass },
    { id: 'dashboard', label: t.navDashboard || 'Dashboard', icon: LayoutDashboard, roleRestricted: false },
    { id: 'explorer', label: t.navExplorer || 'College Explorer', icon: Search },
    { id: 'alumni', label: t.navAlumni || 'Seniors & Alumni', icon: GraduationCap },
    { id: 'internships', label: t.navInternships || 'Internships & Training', icon: Briefcase },
    { id: 'safe-campus', label: t.navSafeCampus || 'Anti-Harassment & Care', icon: ShieldAlert },
    { id: 'academics', label: t.navAcademics || 'Academics', icon: BookOpen },
    { id: 'faculty', label: t.navFaculty || 'Faculty', icon: Users },
    { id: 'fees', label: t.navFees || 'Fees & Aid', icon: CreditCard },
    { id: 'problems', label: t.navProblemSolver || 'Problem Solver', icon: HelpCircle },
    { id: 'compare', label: t.navCompare || 'Compare', icon: Scale },
    { id: 'campus', label: t.navCampus || 'Campus Life', icon: Building2 },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'admin-portal', label: t.navAdmin || 'Admin Panel', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-[#2D2A4A] font-bold shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-[#2D2A4A]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#2D2A4A] font-['Outfit']">
                  Student Wand
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
                  Clean AI
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            {mainNavItems
              .filter((item) => (item.adminOnly ? userRole === 'college_admin' : true))
              .map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#2D2A4A] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-[#2D2A4A] hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
          </nav>

          {/* Right Actions & Utilities */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
              <button
                id="role-switch-current"
                onClick={() => setUserRole('current_student')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  userRole === 'current_student'
                    ? 'bg-white text-[#2D2A4A] font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Current College Student view"
              >
                Student
              </button>
              <button
                id="role-switch-prospective"
                onClick={() => setUserRole('prospective_student')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  userRole === 'prospective_student'
                    ? 'bg-white text-[#2D2A4A] font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Prospective Applicant view"
              >
                Prospective
              </button>
              <button
                id="role-switch-admin"
                onClick={() => setUserRole('college_admin')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  userRole === 'college_admin'
                    ? 'bg-white text-[#2D2A4A] font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="College Administrator view"
              >
                Admin
              </button>
            </div>

            {/* Language Switcher Pill */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
              <Languages className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <select
                value={studentProfile.language || 'en'}
                onChange={(e) => onChangeLanguage?.(e.target.value as SupportedLanguage)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs pr-1"
                title="Change language / भाषा बदलें"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Personalize / Onboarding Quick Trigger */}
            {/* Install App Action Trigger */}
            {onOpenInstall && (
              <button
                id="install-app-nav-btn"
                onClick={onOpenInstall}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs"
                title="Install Student Wand as desktop or mobile app"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Install App</span>
              </button>
            )}

            {/* Supabase Connected Database Badge */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200"
              title="Supabase PostgreSQL & REST Connected (Project: eelmvpztfrsmlmurkcew)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Supabase</span>
            </div>

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-slate-600 hover:text-[#2D2A4A] hover:bg-slate-100 text-xs font-semibold border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                title="Re-open Onboarding & College Personalization"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Personalize</span>
              </button>
            )}

            {/* SOS Anti-Harassment & Mental Health Quick Trigger */}
            <button
              id="sos-safe-nav-trigger"
              onClick={() => setCurrentTab('safe-campus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                currentTab === 'safe-campus'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
              }`}
              title="24x7 Anti-Harassment Cell & Mental Health Helpline"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="hidden sm:inline">24x7 SOS Care</span>
            </button>

            {/* Wand AI Trigger Button */}
            <button
              id="wand-ai-nav-trigger"
              onClick={onOpenWandAI}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-[#2D2A4A] text-xs font-bold shadow-xs transition-colors hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D2A4A]" />
              <span>{t.askWandAI || 'Ask Wand AI'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="notification-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full text-slate-600 hover:text-[#2D2A4A] hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Profile Avatar / Login */}
            <button
              id="user-profile-nav-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
              title="Student Profile Settings"
            >
              <div className="w-7 h-7 rounded-full bg-[#2D2A4A] text-amber-400 flex items-center justify-center font-bold text-xs">
                {studentProfile.name ? studentProfile.name.charAt(0) : 'S'}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight pr-2">
                <p className="font-bold text-[#2D2A4A] truncate max-w-[100px]">{studentProfile.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{studentProfile.state || userRole.replace('_', ' ')}</p>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setUserRole('current_student');
                }}
                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                  userRole === 'current_student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setUserRole('prospective_student');
                }}
                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                  userRole === 'prospective_student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Prospective
              </button>
              <button
                onClick={() => {
                  setUserRole('college_admin');
                }}
                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                  userRole === 'college_admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {mainNavItems
              .filter((item) => (item.adminOnly ? userRole === 'college_admin' : true))
              .map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>

          {onOpenInstall && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onOpenInstall();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Install Student Wand App</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
