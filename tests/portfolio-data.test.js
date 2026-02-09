// tests/portfolio-data.test.js — Validate portfolio data structure and formatters
import { describe, it, expect } from 'vitest';

describe('PORTFOLIO_DATA structure', () => {
  it('has an owner with required fields', () => {
    const o = PORTFOLIO_DATA.owner;
    expect(o.name).toBe('Jordan Mitchell');
    expect(o.age).toBe(38);
    expect(o.filingStatus).toBe('Married Filing Jointly');
    expect(o.state).toBe('California');
    expect(o.annualIncome).toBe(195000);
    expect(o.taxBracketFederal).toBe('24%');
    expect(o.taxBracketState).toBe('9.3%');
  });

  it('has exactly 6 accounts', () => {
    expect(PORTFOLIO_DATA.accounts).toHaveLength(6);
  });

  it('each account has required fields', () => {
    for (const acct of PORTFOLIO_DATA.accounts) {
      expect(acct).toHaveProperty('id');
      expect(acct).toHaveProperty('name');
      expect(acct).toHaveProperty('type');
      expect(acct).toHaveProperty('icon');
      expect(acct).toHaveProperty('institution');
      expect(acct).toHaveProperty('taxTreatment');
      expect(acct).toHaveProperty('holdings');
      expect(Array.isArray(acct.holdings)).toBe(true);
      expect(acct.holdings.length).toBeGreaterThan(0);
    }
  });

  it('each holding has ticker, shares, costBasis, currentPrice, assetClass', () => {
    for (const acct of PORTFOLIO_DATA.accounts) {
      for (const h of acct.holdings) {
        expect(typeof h.ticker).toBe('string');
        expect(typeof h.name).toBe('string');
        expect(typeof h.shares).toBe('number');
        expect(typeof h.costBasis).toBe('number');
        expect(typeof h.currentPrice).toBe('number');
        expect(typeof h.assetClass).toBe('string');
        expect(h.shares).toBeGreaterThan(0);
        expect(h.costBasis).toBeGreaterThan(0);
        expect(h.currentPrice).toBeGreaterThan(0);
      }
    }
  });

  it('has W-2 income data for 2026', () => {
    const w2 = PORTFOLIO_DATA.w2Income;
    expect(w2.year).toBe(2026);
    expect(w2.wagesBox1).toBe(195000);
    expect(w2.employer).toContain('Apex');
  });

  it('has 3 debt items', () => {
    expect(PORTFOLIO_DATA.debt).toHaveLength(3);
    const types = PORTFOLIO_DATA.debt.map(d => d.type);
    expect(types).toContain('Mortgage');
    expect(types).toContain('Auto Loan');
    expect(types).toContain('Student Loan');
  });

  it('has estate plan data with all key sections', () => {
    const e = PORTFOLIO_DATA.estate;
    expect(e.will.status).toBe('Executed');
    expect(e.revocableTrust.status).toBe('Established');
    expect(e.lifeInsurance.coverageAmount).toBe(1000000);
    expect(e.beneficiaries.length).toBeGreaterThan(0);
    expect(e.guardianship.child).toContain('Sarah Mitchell');
  });

  it('529 account has a beneficiary', () => {
    const edu = PORTFOLIO_DATA.accounts.find(a => a.type === '529');
    expect(edu).toBeDefined();
    expect(edu.beneficiary).toBe('Child (age 8)');
  });
});

describe('TAB_DEFINITIONS', () => {
  it('has 4 tabs in correct order', () => {
    expect(TAB_DEFINITIONS).toHaveLength(4);
    expect(TAB_DEFINITIONS.map(t => t.id)).toEqual(['portfolio', 'income', 'debt', 'estate']);
  });

  it('each tab has id, label, and icon', () => {
    for (const tab of TAB_DEFINITIONS) {
      expect(typeof tab.id).toBe('string');
      expect(typeof tab.label).toBe('string');
      expect(typeof tab.icon).toBe('string');
    }
  });
});

describe('Formatters', () => {
  it('fmtCurrency formats whole dollars', () => {
    expect(fmtCurrency.format(195000)).toBe('$195,000');
    expect(fmtCurrency.format(0)).toBe('$0');
    expect(fmtCurrency.format(1234567)).toBe('$1,234,567');
  });

  it('fmtCurrencyPrecise formats with cents', () => {
    expect(fmtCurrencyPrecise.format(268.42)).toBe('$268.42');
    expect(fmtCurrencyPrecise.format(0)).toBe('$0.00');
  });

  it('fmtPercent formats percentages', () => {
    expect(fmtPercent.format(0.241)).toBe('24.1%');
    expect(fmtPercent.format(0)).toBe('0.0%');
    expect(fmtPercent.format(1)).toBe('100.0%');
  });

  it('fmtNumber formats numbers with up to 2 decimals', () => {
    expect(fmtNumber.format(380)).toBe('380');
    expect(fmtNumber.format(48.5)).toBe('48.5');
  });
});

describe('ASSET_CLASS_COLORS', () => {
  it('has colors for all 4 asset classes', () => {
    expect(ASSET_CLASS_COLORS['US Equity']).toBe('#3b82f6');
    expect(ASSET_CLASS_COLORS['Intl Equity']).toBe('#8b5cf6');
    expect(ASSET_CLASS_COLORS['US Bond']).toBe('#14b8a6');
    expect(ASSET_CLASS_COLORS['Target Date']).toBe('#f59e0b');
  });
});
