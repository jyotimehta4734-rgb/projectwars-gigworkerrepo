import React from 'react';
import {
  Shield,
  Terminal,
  Activity,
  FileText,
  IndianRupee,
  Scale,
  Sun,
  Moon,
  Type,
  Volume2,
  Sparkles
} from 'lucide-react';
import { CategoryToken, LanguageMode, TextScale, DayMode } from '../types';

interface HeaderProps {
  activeTab: 'router' | 'earnings' | 'welfare' | 'grievance' | 'api' | 'submission';
  setActiveTab: (tab: 'router' | 'earnings' | 'welfare' | 'grievance' | 'api' | 'submission') => void;
  lang: LanguageMode;
  setLang: (l: LanguageMode) => void;
  lastClassifiedCategory?: CategoryToken;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  dayMode: DayMode;
  setDayMode: (mode: DayMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  lastClassifiedCategory,
  textScale,
  setTextScale,
  dayMode,
  setDayMode,
}) => {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* High-Contrast Solidarity Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span>
            {lang === 'hi'
              ? 'गीग साथी: भारत के 1.5 करोड़ डिलीवरी पार्टनर्स, ऑटो व कैब ड्राइवरों के लिए AI साथी'
              : lang === 'hinglish'
              ? 'GigSaathi: Delivery partners, drivers aur gig workers ke liye AI powered routing & support'
              : 'GigSaathi: Dedicated AI Routing & Operational Support for India’s Gig Workforce'}
          </span>
        </div>

        {/* Accessibility Bar in Banner */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-[11px]">
          {/* Outdoor Daylight High Contrast Mode */}
          <button
            onClick={() => setDayMode(dayMode === 'standard' ? 'daylight' : 'standard')}
            title="Toggle Outdoor High-Contrast Mode for Bright Sunlight"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/25 hover:bg-black/40 text-amber-100 font-semibold transition-colors"
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">
              {dayMode === 'daylight' ? 'Standard Mode' : 'Sunlight Mode (धूप मोड)'}
            </span>
          </button>

          {/* Text Size Resizer */}
          <div className="flex items-center gap-1 bg-black/25 px-1.5 py-0.5 rounded font-mono font-bold">
            <span className="text-[10px] text-amber-200 mr-0.5 hidden lg:inline">Text Size:</span>
            <button
              onClick={() => setTextScale('normal')}
              className={`px-1.5 rounded transition-colors ${
                textScale === 'normal' ? 'bg-white text-neutral-900' : 'text-white/80 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setTextScale('large')}
              className={`px-1.5 rounded transition-colors text-xs ${
                textScale === 'large' ? 'bg-white text-neutral-900 font-bold' : 'text-white/80 hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setTextScale('xlarge')}
              className={`px-1.5 rounded transition-colors text-sm ${
                textScale === 'xlarge' ? 'bg-white text-neutral-900 font-black' : 'text-white/80 hover:text-white'
              }`}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-1.5">
                  GigSaathi
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                    गीग साथी
                  </span>
                </h1>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  Tri-Router Core
                </span>
              </div>
              <p className="text-xs text-neutral-600 line-clamp-1">
                {lang === 'hi'
                  ? 'कमाई हिसाब · सरकारी कल्याण योजनाएं · अनफेयर फाइन और आईडी सस्पेंशन अपील'
                  : 'Earnings Tracking · Welfare Schemes · Grievance & Fine Drafting'}
              </p>
            </div>
          </div>

          {/* Right Utilities: Category Live Indicator & Language Switcher */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {lastClassifiedCategory && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono bg-neutral-950 text-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-neutral-400">Routed Token:</span>
                <span className="text-amber-400 font-black">{lastClassifiedCategory}</span>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-300 text-xs font-medium">
              <button
                onClick={() => setLang('hinglish')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  lang === 'hinglish'
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  lang === 'hi'
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:text-neutral-900'
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'router'
                ? 'bg-neutral-950 text-white shadow-md ring-2 ring-orange-500'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Core Routing Agent</span>
            <span className="text-[10px] bg-orange-500 text-neutral-950 font-black px-1.5 py-0.2 rounded font-mono">
              Live AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'earnings'
                ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-400'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-emerald-300" />
            <span>
              {lang === 'hi' ? 'कमाई ट्रैकिंग' : 'Earnings Tracking'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('welfare')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'welfare'
                ? 'bg-blue-800 text-white shadow-md ring-2 ring-blue-400'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>
              {lang === 'hi' ? 'कल्याणकारी योजनाएं' : 'Welfare Schemes'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grievance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'grievance'
                ? 'bg-amber-800 text-white shadow-md ring-2 ring-amber-400'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'hi' ? 'शिकायत व अपील' : 'Grievance Drafting'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'api'
                ? 'bg-neutral-800 text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>API & Curl</span>
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'submission'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md ring-2 ring-orange-400'
                : 'text-orange-800 hover:text-orange-950 hover:bg-orange-50/80 font-bold border border-orange-300/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Submission Guide</span>
            <span className="text-[10px] bg-amber-400 text-neutral-950 font-mono font-black px-1.5 py-0.2 rounded">
              1024 Words
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
