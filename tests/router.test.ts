import { describe, it, expect } from 'vitest';
import { ruleBasedClassifier } from '../server';

describe('GigSaathi Core Routing Agent Tests', () => {
  it('correctly classifies canonical Swiggy fine dispute to GRIEVANCE_DRAFTING', () => {
    const input = 'Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('GRIEVANCE_DRAFTING');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('correctly classifies canonical e-Shram query to WELFARE_SCHEMES', () => {
    const input = 'Mera e-shram card kaise banega?';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('WELFARE_SCHEMES');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('correctly classifies canonical ride earnings and fuel to EARNINGS_TRACKING', () => {
    const input = 'Aaj maine 4 rides ki, total 1200 kamaye, par Rs 200 fuel me gaye';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('EARNINGS_TRACKING');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('classifies Uber driver account suspension to GRIEVANCE_DRAFTING', () => {
    const input = 'Uber ne mera account block kar diya hai customer ki jhoothi complaint par.';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('GRIEVANCE_DRAFTING');
  });

  it('classifies accident insurance enquiry to WELFARE_SCHEMES', () => {
    const input = 'Accident insurance ka kya process hai delivery boys ke liye?';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('WELFARE_SCHEMES');
  });

  it('classifies shift hisaab query to EARNINGS_TRACKING', () => {
    const input = 'Bhaiya aaj Rs 1500 ka kaam kiya, Zomato se petrol me Rs 350 lag gaye.';
    const result = ruleBasedClassifier(input);
    expect(result.category).toBe('EARNINGS_TRACKING');
  });
});
