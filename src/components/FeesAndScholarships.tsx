import React, { useState } from 'react';
import {
  CreditCard,
  Calculator,
  Award,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { College, ScholarshipItem } from '../types';

interface FeesAndScholarshipsProps {
  college: College;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const FeesAndScholarships: React.FC<FeesAndScholarshipsProps> = ({
  college,
  onOpenWandAIWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'calculator' | 'scholarships' | 'receipts'>('schedule');

  // Interactive Total Cost Estimator State
  const [hostelType, setHostelType] = useState<number>(75000); // 75000 Non-AC, 120000 AC, 0 Day Scholar
  const [transportCostPerMonth, setTransportCostPerMonth] = useState<number>(2000);
  const [pocketExpensesPerMonth, setPocketExpensesPerMonth] = useState<number>(3500);
  const [yearsDuration, setYearsDuration] = useState<number>(4);

  const annualTuition = college.feeStructure.tuitionFeePerYear;
  const annualExam = college.feeStructure.examFeePerYear;
  const annualOther = college.feeStructure.otherCharges;
  const annualLiving = hostelType > 0 ? hostelType : (transportCostPerMonth * 10);
  const annualPocket = pocketExpensesPerMonth * 10;
  const totalAnnualCost = annualTuition + annualExam + annualOther + annualLiving + annualPocket;
  const totalGraduationCost = (totalAnnualCost * yearsDuration) + college.feeStructure.refundableDeposit;

  return (
    <div id="fees-scholarships-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Official Fee Verified
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight mt-1">
              Fees, Total Cost Calculator & Scholarships
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Clear breakdown of tuition, hostel, exam charges, total degree cost calculators, and financial aid schemes.
            </p>
          </div>

          <button
            onClick={() => onOpenWandAIWithPrompt(`Explain the full fee structure and scholarship options for ${college.name}`)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4 text-indigo-950" />
            <span>Ask AI About Fee Waivers</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-xs no-scrollbar">
          {[
            { id: 'schedule', label: '💳 Official Fee Schedule' },
            { id: 'calculator', label: '🧮 4-Year Cost Estimator' },
            { id: 'scholarships', label: '🎓 Scholarships & Waivers' },
            { id: 'receipts', label: '📄 Payment Slips & Receipts' },
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

      {/* TAB 1: OFFICIAL FEE SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Tuition Fee</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
                Rs. {college.feeStructure.tuitionFeePerYear.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Payable per semester in 2 installments</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hostel & Mess (Annual)</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
                Rs. {college.feeStructure.hostelFeePerYear.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Includes 4 meals/day + 24/7 Wi-Fi</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Examination Charges</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
                Rs. {college.feeStructure.examFeePerYear.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Covers mid-sem & end-sem hall tickets</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Refundable Caution Deposit</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1 font-['Outfit']">
                Rs. {college.feeStructure.refundableDeposit.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">100% returned on graduation clearance</span>
            </div>
          </div>

          {/* UGC / AICTE Refund Policy Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Official UGC / AICTE Fee Refund & Cancellation Policy</span>
            </h3>
            <ul className="space-y-1 list-disc pl-4 text-slate-600">
              <li><strong>100% Refund:</strong> Withdrawal requested 15 days or more before the officially notified last date of admission (deduction of max Rs. 1,000 as processing fee).</li>
              <li><strong>90% Refund:</strong> Withdrawal requested less than 15 days before the last date of admission.</li>
              <li><strong>80% Refund:</strong> Withdrawal requested within 15 days after the last date of admission.</li>
              <li><strong>50% Refund:</strong> Withdrawal requested between 16 and 30 days after the last date of admission.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: TOTAL COST ESTIMATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                Customize Your Real Living & Academic Budget
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Accommodation Option</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Hostel (AC)', fee: 120000 },
                    { label: 'Hostel (Non-AC)', fee: 75000 },
                    { label: 'Day Scholar (Home)', fee: 0 },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setHostelType(opt.fee)}
                      className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                        hostelType === opt.fee
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <p>{opt.label}</p>
                      <span className="text-[10px] block opacity-80">
                        {opt.fee > 0 ? `Rs. ${opt.fee.toLocaleString()}/yr` : 'Rs. 0'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {hostelType === 0 && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Monthly Transport / Bus Pass: Rs. {transportCostPerMonth}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="500"
                    value={transportCostPerMonth}
                    onChange={(e) => setTransportCostPerMonth(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Estimated Pocket / Book Expenses: Rs. {pocketExpensesPerMonth} / month
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={pocketExpensesPerMonth}
                  onChange={(e) => setPocketExpensesPerMonth(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Program Duration</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setYearsDuration(yr)}
                      className={`px-4 py-1.5 rounded-lg font-bold border ${
                        yearsDuration === yr
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {yr} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                Total Degree Cost Estimate
              </span>
              <h3 className="text-3xl font-extrabold font-['Outfit'] mt-1 text-white">
                Rs. {totalGraduationCost.toLocaleString()}
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                Estimated total expenditure for {yearsDuration} full years.
              </p>

              <div className="mt-5 space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Tuition Fee ({yearsDuration} yrs):</span>
                  <span className="font-bold text-white">Rs. {(annualTuition * yearsDuration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Living & Hostels ({yearsDuration} yrs):</span>
                  <span className="font-bold text-white">Rs. {(annualLiving * yearsDuration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Exam & Campus Fees:</span>
                  <span className="font-bold text-white">Rs. {(annualExam * yearsDuration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pocket & Stationery Budget:</span>
                  <span className="font-bold text-white">Rs. {(annualPocket * yearsDuration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10 font-bold">
                  <span>Refundable Caution Deposit:</span>
                  <span>Rs. {college.feeStructure.refundableDeposit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenWandAIWithPrompt(`How can I plan an education loan or scholarship for Rs. ${totalGraduationCost.toLocaleString()}?`)}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-950" />
              <span>Get AI Loan & Scholarship Guide</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SCHOLARSHIPS & WAIVERS */}
      {activeTab === 'scholarships' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {college.scholarships.map((sch, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    {sch.source}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {sch.amountOrDiscount}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                  {sch.name}
                </h4>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p><strong>Eligibility:</strong> {sch.eligibility}</p>
                  <p><strong>Deadline:</strong> {sch.applicationDeadline}</p>
                </div>

                <button
                  onClick={() => onOpenWandAIWithPrompt(`Give me the complete step-by-step document checklist to apply for ${sch.name}`)}
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Check Eligibility Checklist</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT SLIPS & RECEIPTS */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
              Semester Fee Payment Ledger
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">REC-2024-SEM5-089</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Paid • Online NetBanking
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Semester 5 Tuition & Exam Fee</h4>
                  <p className="text-slate-500">Paid on 14 Aug 2024 • Transaction ID: HDFC9928174412</p>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <span className="text-base font-extrabold text-slate-900 font-['Outfit']">Rs. 98,500</span>
                  <button
                    onClick={() => alert('Downloading official stamped PDF receipt: REC-2024-SEM5-089.pdf')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-indigo-700 font-bold hover:bg-slate-50 flex items-center gap-1 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
