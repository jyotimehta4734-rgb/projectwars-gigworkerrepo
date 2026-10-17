import React from 'react';
import { Shield, Sparkles, Terminal, Activity, FileText, IndianRupee, Scale } from 'lucide-react';
import { CategoryToken, LanguageMode } from '../types';

interface HeaderProps {
  activeTab: 'router' | 'earnings' | 'welfare' | 'grievance' | 'api';
  setActiveTab: (tab: 'router' | 'earnings' | 'welfare' | 'grievance' | 'api') => void;
  lang: LanguageMode;
  setLang: (l: LanguageMode) => void;
  lastClassifiedCategory?: CategoryToken;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  lastClassifiedCategory,
}) => {
  return (
    <header className="border-b border-amber-950/10 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Top Banner for Gig Worker Solidarity */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>
          {lang === 'hi'
            ? 'गीग साथी: भारत के 1.5 करोड़ डिलीवरी पार्टनर्स, ऑटो व कैब ड्राइवरों के लिए AI साथी'
            : lang === 'hinglish'
            ? 'GigSaathi: Delivery partners, drivers aur gig workers ke liye AI powered routing & support'
            : 'GigSaathi: Dedicated AI Routing & Operational Support for India’s Gig Workforce'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center font-bold text-xl shadow-xs">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-neutral-900 flex items-center gap-1.5">
                  GigSaathi
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                    गीग साथी
                  </span>
                </h1>
                <span className="text-[11px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                  Tri-Router Core
                </span>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-1">
                {lang === 'hi'
                  ? 'कमाई हिसाब · सरकारी कल्याण योजनाएं · अनफेयर फाइन और आईडी सस्पेंशन अपील'
                  : 'Earnings Tracking · Welfare Schemes · Grievance & Fine Drafting'}
              </p>
            </div>
          </div>

          {/* Right Utilities: Category Live Indicator & Language Switcher */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {lastClassifiedCategory && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono bg-neutral-900 text-neutral-100 px-2.5 py-1 rounded-md border border-neutral-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-neutral-400">Last Route:</span>
                <span className="text-amber-400 font-bold">{lastClassifiedCategory}</span>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
              <button
                onClick={() => setLang('hinglish')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  lang === 'hinglish'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  lang === 'hi'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  lang === 'en'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-sm no-scrollbar">
          <button
            onClick={() => setActiveTab('router')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'router'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Core Routing Agent</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.2 rounded font-mono">
              Live AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'earnings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'hi' ? 'कमाई ट्रैकिंग' : lang === 'hinglish' ? 'Earnings Tracking' : 'Earnings Tracking'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('welfare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'welfare'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>
              {lang === 'hi' ? 'कल्याणकारी योजनाएं' : lang === 'hinglish' ? 'Welfare Schemes' : 'Welfare Schemes'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grievance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'grievance'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'hi' ? 'शिकायत व अपील' : lang === 'hinglish' ? 'Grievance Drafting' : 'Grievance Drafting'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>API & Curl</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
