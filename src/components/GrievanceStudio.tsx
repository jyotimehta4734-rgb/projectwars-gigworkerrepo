import React, { useState, useEffect } from 'react';
import {
  Scale,
  Send,
  Copy,
  Check,
  AlertTriangle,
  Mail,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Building2,
  FileCheck,
  PhoneCall,
  Volume2,
  ExternalLink,
  Share2
} from 'lucide-react';
import { LanguageMode, TextScale } from '../types';

interface GrievanceStudioProps {
  lang: LanguageMode;
  textScale?: TextScale;
  initialQuery?: string;
}

export const GrievanceStudio: React.FC<GrievanceStudioProps> = ({
  lang,
  textScale = 'normal',
  initialQuery,
}) => {
  const [platform, setPlatform] = useState('Uber');
  const [issueType, setIssueType] = useState('Wrongful Account Suspension / ID Block');
  const [amount, setAmount] = useState<number>(500);
  const [workerName, setWorkerName] = useState('Ramesh Kumar');
  const [partnerId, setPartnerId] = useState('UBER-DRV-9941');
  const [orderId, setOrderId] = useState('TRIP-748921');
  const [details, setDetails] = useState(
    initialQuery || 'Uber ne mera account block kar diya hai customer ki jhoothi complaint par.'
  );

  const [generating, setGenerating] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // If initialQuery arrives, auto-extract details
  useEffect(() => {
    if (initialQuery) {
      setDetails(initialQuery);
      const lower = initialQuery.toLowerCase();
      if (lower.includes('swiggy')) setPlatform('Swiggy');
      else if (lower.includes('zomato')) setPlatform('Zomato');
      else if (lower.includes('uber')) setPlatform('Uber');
      else if (lower.includes('ola')) setPlatform('Ola');
      else if (lower.includes('blinkit')) setPlatform('Blinkit');
      else if (lower.includes('zepto')) setPlatform('Zepto');

      const amtMatch = lower.match(/(rs\.?|₹)?\s*(\d{2,5})/i);
      if (amtMatch && amtMatch[2]) {
        setAmount(parseInt(amtMatch[2], 10));
      }

      if (lower.includes('suspend') || lower.includes('block') || lower.includes('band')) {
        setIssueType('Wrongful Account Suspension / ID Block');
      } else if (lower.includes('customer') || lower.includes('jhooth')) {
        setIssueType('False Customer Dispute / Allegation');
      } else {
        setIssueType('Unfair Fine / Penalty Deduction');
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    generateAppeal();
  }, [platform, issueType, amount, workerName, partnerId, orderId, details]);

  const generateAppeal = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/draft-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          issueType,
          amount,
          workerName,
          partnerId,
          orderId,
          details,
          input: details,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.fullTextResponse || data.formalEmail) {
          setEmailDraft(data.fullTextResponse || data.formalEmail);
        }
        setWhatsappDraft(
          `Namaste ${platform} Support Team. Mera Partner ID ${partnerId} hai. Mere account me issue: "${details}". Maine apna kaam poori zimmedari se kiya tha. Kripya telematics/GPS audit karke ise turant resolve karein.`
        );
      } else {
        fallbackTemplates();
      }
    } catch {
      fallbackTemplates();
    } finally {
      setGenerating(false);
    }
  };

  const fallbackTemplates = () => {
    setEmailDraft(
      `Bhai, ghabraiye nahi. Maine aapki dikkat ke hisab se ${platform} Support ko bhejne ke liye ek professional email draft taiyar kar diya hai. Aap ise copy karke unhe bhej sakte hain:

--- START OF EMAIL DRAFT ---
Subject: Urgent Appeal: Review of ${issueType} - Partner ID: ${partnerId || '[Insert ID]'}

Dear ${platform} Support Team,

I am writing to formally appeal the recent ${
        issueType.toLowerCase().includes('suspend') || issueType.toLowerCase().includes('block')
          ? 'suspension of my driver/delivery partner account'
          : `unfair penalty of ₹${amount} imposed on my partner account`
      }. I have been informed that this action was taken following a customer complaint or automated deduction.

I maintain a high rating and strictly follow the platform's guidelines. I request an immediate review of the specific ride/order telemetry data and GPS trail associated with this incident, as I believe this complaint is inaccurate. Please reinstate my account / reverse this penalty at the earliest convenience to prevent further loss of livelihood.

Regards,
${workerName || '[Your Name]'}
Partner ID: ${partnerId || '[Insert ID]'}
Phone Number: [Your Registered Phone Number]
--- END OF EMAIL DRAFT ---

*(Is email ka simple matlab yeh hai ki aapne unse janch karne ki request ki hai ki bina galti ke aapka kam band na kiya jaye).*`
    );

    setWhatsappDraft(
      `Namaste ${platform} Support Team. Mera Partner ID ${partnerId} hai. Mere account me: "${details}". Maine apna kaam poori zimmedari se kiya tha. Kripya GPS audit karke mera mamla turant suljhayein.`
    );
  };

  const copyToClipboard = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const clean = text.replace(/[*#|`-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.lang = 'hi-IN';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappDraft);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            <Scale className="w-4 h-4" />
            <span>GRIEVANCE_DRAFTING WORKSPACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'hi'
              ? 'गलत फाइन, पेनाल्टी व आईडी ब्लॉक के खिलाफ कानूनी अपील'
              : 'Formal Dispute & Penalty Waiver Appeal Generator'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-2xl">
            {lang === 'hi'
              ? 'स्विगी, जोमैटो, उबर या ओला द्वारा बिना वजह काटे गए पैसे या ब्लॉक की गई आईडी के लिए फॉर्मल ईमेल व व्हाट्सएप टिकट बनाएं।'
              : 'Empowering gig workers with legally grounded, assertive appeals requesting GPS audit trails and reversal of arbitrary deductions.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-amber-900/60 p-3.5 rounded-xl border border-amber-700/60 text-xs text-amber-200">
          <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-sm">Consumer Helpline: 1915</div>
            <div className="text-[11px] text-amber-300">National Worker Grievance Cell</div>
          </div>
        </div>
      </div>

      {/* Quick 1-Tap Scenarios Bar */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-xs flex items-center gap-2 flex-wrap text-xs">
        <span className="font-bold text-neutral-800 text-xs mr-1">1-Tap Scenarios:</span>
        <button
          onClick={() => {
            setPlatform('Uber');
            setIssueType('Wrongful Account Suspension / ID Block');
            setDetails('Uber ne mera account block kar diya hai customer ki jhoothi complaint par.');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300 transition-all"
        >
          🚗 "Uber account block (Customer complaint)"
        </button>
        <button
          onClick={() => {
            setPlatform('Swiggy');
            setIssueType('Unfair Fine / Penalty Deduction');
            setAmount(500);
            setDetails('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300 transition-all"
        >
          🛵 "Swiggy ₹500 unfair fine"
        </button>
        <button
          onClick={() => {
            setPlatform('Zomato');
            setIssueType('False Customer Dispute / Allegation');
            setDetails('Customer ne packet receive karke bola nahi mila, Zomato ne meri ID suspend kar di');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300 transition-all"
        >
          🍔 "Zomato false dispute & ID suspension"
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Details */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-300 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-200 pb-2 flex items-center justify-between">
            <span>Incident & Penalty Details</span>
            {generating && <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />}
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Platform Aggregator
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-bold outline-none"
            >
              <option value="Uber">Uber India</option>
              <option value="Swiggy">Swiggy (Bundl Technologies)</option>
              <option value="Zomato">Zomato / Eternal</option>
              <option value="Ola">Ola (ANI Technologies)</option>
              <option value="Blinkit">Blinkit</option>
              <option value="Zepto">Zepto</option>
              <option value="Rapido">Rapido</option>
              <option value="Porter">Porter</option>
              <option value="Urban Company">Urban Company</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Issue Classification
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-semibold outline-none"
            >
              <option value="Wrongful Account Suspension / ID Block">
                Account Suspension / ID Block (आईडी सस्पेंड)
              </option>
              <option value="Unfair Fine / Penalty Deduction">
                Unfair Fine / Penalty Deduction (गलत फाइन)
              </option>
              <option value="False Customer Dispute / Allegation">
                False Customer Complaint (कस्टमर का झूठा आरोप)
              </option>
              <option value="Severe Weather or Rain Delay Penalty">
                Weather / Heavy Rain Delay (मौसम/बारिश में देरी)
              </option>
              <option value="Missing Surge / Incentive Payout">
                Missing Payout / Incentive (पेआउट में गड़बड़)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Fine / Dispute Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-black text-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Order / Ride ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="TRIP-12345"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Partner Full Name
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Partner ID / Phone
              </label>
              <input
                type="text"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Incident Description (In worker's own words)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Uber ne mera account block kar diya hai customer ki jhoothi complaint par"
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 outline-none resize-none"
            />
          </div>

          <button
            onClick={generateAppeal}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Regenerate Legal Dispute Appeal</span>
          </button>
        </div>

        {/* Right Output: Formal Draft & WhatsApp Quick Chat */}
        <div className="lg:col-span-7 space-y-4">
          {/* WhatsApp / Chat Message */}
          <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-neutral-200 gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase font-mono">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                In-App Support & WhatsApp Message (Short & Crisp)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenWhatsApp}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-2xs transition-all"
                  title="Open in WhatsApp directly"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => copyToClipboard(whatsappDraft, 'whatsapp')}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 font-bold transition-all shadow-2xs"
                >
                  {copiedWhatsapp ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 font-sans text-xs text-neutral-900 whitespace-pre-wrap leading-relaxed">
              {whatsappDraft}
            </div>
          </div>

          {/* Formal Escalation Email */}
          <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-neutral-200 gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase font-mono">
                <Mail className="w-4 h-4 text-amber-700" />
                Formal Corporate Appeal Email
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeakText(emailDraft)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-all"
                  title="Listen to email"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Stop Bolna' : 'Bolke Suno'}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(emailDraft, 'email')}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 font-bold transition-all shadow-2xs"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className={`bg-neutral-950 text-neutral-200 p-4 rounded-xl border border-neutral-800 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto ${
              textScale === 'xlarge' ? 'text-sm' : textScale === 'large' ? 'text-xs' : 'text-[11px]'
            }`}>
              {emailDraft}
            </div>
          </div>

          {/* Platform Grievance Directory */}
          <div className="p-4 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs">
            <span className="font-bold text-neutral-900 block mb-1.5">
              Official Platform Grievance Desk Emails:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-700">
              <div>Uber: <strong className="font-mono text-neutral-900">support-india@uber.com</strong></div>
              <div>Swiggy: <strong className="font-mono text-neutral-900">grievances@swiggy.in</strong></div>
              <div>Zomato: <strong className="font-mono text-neutral-900">grievance@zomato.com</strong></div>
              <div>Ola: <strong className="font-mono text-neutral-900">partnercare@olacabs.com</strong></div>
              <div>Blinkit: <strong className="font-mono text-neutral-900">rider-support@blinkit.com</strong></div>
              <div>Zepto: <strong className="font-mono text-neutral-900">deliveryhelp@zepto.in</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
