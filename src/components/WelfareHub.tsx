import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Check,
  ExternalLink,
  Phone,
  Search,
  Filter,
  CreditCard,
  HeartPulse,
  Award,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Volume2,
  Copy,
  CheckCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { LanguageMode, WelfareScheme, TextScale } from '../types';
import { WELFARE_SCHEMES_DATA } from '../data/schemes';

interface WelfareHubProps {
  lang: LanguageMode;
  textScale?: TextScale;
  initialQuery?: string;
}

export const WelfareHub: React.FC<WelfareHubProps> = ({
  lang,
  textScale = 'normal',
  initialQuery,
}) => {
  const [search, setSearch] = useState(
    initialQuery && initialQuery.toLowerCase().includes('e-shram') ? 'e-shram' : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme>(WELFARE_SCHEMES_DATA[0]);

  // Welfare & Legal Rights Advisor state
  const [advisorQuery, setAdvisorQuery] = useState(
    initialQuery || 'Accident insurance ka kya process hai delivery boys ke liye?'
  );
  const [advisorOutput, setAdvisorOutput] = useState(
    `Gig workers aur delivery partners ke liye Sarkari 'Pradhan Mantri Suraksha Bima Yojana' (PMSBY) sabse behtar hai:\n\n• **Kaun apply kar sakta hai (Eligibility):** 18 se 70 saal ke sabhi Bhartiya nagrik jinka bank account hai.\n• **Kya fayda milega (Benefits):** Accident se death ya full disability hone par ₹2 Lakh ka cover, sirf ₹20 prati saal ke premium par.\n• **Kaise apply karein (Process):** Apne bank ki branch me jakar ek simple PMSBY form bharein ya net banking app se auto-debit option on kar lein.`
  );
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [copiedAdvisor, setCopiedAdvisor] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Interactive 30-Second Eligibility Quiz State
  const [quizRole, setQuizRole] = useState<'delivery' | 'driver' | 'labor'>('delivery');
  const [quizAge, setQuizAge] = useState<number>(26);
  const [hasAadhaar, setHasAadhaar] = useState<boolean>(true);

  const handleAskAdvisor = async (customQ?: string) => {
    const q = customQ || advisorQuery;
    if (!q.trim()) return;

    setAdvisorLoading(true);
    try {
      const res = await fetch('/api/welfare-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: q }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.textResponse) {
          setAdvisorOutput(data.textResponse);
        }
      }
    } catch (err) {
      console.error('Welfare advisor error:', err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleCopyAdvisor = () => {
    navigator.clipboard.writeText(advisorOutput);
    setCopiedAdvisor(true);
    setTimeout(() => setCopiedAdvisor(false), 2000);
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const clean = text.replace(/[*#|•`-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.lang = 'hi-IN';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const filteredSchemes = WELFARE_SCHEMES_DATA.filter((scheme) => {
    const matchesCategory =
      selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.hindiName.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>WELFARE_SCHEMES DIRECTORY & GUIDANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'hi'
              ? 'सरकारी कल्याणकारी योजनाएं व सामाजिक सुरक्षा'
              : 'Government Welfare Schemes & Gig Social Security'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
            {lang === 'hi'
              ? 'ई-श्रम (e-Shram) कार्ड, ₹5 लाख आयुष्मान भारत स्वास्थ्य बीमा, राजस्थान गीग वर्कर्स एक्ट और ₹3,000 मासिक पेंशन की पूर्ण जानकारी।'
              : 'Official rights, social security enrollment guides, and government benefits curated specifically for unorganised delivery & cab partners.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-blue-900/60 p-3.5 rounded-xl border border-blue-700/60 text-xs text-blue-200">
          <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-sm">e-Shram Toll-Free: 14434</div>
            <div className="text-[11px] text-blue-300">National Worker Helpdesk (24/7)</div>
          </div>
        </div>
      </div>

      {/* ADVISOR INTERACTIVE CARD */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-neutral-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-blue-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-800/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                Welfare & Legal Rights Advisor (योजना व अधिकार साथी)
                <span className="text-[10px] font-mono uppercase bg-blue-400 text-neutral-950 font-black px-1.5 py-0.5 rounded">
                  Adhikar AI
                </span>
              </h3>
              <p className="text-xs text-blue-200/80">
                Democratizing access to government social security, accident insurance, and labor rights in simple brotherly Hinglish.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeakText(advisorOutput)}
              className="p-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-blue-300 text-xs font-bold flex items-center gap-1.5 border border-white/10"
              title="Listen to Advice"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Stop Bolna' : 'Bolke Sunao'}</span>
            </button>
            <button
              onClick={handleCopyAdvisor}
              className="px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {copiedAdvisor ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Advice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input & Presets */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={advisorQuery}
              onChange={(e) => setAdvisorQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAskAdvisor();
                }
              }}
              placeholder='e.g., "Accident insurance ka kya process hai delivery boys ke liye?"'
              className="flex-1 p-3.5 rounded-xl bg-neutral-900 border border-blue-500/40 text-white text-sm focus:border-blue-400 outline-none placeholder:text-neutral-500"
            />
            <button
              onClick={() => handleAskAdvisor()}
              disabled={advisorLoading}
              className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md flex items-center justify-center gap-2"
            >
              {advisorLoading ? (
                <span>Checking Rights...</span>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Jankari Prapt Karein</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Benchmark Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-neutral-400 text-[11px] font-semibold">1-Tap Scenarios:</span>
            <button
              onClick={() => {
                const q = 'Accident insurance ka kya process hai delivery boys ke liye?';
                setAdvisorQuery(q);
                handleAskAdvisor(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "Accident insurance ₹20/year"
            </button>
            <button
              onClick={() => {
                const q = 'Mera e-shram card kaise banega?';
                setAdvisorQuery(q);
                handleAskAdvisor(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "e-Shram card kaise banega"
            </button>
            <button
              onClick={() => {
                const q = 'PM-SYM pension yojana me kitna paisa jama karna padta hai?';
                setAdvisorQuery(q);
                handleAskAdvisor(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "PM-SYM ₹3000 pension"
            </button>
            <button
              onClick={() => {
                const q = 'Rajasthan gig workers welfare board me registration ke kya niyam hain?';
                setAdvisorQuery(q);
                handleAskAdvisor(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "Rajasthan Gig Act cess"
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="mt-4 pt-4 border-t border-blue-800/60">
          <div className="bg-neutral-950 rounded-xl p-4 sm:p-5 border border-blue-500/30 text-blue-100 font-sans text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
            {advisorOutput}
          </div>
        </div>
      </div>

      {/* Interactive 30-Second Eligibility Quiz */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-neutral-900 text-base">
            30-Second Interactive Scheme Matcher (आप किन योजनाओं के हकदार हैं?)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">Aapka Kaam (Role):</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setQuizRole('delivery')}
                className={`py-2 px-1 rounded-lg text-center font-bold border transition-all ${
                  quizRole === 'delivery'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}
              >
                🛵 Delivery
              </button>
              <button
                onClick={() => setQuizRole('driver')}
                className={`py-2 px-1 rounded-lg text-center font-bold border transition-all ${
                  quizRole === 'driver'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}
              >
                🚗 Cab/Auto
              </button>
              <button
                onClick={() => setQuizRole('labor')}
                className={`py-2 px-1 rounded-lg text-center font-bold border transition-all ${
                  quizRole === 'labor'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}
              >
                🛠️ Labor
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">
              Aapki Umar (Age): <strong className="text-blue-700 text-sm">{quizAge} saal</strong>
            </label>
            <input
              type="range"
              min={18}
              max={65}
              value={quizAge}
              onChange={(e) => setQuizAge(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">Aadhaar Linked Mobile:</label>
            <button
              onClick={() => setHasAadhaar(!hasAadhaar)}
              className={`w-full py-2 px-3 rounded-lg font-bold border transition-all text-left flex items-center justify-between ${
                hasAadhaar
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-red-50 text-red-800 border-red-300'
              }`}
            >
              <span>{hasAadhaar ? '✓ Haan, linked hai' : '✗ Nahi hai'}</span>
              <span className="text-[10px] font-normal underline">Tap to toggle</span>
            </button>
          </div>
        </div>

        {/* Matched Schemes Badge Strip */}
        <div className="pt-2 border-t border-neutral-200 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-neutral-800">You Qualify For:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            ✓ e-Shram UAN Card (₹2 Lakh Accident Cover)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold border border-blue-300">
            ✓ PMSBY (₹20/year ₹2L Bima)
          </span>
          {quizAge <= 40 && (
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold border border-purple-300">
              ✓ PM-SYM (₹3,000/mo Pension)
            </span>
          )}
        </div>
      </div>

      {/* Schemes Catalog & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Schemes */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes (e.g. e-shram, pension, ayushman)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-blue-500 outline-none bg-white font-medium"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredSchemes.map((scheme) => {
              const isSelected = selectedScheme.id === scheme.id;
              return (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-400'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-neutral-500 uppercase">{scheme.category}</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">
                      {scheme.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm leading-snug">
                    {lang === 'hi' ? scheme.hindiName : scheme.name}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                    {lang === 'hi' ? scheme.hindiDescription : scheme.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Scheme Deep-Dive */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-300 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-neutral-200 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                {selectedScheme.badge}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleSpeakText(
                      `${selectedScheme.name}. ${selectedScheme.description}. Benefits: ${selectedScheme.benefits.join(
                        '. '
                      )}`
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Suno</span>
                </button>
                <a
                  href={selectedScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <h3 className="text-xl font-black text-neutral-900">
              {lang === 'hi' ? selectedScheme.hindiName : selectedScheme.name}
            </h3>
            <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
              {lang === 'hi' ? selectedScheme.hindiDescription : selectedScheme.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold text-neutral-500 mb-2">
              Key Benefits & Entitlements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedScheme.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-neutral-800 font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold text-neutral-500 mb-2">
              Who is Eligible? (पात्रता)
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-700">
              {selectedScheme.eligibility.map((e, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <h4 className="text-xs uppercase font-mono font-bold text-neutral-700 mb-2">
              Required Documents (ज़रूरी दस्तावेज़)
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedScheme.requiredDocs.map((doc, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white px-3 py-1.5 rounded-lg border border-neutral-300 font-bold text-neutral-800 shadow-2xs"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>

          {/* Helpline Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs text-neutral-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>National Helpline: <strong className="text-neutral-900">{selectedScheme.helpline}</strong></span>
            </span>
            <span className="text-neutral-400">Govt of India / State Labour Dept</span>
          </div>
        </div>
      </div>
    </div>
  );
};
