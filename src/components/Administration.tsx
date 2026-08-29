import React, { useState } from 'react';
import {
  Building2,
  Users,
  FileText,
  Download,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { College, AdminOfficer, AdminProcedure } from '../types';

interface AdministrationProps {
  college: College;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const Administration: React.FC<AdministrationProps> = ({
  college,
  onOpenWandAIWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'procedures' | 'officers' | 'faq'>('procedures');
  const [faqSearch, setFaqSearch] = useState('');

  const adminOfficers: AdminOfficer[] = [
    {
      id: 'off-1',
      name: 'Dr. R. K. Sharma',
      designation: 'Dean of Academic Affairs',
      department: 'Academic Section',
      room: 'Admin Block, 1st Floor, Room 102',
      email: 'dean.academics@apextech.edu',
      phone: '+91 11 2894 1002',
      officeHours: 'Mon - Fri: 10:30 AM - 01:00 PM',
      responsibilities: ['Syllabus approvals', 'Course registrations', 'Attendance shortage hearings', 'Transcripts'],
    },
    {
      id: 'off-2',
      name: 'Dr. Shalini Varma',
      designation: 'Dean of Student Welfare & Affairs',
      department: 'Student Affairs Cell',
      room: 'Admin Block, Ground Floor, Room 008',
      email: 'dean.sw@apextech.edu',
      phone: '+91 11 2894 1008',
      officeHours: 'Mon - Fri: 02:00 PM - 04:30 PM',
      responsibilities: ['Student clubs & fests', 'Anti-ragging committee', 'Disciplinary appeals', 'Hostel grievances'],
    },
    {
      id: 'off-3',
      name: 'Mr. Arvind Gupta',
      designation: 'Finance & Accounts Officer',
      department: 'Accounts Section',
      room: 'Admin Block, Ground Floor, Counter 3 & 4',
      email: 'accounts@apextech.edu',
      phone: '+91 11 2894 1004',
      officeHours: 'Mon - Fri: 09:30 AM - 03:30 PM',
      responsibilities: ['Tuition fee collections', 'Installment approvals', 'Scholarship disbursements', 'Caution refunds'],
    },
    {
      id: 'off-4',
      name: 'Prof. S. N. Roy',
      designation: 'Controller of Examinations (COE)',
      department: 'Examination Cell',
      room: 'Exam Block, 2nd Floor, Room 204',
      email: 'coe@apextech.edu',
      phone: '+91 11 2894 2040',
      officeHours: 'Mon - Fri: 11:00 AM - 01:00 PM',
      responsibilities: ['End-sem datesheets', 'Admit cards', 'Re-evaluation & answer-script reviews', 'Grade cards'],
    },
  ];

  const adminProcedures: AdminProcedure[] = [
    {
      id: 'proc-1',
      title: 'Medical Leave & Attendance Exemption',
      department: 'Dean Academics & Medical Center',
      estimatedProcessingDays: 3,
      requiredDocuments: [
        'Doctor Prescription with Registration Number',
        'Medical Fitness Certificate',
        'Hospital discharge/medical bill receipts',
        'Parent signed leave application',
      ],
      steps: [
        'Collect valid prescription and fitness certificate from a registered MBBS practitioner.',
        'Download and fill the Medical Attendance Exemption Form.',
        'Get the form endorsed by your subject teachers and HOD.',
        'Submit the physical dossier to Room 102 (Dean Academics) within 7 days of returning to campus.',
      ],
      downloadableFormName: 'Medical_Attendance_Exemption_Form_2024.pdf',
    },
    {
      id: 'proc-2',
      title: 'Bonafide & Character Certificate Request',
      department: 'Student Registrar Desk',
      estimatedProcessingDays: 2,
      requiredDocuments: ['Valid College Student ID Card', 'Latest Semester Fee Clearance Slip'],
      steps: [
        'Submit an online Bonafide Request in the student ERP portal stating the purpose (Passport / Education Loan / NSP).',
        'Verify that all past semester dues are cleared.',
        'Collect the physically signed and stamped certificate from Counter 1 after 48 hours.',
      ],
      downloadableFormName: 'Bonafide_Application_Form.pdf',
    },
    {
      id: 'proc-3',
      title: 'Hostel Room Swap / Change Application',
      department: 'Hostel Chief Warden Office',
      estimatedProcessingDays: 5,
      requiredDocuments: ['Written mutual consent of both students', 'Hostel Warden NOC clearance'],
      steps: [
        'Download and fill the Mutual Room Swap Undertaking.',
        'Get signatures from the current roommates of both rooms.',
        'Submit to the Chief Warden office before the 10th of the month.',
        'Complete biometric room key re-allocation after approval.',
      ],
      downloadableFormName: 'Hostel_Room_Change_Request.pdf',
    },
    {
      id: 'proc-4',
      title: 'End-Semester Answer Script Re-evaluation',
      department: 'Examination Cell (COE)',
      estimatedProcessingDays: 14,
      requiredDocuments: ['End-sem Grade Card copy', 'Re-evaluation fee challan (Rs. 500/paper)'],
      steps: [
        'Apply within 10 days of the official declaration of semester results.',
        'Pay the re-evaluation fee at Accounts Counter or via NetBanking.',
        'Submit the challan copy at Examination Cell Room 204.',
        'Check revised grade status on ERP within 14 working days.',
      ],
      downloadableFormName: 'Exam_ReEvaluation_Challan_Form.pdf',
    },
  ];

  const adminFaqs = [
    {
      q: 'What should I do if my attendance drops below 75%?',
      a: 'Submit a medical certificate or university co-curricular representation letter to Dean Academics Room 102 within 7 days. Students with genuine medical records between 65% and 75% are routinely granted exam admit cards upon verification.',
    },
    {
      q: 'Can I pay my semester fee in 2 or 3 installments?',
      a: 'Yes. Visit Accounts Counter 3 with an application letter signed by your parent. The Finance Officer will approve a split payment plan (minimum 50% upfront, balance within 45 days) with zero penalty.',
    },
    {
      q: 'How do I apply for a duplicate Student ID card if lost?',
      a: 'File an online loss report on ERP, pay Rs. 200 replacement fee at Counter 2, and collect your fresh RFID smart ID card from the Security Office within 2 working days.',
    },
    {
      q: 'What is the procedure to issue library books beyond normal limit?',
      a: 'Final year project teams and students with CGPA > 8.5 can request 2 additional book cards by submitting an HOD recommendation letter to the Central Library Circulation Desk.',
    },
  ];

  const filteredFaqs = adminFaqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div id="administration-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                College Administration & Support
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight mt-1">
              Procedures, Official Forms & Admin Contacts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Clear step-by-step guides for leaves, certificates, fee extensions, and verified administrative officer contacts.
            </p>
          </div>

          <button
            onClick={() => onOpenWandAIWithPrompt(`What is the step-by-step process to get a Bonafide Certificate or Medical Leave at ${college.name}?`)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4 text-indigo-950" />
            <span>Ask AI About Admin Rules</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-xs no-scrollbar">
          {[
            { id: 'procedures', label: '📋 Student Procedures & Forms' },
            { id: 'officers', label: '🏛️ Key Officers & Office Hours' },
            { id: 'faq', label: '❓ Searchable Admin FAQs' },
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

      {/* TAB 1: PROCEDURES & FORMS */}
      {activeTab === 'procedures' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminProcedures.map((proc) => (
              <div
                key={proc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {proc.department}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      ~{proc.estimatedProcessingDays} days processing
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2 font-['Outfit']">
                    {proc.title}
                  </h3>

                  {/* Steps */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                      Steps to Follow:
                    </span>
                    {proc.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>

                  {/* Required Documents */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Required Documents:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                      {proc.requiredDocuments.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate max-w-[170px]">
                    {proc.downloadableFormName}
                  </span>
                  <button
                    onClick={() => alert(`Downloading official application form: ${proc.downloadableFormName}`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Form</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OFFICERS & OFFICE HOURS */}
      {activeTab === 'officers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminOfficers.map((off) => (
              <div key={off.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      {off.department}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 font-['Outfit']">
                      {off.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{off.designation}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Location:</strong> {off.room}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span><strong>Visiting Hours:</strong> {off.officeHours}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-indigo-700">{off.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{off.phone}</span>
                  </p>
                </div>

                <div className="text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Key Responsibilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {off.responsibilities.map((r, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SEARCHABLE ADMIN FAQS */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search administration FAQs (e.g., 'attendance', 'late fee', 'bonafide')..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <h4 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                  Q: {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
