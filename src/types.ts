export type CategoryToken = 'EARNINGS_TRACKING' | 'WELFARE_SCHEMES' | 'GRIEVANCE_DRAFTING';

export type LanguageMode = 'en' | 'hi' | 'hinglish';

export interface RouteResult {
  category: CategoryToken;
  token: CategoryToken;
  source: string;
  confidence: number;
  reason: string;
  detectedLanguage: string;
  input: string;
  timestamp: string;
}

export interface ShiftEntry {
  id: string;
  date: string;
  platform: string;
  tripsOrOrders: number;
  hoursWorked: number;
  grossEarnings: number;
  fuelExpense: number;
  tips: number;
  platformDeduction: number;
  netProfit: number;
  notes?: string;
}

export interface WelfareScheme {
  id: string;
  name: string;
  hindiName: string;
  category: 'social_security' | 'health' | 'pension' | 'credit' | 'legal';
  badge: string;
  description: string;
  hindiDescription: string;
  eligibility: string[];
  benefits: string[];
  requiredDocs: string[];
  officialUrl: string;
  helpline: string;
}

export interface GrievanceTemplate {
  id: string;
  title: string;
  hindiTitle: string;
  platform: string;
  commonFine: number;
  description: string;
  appealReason: string;
}
