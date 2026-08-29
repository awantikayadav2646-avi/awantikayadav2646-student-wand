import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Sparkles,
  Layers,
  FileText,
  HelpCircle,
  TrendingUp,
  Calculator,
  Loader2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  TimetableSlot,
  AttendanceSubject,
  AssignmentItem,
  StudyMaterialItem,
  ExamScheduleItem,
} from '../types';

interface AcademicsProps {
  timetable: TimetableSlot[];
  attendance: AttendanceSubject[];
  assignments: AssignmentItem[];
  materials: StudyMaterialItem[];
  exams: ExamScheduleItem[];
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const Academics: React.FC<AcademicsProps> = ({
  timetable,
  attendance,
  assignments,
  materials,
  exams,
  onOpenWandAIWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'attendance' | 'assignments' | 'study-ai' | 'materials' | 'exams'>('timetable');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Interactive Attendance Target Calculator State
  const [targetAttendancePct, setTargetAttendancePct] = useState<number>(75);

  // AI Study Assistant State
  const [studyAction, setStudyAction] = useState<'explain' | 'quiz' | 'plan' | 'summary'>('explain');
  const [studyTopic, setStudyTopic] = useState('Data Structures & Algorithms - Dynamic Programming');
  const [studySubject, setStudySubject] = useState('Computer Science');
  const [isStudyLoading, setIsStudyLoading] = useState(false);
  const [studyResult, setStudyResult] = useState<any>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});

  // Assignment submission simulation
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyTopic.trim()) return;
    setIsStudyLoading(true);
    setStudyResult(null);
    setSelectedQuizAnswers({});

    try {
      const res = await fetch('/api/gemini/study-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: studyAction,
          topic: studyTopic,
          subject: studySubject,
          daysUntilExam: 7,
        }),
      });
      const data = await res.json();
      setStudyResult(data.result);
    } catch (err) {
      console.error('Study assistant error:', err);
    } finally {
      setIsStudyLoading(false);
    }
  };

  const handleAssignmentSubmit = (id: string) => {
    setSubmittedIds((prev) => [...prev, id]);
  };

  return (
    <div id="academics-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Academics & Study Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Weekly timetables, 75% attendance target optimizer, homework manager, and AI exam study assistant.
            </p>
          </div>

          {/* AI Helper Trigger */}
          <button
            onClick={() => {
              setActiveTab('study-ai');
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-200 self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open AI Study Assistant</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-xs no-scrollbar">
          {[
            { id: 'timetable', label: '📅 Class Timetable' },
            { id: 'attendance', label: '📊 Attendance & 75% Calculator' },
            { id: 'assignments', label: '📝 Assignments' },
            { id: 'study-ai', label: '✨ AI Study Tutor & Quiz' },
            { id: 'materials', label: '📚 Notes & Question Banks' },
            { id: 'exams', label: '🎯 Exam Schedule' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          {/* Day Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedDay === day
                    ? 'bg-indigo-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Classes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable
              .filter((slot) => slot.day === selectedDay)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {slot.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slot.type === 'Lab'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                      {slot.subjectName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{slot.subjectCode}</p>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-0.5">
                      <p><strong>Faculty:</strong> {slot.facultyName}</p>
                      <p><strong>Venue:</strong> {slot.room}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenWandAIWithPrompt(`Explain key topics in ${slot.subjectName} (${slot.subjectCode})`)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-slate-200 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Prep for this Lecture</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE & 75% CALCULATOR TAB */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Target Calculator Widget */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-amber-300">
              <Calculator className="w-5 h-5" />
              <h3 className="text-base font-extrabold font-['Outfit'] text-white">
                Interactive 75% Attendance Requirement Planner
              </h3>
            </div>
            <p className="text-xs text-indigo-200">
              Select your goal percentage to calculate how many upcoming continuous lectures you must attend to stay safe from exam detentions.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">Target Goal:</span>
              {[75, 80, 85].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTargetAttendancePct(pct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    targetAttendancePct === pct
                      ? 'bg-amber-400 text-indigo-950 font-extrabold shadow-sm'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {pct}% Minimum
                </button>
              ))}
            </div>
          </div>

          {/* Per Subject Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendance.map((sub) => {
              const currentPct = Math.round((sub.attendedClasses / sub.totalClasses) * 100);
              const target = targetAttendancePct / 100;
              const classesNeeded = Math.max(
                0,
                Math.ceil((target * sub.totalClasses - sub.attendedClasses) / (1 - target))
              );
              const safeToBunk = Math.max(
                0,
                Math.floor((sub.attendedClasses - target * sub.totalClasses) / target)
              );
              const isSafe = currentPct >= targetAttendancePct;

              return (
                <div
                  key={sub.subjectCode}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded-sm text-slate-600">
                        {sub.subjectCode}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 font-['Outfit'] mt-1">
                        {sub.subjectName}
                      </h4>
                      <p className="text-xs text-slate-500">Teacher: {sub.facultyName}</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-xl font-extrabold font-['Outfit'] ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {currentPct}%
                      </span>
                      <span className="text-[10px] block text-slate-400">
                        {sub.attendedClasses} / {sub.totalClasses} held
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, currentPct)}%` }}
                    />
                  </div>

                  {/* Insight Pill */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                    {isSafe ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Safe! Can skip ~{safeToBunk} more classes safely.
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Must attend next {classesNeeded} continuous classes!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asg) => {
              const isSubmitted = submittedIds.includes(asg.id) || asg.status === 'Submitted' || asg.status === 'Graded';
              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-mono">
                        {asg.subjectCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSubmitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 mt-2 font-['Outfit']">
                      {asg.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{asg.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Due: <strong>{asg.dueDate}</strong></span>
                      <span>Max Marks: {asg.maxMarks}</span>
                    </div>

                    {isSubmitted ? (
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-center font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Work Uploaded & Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAssignmentSubmit(asg.id)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Solution File</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. AI STUDY ASSISTANT & QUIZ GENERATOR TAB */}
      {activeTab === 'study-ai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                AI Powered Study Assistant & Exam Practice Engine
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Input any topic to get step-by-step concepts, instant practice questions, or 7-day study timetables.
            </p>

            {/* Mode Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'explain', label: '📖 Concept Explainer' },
                { id: 'quiz', label: '🎯 Exam Practice Quiz' },
                { id: 'plan', label: '📅 7-Day Study Plan' },
                { id: 'summary', label: '📝 Quick Cheatsheet' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setStudyAction(m.id as any)}
                  className={`p-2.5 rounded-xl font-bold border transition-all ${
                    studyAction === m.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleStudySubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Target Topic / Concept</label>
                  <input
                    type="text"
                    value={studyTopic}
                    onChange={(e) => setStudyTopic(e.target.value)}
                    placeholder="e.g. Dynamic Programming, Normalization in DBMS, Fourier Transform"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={studySubject}
                    onChange={(e) => setStudySubject(e.target.value)}
                    placeholder="e.g. Operating Systems, Algorithms"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isStudyLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isStudyLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Tailored College Study Notes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Study Material</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Result View */}
          {studyResult && (
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Wand AI Generated Material
                </span>
                <span className="text-xs text-slate-400 font-mono">{studySubject}</span>
              </div>

              {/* If Quiz format */}
              {studyAction === 'quiz' && studyResult?.questions ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                    Practice Test: {studyResult.topic}
                  </h4>
                  {studyResult.questions.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Question {idx + 1}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900">{q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const optKey = opt.charAt(0);
                          const isChosen = selectedQuizAnswers[q.id] === optKey;
                          const isCorrect = q.correctAnswer === optKey;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedQuizAnswers((prev) => ({ ...prev, [q.id]: optKey }))}
                              className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all ${
                                isChosen
                                  ? isCorrect
                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selectedQuizAnswers[q.id] && (
                        <div className="mt-2 p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-slate-700">
                          <p className="font-bold text-indigo-900">
                            Answer: Option {q.correctAnswer}
                          </p>
                          <p className="mt-0.5">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Textual Explanation / Plan / Summary */
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                  {typeof studyResult === 'string' ? studyResult : JSON.stringify(studyResult, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. NOTES & QUESTION BANKS TAB */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-mono">
                      {mat.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.fileSize}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 mt-2 font-['Outfit']">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{mat.subjectName}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{mat.downloadsCount} downloads</span>
                  <button
                    onClick={() => alert(`Downloading "${mat.title}" (${mat.fileSize})`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. EXAM SCHEDULE TAB */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {ex.examType}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{ex.subjectCode}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1 font-['Outfit']">
                    {ex.subjectName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Syllabus:</strong> {ex.syllabusCovered}
                  </p>
                </div>

                <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-sm font-extrabold text-indigo-700 block font-['Outfit']">
                    {ex.date}
                  </span>
                  <span className="text-xs text-slate-500 block">{ex.time}</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">Room: {ex.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
