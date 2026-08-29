import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { College, CollegeComparisonMatrix } from '../types';

interface CollegeCompareProps {
  colleges: College[];
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const CollegeCompare: React.FC<CollegeCompareProps> = ({
  colleges,
  onOpenWandAIWithPrompt,
}) => {
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>([colleges[0]?.id, colleges[1]?.id]);
  const [studentPriority, setStudentPriority] = useState('High placements with reasonable tuition fees');
  const [isComparing, setIsComparing] = useState(false);
  const [aiComparison, setAiComparison] = useState<CollegeComparisonMatrix | null>(null);

  const selectedColleges = colleges.filter((c) => selectedCollegeIds.includes(c.id));

  const toggleSelectCollege = (id: string) => {
    if (selectedCollegeIds.includes(id)) {
      if (selectedCollegeIds.length <= 2) {
        alert('Please keep at least 2 colleges selected for comparison.');
        return;
      }
      setSelectedCollegeIds(selectedCollegeIds.filter((cid) => cid !== id));
    } else {
      if (selectedCollegeIds.length >= 4) {
        alert('You can compare up to 4 colleges simultaneously.');
        return;
      }
      setSelectedCollegeIds([...selectedCollegeIds, id]);
    }
  };

  const handleRunAiComparison = async () => {
    setIsComparing(true);
    setAiComparison(null);

    try {
      const res = await fetch('/api/gemini/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colleges: selectedColleges,
          studentPriorities: studentPriority,
        }),
      });
      const data = await res.json();
      if (data.comparison) {
        setAiComparison(data.comparison);
      }
    } catch (err) {
      console.error('Compare AI error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div id="college-compare-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Multi-College Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Compare 2 to 4 colleges side-by-side on verified fees, placement track records, hostel rules, and run AI trade-off evaluations.
            </p>
          </div>

          <button
            onClick={handleRunAiComparison}
            disabled={isComparing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all shrink-0 self-start sm:self-center disabled:opacity-50"
          >
            {isComparing ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>Generate AI Comparison Report</span>
          </button>
        </div>

        {/* Selected Colleges Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs no-scrollbar">
          <span className="font-bold text-slate-500 text-[11px] uppercase shrink-0">Selected ({selectedColleges.length}/4):</span>
          {colleges.map((clg) => {
            const isSelected = selectedCollegeIds.includes(clg.id);
            return (
              <button
                key={clg.id}
                onClick={() => toggleSelectCollege(clg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{clg.name.split(' ')[0]} {clg.name.split(' ')[1] || ''}</span>
                {isSelected ? <X className="w-3 h-3 opacity-80" /> : <Plus className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider w-48 shrink-0">
                  Feature / Parameter
                </th>
                {selectedColleges.map((clg) => (
                  <th key={clg.id} className="p-4 font-extrabold text-slate-900 font-['Outfit'] min-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{clg.name}</span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                      {clg.location.city}, {clg.location.state}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Tuition Fee / Year</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-extrabold text-slate-900">
                    Rs. {clg.feeStructure.tuitionFeePerYear.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Average CTC (LPA)</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-extrabold text-emerald-600">
                    {clg.placementHistory[0]?.avgPackageLPA} LPA
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Highest CTC (LPA)</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-extrabold text-slate-900">
                    {clg.placementHistory[0]?.highestPackageLPA} LPA
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">NIRF Ranking</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-bold text-amber-700">
                    #{clg.rankings[0]?.rank || 'Unranked'} ({clg.rankings[0]?.agency})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Hostel Fee (Annual)</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4">
                    Rs. {clg.feeStructure.hostelFeePerYear.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Hostel Curfew</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-medium">
                    {clg.campusLife.hostelCurfewTime}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Attendance Strictness</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-medium">
                    {clg.campusLife.attendanceMandatoryPercentage}% Mandatory
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Canteen & Mess Score</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-bold text-amber-700">
                    ★ {clg.campusLife.canteenFoodRating} / 5.0
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Overall Rating</td>
                {selectedColleges.map((clg) => (
                  <td key={clg.id} className="p-4 font-bold text-indigo-700">
                    ★ {clg.overallRating} ({clg.totalReviewsCount} reviews)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Comparison Analysis Section */}
      {aiComparison && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-300 shadow-lg space-y-5">
          <div className="flex items-center gap-2 text-indigo-900">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-extrabold font-['Outfit']">
              Wand AI Comprehensive Decision Verdict
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {aiComparison.summaryRecommendation}
          </p>

          {/* Leaders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                Best For Placements & ROI
              </span>
              <h4 className="font-extrabold text-emerald-950 text-sm font-['Outfit']">
                {aiComparison.bestForPlacements}
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">
                Best For Low Budget / Value
              </span>
              <h4 className="font-extrabold text-amber-950 text-sm font-['Outfit']">
                {aiComparison.bestForBudget}
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase block mb-1">
                Best For Campus Life & Fests
              </span>
              <h4 className="font-extrabold text-purple-950 text-sm font-['Outfit']">
                {aiComparison.bestForCampusLife}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
