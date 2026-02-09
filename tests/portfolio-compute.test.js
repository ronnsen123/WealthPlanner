// tests/portfolio-compute.test.js — Test portfolio and debt computation + memoization
import { describe, it, expect, beforeEach } from 'vitest';

describe('computeHolding', () => {
  it('computes current value, cost basis total, gain/loss', () => {
    const h = computeHolding({ ticker: 'VTI', shares: 100, costBasis: 200, currentPrice: 250, assetClass: 'US Equity', name: 'Test' });
    expect(h.currentValue).toBe(25000);
    expect(h.costBasisTotal).toBe(20000);
    expect(h.gainLoss).toBe(5000);
    expect(h.gainLossPercent).toBeCloseTo(0.25);
  });

  it('handles a loss', () => {
    const h = computeHolding({ ticker: 'BND', shares: 50, costBasis: 80, currentPrice: 70, assetClass: 'US Bond', name: 'Bond' });
    expect(h.gainLoss).toBe(-500);
    expect(h.gainLossPercent).toBeCloseTo(-0.125);
  });

  it('handles zero cost basis gracefully', () => {
    const h = computeHolding({ ticker: 'X', shares: 10, costBasis: 0, currentPrice: 50, assetClass: 'Other', name: 'Free' });
    expect(h.currentValue).toBe(500);
    expect(h.gainLossPercent).toBe(0);
  });
});

describe('computeAccount', () => {
  it('aggregates holdings correctly', () => {
    const acct = computeAccount({
      id: 'test',
      name: 'Test Account',
      holdings: [
        { ticker: 'A', shares: 10, costBasis: 100, currentPrice: 120, assetClass: 'US Equity', name: 'A' },
        { ticker: 'B', shares: 20, costBasis: 50, currentPrice: 60, assetClass: 'US Bond', name: 'B' },
      ]
    });
    expect(acct.totalValue).toBe(10 * 120 + 20 * 60); // 1200 + 1200 = 2400
    expect(acct.totalCostBasis).toBe(10 * 100 + 20 * 50); // 1000 + 1000 = 2000
    expect(acct.totalGainLoss).toBe(400);
    expect(acct.gainLossPercent).toBeCloseTo(0.2);
    expect(acct.holdings).toHaveLength(2);
    expect(acct.holdings[0].currentValue).toBe(1200);
  });
});

describe('computePortfolio', () => {
  beforeEach(() => {
    invalidatePortfolioCache();
  });

  it('returns aggregate stats across all 6 accounts', () => {
    const p = computePortfolio();
    expect(p.accounts).toHaveLength(6);
    expect(p.totalValue).toBeGreaterThan(0);
    expect(p.totalCostBasis).toBeGreaterThan(0);
    expect(typeof p.totalGainLoss).toBe('number');
    expect(typeof p.gainLossPercent).toBe('number');
    expect(p.owner.name).toBe('Jordan Mitchell');
  });

  it('totalValue equals sum of account values', () => {
    const p = computePortfolio();
    const sumAccounts = p.accounts.reduce((s, a) => s + a.totalValue, 0);
    expect(p.totalValue).toBeCloseTo(sumAccounts, 2);
  });

  it('asset allocation sums to approximately 1.0', () => {
    const p = computePortfolio();
    const total = Object.values(p.assetAllocation).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  it('asset allocation includes expected classes', () => {
    const p = computePortfolio();
    expect(p.assetAllocation['US Equity']).toBeGreaterThan(0);
    expect(p.assetAllocation['US Bond']).toBeGreaterThan(0);
    expect(p.assetAllocation['Intl Equity']).toBeGreaterThan(0);
    expect(p.assetAllocation['Target Date']).toBeGreaterThan(0);
  });

  it('memoization returns same object on second call', () => {
    const p1 = computePortfolio();
    const p2 = computePortfolio();
    expect(p1).toBe(p2); // Same reference
  });

  it('invalidatePortfolioCache forces recomputation', () => {
    const p1 = computePortfolio();
    invalidatePortfolioCache();
    const p2 = computePortfolio();
    expect(p1).not.toBe(p2); // Different reference
    expect(p1.totalValue).toBe(p2.totalValue); // Same values
  });
});

describe('computeDebtSummary', () => {
  beforeEach(() => {
    invalidatePortfolioCache();
  });

  it('returns correct totals', () => {
    const d = computeDebtSummary();
    expect(d.debts).toHaveLength(3);
    expect(d.totalBalance).toBe(542000 + 14200 + 18400); // 574600
    expect(d.totalMonthly).toBe(4186 + 720 + 485); // 5391
  });

  it('calculates home equity correctly', () => {
    const d = computeDebtSummary();
    expect(d.homeEquity).toBe(985000 - 542000); // 443000
  });

  it('memoization returns same object on second call', () => {
    const d1 = computeDebtSummary();
    const d2 = computeDebtSummary();
    expect(d1).toBe(d2);
  });

  it('invalidatePortfolioCache clears debt cache too', () => {
    const d1 = computeDebtSummary();
    invalidatePortfolioCache();
    const d2 = computeDebtSummary();
    expect(d1).not.toBe(d2);
  });

  it('DTI ratio is around 33%', () => {
    const d = computeDebtSummary();
    const annualDebtService = d.totalMonthly * 12;
    const dtiRatio = annualDebtService / PORTFOLIO_DATA.owner.annualIncome;
    expect(dtiRatio).toBeGreaterThan(0.30);
    expect(dtiRatio).toBeLessThan(0.36);
  });
});
