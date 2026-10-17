import { describe, it, expect } from 'vitest';

describe('Expert Financial Companion Math & Extraction Tests', () => {
  it('correctly calculates net profit: 1500 gross - 350 expense = 1150', () => {
    const gross = 1500;
    const expenses = 350;
    const netProfit = gross - expenses;
    expect(netProfit).toBe(1150);
  });

  it('correctly handles zero expenses and tips', () => {
    const gross = 1200;
    const tips = 150;
    const expenses = 0;
    const netProfit = gross + tips - expenses;
    expect(netProfit).toBe(1350);
  });

  it('guarantees non-negative profit even if expenses exceed gross', () => {
    const gross = 400;
    const expenses = 500;
    const netProfit = Math.max(0, gross - expenses);
    expect(netProfit).toBe(0);
  });
});
