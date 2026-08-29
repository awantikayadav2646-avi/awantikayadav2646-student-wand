import React, { useState } from 'react';
import {
  Bell,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';
import { NoticeItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notices: NoticeItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notices,
  onMarkAllRead,
}) => {
  const [filterCat, setFilterCat] = useState('All');

  if (!isOpen) return null;

  const filteredNotices = notices.filter(
    (n) => filterCat === 'All' || n.category.toLowerCase().includes(filterCat.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                College Bulletins & Alerts
              </h2>
              <span className="text-[10px] text-slate-500">{notices.length} active announcements</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {['All', 'Examination', 'Fee', 'Events', 'Administrative'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCat === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Notices */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm ${
                    notice.priority === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-400">{notice.date}</span>
              </div>

              <h4 className="font-extrabold text-slate-900 text-xs font-['Outfit']">
                {notice.title}
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">{notice.content}</p>

              {notice.attachmentName && (
                <div className="pt-2 flex items-center justify-between text-[10px] text-indigo-700 font-bold border-t border-slate-200/60 mt-1">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{notice.attachmentName}</span>
                  </span>
                  <button
                    onClick={() => alert(`Downloading notice attachment: ${notice.attachmentName}`)}
                    className="hover:underline"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllRead}
            className="text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
