import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  X,
  MessageSquare,
} from 'lucide-react';
import { FacultyMember } from '../types';

interface FacultyDirectoryProps {
  facultyList: FacultyMember[];
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  facultyList,
  onOpenWandAIWithPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedFacultyForBooking, setSelectedFacultyForBooking] = useState<FacultyMember | null>(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const departments = ['All', ...Array.from(new Set(facultyList.map((f) => f.department)))];

  const filteredFaculty = facultyList.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.specialization.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      fac.coursesTaught.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedFacultyForBooking(null);
      setBookingSlot('');
      setBookingReason('');
    }, 2000);
  };

  return (
    <div id="faculty-directory-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Faculty Directory & Mentors
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse professors, review office hours, verify research credentials, and schedule academic consultations.
          </p>
        </div>

        {/* Search & Dept Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name, specialization (e.g., 'Machine Learning', 'Data Structures')..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((fac) => (
          <div
            key={fac.id}
            id={`faculty-card-${fac.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Profile Info */}
              <div className="flex items-start gap-3">
                <img
                  src={fac.avatar}
                  alt={fac.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                      {fac.department.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">
                      ★ {fac.studentRating}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 font-['Outfit']">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-500">{fac.designation}</p>
                </div>
              </div>

              {/* Qualifications & Experience */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <p>
                  <strong>Degrees:</strong> {fac.qualifications} ({fac.experienceYears}+ yrs exp)
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Cabin: <strong>{fac.cabinRoom}</strong></span>
                </p>
                <p className="flex items-center gap-1 text-indigo-700">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>Hours: {fac.consultationHours}</span>
                </p>
              </div>

              {/* Specialization Tags */}
              <div className="flex flex-wrap gap-1">
                {fac.specialization.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Teaching Style & Feedback */}
              <div className="text-xs text-slate-600 pt-1">
                <p className="line-clamp-2 italic">"{fac.teachingStyle}"</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {fac.studentFeedbackTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedFacultyForBooking(fac)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>

              <button
                onClick={() => onOpenWandAIWithPrompt(`Tell me more about Professor ${fac.name}, their courses, and research interests`)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Ask AI about this faculty"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedFacultyForBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Schedule Office Hour
                </h3>
              </div>
              <button
                onClick={() => setSelectedFacultyForBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                  Appointment Request Sent!
                </h4>
                <p className="text-xs text-slate-600">
                  Confirmation sent to {selectedFacultyForBooking.email}. You will receive a calendar notification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faculty Member</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedFacultyForBooking.name} (${selectedFacultyForBooking.department})`}
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Office Hours</label>
                  <input
                    type="text"
                    disabled
                    value={selectedFacultyForBooking.consultationHours}
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-indigo-700 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                  <select
                    required
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="">Select a 15-minute slot</option>
                    <option value="Tue 03:00 PM">Tuesday 03:00 PM - 03:15 PM</option>
                    <option value="Tue 03:30 PM">Tuesday 03:30 PM - 03:45 PM</option>
                    <option value="Thu 03:15 PM">Thursday 03:15 PM - 03:30 PM</option>
                    <option value="Thu 04:00 PM">Thursday 04:00 PM - 04:15 PM</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purpose / Topic of Discussion</label>
                  <textarea
                    required
                    rows={3}
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    placeholder="e.g., Doubts regarding Data Structures recursion assignment or guidance on research project."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFacultyForBooking(null)}
                    className="px-3 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
