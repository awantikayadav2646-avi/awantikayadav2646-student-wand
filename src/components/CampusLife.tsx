import React, { useState } from 'react';
import {
  Building2,
  Users,
  Award,
  Utensils,
  Moon,
  ShieldCheck,
  Sparkles,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { College, EventItem } from '../types';

interface CampusLifeProps {
  college: College;
  events: EventItem[];
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const CampusLife: React.FC<CampusLifeProps> = ({
  college,
  events,
  onOpenWandAIWithPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'clubs' | 'fests' | 'canteen' | 'hostel' | 'culture'>('culture');

  const clubs = [
    {
      name: 'Google Developer Student Club (GDSC)',
      category: 'Technical',
      lead: 'Aman Verma (4th Yr CSE)',
      membersCount: 320,
      description: 'Host weekly hack nights, cloud workshops, and competitive programming bootcamps.',
      activities: 'Hackathons, Open Source sprints, Google Cloud study jams',
    },
    {
      name: 'Apex Robotics & AI Society',
      category: 'Innovation',
      lead: 'Riya Sen (3rd Yr AI)',
      membersCount: 180,
      description: 'Design autonomous rovers, drone racing rigs, and smart campus IoT prototypes.',
      activities: 'RoboWars, Hardware hackathons, Drone testing',
    },
    {
      name: 'Dhwani - The Music Society',
      category: 'Cultural',
      lead: 'Kabir Mehta (3rd Yr ECE)',
      membersCount: 95,
      description: 'The college official rock band and classical ensemble. Winners of 8 inter-college battle of bands.',
      activities: 'Acoustic jam sessions, Fest headliner concerts, studio recordings',
    },
    {
      name: 'E-Cell (Entrepreneurship Hub)',
      category: 'Leadership',
      lead: 'Shruti Patel (4th Yr BBA)',
      membersCount: 210,
      description: 'Connecting student founders with venture capitalists and alumni angel investors.',
      activities: 'Pitch Desk, Startup Bootcamp, Founder Fireside chats',
    },
    {
      name: 'Abhinay - Dramatic Society',
      category: 'Arts',
      lead: 'Rohan Joshi (2nd Yr ME)',
      membersCount: 65,
      description: 'Nukkad Natak (Street plays) and full-length stage productions addressing societal themes.',
      activities: 'Street plays, annual theater fest, voice modulation workshops',
    },
    {
      name: 'Apex Sports Club',
      category: 'Athletics',
      lead: 'Vikram Singh (3rd Yr Civil)',
      membersCount: 450,
      description: 'Coordinates cricket, football, basketball, badminton tournaments and fitness regimes.',
      activities: 'Inter-branch leagues, marathon runs, martial arts training',
    },
  ];

  const canteenHighlights = [
    { item: 'South Indian Dosa & Filter Coffee', rating: 4.8, price: 'Rs. 40 - 60', popular: true },
    { item: 'Paneer Butter Masala Thali', rating: 4.6, price: 'Rs. 90', popular: true },
    { item: 'Cold Coffee & Grilled Sandwiches', rating: 4.7, price: 'Rs. 50 - 70', popular: true },
    { item: 'Chinese Hakka Noodles & Manchurian', rating: 4.2, price: 'Rs. 60 - 80', popular: false },
    { item: 'Fresh Fruit Juice & Shakes', rating: 4.9, price: 'Rs. 40 - 60', popular: true },
  ];

  return (
    <div id="campus-life-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-purple-300 border border-purple-300/30 text-[10px] font-bold">
                Student Life & Vibe
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ragging-Free Campus
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold font-['Outfit'] mt-1">
              Campus Life & Student Experience
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              {college.name} • Honest look at culture, clubs, canteens, fests, and night-life rules.
            </p>
          </div>

          <button
            onClick={() => onOpenWandAIWithPrompt(`How is the student life, food, and culture at ${college.name}?`)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0 self-start md:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Wand AI About Campus Vibe</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-white/10 text-xs no-scrollbar">
          {[
            { id: 'culture', label: 'Culture & Environment' },
            { id: 'clubs', label: 'Clubs & Societies (28+)' },
            { id: 'fests', label: 'Fests & Events' },
            { id: 'canteen', label: 'Canteens & Food (★ 4.4)' },
            { id: 'hostel', label: 'Hostel & Curfew' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: CULTURE & ENVIRONMENT */}
      {activeTab === 'culture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Academic Pressure</span>
              <p className="text-lg font-extrabold text-slate-900 mt-1 font-['Outfit']">
                {college.campusLife.academicPressureLevel}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Balanced mid-terms, regular project assignments.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance Strictness</span>
              <p className="text-lg font-extrabold text-indigo-700 mt-1 font-['Outfit']">
                {college.campusLife.attendanceMandatoryPercentage}% Policy
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Biometric card swipe before each lecture hall.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hostel Curfew</span>
              <p className="text-lg font-extrabold text-amber-700 mt-1 font-['Outfit']">
                {college.campusLife.hostelCurfewTime}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Late passes available for Hackathons & Lab work.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Canteen Food Score</span>
              <p className="text-lg font-extrabold text-emerald-600 mt-1 font-['Outfit']">
                ★ {college.campusLife.canteenFoodRating} / 5.0
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Hygienic multi-cuisine counters & night canteen.</p>
            </div>
          </div>

          {/* Deep Culture Narrative */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
              What Is It Really Like To Study Here?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {college.campusLife.cultureOverview}
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                <strong>Student Vibe:</strong> {college.campusLife.studentCommunityVibe}
              </p>
              <p>
                <strong>Safety & Anti-Ragging:</strong> 24/7 CCTV surveillance across all corridors, women's grievance redressal cell, dedicated security guards at all entry points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CLUBS & SOCIETIES */}
      {activeTab === 'clubs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                Student Clubs & Chapters
              </h3>
              <p className="text-xs text-slate-500">
                Over 28 technical, cultural, sports, and entrepreneurship clubs active on campus.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              Recruitment every August
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((clb, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {clb.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {clb.membersCount}+ members
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 mt-2 font-['Outfit']">
                    {clb.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{clb.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <p><strong>Lead:</strong> {clb.lead}</p>
                  <p className="text-indigo-600 font-medium truncate mt-0.5"><strong>Key Ops:</strong> {clb.activities}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FESTS & EVENTS */}
      {activeTab === 'fests' && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
            Annual Flagship Celebrations & Hackathons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className={`p-4 bg-gradient-to-r ${evt.bannerGradient} text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-black/20 px-2 py-0.5 rounded-sm">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold">{evt.date}</span>
                  </div>
                  <h4 className="text-lg font-extrabold font-['Outfit'] mt-2">{evt.title}</h4>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 font-medium">
                    <span>Venue: {evt.venue}</span>
                    <span className="font-bold text-indigo-700">{evt.registrationFee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CANTEEN & FOOD */}
      {activeTab === 'canteen' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                  Campus Cafeterias & Food Outlets
                </h3>
                <p className="text-xs text-slate-500">
                  Student rated food items, pricing, and hygiene inspection scores.
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                FSSAI Certified
              </span>
            </div>

            <div className="space-y-2.5">
              {canteenHighlights.map((food, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-900">{food.item}</span>
                      {food.popular && (
                        <span className="ml-2 text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-sm">
                          Campus Favorite
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">{food.price}</span>
                    <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      ★ {food.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: HOSTEL */}
      {activeTab === 'hostel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
              Hostel Accommodation & Living Standards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Room Types</span>
                <p className="text-slate-600">Single AC, Double AC, Triple Non-AC options with study tables and attached washrooms.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Mess & Meal Timings</span>
                <p className="text-slate-600">4 meals a day (Breakfast, Lunch, Evening Snacks, Dinner). Vegetarian and non-veg days included.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Internet & Utilities</span>
                <p className="text-slate-600">High-speed Wi-Fi (100 Mbps), 24/7 power backup, solar water heaters, and coin-operated laundry.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
