import { CategoryToken } from '../types';

export interface PromptExample {
  id: string;
  input: string;
  expectedCategory: CategoryToken;
  language: 'Hinglish' | 'Hindi' | 'English';
  platform?: string;
  label: string;
}

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'ex-1',
    input: 'Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo',
    expectedCategory: 'GRIEVANCE_DRAFTING',
    language: 'Hinglish',
    platform: 'Swiggy',
    label: 'Swiggy Unfair Fine Dispute'
  },
  {
    id: 'ex-2',
    input: 'Mera e-shram card kaise banega?',
    expectedCategory: 'WELFARE_SCHEMES',
    language: 'Hinglish',
    platform: 'e-Shram',
    label: 'e-Shram Card Registration'
  },
  {
    id: 'ex-3',
    input: 'Aaj maine 4 rides ki, total 1200 kamaye, par Rs 200 fuel me gaye',
    expectedCategory: 'EARNINGS_TRACKING',
    language: 'Hinglish',
    platform: 'Uber/Ola',
    label: 'Ride Earnings & Fuel Calculation'
  },
  {
    id: 'ex-4',
    input: 'Customer ne khana receive karke jhoothi complaint kar di ki deliver nahi hua, Zomato ne meri ID suspend kar di hai',
    expectedCategory: 'GRIEVANCE_DRAFTING',
    language: 'Hinglish',
    platform: 'Zomato',
    label: 'Fraud Complaint & ID Suspension'
  },
  {
    id: 'ex-5',
    input: 'राजस्थान में जो नया गिग वर्कर्स कानून लागू हुआ है, उसमें डिलीवरी बॉय को क्या क्या सुविधाएं और बीमा मिलता है?',
    expectedCategory: 'WELFARE_SCHEMES',
    language: 'Hindi',
    platform: 'Rajasthan Welfare Board',
    label: 'Rajasthan Gig Act Benefits'
  },
  {
    id: 'ex-6',
    input: '8 orders completed today on Blinkit for 950 rupees, tips received 80 rupees, petrol expense 210 rupees. What is my real profit?',
    expectedCategory: 'EARNINGS_TRACKING',
    language: 'English',
    platform: 'Blinkit',
    label: 'Shift Profit Breakdown'
  },
  {
    id: 'ex-7',
    input: 'Ayushman Bharat card hospital me 5 lakh tak ka free treatment deta hai kya? Auto driver ko milega?',
    expectedCategory: 'WELFARE_SCHEMES',
    language: 'Hinglish',
    platform: 'PM-JAY',
    label: 'Health Insurance Eligibility'
  },
  {
    id: 'ex-8',
    input: 'Uber app ne bina bataye ride cancellation charges 3 baar deduct kar liye mere payout me se',
    expectedCategory: 'GRIEVANCE_DRAFTING',
    language: 'Hinglish',
    platform: 'Uber',
    label: 'Unauthorized Cancellation Fee'
  }
];
