import React from 'react';
import { LayoutDashboard, Search, Sparkles, BookOpen, Menu } from 'lucide-react';
import { UserRole } from '../types';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  onOpenWandAI: () => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  onOpenWandAI,
  onOpenMore,
}) => {
  return (
    <div id="mobile-bottom-nav" className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setCurrentTab(userRole === 'prospective_student' ? 'explorer' : 'dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'dashboard' || currentTab === 'home'
              ? 'text-[#2D2A4A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>{userRole === 'prospective_student' ? 'Discover' : 'Dashboard'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('explorer')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'explorer' ? 'text-[#2D2A4A]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Colleges</span>
        </button>

        {/* Center Floating Wand AI */}
        <button
          onClick={onOpenWandAI}
          className="flex flex-col items-center -mt-5"
          title="Ask Wand AI"
        >
          <div className="w-12 h-12 rounded-full bg-[#2D2A4A] text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] font-extrabold text-[#2D2A4A] mt-0.5">Wand AI</span>
        </button>

        <button
          onClick={() => setCurrentTab('academics')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'academics' ? 'text-[#2D2A4A]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Academics</span>
        </button>

        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            ['fees', 'faculty', 'campus', 'problems', 'compare', 'community', 'alumni', 'internships', 'safe-campus'].includes(currentTab)
              ? 'text-[#2D2A4A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
