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

  it('references 401(k) and HSA maximums', () => {
    const text = SPECIALIST_KNOWLEDGE.retirement();
    expect(text).toContain('$23,500');
    expect(text).toContain('$8,550');
  });
});

describe('debt knowledge — Marcus Thompson', () => {
  it('contains debt-specific domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    expect(text).toContain('avalanche');
    expect(text).toContain('snowball');
    expect(text).toContain('refinancing');
  });

  it('references mortgage and DTI', () => {
    const text = SPECIALIST_KNOWLEDGE.debt();
    expect(text).toContain('6.25%');
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

  it('references coverage gap and term life expiry', () => {
    const text = SPECIALIST_KNOWLEDGE.insurance();
    expect(text).toContain('$1M');
    expect(text).toContain('2042');
  });
});

describe('cashflow knowledge — James Park', () => {
  it('contains cash flow domain keywords', () => {
    const text = SPECIALIST_KNOWLEDGE.cashflow();
    expect(text).toContain('savings rate');
    expect(text).toContain('emergency fund');
  });

  it('references income and DTI ratio', () => {
    const text = SPECIALIST_KNOWLEDGE.cashflow();
    expect(text).toContain('$195K');
    expect(text).toContain('DTI');
    expect(text).toContain('33%');
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
