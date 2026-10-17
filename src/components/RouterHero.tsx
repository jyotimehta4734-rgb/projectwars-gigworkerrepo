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
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { CategoryToken, LanguageMode, RouteResult, TextScale } from '../types';
import { PROMPT_EXAMPLES } from '../data/examples';
import { routeInput } from '../utils/classifier';

interface RouterHeroProps {
  lang: LanguageMode;
  textScale?: TextScale;
  onNavigateToCategory: (category: CategoryToken, initialQuery?: string) => void;
  onClassified: (res: RouteResult) => void;
}

export const RouterHero: React.FC<RouterHeroProps> = ({
  lang,
  textScale = 'normal',
  onNavigateToCategory,
  onClassified,
}) => {
  const [input, setInput] = useState('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [multiAgentResponse, setMultiAgentResponse] = useState<string>('');
  const [pipelineDetails, setPipelineDetails] = useState<any>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryToken>('all');
  const [currentStep, setCurrentStep] = useState<number>(3); // 1: Input, 2: Agent A, 3: Agent B & C

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

  // Initial classification run
  useEffect(() => {
    handleClassify('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
  }, []);

  const handleClassify = async (textToRoute?: string) => {
    const text = (textToRoute ?? input).trim();
    if (!text) return;

    setLoading(true);
    setCurrentStep(2);
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
      setCurrentStep(3);

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
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!multiAgentResponse) return;
    navigator.clipboard.writeText(multiAgentResponse);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
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

  const handleSpeakText = (textToSpeak: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const cleanText = textToSpeak.replace(/[*#|•`-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'hi-IN';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const getCategoryTheme = (token: CategoryToken) => {
    switch (token) {
      case 'EARNINGS_TRACKING':
        return {
          bg: 'bg-emerald-50 border-emerald-400 text-emerald-950',
          badge: 'bg-emerald-800 text-white',
          accent: 'text-emerald-800',
          border: 'border-emerald-500',
          title: 'Earnings Tracking (कमाई का हिसाब)',
          hindiTitle: 'कमाई व पेट्रोल/CNG हिसाब',
          actionText: 'Open Full Earnings Calculator',
          actionTab: 'earnings' as const,
        };
      case 'WELFARE_SCHEMES':
        return {
          bg: 'bg-blue-50 border-blue-400 text-blue-950',
          badge: 'bg-blue-800 text-white',
          accent: 'text-blue-800',
          border: 'border-blue-500',
          title: 'Welfare Schemes (सरकारी योजनाएं व अधिकार)',
          hindiTitle: 'सरकारी योजनाएं व ई-श्रम पोर्टल',
          actionText: 'Explore Welfare & e-Shram Portal',
          actionTab: 'welfare' as const,
        };
      case 'GRIEVANCE_DRAFTING':
        return {
          bg: 'bg-amber-50 border-amber-400 text-amber-950',
          badge: 'bg-amber-800 text-white',
          accent: 'text-amber-800',
          border: 'border-amber-500',
          title: 'Grievance Drafting (फाइन व आईडी अपील)',
          hindiTitle: 'शिकायत, फाइन व आईडी सस्पेंशन अपील',
          actionText: 'Draft Corporate Appeal Letter',
          actionTab: 'grievance' as const,
        };
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-200 shadow-2xs">
          <Zap className="w-4 h-4 text-orange-600 fill-orange-500" />
          <span>Core AI Routing & Multi-Agent Assistant for Gig Workers</span>
        </div>
        <h2 className={`font-black text-neutral-900 tracking-tight leading-tight ${
          textScale === 'xlarge' ? 'text-3xl sm:text-5xl' : textScale === 'large' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
        }`}>
          {lang === 'hi'
            ? 'अपनी भाषा में बोलें या लिखें — साथी AI सही जगह मदद करेगा'
            : lang === 'hinglish'
            ? 'Hinglish, Hindi ya English me bolo — AI turant sahi category me route karega'
            : 'Voice & Text AI Companion for India’s Delivery & Cab Partners'}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">
          {lang === 'hi'
            ? 'कमाई का हिसाब, ई-श्रम व सरकारी योजनाएं, या स्विगी/उबर के गलत फाइन और आईडी ब्लॉक की शिकायत।'
            : 'Classifies inputs into EARNINGS_TRACKING, WELFARE_SCHEMES, or GRIEVANCE_DRAFTING with full multi-agent support.'}
        </p>
      </div>

      {/* Interactive 3-Agent Live Pipeline Visualizer */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">
          <span>Multi-Agent Live Execution Pipeline</span>
          <span className="text-emerald-700 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            System Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Agent A Box */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentStep >= 2
              ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-2xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-600'
          }`}>
            <div className="flex items-center justify-between mb-1 font-bold">
              <span className="flex items-center gap-1.5 text-orange-900">
                <Terminal className="w-3.5 h-3.5 text-orange-600" />
                1. Agent A (Core Router)
              </span>
              <span className="font-mono text-[10px] bg-orange-200 text-orange-900 px-1.5 rounded">
                Token Output
              </span>
            </div>
            <p className="text-[11px] text-neutral-700">
              Classifies input into strictly one category token without conversational filler.
            </p>
            {result && (
              <div className="mt-2 text-[11px] font-mono font-black text-orange-900 bg-white/80 p-1.5 rounded border border-orange-300 truncate">
                ➔ {result.token}
              </div>
            )}
          </div>

          {/* Agent B Box */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentStep >= 3
              ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-2xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-600'
          }`}>
            <div className="flex items-center justify-between mb-1 font-bold">
              <span className="flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                2. Agent B (Domain Expert)
              </span>
              <span className="font-mono text-[10px] bg-blue-200 text-blue-900 px-1.5 rounded">
                Logic & Math
              </span>
            </div>
            <p className="text-[11px] text-neutral-700">
              Performs arithmetic, policy analysis, or formal corporate appeal legal structuring.
            </p>
            <div className="mt-2 text-[11px] font-mono text-blue-900 bg-white/80 p-1.5 rounded border border-blue-300 truncate">
              {result?.token === 'EARNINGS_TRACKING'
                ? 'Gross - Fuel = Net Profit'
                : result?.token === 'WELFARE_SCHEMES'
                ? 'Eligibility · Benefits · Process'
                : 'Telematics Audit Request'}
            </div>
          </div>

          {/* Agent C Box */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentStep >= 3
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-2xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-600'
          }`}>
            <div className="flex items-center justify-between mb-1 font-bold">
              <span className="flex items-center gap-1.5 text-emerald-900">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                3. Agent C (Multilingual Presenter)
              </span>
              <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-1.5 rounded">
                Warm Hinglish
              </span>
            </div>
            <p className="text-[11px] text-neutral-700">
              Presents friendly brotherly tone with clean visual Markdown tables and voice readout.
            </p>
            <div className="mt-2 text-[11px] font-mono text-emerald-900 bg-white/80 p-1.5 rounded border border-emerald-300 truncate">
              Bhai, aapka hisab & tips tayyar!
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Input Console */}
      <div className="bg-white rounded-2xl border-2 border-neutral-300 shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <span>Worker Natural Query (बोलें या लिखें)</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 hidden sm:inline">Speed:</span>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-xs text-neutral-700 outline-none"
              >
                <option value={0.85}>0.85x (Slow/Clear)</option>
                <option value={0.95}>1.0x (Normal)</option>
                <option value={1.15}>1.2x (Fast)</option>
              </select>
            </div>
          </div>

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
              placeholder='e.g., "Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo" ya "Aaj 1200 kamaye, 200 fuel me gaye"'
              className={`w-full p-4 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-neutral-900 placeholder:text-neutral-400 bg-white font-sans transition-all resize-none ${
                textScale === 'xlarge' ? 'text-xl' : textScale === 'large' ? 'text-lg' : 'text-base'
              }`}
            />

            {/* Accessible Audio & Action Bar */}
            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleSpeechToggle}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all shadow-xs ${
                      isListening
                        ? 'bg-red-600 text-white border-red-700 animate-pulse'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 text-white" />
                        <span>Listening... (Bol rahe hain)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-orange-600" />
                        <span>Bolein (Microphone Voice Input)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="px-3 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 text-xs font-semibold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleClassify()}
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                      <span>Classifying & Computing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-orange-400" />
                      <span>Process & Route</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Result View */}
        {result && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* AGENT A STRICT TOKEN BADGE */}
            <div className={`p-5 rounded-2xl border-2 ${getCategoryTheme(result.token).border} ${getCategoryTheme(result.token).bg} shadow-sm`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-neutral-700">
                    Agent A: Core Router Output Token
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakText(`Category token is ${result.token}. ${result.reason}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-neutral-800 shadow-2xs"
                    title="Audio read aloud"
                  >
                    <Volume2 className="w-4 h-4 text-neutral-700" />
                    <span>Bolke Suno</span>
                  </button>

                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-neutral-800 shadow-2xs"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-neutral-700" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Exact Mandated Token Display */}
              <div className="bg-neutral-950 text-neutral-100 rounded-xl p-4 font-mono text-center shadow-inner border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                  Strict Classification Token (Mandated Format)
                </span>
                <span className="text-2xl sm:text-4xl font-black text-amber-400 tracking-wider select-all block">
                  {result.token}
                </span>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Confidence: {(result.confidence * 100).toFixed(1)}% · Dialect: {result.detectedLanguage} · Engine: {result.source}
                </span>
              </div>

              {/* Action Button & Deep Dive */}
              <div className="mt-4 pt-3 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">
                    {getCategoryTheme(result.token).title}
                  </h4>
                  <p className="text-xs text-neutral-700 mt-0.5">{result.reason}</p>
                </div>

                <button
                  onClick={() => onNavigateToCategory(result.token, input)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 text-sm font-bold transition-all shadow-md"
                >
                  <span>{getCategoryTheme(result.token).actionText}</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </button>
              </div>
            </div>

            {/* AGENT B & C UNIFIED MULTI-AGENT RESPONSE SHOWCASE */}
            {multiAgentResponse && (
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-400">
                      GigSaathi Multi-Agent Response (Agent B & C)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakText(multiAgentResponse)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Stop Audio' : 'Audio Read Aloud'}</span>
                    </button>

                    <button
                      onClick={handleCopyResponse}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
                    >
                      {copiedResponse ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className={`font-sans text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-950/80 p-4 sm:p-5 rounded-xl border border-neutral-800/80 ${
                  textScale === 'xlarge' ? 'text-base sm:text-lg' : textScale === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                }`}>
                  {multiAgentResponse}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QUICK BENCHMARK PRESETS (1-Tap for High Accessibility) */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
              {lang === 'hi'
                ? '1-क्लिक परीक्षण प्रश्न (बिना टाइप किए तुरंत आज़माएँ)'
                : '1-Tap Interactive Queries (No Typing Required)'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Filter:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                activeFilter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('EARNINGS_TRACKING')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                activeFilter === 'EARNINGS_TRACKING'
                  ? 'bg-emerald-800 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveFilter('WELFARE_SCHEMES')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                activeFilter === 'WELFARE_SCHEMES'
                  ? 'bg-blue-800 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Welfare
            </button>
            <button
              onClick={() => setActiveFilter('GRIEVANCE_DRAFTING')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                activeFilter === 'GRIEVANCE_DRAFTING'
                  ? 'bg-amber-800 text-white'
                  : 'text-neutral-700 hover:bg-neutral-200'
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
              className="group p-4 rounded-xl border border-neutral-200 hover:border-orange-500 bg-neutral-50/50 hover:bg-orange-50/20 cursor-pointer transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-neutral-600 uppercase tracking-wider">
                    {ex.label}
                  </span>
                  <span
                    className={`font-mono px-2 py-0.5 rounded text-[10px] font-black ${
                      ex.expectedCategory === 'EARNINGS_TRACKING'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : ex.expectedCategory === 'WELFARE_SCHEMES'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {ex.expectedCategory}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-900 font-medium line-clamp-3">
                  "{ex.input}"
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                <span>{ex.language}</span>
                <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  1-Tap Route <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
