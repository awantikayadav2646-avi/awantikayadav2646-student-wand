import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Bell,
  ArrowRight,
  TrendingUp,
  FileText,
  Building,
  Award,
  ChevronRight,
  Send,
  UserCheck,
  Zap,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  ShieldAlert,
  HeartHandshake,
  PhoneCall,
  Lock,
} from 'lucide-react';
import {
  StudentProfile,
  College,
  TimetableSlot,
  AttendanceSubject,
  AssignmentItem,
  ExamScheduleItem,
  NoticeItem,
  EventItem,
} from '../types';
import { getTranslation } from '../data/i18n';

interface StudentDashboardProps {
  studentProfile: StudentProfile;
  activeCollege: College;
  timetable: TimetableSlot[];
  attendance: AttendanceSubject[];
  assignments: AssignmentItem[];
  exams: ExamScheduleItem[];
  notices: NoticeItem[];
  events: EventItem[];
  onOpenWandAIWithPrompt: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentProfile,
  activeCollege,
  timetable,
  attendance,
  assignments,
  exams,
  notices,
  events,
  onOpenWandAIWithPrompt,
  onNavigateTab,
}) => {
  const [quickAiInput, setQuickAiInput] = useState('');
  const [activeDay, setActiveDay] = useState<string>('Monday');

  // Overall Attendance Calculation
  const totalAttended = attendance.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalConducted = attendance.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;
  const isAttendanceSafe = overallPercentage >= 75;

  // Filter today's timetable slots
  const todayClasses = timetable.filter((t) => t.day === activeDay);

  // Pending assignments count
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');

  // Next upcoming exam
  const nextExam = exams[0];

  const handleQuickAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiInput.trim()) return;
    onOpenWandAIWithPrompt(quickAiInput.trim());
    setQuickAiInput('');
  };

  const t = getTranslation(studentProfile.language || 'en');
  const collegeDisplayName = studentProfile.collegeName || activeCollege.name;

  return (
    <div id="student-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 12-Column Grid Layout matching Clean Minimalism design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Welcome, Schedule, Quick Actions, Attendance & Assignments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A4A] font-['Outfit']">
                    {t.welcomeTitle ? t.welcomeTitle.replace('✨', '').trim() : 'Welcome back'}, {studentProfile.name.split(' ')[0]}! 👋
                  </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  You have {todayClasses.length} lectures and {pendingAssignments.length} assignments due this week at <strong className="text-slate-700 font-semibold">{collegeDisplayName}</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {(studentProfile.city || studentProfile.state) && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {studentProfile.city ? `${studentProfile.city}, ` : ''}{studentProfile.state}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {studentProfile.course} {studentProfile.branch ? `(${studentProfile.branch})` : ''} • Sem {studentProfile.semester}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-mono font-semibold">
                    Roll: {studentProfile.rollNumber}
                  </span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100/80 text-center sm:text-right shrink-0">
                <span className="text-indigo-600 font-bold text-2xl font-['Outfit'] block leading-none">
                  {overallPercentage}%
                </span>
                <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mt-1">
                  Attendance
                </p>
              </div>
            </div>
          </div>

          {/* Schedule and Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Schedule Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest">
                    Today's Schedule
                  </h3>
                  {/* Day Picker */}
                  <div className="flex gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => {
                      const fullDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i];
                      const isSelected = activeDay === fullDay;
                      return (
                        <button
                          key={d}
                          onClick={() => setActiveDay(fullDay)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                            isSelected ? 'bg-[#2D2A4A] text-white' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {todayClasses.length > 0 ? (
                    todayClasses.slice(0, 3).map((slot, index) => (
                      <div
                        key={slot.id}
                        className={`flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 ${
                          index > 0 ? 'opacity-80' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-10 rounded-full shrink-0 ${
                            index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-blue-400' : 'bg-purple-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#2D2A4A] truncate">{slot.subjectName}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {slot.time.split(' - ')[0]} • Room {slot.room}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                          {slot.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No classes for {activeDay}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigateTab('academics')}
                  className="text-[#2D2A4A] text-[10px] font-bold tracking-wider uppercase hover:text-indigo-600 flex items-center gap-1"
                >
                  <span>View All Timetable</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
              <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div
                  onClick={() => onNavigateTab('safe-campus')}
                  className="p-3 sm:p-4 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">🛡️</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-rose-900 tracking-wider uppercase text-center">SOS & CARE</span>
                </div>
                <div
                  onClick={() => onNavigateTab('alumni')}
                  className="p-3 sm:p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">🎓</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-indigo-900 tracking-wider uppercase text-center">ALUMNI Q&A</span>
                </div>
                <div
                  onClick={() => onNavigateTab('internships')}
                  className="p-3 sm:p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">💼</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-900 tracking-wider uppercase text-center">INTERNSHIPS</span>
                </div>
                <div
                  onClick={() => onNavigateTab('fees')}
                  className="p-3 sm:p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">🧾</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 tracking-wider uppercase text-center">PAY FEES</span>
                </div>
                <div
                  onClick={() => onNavigateTab('academics')}
                  className="p-3 sm:p-4 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">📝</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-blue-800 tracking-wider uppercase text-center">NOTES AI</span>
                </div>
                <div
                  onClick={() => onNavigateTab('problems')}
                  className="p-3 sm:p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100/80 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">💡</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-green-800 tracking-wider uppercase text-center">PROBLEM SOLVER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Support, Anti-Harassment & Mental Health Alert Strip */}
          <div
            onClick={() => onNavigateTab('safe-campus')}
            className="p-5 rounded-3xl bg-gradient-to-r from-[#2A1526] via-[#3B1C2E] to-[#1C172E] text-white border border-rose-900/40 shadow-xs cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 animate-pulse" />
                    <span>24x7 Student Care & Safety</span>
                  </span>
                  <span className="text-[11px] text-rose-300 font-medium">Zero Tolerance for Ragging & Harassment</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold font-['Outfit']">
                  Anti-Harassment Cell, Mental Health Support & Confidential Incident Reporting
                </h4>
                <p className="text-xs text-slate-300">
                  National Helplines (Tele-MANAS: <strong className="text-emerald-300">14416</strong>, Anti-Ragging: <strong className="text-rose-300">1800-180-5522</strong>), Internal Complaints Committee (ICC), free campus psychologist bookings, and encrypted anonymous reporting.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Access Safe Hub →</span>
                </span>
              </div>
            </div>
          </div>

          {/* Seniors Discussion & AICTE Summer Internship Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onNavigateTab('alumni')}
              className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-[#2D2A4A] text-white border border-indigo-800/60 shadow-xs cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  Senior Advice
                </span>
                <span className="text-xs text-indigo-300 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore Hub →
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                Ask Verified Seniors & Alumni
              </h4>
              <p className="text-xs text-indigo-200 mt-1 leading-relaxed line-clamp-2">
                Get interview tips, GATE study plans, and 1:1 mentorship from Google, Microsoft, BHEL & Zomato alumni.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('internships')}
              className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#16382b] to-[#0f281e] text-white border border-emerald-800/60 shadow-xs cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950">
                  AICTE Approved
                </span>
                <span className="text-xs text-emerald-300 font-semibold group-hover:translate-x-1 transition-transform">
                  View Internships →
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                Summer Internships & Industrial Training
              </h4>
              <p className="text-xs text-emerald-200 mt-1 leading-relaxed line-clamp-2">
                Mandatory 6-week summer trainings, HAL Kanpur, TCS, IITK Technopark, and application Kanban tracker.
              </p>
            </div>
          </div>

          {/* Attendance Tracker & Assignments Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest">
                Attendance Tracker (75% Threshold)
              </h3>
              <button
                onClick={() => onNavigateTab('academics')}
                className="text-indigo-600 text-xs font-bold hover:underline"
              >
                Detailed Ledger
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attendance.slice(0, 4).map((sub) => {
                const subPct = Math.round((sub.attendedClasses / sub.totalClasses) * 100);
                const isSubSafe = subPct >= sub.targetPercentage;
                const neededFor75 = Math.max(0, Math.ceil((0.75 * sub.totalClasses - sub.attendedClasses) / 0.25));

                return (
                  <div key={sub.subjectCode} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#2D2A4A] truncate max-w-[170px]">
                          {sub.subjectName}
                        </h4>
                        <p className="text-[10px] text-slate-400">{sub.subjectCode}</p>
                      </div>
                      <span className={`text-xs font-extrabold ${isSubSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {subPct}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isSubSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, subPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{sub.attendedClasses} / {sub.totalClasses} classes</span>
                      <span>
                        {isSubSafe ? (
                          <span className="text-emerald-700 font-semibold">Safe</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Need {neededFor75} classes</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Wand AI Assistant Card & Campus Buzz */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Wand AI Assistant Card */}
          <div className="bg-[#2D2A4A] rounded-3xl p-6 text-white shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-amber-400 opacity-20 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-7 h-7 bg-amber-400 rounded-xl flex items-center justify-center text-[#2D2A4A] font-bold">
                  <Sparkles className="w-4 h-4 text-[#2D2A4A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Wand AI Assistant</h3>
                  <p className="text-[10px] text-slate-300">Ready in English, Hindi & Hinglish</p>
                </div>
              </div>

              {/* Sample AI Dialog Bubble */}
              <div className="flex flex-col space-y-3 mb-4">
                <div className="bg-white/10 p-3.5 rounded-2xl rounded-bl-none text-xs leading-relaxed text-slate-200">
                  Hey {studentProfile.name.split(' ')[0]}! Need help with attendance shortage waiver, fee receipts, or syllabus breakdown?
                </div>
                <button
                  type="button"
                  onClick={() => onOpenWandAIWithPrompt('How to apply for the Merit Scholarship?')}
                  className="bg-amber-400 hover:bg-amber-300 text-[#2D2A4A] p-3 rounded-2xl rounded-br-none text-xs font-semibold self-end text-left transition-colors shadow-xs"
                >
                  How to apply for the Merit Scholarship?
                </button>
              </div>
            </div>

            {/* AI Prompt Input Bar */}
            <form onSubmit={handleQuickAiSubmit} className="bg-white/10 rounded-2xl p-2.5 flex items-center border border-white/15">
              <input
                type="text"
                value={quickAiInput}
                onChange={(e) => setQuickAiInput(e.target.value)}
                placeholder="Solve a problem or ask a question..."
                className="bg-transparent text-xs outline-none flex-1 placeholder-white/40 text-white pr-2"
              />
              <button
                type="submit"
                className="w-7 h-7 bg-amber-400 text-[#2D2A4A] rounded-xl flex items-center justify-center font-bold hover:bg-amber-300 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Campus Buzz Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest mb-3">
              Campus Buzz
            </h3>
            {events.length > 0 ? (
              <div
                onClick={() => onNavigateTab('campus')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-28 rounded-2xl p-4 flex flex-col justify-end text-white overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity"
              >
                <div className="z-10">
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    {events[0].category} • {events[0].date}
                  </p>
                  <p className="text-base font-bold font-['Outfit']">{events[0].title}</p>
                </div>
                <div className="absolute right-3 bottom-1 text-5xl opacity-20 select-none">
                  🎉
                </div>
              </div>
            ) : null}

            <div className="mt-3 text-center">
              <button
                onClick={() => onNavigateTab('campus')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View All Campus Events →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
