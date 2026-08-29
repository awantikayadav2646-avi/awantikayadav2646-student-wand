import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, CheckCircle, Apple, Chrome, X, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for standard beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2D2A4A] to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#2D2A4A] flex items-center justify-center font-extrabold shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit']">Install Student Wand</h3>
              <p className="text-xs text-amber-200">Get the full desktop & mobile app experience</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quick Features Pill */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block">⚡ Instant</span>
              <span className="text-[11px] text-slate-500">1-Tap Launch</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block">📴 Offline</span>
              <span className="text-[11px] text-slate-500">Cached Access</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block">🔔 Direct SOS</span>
              <span className="text-[11px] text-slate-500">Fast Helpline</span>
            </div>
          </div>

          {/* Primary Action Button (If browser supports native prompt) */}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install to Your Device Now</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-xs font-bold">App is already installed!</strong>
                <span className="text-[11px]">You can open Student Wand directly from your home screen or app drawer.</span>
              </div>
            </div>
          )}

          {/* Platform Specific Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Installation Instructions</h4>

            {/* Desktop Chrome / Edge */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
              <Monitor className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Chrome, Edge & Brave on Desktop / Laptop</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Click the <strong>Install / App icon (⊕)</strong> on the right side of the browser URL address bar, then click <strong>Install</strong>.
                </p>
              </div>
            </div>

            {/* Android */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
              <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Android Mobile Phone (Chrome)</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tap the browser menu <strong>(⋮ 3 dots)</strong> ➔ tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>
            </div>

            {/* iPhone / iPad */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
              <Apple className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">iPhone & iPad (Safari)</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tap the <strong>Share button (⎋ with arrow)</strong> at the bottom of Safari ➔ scroll down and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Standalone Web App (PWA)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
