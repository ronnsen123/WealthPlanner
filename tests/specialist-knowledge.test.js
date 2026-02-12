// tests/specialist-knowledge.test.js — Tests for specialist knowledge module system
import { describe, it, expect } from 'vitest';

describe('SPECIALIST_KNOWLEDGE registry', () => {
  it('is defined as an object', () => {
    expect(typeof SPECIALIST_KNOWLEDGE).toBe('object');
    expect(SPECIALIST_KNOWLEDGE).not.toBeNull();
  });

  it('contains exactly 7 knowledge functions', () => {
    expect(Object.keys(SPECIALIST_KNOWLEDGE)).toHaveLength(7);
  });

  it('has all expected specialist IDs', () => {
    const ids = Object.keys(SPECIALIST_KNOWLEDGE);
    expect(ids).toContain('tax');
    expect(ids).toContain('retirement');
    expect(ids).toContain('debt');
    expect(ids).toContain('rebalancing');
    expect(ids).toContain('insurance');
    expect(ids).toContain('cashflow');
    expect(ids).toContain('goals');
  });

  it('keys match SPECIALISTS keys exactly', () => {
    const knowledgeKeys = Object.keys(SPECIALIST_KNOWLEDGE).sort();
    const specialistKeys = Object.keys(SPECIALISTS).sort();
    expect(knowledgeKeys).toEqual(specialistKeys);
  });

  it('each entry is a function', () => {
    for (const [id, fn] of Object.entries(SPECIALIST_KNOWLEDGE)) {
      expect(typeof fn).toBe('function');
    }
  });
});

describe('individual specialist knowledge functions', () => {
  it('each function returns a non-empty string', () => {
    for (const [id, fn] of Object.entries(SPECIALIST_KNOWLEDGE)) {
      const result = fn();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(50);
    }
  });

  it('each function output includes the specialist name and title', () => {
    for (const [id, fn] of Object.entries(SPECIALIST_KNOWLEDGE)) {
      const result = fn();
      const spec = SPECIALISTS[id];
      expect(result).toContain(spec.name);
      expect(result).toContain(spec.title);
    }
  });

  it('each function output starts with === SPECIALIST: header', () => {
    for (const [id, fn] of Object.entries(SPECIALIST_KNOWLEDGE)) {
      const result = fn();
      expect(result).toMatch(/^=== SPECIALIST:/);
    }
  });

  it('each function output contains Domain and Directive sections', () => {
    for (const [id, fn] of Object.entries(SPECIALIST_KNOWLEDGE)) {
      const result = fn();
      expect(result).toContain('Domain:');
      expect(result).toContain('Directive:');
    }
  });
});

describe('tax knowledge — Alex Rivera', () => {
  it('contains tax-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    expect(text).toContain('tax-loss harvesting');
    expect(text).toContain('Roth conversions');
    expect(text).toContain('capital gains');
  });

  it('references NVDA and DAF', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    expect(text).toContain('NVDA');
    expect(text).toContain('DAF');
  });

  it('mentions marginal rate and withholding', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    expect(text).toContain('marginal rate');
    expect(text).toContain('withholding');
  });
});

describe('retirement knowledge — Priya Patel', () => {
  it('contains retirement-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.retirement();
    expect(text).toContain('Monte Carlo');
    expect(text).toContain('withdrawal strategies');
    expect(text).toContain('Social Security');
  });

  it('references 401(k) and HSA amounts from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.retirement();
    expect(text).toContain(fmtDollars(PORTFOLIO_DATA.w2Income.retirement401kBox12D));
    expect(text).toContain(fmtDollars(PORTFOLIO_DATA.w2Income.hsaBox12W));
  });
});

describe('debt knowledge — Marcus Thompson', () => {
  it('contains debt-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    expect(text).toContain('avalanche');
    expect(text).toContain('snowball');
    expect(text).toContain('refinancing');
  });

  it('references mortgage rate and DTI from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    expect(text).toContain(fmtPct(PORTFOLIO_DATA.debt[0].interestRate));
    expect(text).toContain('DTI');
  });
});

describe('rebalancing knowledge — Sarah Kim', () => {
  it('contains rebalancing-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.rebalancing();
    expect(text).toContain('portfolio drift');
    expect(text).toContain('asset allocation');
    expect(text).toContain('diversification');
  });

  it('references concentration risk and BND', () => {
    const text = SPECIALIST_KNOWLEDGE.rebalancing();
    expect(text).toContain('concentration risk');
    expect(text).toContain('BND');
  });
});

describe('insurance knowledge — Diana Nakamura', () => {
  it('contains insurance-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.insurance();
    expect(text).toContain('life insurance');
    expect(text).toContain('beneficiary');
    expect(text).toContain('estate planning');
  });

  it('references coverage amount and term life expiry from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.insurance();
    const li = PORTFOLIO_DATA.estate.lifeInsurance;
    const expiryYear = parseInt(li.startDate.split('-')[0]) + parseInt(li.term);
    expect(text).toContain(fmtM(li.coverageAmount));
    expect(text).toContain(String(expiryYear));
  });
});

describe('cashflow knowledge — James Park', () => {
  it('contains cash flow domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.cashflow();
    expect(text).toContain('savings rate');
    expect(text).toContain('emergency fund');
  });

  it('references income and DTI ratio from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.cashflow();
    expect(text).toContain(fmtK(PORTFOLIO_DATA.owner.annualIncome));
    expect(text).toContain('DTI');
    const debtSum = computeDebtSummary();
    const dti = Math.round((debtSum.totalMonthly / (PORTFOLIO_DATA.owner.annualIncome / 12)) * 100);
    expect(text).toContain(dti + '%');
  });
});

describe('goals knowledge — Elena Vasquez', () => {
  it('contains goal tracking domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.goals();
    expect(text).toContain('milestone planning');
    expect(text).toContain('priority ranking');
  });

  it('references 529 and competing priorities', () => {
    const text = SPECIALIST_KNOWLEDGE.goals();
    expect(text).toContain('529');
    expect(text).toContain('competing priorities');
  });
});

describe('dynamic value computation in specialist knowledge', () => {
  it('tax: NVDA cost basis and price come from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    const nvda = PORTFOLIO_DATA.accounts[5].holdings[0];
    expect(text).toContain('$' + nvda.costBasis);
    expect(text).toContain('$' + nvda.currentPrice);
  });

  it('tax: withholding rate matches computed value', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    const w2 = PORTFOLIO_DATA.w2Income;
    const totalWithholding = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
    const effectivePct = Math.round((totalWithholding / PORTFOLIO_DATA.owner.annualIncome) * 100);
    expect(text).toContain(effectivePct + '%');
  });

  it('tax: federal and state brackets come from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.tax();
    expect(text).toContain(PORTFOLIO_DATA.owner.taxBracketFederal);
    expect(text).toContain(PORTFOLIO_DATA.owner.taxBracketState);
  });

  it('retirement: net worth matches portfolio minus debt', () => {
    const text = SPECIALIST_KNOWLEDGE.retirement();
    const portfolio = computePortfolio();
    const debt = computeDebtSummary();
    const netWorth = Math.round(portfolio.totalValue - debt.totalBalance);
    expect(text).toContain(fmtK(netWorth));
  });

  it('retirement: includes owner age from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.retirement();
    expect(text).toContain(PORTFOLIO_DATA.owner.age + '-year-old');
  });

  it('debt: all three debt balances come from PORTFOLIO_DATA', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    for (const debt of PORTFOLIO_DATA.debt) {
      expect(text).toContain(fmtK(debt.currentBalance));
    }
  });

  it('debt: annual debt service equals monthly * 12', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    const debtSum = computeDebtSummary();
    expect(text).toContain(fmtDollars(debtSum.totalMonthly * 12));
  });

  it('rebalancing: US equity percentage comes from computePortfolio', () => {
    const text = SPECIALIST_KNOWLEDGE.rebalancing();
    const portfolio = computePortfolio();
    const pct = Math.round(portfolio.assetAllocation['US Equity'] * 100);
    expect(text).toContain(pct + '%');
  });

  it('insurance: expiry year computed from start date + term', () => {
    const text = SPECIALIST_KNOWLEDGE.insurance();
    const li = PORTFOLIO_DATA.estate.lifeInsurance;
    const expiryYear = parseInt(li.startDate.split('-')[0]) + parseInt(li.term);
    expect(text).toContain(String(expiryYear));
  });

  it('cashflow: total withholding computed from W-2 fields', () => {
    const text = SPECIALIST_KNOWLEDGE.cashflow();
    const w2 = PORTFOLIO_DATA.w2Income;
    const total = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
    expect(text).toContain(fmtK(total));
  });

  it('goals: 529 value comes from computePortfolio', () => {
    const text = SPECIALIST_KNOWLEDGE.goals();
    const edu529 = computePortfolio().accounts[3];
    expect(text).toContain(fmtK(edu529.totalValue));
  });

  it('goals: years to college computed from beneficiary age', () => {
    const text = SPECIALIST_KNOWLEDGE.goals();
    const childAge = parseInt(PORTFOLIO_DATA.accounts[3].beneficiary.match(/age (\d+)/)[1]);
    expect(text).toContain((18 - childAge) + ' years to college');
  });
});
