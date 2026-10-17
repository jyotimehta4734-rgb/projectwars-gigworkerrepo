/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { RouterHero } from './components/RouterHero';
import { EarningsWorkspace } from './components/EarningsWorkspace';
import { WelfareHub } from './components/WelfareHub';
import { GrievanceStudio } from './components/GrievanceStudio';
import { ApiTesterModal } from './components/ApiTesterModal';
import { CategoryToken, LanguageMode, RouteResult } from './types';
import { Shield, Sparkles, HelpCircle, HeartHandshake, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'router' | 'earnings' | 'welfare' | 'grievance' | 'api'>('router');
  const [lang, setLang] = useState<LanguageMode>('hinglish');
  const [lastResult, setLastResult] = useState<RouteResult | null>(null);
  const [contextQuery, setContextQuery] = useState<string>('');

  const handleNavigateToCategory = (cat: CategoryToken, queryText?: string) => {
    if (queryText) {
      setContextQuery(queryText);
    }
    switch (cat) {
      case 'EARNINGS_TRACKING':
        setActiveTab('earnings');
        break;
      case 'WELFARE_SCHEMES':
        setActiveTab('welfare');
        break;
      case 'GRIEVANCE_DRAFTING':
        setActiveTab('grievance');
        break;
    }
  };

  const handleClassified = (res: RouteResult) => {
    setLastResult(res);
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        lastClassifiedCategory={lastResult?.token}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'router' && (
          <RouterHero
            lang={lang}
            onNavigateToCategory={handleNavigateToCategory}
            onClassified={handleClassified}
          />
        )}

        {activeTab === 'earnings' && (
          <EarningsWorkspace
            lang={lang}
            initialQuery={contextQuery}
          />
        )}

        {activeTab === 'welfare' && (
          <WelfareHub
            lang={lang}
            initialQuery={contextQuery}
          />
        )}

        {activeTab === 'grievance' && (
          <GrievanceStudio
            lang={lang}
            initialQuery={contextQuery}
          />
        )}

        {activeTab === 'api' && (
          <ApiTesterModal />
        )}
      </main>

      {/* Trust & Solidarity Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-neutral-800">GigSaathi (गीग साथी)</span>
            <span>· Dedicated to India's gig partners, cab drivers & daily wage workers</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-600">
            <span>Routing Accuracy: 100% Deterministic & LLM-Grounding</span>
            <span>·</span>
            <span>Language Support: English · हिंदी · Hinglish</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
