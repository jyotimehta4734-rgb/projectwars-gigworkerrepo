import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Fuel,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Calculator,
  Volume2,
  Copy,
  Check,
  Zap,
  Gauge
} from 'lucide-react';
import { LanguageMode, ShiftEntry, TextScale } from '../types';

interface EarningsWorkspaceProps {
  lang: LanguageMode;
  textScale?: TextScale;
  initialQuery?: string;
}

export const EarningsWorkspace: React.FC<EarningsWorkspaceProps> = ({
  lang,
  textScale = 'normal',
  initialQuery,
}) => {
  // Calculator state
  const [platform, setPlatform] = useState('Uber/Ola');
  const [trips, setTrips] = useState<number>(4);
  const [gross, setGross] = useState<number>(1200);
  const [fuel, setFuel] = useState<number>(200);
  const [tips, setTips] = useState<number>(50);
  const [deductions, setDeductions] = useState<number>(0);
  const [hours, setHours] = useState<number>(5);
  const [notes, setNotes] = useState<string>('4 rides completed, smooth shift');

  // Hinglish natural text input for quick parser & Expert Financial Companion
  const [quickText, setQuickText] = useState(
    initialQuery || 'Bhaiya aaj Rs 1500 ka kaam kiya, Zomato se petrol me Rs 350 lag gaye.'
  );
  const [companionOutput, setCompanionOutput] = useState<string>(
    `Bhai, aapka aaj ka hisab yeh hai:\n\n| Description | Amount |\n| :--- | :--- |\n| Kul Kamai (Gross Earnings) | ₹1,500 |\n| Kharcha (Petrol Expense) | -₹350 |\n| **Shuddh Munafa (Net Profit)** | **₹1,150** |\n\n💡 **Tip:** Delivery ke liye peak hours (lunch aur dinner) me active rahein taaki kam samay me zyada orders milein aur petrol bache!`
  );
  const [companionLoading, setCompanionLoading] = useState(false);
  const [copiedHisaab, setCopiedHisaab] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Past logs with local persistence
  const [history, setHistory] = useState<ShiftEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gigsaathi_shift_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'shift-1',
        date: '2026-10-16',
        platform: 'Swiggy',
        tripsOrOrders: 14,
        hoursWorked: 8,
        grossEarnings: 1150,
        fuelExpense: 220,
        tips: 80,
        platformDeduction: 0,
        netProfit: 1010,
        notes: 'Dinner surge, high tips',
      },
      {
        id: 'shift-2',
        date: '2026-10-15',
        platform: 'Uber Cab',
        tripsOrOrders: 7,
        hoursWorked: 9,
        grossEarnings: 2100,
        fuelExpense: 480,
        tips: 60,
        platformDeduction: 150,
        netProfit: 1530,
        notes: 'Airport trips, CNG refueling',
      },
      {
        id: 'shift-3',
        date: '2026-10-14',
        platform: 'Blinkit',
        tripsOrOrders: 18,
        hoursWorked: 7.5,
        grossEarnings: 1350,
        fuelExpense: 180,
        tips: 110,
        platformDeduction: 0,
        netProfit: 1280,
        notes: 'Grocery morning rush',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('gigsaathi_shift_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // If initialQuery changes or is passed, try auto-parsing
  useEffect(() => {
    if (initialQuery) {
      setQuickText(initialQuery);
      parseHinglishQuery(initialQuery);
    }
  }, [initialQuery]);

  const parseHinglishQuery = (text: string) => {
    if (!text) return;
    const lower = text.toLowerCase();

    // Extract rides/trips
    const rideMatch = lower.match(/(\d+)\s*(rides|trips|orders|order|deliveries|delivery|chhakka)/i);
    if (rideMatch) {
      setTrips(parseInt(rideMatch[1], 10));
    }

    // Extract earnings/gross
    const earnMatch =
      lower.match(/(total\s*)?(rs\.?|inr|₹)?\s*(\d{2,6})\s*(kamaye|kamaai|mile|gross|rupaye)/i) ||
      lower.match(/(\d{3,6})\s*(kamaye|rupaye|rs)/i);
    if (earnMatch) {
      const val = parseInt(earnMatch[3] || earnMatch[1], 10);
      if (val > 0) setGross(val);
    }

    // Extract fuel
    const fuelMatch =
      lower.match(/(rs\.?|₹)?\s*(\d{2,5})\s*(fuel|petrol|cng|diesel)/i) ||
      lower.match(/(fuel|petrol|cng|diesel)\s*(me|ka|pe)?\s*(rs\.?|₹)?\s*(\d{2,5})/i);
    if (fuelMatch) {
      const val = parseInt(fuelMatch[2] || fuelMatch[4], 10);
      if (val > 0) setFuel(val);
    }

    // Extract tips
    const tipMatch =
      lower.match(/(tip|tips)\s*(rs\.?|₹)?\s*(\d{1,4})/i) || lower.match(/(\d{1,4})\s*(tip|tips)/i);
    if (tipMatch) {
      const val = parseInt(tipMatch[3] || tipMatch[1], 10);
      if (val > 0) setTips(val);
    }
  };

  const handleFinancialCompanion = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || quickText;
    if (!textToAnalyze.trim()) return;

    setCompanionLoading(true);
    try {
      const res = await fetch('/api/financial-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToAnalyze }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.textResponse) {
          setCompanionOutput(data.textResponse);
        }
        if (data.grossEarnings) setGross(data.grossEarnings);
        if (data.totalExpenses) setFuel(data.totalExpenses);
      }
    } catch (err) {
      console.error('Financial companion error:', err);
    } finally {
      setCompanionLoading(false);
    }
  };

  const handleCopyHisaab = () => {
    navigator.clipboard.writeText(companionOutput);
    setCopiedHisaab(true);
    setTimeout(() => setCopiedHisaab(false), 2000);
  };

  const handleSpeakHisaab = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const clean = companionOutput.replace(/[*#|`-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.lang = 'hi-IN';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Math calculations
  const totalRevenue = gross + tips;
  const totalExpense = fuel + deductions;
  const netInHand = Math.max(0, totalRevenue - totalExpense);
  const hourlyRate = hours > 0 ? (netInHand / hours).toFixed(1) : '0';
  const fuelRatio = gross > 0 ? ((fuel / gross) * 100).toFixed(1) : '0';

  const handleSaveShift = () => {
    const newEntry: ShiftEntry = {
      id: `shift-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      platform,
      tripsOrOrders: trips,
      hoursWorked: hours,
      grossEarnings: gross,
      fuelExpense: fuel,
      tips,
      platformDeduction: deductions,
      netProfit: netInHand,
      notes,
    };
    setHistory([newEntry, ...history]);
  };

  const handleDeleteEntry = (id: string) => {
    setHistory(history.filter((h) => h.id !== id));
  };

  const handleExportCSV = () => {
    const headers = 'Date,Platform,Trips,Hours,Gross,Fuel,Tips,Deductions,NetTakeHome,Notes\n';
    const rows = history
      .map(
        (h) =>
          `${h.date},"${h.platform}",${h.tripsOrOrders},${h.hoursWorked},${h.grossEarnings},${h.fuelExpense},${h.tips},${h.platformDeduction},${h.netProfit},"${h.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gigsaathi-earnings-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Workspace Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            <Calculator className="w-4 h-4" />
            <span>EARNINGS_TRACKING WORKSPACE & HISAAB AI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'hi'
              ? 'दैनिक कमाई, पेट्रोल/CNG और शुद्ध बचत कैलकुलेटर'
              : 'Daily Shift Wages, Fuel Expenses & Real Profit Analytics'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
            {lang === 'hi'
              ? 'एग्रीगेटर ऐप ग्रॉस कमाई दिखाता है, लेकिन पेट्रोल, कमीशन और डिडक्शन के बाद आपकी जेब में कितना बचा? यहाँ रियल हिसाब निकालें।'
              : 'Track what actually goes into your pocket after subtracting petrol/CNG, platform commissions, penalties, and tolls.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 text-xs font-bold tracking-wide transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log ({history.length})</span>
        </button>
      </div>

      {/* EXPERT FINANCIAL COMPANION (HISAAB AI) INTERACTIVE CARD */}
      <div className="bg-gradient-to-br from-emerald-900 via-neutral-900 to-neutral-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                Expert Financial Companion (हिसाब साथी)
                <span className="text-[10px] font-mono uppercase bg-emerald-400 text-neutral-950 font-black px-1.5 py-0.5 rounded">
                  Hisaab AI
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Automatic Gross Earnings & Expense extraction, Net Profit computation, and actionable Hinglish budgeting advice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakHisaab}
              className="p-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-white/10"
              title="Listen to Hisaab & Tip"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Stop Bolna' : 'Bolke Sunao'}</span>
            </button>
            <button
              onClick={handleCopyHisaab}
              className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {copiedHisaab ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Hisaab</span>
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
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFinancialCompanion();
                }
              }}
              placeholder='e.g., "Bhaiya aaj Rs 1500 ka kaam kiya, Zomato se petrol me Rs 350 lag gaye."'
              className="flex-1 p-3.5 rounded-xl bg-neutral-900 border border-emerald-500/40 text-white text-sm focus:border-emerald-400 outline-none placeholder:text-neutral-500"
            />
            <button
              onClick={() => handleFinancialCompanion()}
              disabled={companionLoading}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md flex items-center justify-center gap-2"
            >
              {companionLoading ? (
                <span>Calculating...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Hisaab Nikalo & Get Tip</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-neutral-400 text-[11px] font-semibold">1-Tap Scenarios:</span>
            <button
              onClick={() => {
                const q = 'Bhaiya aaj Rs 1500 ka kaam kiya, Zomato se petrol me Rs 350 lag gaye.';
                setQuickText(q);
                handleFinancialCompanion(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "Rs 1500 kaam, petrol 350"
            </button>
            <button
              onClick={() => {
                const q = 'Aaj maine 4 rides ki, total 1200 kamaye, par Rs 200 fuel me gaye';
                setQuickText(q);
                handleFinancialCompanion(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "4 rides 1200 kamaye, 200 fuel"
            </button>
            <button
              onClick={() => {
                const q = 'Uber me 2100 ka kaam hua, CNG 450 lag gayi aur chai nashta 80 rupaye';
                setQuickText(q);
                handleFinancialCompanion(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-xs border border-white/10 transition-all font-medium"
            >
              "2100 kaam, CNG 450, nashta 80"
            </button>
          </div>
        </div>

        {/* Formatted Markdown Table & Tip Output Box */}
        <div className="mt-4 pt-4 border-t border-emerald-800/60">
          <div className="bg-neutral-950 rounded-xl p-4 sm:p-5 border border-emerald-500/30 text-emerald-100 font-sans text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
            {companionOutput}
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Grid with Steppers & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters Form with Quick Increment Steppers */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-300 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" />
              <span>Manual Interactive Shift Calculator</span>
            </h3>
            <span className="text-xs text-neutral-500 font-medium">Use steppers or sliders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Platform / Company
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-semibold outline-none"
              >
                <option value="Swiggy">Swiggy Delivery</option>
                <option value="Zomato">Zomato Delivery</option>
                <option value="Uber Cab">Uber Cab / Auto</option>
                <option value="Ola">Ola Cab / Auto</option>
                <option value="Rapido">Rapido Bike Taxi</option>
                <option value="Blinkit">Blinkit Quick Commerce</option>
                <option value="Zepto">Zepto Grocery</option>
                <option value="Porter">Porter Logistics</option>
                <option value="Urban Company">Urban Company Services</option>
                <option value="Daily Wage / Offline">Daily Wage (दैनिक दिहाड़ी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Trips / Orders Completed
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  value={trips}
                  onChange={(e) => setTrips(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTrips(trips + 1)}
                  className="px-2.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-xs"
                >
                  +1
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Shift Working Hours
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() => setHours(hours + 1)}
                  className="px-2.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-xs"
                >
                  +1h
                </button>
              </div>
            </div>
          </div>

          {/* Quick Increment Touch Controls for Money */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Gross Earnings Field */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-700">Gross App Earnings (₹)</label>
                <span className="text-sm font-black text-neutral-900">₹{gross}</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={gross}
                onChange={(e) => setGross(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-neutral-500">Quick:</span>
                <button
                  type="button"
                  onClick={() => setGross(gross + 100)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹100
                </button>
                <button
                  type="button"
                  onClick={() => setGross(gross + 500)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹500
                </button>
                <button
                  type="button"
                  onClick={() => setGross(gross + 1000)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹1000
                </button>
              </div>
            </div>

            {/* Fuel / CNG Expense Field */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-700">Fuel / CNG Expense (₹)</label>
                <span className="text-sm font-black text-red-600">₹{fuel}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1500}
                step={25}
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-neutral-500">Quick:</span>
                <button
                  type="button"
                  onClick={() => setFuel(fuel + 50)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹50
                </button>
                <button
                  type="button"
                  onClick={() => setFuel(fuel + 100)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹100
                </button>
                <button
                  type="button"
                  onClick={() => setFuel(fuel + 200)}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-300 font-semibold"
                >
                  +₹200
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Cash / In-App Tips (₹)
              </label>
              <input
                type="number"
                value={tips}
                onChange={(e) => setTips(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Tolls / Platform Deductions (₹)
              </label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Shift Notes / Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Rainy day surge, high customer tips, heavy traffic on Ring Road"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveShift}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Shift into My History</span>
            </button>
          </div>
        </div>

        {/* Live Take-Home Profit & Fuel Gauge Card */}
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-400 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-950">
              REAL IN-HAND NET PROFIT
            </span>

            <div className="mt-3 bg-white rounded-2xl p-5 border border-emerald-300 shadow-inner text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
                Asal Munafa (असल बचत)
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-700 my-1">
                ₹{netInHand.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-neutral-600">
                After ₹{fuel} fuel & deductions
              </span>
            </div>

            {/* Interactive Fuel Gauge Meter */}
            <div className="mt-4 p-3.5 bg-white rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1 text-neutral-700">
                  <Gauge className="w-4 h-4 text-emerald-700" />
                  Fuel Burden Ratio:
                </span>
                <span
                  className={
                    Number(fuelRatio) > 25
                      ? 'text-red-600 font-black'
                      : Number(fuelRatio) > 18
                      ? 'text-amber-600 font-bold'
                      : 'text-emerald-700 font-bold'
                  }
                >
                  {fuelRatio}% of Gross
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    Number(fuelRatio) > 25
                      ? 'bg-red-500'
                      : Number(fuelRatio) > 18
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, Number(fuelRatio)))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0% Safe</span>
                <span>18% Moderate</span>
                <span>25%+ Danger</span>
              </div>
            </div>

            {/* Metric Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-emerald-200">
                <span className="text-neutral-600 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  Effective Net Wage/Hour:
                </span>
                <span className="font-bold text-neutral-900">₹{hourlyRate} / hr</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-emerald-200">
                <span className="text-neutral-600 font-medium">Earnings per Trip/Order:</span>
                <span className="font-bold text-neutral-900">
                  ₹{trips > 0 ? (netInHand / trips).toFixed(0) : '0'} / order
                </span>
              </div>
            </div>
          </div>

          {/* Efficiency Insight */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Saathi Tip: </span>
              {Number(fuelRatio) > 25
                ? 'Your fuel is taking more than 25% of your earnings. Try switching routes or consider EV/CNG rental programs to double take-home.'
                : 'Good efficiency! Fuel expense is under healthy limits for platform delivery.'}
            </div>
          </div>
        </div>
      </div>

      {/* Shift Log History Table */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-neutral-900 text-base">
              Logged Shift History ({history.length} records)
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Trips/Orders</th>
                <th className="py-3 px-3">Hours</th>
                <th className="py-3 px-3">Gross</th>
                <th className="py-3 px-3">Fuel (₹)</th>
                <th className="py-3 px-3">Tips (₹)</th>
                <th className="py-3 px-3 text-emerald-800 font-bold">Net In-Hand (₹)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-neutral-700">{h.date}</td>
                  <td className="py-3.5 px-3 font-bold text-neutral-900">{h.platform}</td>
                  <td className="py-3.5 px-3 font-mono">{h.tripsOrOrders}</td>
                  <td className="py-3.5 px-3 font-mono">{h.hoursWorked}h</td>
                  <td className="py-3.5 px-3 font-mono font-medium">₹{h.grossEarnings}</td>
                  <td className="py-3.5 px-3 font-mono text-red-600 font-medium">-₹{h.fuelExpense}</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-700 font-medium">+₹{h.tips}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-700">
                    ₹{h.netProfit}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteEntry(h.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
