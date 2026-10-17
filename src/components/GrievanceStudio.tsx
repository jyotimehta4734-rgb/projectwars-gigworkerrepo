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
  PhoneCall
} from 'lucide-react';
import { LanguageMode } from '../types';

interface GrievanceStudioProps {
  lang: LanguageMode;
  initialQuery?: string;
}

export const GrievanceStudio: React.FC<GrievanceStudioProps> = ({
  lang,
  initialQuery,
}) => {
  const [platform, setPlatform] = useState('Swiggy');
  const [issueType, setIssueType] = useState('Unfair Fine / Penalty Deduction');
  const [amount, setAmount] = useState<number>(500);
  const [workerName, setWorkerName] = useState('Ramesh Kumar');
  const [partnerId, setPartnerId] = useState('SWIG-94821');
  const [orderId, setOrderId] = useState('ORD-883921');
  const [details, setDetails] = useState(
    initialQuery || 'Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo'
  );

  const [generating, setGenerating] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

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
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.formalEmail) setEmailDraft(data.formalEmail);
        if (data.whatsappTicket) setWhatsappDraft(data.whatsappTicket);
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
      `Namaste ${platform} Support Team. Mera Partner ID ${partnerId} hai. Aaj mere account me: "${details}". Maine delivery poori zimmedari se ki thi. Kripya GPS audit karke mera ₹${amount} turant refund karein.`
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-amber-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-1">
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

        <div className="flex items-center gap-2 bg-amber-950/60 p-3 rounded-xl border border-amber-700/50 text-xs text-amber-200">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="font-semibold text-white">National Consumer Helpline</div>
            <div>Dial 1915 or WhatsApp 8800001915</div>
          </div>
        </div>
      </div>

      {/* Quick Benchmark Presets Bar */}
      <div className="bg-white rounded-xl border border-neutral-300 p-3.5 shadow-xs flex items-center gap-2 flex-wrap text-xs">
        <span className="font-bold text-neutral-600 text-xs">Quick Scenarios:</span>
        <button
          onClick={() => {
            setPlatform('Uber');
            setIssueType('Wrongful Account Suspension / ID Block');
            setDetails('Uber ne mera account block kar diya hai customer ki jhoothi complaint par.');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium border border-neutral-200 transition-all"
        >
          "Uber account block (Customer complaint)"
        </button>
        <button
          onClick={() => {
            setPlatform('Swiggy');
            setIssueType('Unfair Fine / Penalty Deduction');
            setAmount(500);
            setDetails('Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium border border-neutral-200 transition-all"
        >
          "Swiggy ₹500 unfair fine"
        </button>
        <button
          onClick={() => {
            setPlatform('Zomato');
            setIssueType('False Customer Dispute / Allegation');
            setDetails('Customer ne packet receive karke bola nahi mila, Zomato ne meri ID suspend kar di');
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium border border-neutral-200 transition-all"
        >
          "Zomato false dispute & ID suspension"
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Details */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-300 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-200 pb-2 flex items-center justify-between">
            <span>Incident & Penalty Details</span>
            {generating && <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Platform Aggregator
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-sm font-semibold outline-none"
            >
              <option value="Swiggy">Swiggy (Bundl Technologies)</option>
              <option value="Zomato">Zomato / Eternal</option>
              <option value="Uber">Uber India</option>
              <option value="Ola">Ola (ANI Technologies)</option>
              <option value="Blinkit">Blinkit</option>
              <option value="Zepto">Zepto</option>
              <option value="Rapido">Rapido</option>
              <option value="Porter">Porter</option>
              <option value="Urban Company">Urban Company</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Issue Classification
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-sm font-medium outline-none"
            >
              <option value="Unfair Fine / Penalty Deduction">
                Unfair Fine / Penalty Deduction (गलत फाइन)
              </option>
              <option value="Wrongful Account Suspension / ID Block">
                Account Suspension / ID Block (आईडी सस्पेंड)
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
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Fine / Dispute Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-sm font-bold text-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Order / Ride ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-12345"
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-sm font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Partner Full Name
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-sm font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Partner ID / Phone
              </label>
              <input
                type="text"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-sm font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Incident Description (In worker's own words)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Swiggy ne bina vajah Rs 500 ka fine laga diya, delivery time pe ki thi"
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-800 outline-none resize-none"
            />
          </div>

          <button
            onClick={generateAppeal}
            disabled={generating}
            className="w-full py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Regenerate Professional Appeal</span>
          </button>
        </div>

        {/* Right Output: Formal Draft & WhatsApp Quick Chat */}
        <div className="lg:col-span-7 space-y-4">
          {/* WhatsApp / Chat Message */}
          <div className="bg-white rounded-xl border border-neutral-300 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase font-mono">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                In-App Support & WhatsApp Message (Short & Crisp)
              </span>
              <button
                onClick={() => copyToClipboard(whatsappDraft, 'whatsapp')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold transition-all shadow-2xs"
              >
                {copiedWhatsapp ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy for WhatsApp</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80 font-sans text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
              {whatsappDraft}
            </div>
          </div>

          {/* Formal Escalation Email */}
          <div className="bg-white rounded-xl border border-neutral-300 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
              <span className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase font-mono">
                <Mail className="w-4 h-4 text-amber-700" />
                Formal Grievance Email (To Platform Grievance Officer)
              </span>
              <button
                onClick={() => copyToClipboard(emailDraft, 'email')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 font-semibold transition-all shadow-2xs"
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
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 font-mono text-[11px] text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-[340px] overflow-y-auto">
              {emailDraft}
            </div>
          </div>

          {/* Platform Grievance Directory */}
          <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
            <span className="font-bold text-neutral-800 block mb-1">
              Official Grievance Officer Contacts:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-600">
              <div>Swiggy: <span className="font-mono text-neutral-900">grievances@swiggy.in</span></div>
              <div>Zomato: <span className="font-mono text-neutral-900">grievance@zomato.com</span></div>
              <div>Uber: <span className="font-mono text-neutral-900">support-india@uber.com</span></div>
              <div>Ola: <span className="font-mono text-neutral-900">partnercare@olacabs.com</span></div>
              <div>Blinkit: <span className="font-mono text-neutral-900">rider-support@blinkit.com</span></div>
              <div>Zepto: <span className="font-mono text-neutral-900">deliveryhelp@zepto.in</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
