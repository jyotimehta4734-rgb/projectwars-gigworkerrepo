import { CategoryToken, RouteResult } from '../types';

export function clientClassify(text: string): RouteResult {
  const trimmed = (text || '').trim();
  const lower = trimmed.toLowerCase();

  let earningsScore = 0;
  let welfareScore = 0;
  let grievanceScore = 0;

  // Grievance checks
  const grievanceMatches = [
    'fine', 'penalty', 'penalti', 'kata', 'kat gaya', 'kat liya', 'deduct', 'deduction',
    'suspend', 'suspension', 'block', 'blocked', 'ban', 'banned', 'deactivat', 'id band',
    'complaint', 'shikayat', 'grievance', 'unfair', 'bina vajah', 'bina kisi wajah',
    'bina reason', 'galat', 'jhooth', 'jhootha', 'fake customer', 'dispute', 'appeal',
    'help karo', 'madad karo', 'accident', 'damage', 'order nahi mila', 'ratings gira'
  ];

  // Welfare checks
  const welfareMatches = [
    'e-shram', 'eshram', 'shramik', 'yojana', 'scheme', 'benefit', 'government', 'sarkari',
    'social security', 'pf', 'provident fund', 'epfo', 'esic', 'insurance', 'beema', 'bima',
    'ayushman', 'pmjay', 'pm-jay', 'pmsby', 'pmjjby', 'pm-sym', 'pension', 'rajasthan',
    'labor rights', 'kanoon', 'adhikar', 'welfare', 'svanidhi', 'loan', 'card kaise bane',
    'registration', 'patrata', 'subsidy'
  ];

  // Earnings checks
  const earningsMatches = [
    'kamaye', 'kamaai', 'kamai', 'earning', 'earnings', 'wage', 'wages', 'dihadi', 'haziri',
    'hisaab', 'hisab', 'calc', 'tip', 'tips', 'fuel', 'petrol', 'cng', 'diesel', 'kharcha',
    'expense', 'payout', 'net profit', 'profit', 'munafa', 'bachat', 'bacha', 'bacha kitna',
    'rides', 'trips', 'order', 'delivery', 'incentive', 'target', 'commission', 'rupaye', 'rupees'
  ];

  for (const w of grievanceMatches) {
    if (lower.includes(w)) grievanceScore += 2;
  }
  for (const w of welfareMatches) {
    if (lower.includes(w)) welfareScore += 2;
  }
  for (const w of earningsMatches) {
    if (lower.includes(w)) earningsScore += 2;
  }

  // Exact examples priority
  if (lower.includes('swiggy ne bina vajah') || lower.includes('fine laga diya') || lower.includes('id suspend')) {
    grievanceScore += 10;
  }
  if (lower.includes('e-shram') || lower.includes('eshram') || lower.includes('card kaise banega') || lower.includes('accident insurance') || lower.includes('accident bima')) {
    welfareScore += 15;
  }
  if (lower.includes('rides ki') || lower.includes('fuel me gaye') || lower.includes('kamaye')) {
    earningsScore += 10;
  }

  let cat: CategoryToken = 'EARNINGS_TRACKING';
  let reason = '';
  let confidence = 0.88;

  if (grievanceScore >= welfareScore && grievanceScore >= earningsScore && grievanceScore > 0) {
    cat = 'GRIEVANCE_DRAFTING';
    reason = 'Identified grievance issue: unfair penalty, account suspension, or dispute resolution request.';
    confidence = Math.min(0.99, 0.82 + grievanceScore * 0.03);
  } else if (welfareScore >= earningsScore && welfareScore > 0) {
    cat = 'WELFARE_SCHEMES';
    reason = 'Identified welfare inquiry: government schemes, e-Shram registration, healthcare, or worker rights.';
    confidence = Math.min(0.99, 0.82 + welfareScore * 0.03);
  } else if (earningsScore > 0) {
    cat = 'EARNINGS_TRACKING';
    reason = 'Identified earnings context: daily wages, ride/trip calculations, fuel deduction, or net profit analysis.';
    confidence = Math.min(0.99, 0.82 + earningsScore * 0.03);
  } else {
    cat = 'EARNINGS_TRACKING';
    reason = 'Classified as shift earnings tracking context.';
    confidence = 0.70;
  }

  const detectedLang = /[\u0900-\u097F]/.test(trimmed)
    ? 'Hindi (हिंदी)'
    : /\b(aaj|maine|karega|kaise|mera|meri|karo|bina|vajah|gaye|kamaye|chahiye|hai|bhai|batao)\b/i.test(trimmed)
    ? 'Hinglish (Hindi in Latin script)'
    : 'English';

  return {
    category: cat,
    token: cat,
    source: 'client-pattern-engine',
    confidence,
    reason,
    detectedLanguage: detectedLang,
    input: trimmed,
    timestamp: new Date().toISOString()
  };
}

export async function routeInput(text: string): Promise<RouteResult> {
  try {
    const res = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('API route call error, using local classification:', err);
  }
  return clientClassify(text);
}
