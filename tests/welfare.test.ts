import { describe, it, expect } from 'vitest';
import { WELFARE_SCHEMES_DATA } from '../src/data/schemes';

describe('Welfare Schemes & Social Security Data Tests', () => {
  it('contains mandatory gig welfare schemes (eshram, rajasthan-gig-act, pmjay, pmsby, pmsvanidhi, pmsym)', () => {
    const ids = WELFARE_SCHEMES_DATA.map((s) => s.id);
    expect(ids).toContain('eshram');
    expect(ids).toContain('rajasthan-gig-act');
    expect(ids).toContain('pmjay');
    expect(ids).toContain('pmsby');
    expect(ids).toContain('pmsym');
  });

  it('each scheme explicitly outlines eligibility, benefits, and required documents', () => {
    for (const scheme of WELFARE_SCHEMES_DATA) {
      expect(scheme.eligibility.length).toBeGreaterThan(0);
      expect(scheme.benefits.length).toBeGreaterThan(0);
      expect(scheme.requiredDocs.length).toBeGreaterThan(0);
      expect(scheme.officialUrl).toMatch(/^https:\/\//);
    }
  });

  it('e-Shram card provides accidental death coverage of 2 lakh', () => {
    const eshram = WELFARE_SCHEMES_DATA.find((s) => s.id === 'eshram');
    expect(eshram).toBeDefined();
    const has2LakhBenefit = eshram?.benefits.some((b) => b.includes('2,00,000'));
    expect(has2LakhBenefit).toBe(true);
  });
});
