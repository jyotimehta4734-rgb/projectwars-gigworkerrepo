import { WelfareScheme } from '../types';

export const WELFARE_SCHEMES_DATA: WelfareScheme[] = [
  {
    id: 'eshram',
    name: 'e-Shram National Database for Unorganised Workers',
    hindiName: 'ई-श्रम कार्ड (असंगठित व गीग कामगार पोर्टल)',
    category: 'social_security',
    badge: 'Universal UAN',
    description: 'National digital registration for informal and gig workers by the Ministry of Labour and Employment providing a 12-digit Universal Account Number (UAN).',
    hindiDescription: 'श्रम एवं रोजगार मंत्रालय द्वारा असंगठित व गीग वर्कर्स के लिए 12 अंकों का परमानेंट UAN कार्ड और आपातकालीन सुरक्षा।',
    eligibility: [
      'Age between 16 to 59 years',
      'Informal worker, gig partner (Swiggy, Zomato, Uber, Ola, etc.), or daily-wage earner',
      'Not an active income taxpayer and not covered under EPFO/ESIC',
      'Valid Aadhaar card linked with an active mobile number'
    ],
    benefits: [
      '₹2,00,000 accidental death or permanent total disability coverage',
      '₹1,00,000 partial permanent disability benefit',
      'Direct integration with future central and state social security benefits',
      'Portability across states during migration or inter-city platform work'
    ],
    requiredDocs: ['Aadhaar Number', 'Aadhaar-linked Mobile Number', 'Active Bank Account (IFSC & Acc Number)'],
    officialUrl: 'https://eshram.gov.in',
    helpline: '14434 (Toll-free national helpline)'
  },
  {
    id: 'rajasthan-gig-act',
    name: 'Rajasthan Platform-Based Gig Workers Social Security Welfare Board',
    hindiName: 'राजस्थान प्लेटफॉर्म-आधारित गीग वर्कर्स कल्याण बोर्ड',
    category: 'legal',
    badge: 'Pioneering Law',
    description: 'Pioneering state legislative act mandating welfare cess (1-2% on each ride/delivery) deposited into a social security fund for registered platform workers.',
    hindiDescription: 'प्रत्येक राइड या डिलीवरी पर 1-2% वेलफेयर सेस से बना फंड, जो सीधे डिलीवरी व कैब ड्राइवरों के कल्याण में खर्च होता है।',
    eligibility: [
      'Gig or platform workers operating within Rajasthan (cab, delivery, logistics, home services)',
      'Onboarded with any digital aggregator app (Zomato, Swiggy, Uber, Ola, Urban Company, Porter)'
    ],
    benefits: [
      'Unique Gig Worker ID valid across multiple aggregators',
      'Access to state social security schemes, accidental insurance, and health funds',
      'Statutory Grievance Redressal Mechanism with penal authority on non-compliant platforms',
      'Dedicated Welfare Fund managed by worker representatives and government'
    ],
    requiredDocs: ['Aggregator App Partner ID', 'Aadhaar Card', 'Rajasthan Local Address or Work Proof'],
    officialUrl: 'https://labour.rajasthan.gov.in',
    helpline: '1800-180-6127'
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    hindiName: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)',
    category: 'health',
    badge: '₹5 Lakh Health Cover',
    description: 'World’s largest government-funded healthcare assurance scheme offering secondary and tertiary hospitalization cover.',
    hindiDescription: 'प्रति परिवार प्रति वर्ष ₹5 लाख तक का मुफ्त कैशलेस इलाज पूरे देश के सूचीबद्ध सरकारी व निजी अस्पतालों में।',
    eligibility: [
      'Families identified under SECC database or state-notified low-income informal categories',
      'Gig and unorganised transport/delivery families without private health policies'
    ],
    benefits: [
      'Cashless and paperless access to healthcare services at all empaneled hospitals',
      'Covers up to ₹5,00,000 per family per year on a family floater basis',
      'Covers pre-existing conditions from Day 1, including surgery, ICU, and medications'
    ],
    requiredDocs: ['Ration Card / Family ID', 'Aadhaar Card', 'PM-JAY Golden Card or Eligibility Slip'],
    officialUrl: 'https://pmjay.gov.in',
    helpline: '14555'
  },
  {
    id: 'pmsvanidhi',
    name: 'PM SVANidhi (Micro-Credit Scheme)',
    hindiName: 'पीएम स्वनिधि (स्ट्रीट वेंडर एवं ट्रांसपोर्ट वर्कर ऋण)',
    category: 'credit',
    badge: 'Collateral-free Loan',
    description: 'Collateral-free micro-working capital loans designed for street vendors, auto/e-rickshaw drivers, and informal mobility operators.',
    hindiDescription: 'बिना किसी गारंटी के आसान किस्तों पर ₹10,000, ₹20,000 और ₹50,000 का सस्ता लोन सीधे बैंक खाते में।',
    eligibility: [
      'Informal self-employed vendors, auto-rickshaw / rickshaw owners, informal delivery transporters',
      'Possession of Urban Local Body (ULB) vending certificate or recommendation letter'
    ],
    benefits: [
      'First tranche of ₹10,000 working capital loan with 7% interest subsidy',
      'Second tranche of ₹20,000 and third tranche of ₹50,000 on timely repayments',
      'Cashback incentive of up to ₹1,200 per year on digital payment transactions'
    ],
    requiredDocs: ['Aadhaar Card', 'Voter ID / Driving License', 'Bank Account details', 'Mobile Number'],
    officialUrl: 'https://pmsvanidhi.mohua.gov.in',
    helpline: '1800-180-1111'
  },
  {
    id: 'pmsym',
    name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM Pension)',
    hindiName: 'प्रधानमंत्री श्रम योगी मान-धन (मासिक पेंशन योजना)',
    category: 'pension',
    badge: '₹3,000/mo Pension',
    description: 'Voluntary and contributory pension scheme for unorganised workers providing guaranteed old-age income security.',
    hindiDescription: '60 वर्ष की आयु के बाद ₹3,000 की सुनिश्चित मासिक पेंशन। जितना पैसा आप जमा करेंगे, उतना ही केंद्र सरकार मिलाएगी।',
    eligibility: [
      'Entry age between 18 to 40 years',
      'Monthly income of ₹15,000 or less',
      'Should not be an income taxpayer or member of EPFO/ESIC/NPS'
    ],
    benefits: [
      'Guaranteed pension of ₹3,000 per month after attaining 60 years of age',
      '50% family pension to spouse in case of subscriber demise',
      '50:50 matching contribution by Central Government (worker deposits ₹55-200/mo, Gov deposits equal)'
    ],
    requiredDocs: ['Aadhaar Card', 'Savings Bank Account with Auto-Debit facility', 'Mobile Phone'],
    officialUrl: 'https://maandhan.in',
    helpline: '1800-267-6888'
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    hindiName: 'प्रधानमंत्री सुरक्षा बीमा योजना (दुर्घटना बीमा)',
    category: 'social_security',
    badge: '₹20/year Premium',
    description: 'Extremely affordable government-backed personal accident insurance scheme for all bank account holders.',
    hindiDescription: 'मात्र ₹20 प्रति वर्ष के प्रीमियम में ₹2,00,000 का दुर्घटना मृत्यु व विकलांगता सुरक्षा कवर।',
    eligibility: [
      'Age between 18 to 70 years',
      'Active savings bank account with auto-debit consent enabled'
    ],
    benefits: [
      '₹2,00,000 for accidental death or total irrecoverable loss of both eyes or hands/feet',
      '₹1,00,000 for total loss of sight of one eye or loss of one hand or foot',
      'Direct auto-debit from bank account once a year on May 31'
    ],
    requiredDocs: ['Bank Passbook', 'Aadhaar Card linked to Bank', 'Signed Auto-debit Consent Form'],
    officialUrl: 'https://jansuraksha.gov.in',
    helpline: '1800-180-1111'
  }
];
