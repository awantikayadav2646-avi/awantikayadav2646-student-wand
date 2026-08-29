import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  Bot,
  User,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';
import { College, StudentProfile, ChatMessage } from '../types';

interface WandAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: College;
  studentProfile: StudentProfile;
  initialPrompt?: string;
}

export const WandAIModal: React.FC<WandAIModalProps> = ({
  isOpen,
  onClose,
  college,
  studentProfile,
  initialPrompt = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${studentProfile.name.split(' ')[0]}! I am **Wand AI**, your intelligent companion for **${college.name}**.\n\nAsk me anything in **Hindi, Hinglish, or English** about your timetable, attendance rules, fee structure, hostel life, or syllabus!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          contextData: {
            collegeName: college.name,
            course: studentProfile.course,
            semester: studentProfile.semester,
            attendancePercent: '78%',
            tuitionFee: college.feeStructure.tuitionFeePerYear,
            placements: college.placementHistory[0],
            hostelCurfew: college.campusLife.hostelCurfewTime,
          },
        }),
      });
      const data = await res.json();
      const aiReply = data.reply || 'I am happy to assist you with your college queries!';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `According to ${college.name} official rules, 75% attendance is required and administrative counters are open Mon-Fri 09:30 AM to 03:30 PM.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Chat reset! How can I assist you with your academics or college inquiries?`,
        timestamp: 'Just now',
      },
    ]);
  };

  const quickPrompts = [
    'Kal meri class schedule kya hai?',
    'Attendance shortage ke medical rules',
    'Hostel curfew aur mess menu ratings',
    'Placement average CTC aur top companies',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl bg-white h-[85vh] rounded-3xl shadow-2xl flex flex-col justify-between border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#2D2A4A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#2D2A4A] flex items-center justify-center font-extrabold shadow-xs">
              <Sparkles className="w-5 h-5 text-[#2D2A4A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-['Outfit']">Wand AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[9px] font-bold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <Building className="w-3 h-3 text-amber-300" />
                <span>{college.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#2D2A4A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold">
                    <Sparkles className="w-4 h-4 text-[#2D2A4A]" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isAI
                      ? 'bg-white border border-slate-200/80 text-slate-800 shadow-xs rounded-bl-none'
                      : 'bg-[#2D2A4A] text-white shadow-xs font-medium rounded-br-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1.5 ${
                      isAI ? 'text-slate-400' : 'text-slate-300'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-['Outfit']">
                    {studentProfile.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#2D2A4A] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#2D2A4A] animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D2A4A]" />
                <span>Wand AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Suggestions:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp)}
              className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 hover:text-[#2D2A4A] text-slate-700 border border-slate-200 transition-colors whitespace-nowrap text-xs font-medium"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything in English, Hindi or Hinglish..."
              className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#2D2A4A]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-[#2D2A4A] font-bold transition-colors disabled:opacity-50 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
