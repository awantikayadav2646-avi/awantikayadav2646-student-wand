import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  BookmarkPlus,
  Share2,
} from 'lucide-react';
import { College, StudentProfile, ProblemSolution } from '../types';

interface ProblemSolverProps {
  college: College;
  studentProfile: StudentProfile;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  college,
  studentProfile,
  onOpenWandAIWithPrompt,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);

  const presetQueries = [
    'Meri attendance 75% se kam hai, exam mein baithne denge kya?',
    'Semester fee payment late ho gaya hai, extension kaise milti hai?',
    'NSP Scholarship ke liye bonafide certificate aur documents kaise bante hain?',
    'Hostel room change karne ka kya procedure hai?',
    'End-sem answer sheet re-checking / re-evaluation ke liye apply kaise karein?',
    'College library se project ke liye extra books issue karwani hai',
  ];

  const handleSolve = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setSolution(null);
    setQueryInput(queryText);

    try {
      const res = await fetch('/api/gemini/problem-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          collegeContext: college,
          studentContext: studentProfile,
        }),
      });
      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
      }
    } catch (err) {
      console.error('Problem solver error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="problem-solver-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-bold">
            Hindi • Hinglish • English Support
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Grounded in Official College Rules
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
          Student Problem Solver
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-3xl">
          Stuck with attendance shortages, fee deadlines, hostel issues, or exam rules? Describe your problem naturally in your own words. Get actionable step-by-step solutions, exact room numbers, and required document checklists.
        </p>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSolve(queryInput);
          }}
          className="relative pt-2"
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Type your problem (e.g. 'Attendance short ho gayi hai', 'Fee refund rule', 'Exam re-evaluation')..."
            className="w-full pl-4 pr-28 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-indigo-200/60 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={isLoading || !queryInput.trim()}
            className="absolute right-1.5 top-3.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center gap-1 shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-950" />
            ) : (
              <>
                <span>Solve</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Preset Prompt Pills */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1.5">
            Common Student Situations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetQueries.map((query, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSolve(query)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/10 transition-colors text-left"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
            Analyzing College Ordinances & Rules...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Cross-referencing {college.name} regulations, medical waiver policies, and department procedures.
          </p>
        </div>
      )}

      {/* Structured Solution Output */}
      {solution && !isLoading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-lg space-y-6">
          {/* Top Direct Answer */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-extrabold font-['Outfit']">
                Direct Resolution Overview
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {solution.directAnswer}
            </p>
          </div>

          {/* Immediate Action Pill */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Immediate Next Action:</span>
              <span className="font-normal text-slate-800">{solution.suggestedNextAction}</span>
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div>
            <h4 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider font-['Outfit'] mb-3">
              Step-by-Step Action Plan
            </h4>
            <div className="space-y-2.5">
              {solution.stepByStepSolution.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department & Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Concerned Department & Office</span>
              </h5>
              <p className="text-indigo-800 font-extrabold">{solution.relevantDepartment}</p>
              <p className="text-slate-600"><strong>Location / Room:</strong> {solution.contactPersonOrOffice}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Required Documents Checklist</span>
              </h5>
              <ul className="space-y-1 list-disc pl-4 text-slate-700">
                {solution.requiredDocuments.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deadlines & Policies */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Deadlines & Penalty Rules:</span>
            </span>
            <p className="text-slate-600">{solution.importantDeadlinesOrRules}</p>
          </div>

          {/* Official Confirmation Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Official Disclaimer:</strong> {solution.officialConfirmationDisclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
