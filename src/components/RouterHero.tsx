import React, { useState, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  RefreshCw,
  Terminal,
  Layers,
  Code
} from 'lucide-react';
import { CategoryToken, LanguageMode, RouteResult } from '../types';
import { PROMPT_EXAMPLES } from '../data/examples';
import { routeInput } from '../utils/classifier';

interface RouterHeroProps {
  lang: LanguageMode;
  onNavigateToCategory: (category: CategoryToken, initialQuery?: string) => void;
  onClassified: (res: RouteResult) => void;
}

export const RouterHero: React.FC<RouterHeroProps> = ({
  lang,
  onNavigateToCategory,
  onClassified,
}) => {
  const [input, setInput] = useState('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryToken>('all');
  const [showInspector, setShowInspector] = useState(true);
  const [multiAgentResponse, setMultiAgentResponse] = useState<string>('');
  const [pipelineDetails, setPipelineDetails] = useState<any>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  // Initial classification run for the default prompt example
  useEffect(() => {
    handleClassify('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
  }, []);

  const handleClassify = async (textToRoute?: string) => {
    const text = (textToRoute ?? input).trim();
    if (!text) return;

    setLoading(true);
    try {
      const [res, chatRes] = await Promise.all([
        routeInput(text),
        fetch('/api/gigsaathi-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: text }),
        })
          .then((r) => r.json())
          .catch(() => null),
      ]);

      setResult(res);
      onClassified(res);

      if (chatRes?.textResponse) {
        setMultiAgentResponse(chatRes.textResponse);
        setPipelineDetails(chatRes.pipeline);
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (!speechSupported) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleClassify(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  const handleSpeakOutput = () => {
    if (!result || typeof window === 'undefined') return;
    const msg =
      result.token === 'EARNINGS_TRACKING'
        ? 'Categorized as Earnings Tracking. Opening daily wage and fuel calculation.'
        : result.token === 'WELFARE_SCHEMES'
        ? 'Categorized as Welfare Schemes. Opening government benefits and e-Shram guide.'
        : 'Categorized as Grievance Drafting. Opening dispute resolution and penalty appeal.';

    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const getCategoryTheme = (token: CategoryToken) => {
    switch (token) {
      case 'EARNINGS_TRACKING':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-700 text-white',
          accent: 'text-emerald-700',
          border: 'border-emerald-500',
          title: 'Earnings Tracking',
          hindiTitle: 'कमाई व पेट्रोल/CNG हिसाब',
          actionText: 'Open Earnings & Fuel Calculator',
          actionTab: 'earnings' as const,
        };
      case 'WELFARE_SCHEMES':
        return {
          bg: 'bg-blue-50 border-blue-300 text-blue-950',
          badge: 'bg-blue-700 text-white',
          accent: 'text-blue-700',
          border: 'border-blue-500',
          title: 'Welfare Schemes',
          hindiTitle: 'सरकारी योजनाएं व ई-श्रम पोर्टल',
          actionText: 'Explore Welfare & e-Shram Portal',
          actionTab: 'welfare' as const,
        };
      case 'GRIEVANCE_DRAFTING':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-700 text-white',
          accent: 'text-amber-800',
          border: 'border-amber-500',
          title: 'Grievance Drafting',
          hindiTitle: 'शिकायत, फाइन व आईडी सस्पेंशन अपील',
          actionText: 'Draft Formal Appeal Letter',
          actionTab: 'grievance' as const,
        };
    }
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-3 border border-orange-200">
          <Zap className="w-3.5 h-3.5 text-orange-600" />
          <span>Core Routing Agent Engine · Exact Token Resolution</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          {lang === 'hi'
            ? 'गीग वर्कर्स के सवालों का ऑटोमैटिक AI वर्गीकरण'
            : lang === 'hinglish'
            ? 'Hinglish, Hindi ya English me bolo — AI sahi system me route karega'
            : 'Tri-Category Neural Router for Informal & Gig Workers'}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">
          {lang === 'hi'
            ? 'कोई भी समस्या या सवाल टाइप या बोलें: कमाई का हिसाब, सरकारी योजनाएं, या फाइन/आईडी बैन की शिकायत।'
            : 'Analyzes natural voice & text across English, Devanagari Hindi, and Hinglish. Emits strictly one category token.'}
        </p>
      </div>

      {/* Main Interactive Router Box */}
      <div className="bg-white rounded-2xl border border-neutral-300 shadow-lg overflow-hidden transition-all">
        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-neutral-50/80 to-white border-b border-neutral-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 flex items-center justify-between">
            <span>
              {lang === 'hi'
                ? 'श्रमिक प्रश्न / समस्या (Worker Input)'
                : 'Worker Input (English / Hindi / Hinglish)'}
            </span>
            <span className="text-[11px] text-neutral-400 font-normal">
              Press Enter or click Classify
            </span>
          </label>

          <div className="relative">
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleClassify();
                }
              }}
              placeholder={
                lang === 'hi'
                  ? 'उदा. "स्विगी ने बिना वजह 500 रुपये काट लिए, क्या करूँ?" या "ई-श्रम कार्ड कैसे बनेगा?"'
                  : 'Type or speak in Hinglish/Hindi/English e.g., "Aaj 1200 kamaye 200 fuel me gaye" or "Swiggy ne 500 fine lagaya"'
              }
              className="w-full text-base sm:text-lg p-3.5 sm:p-4 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-neutral-900 placeholder:text-neutral-400 bg-white font-sans transition-all resize-none"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleSpeechToggle}
                  title="Speech-to-Text Input (Hindi/English)"
                  className={`p-2.5 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-300'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => handleClassify()}
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-50 font-semibold text-sm transition-all shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-orange-400" />
                    <span>Classify & Route</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Classification Result Showcase */}
        {result && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
              {/* PRIMARY TOKEN EMISSION DISPLAY */}
              <div
                className={`flex-1 rounded-xl p-5 border-2 ${
                  getCategoryTheme(result.token).border
                } ${getCategoryTheme(result.token).bg} transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-mono tracking-wider font-bold text-neutral-600">
                    Routing Agent Decision (Mandated Output)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSpeakOutput}
                      title="Audio Speech Synthesis"
                      className="p-1.5 rounded-md hover:bg-black/5 text-neutral-700"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopyToken}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white border border-neutral-300 hover:bg-neutral-50 font-medium text-neutral-800 shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied Token</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Token</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* THE RAW CATEGORY TOKEN - PROMINENT & STRICT */}
                <div className="bg-neutral-950 text-neutral-100 rounded-lg p-4 font-mono text-center my-2 shadow-inner border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 uppercase tracking-widest mb-1">
                    System Category Token
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-wider text-amber-400 select-all">
                    {result.token}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Confidence: {(result.confidence * 100).toFixed(1)}% · Engine: {result.source}
                  </div>
                </div>

                {/* Plain Hindi/English Meaning & Direct Deep Dive */}
                <div className="mt-4 pt-3 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">
                      {getCategoryTheme(result.token).title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{result.reason}</p>
                  </div>

                  <button
                    onClick={() =>
                      onNavigateToCategory(
                        result.token,
                        input
                      )
                    }
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-semibold transition-all shadow-xs"
                  >
                    <span>{getCategoryTheme(result.token).actionText}</span>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </button>
                </div>
              </div>

              {/* TECHNICAL AGENT TERMINAL INSPECTOR */}
              {showInspector && (
                <div className="w-full lg:w-80 rounded-xl bg-neutral-950 text-neutral-200 p-4 font-mono text-xs border border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-3">
                      <span className="flex items-center gap-1.5 text-neutral-400 font-bold">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        AGENT RAW LOG
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">200 OK</span>
                    </div>

                    <div className="space-y-1.5 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-neutral-500">Input:</span>{' '}
                        <span className="text-neutral-300">"{result.input.slice(0, 45)}..."</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Dialect:</span>{' '}
                        <span className="text-amber-300">{result.detectedLanguage}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Model:</span>{' '}
                        <span className="text-sky-400">{result.source}</span>
                      </div>
                      <div className="pt-2 border-t border-neutral-800 mt-2">
                        <span className="text-neutral-500">Strict Output:</span>
                        <div className="p-2 bg-neutral-900 rounded border border-neutral-700 text-emerald-400 font-bold mt-1 text-sm">
                          {result.token}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
                    <span>Format: Token-Only</span>
                    <span className="text-emerald-500">0 Conversational Filler</span>
                  </div>
                </div>
              )}
            </div>

            {/* UNIFIED MULTI-AGENT PIPELINE RESPONSE SHOWCASE */}
            {multiAgentResponse && (
              <div className="mt-5 pt-4 border-t border-neutral-200">
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-xl p-4 sm:p-5 border border-neutral-800 shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-400">
                        GigSaathi Multi-Agent Workflow Result
                      </span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                        Router ➔ Expert ➔ Multilingual Presenter
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(multiAgentResponse);
                        setCopiedResponse(true);
                        setTimeout(() => setCopiedResponse(false), 2000);
                      }}
                      className="text-xs px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1 font-medium transition-all"
                    >
                      {copiedResponse ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Output</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-sans text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-950/80 p-4 rounded-lg border border-neutral-850">
                    {multiAgentResponse}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QUICK PRESET SCENARIOS (Including all 3 exact Prompt Examples) */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
              {lang === 'hi'
                ? 'परीक्षण उदाहरण (Prompt Examples & Real Scenarios)'
                : 'Canonical Benchmark Examples & Test Queries'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Filter:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'all'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('EARNINGS_TRACKING')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'EARNINGS_TRACKING'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveFilter('WELFARE_SCHEMES')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'WELFARE_SCHEMES'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Welfare
            </button>
            <button
              onClick={() => setActiveFilter('GRIEVANCE_DRAFTING')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'GRIEVANCE_DRAFTING'
                  ? 'bg-amber-700 text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Grievance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROMPT_EXAMPLES.filter(
            (ex) => activeFilter === 'all' || ex.expectedCategory === activeFilter
          ).map((ex) => (
            <div
              key={ex.id}
              onClick={() => {
                setInput(ex.input);
                handleClassify(ex.input);
              }}
              className="group p-3.5 rounded-xl border border-neutral-200 hover:border-orange-500/60 bg-white hover:bg-orange-50/20 cursor-pointer transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-neutral-500 uppercase tracking-wider">
                    {ex.label}
                  </span>
                  <span
                    className={`font-mono px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      ex.expectedCategory === 'EARNINGS_TRACKING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ex.expectedCategory === 'WELFARE_SCHEMES'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ex.expectedCategory}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium line-clamp-3">
                  "{ex.input}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Language: {ex.language}</span>
                <span className="text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Test Route <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
