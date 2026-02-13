// tests/clients.test.js — Tests for multi-client data model, switching, and persistence
import { describe, it, expect, beforeEach } from 'vitest';

describe('CLIENTS data model', () => {
  it('contains exactly 4 clients', () => {
    expect(CLIENTS).toHaveLength(4);
  });

  it('each client has a unique clientId', () => {
    const ids = CLIENTS.map(c => c.clientId);
    expect(new Set(ids).size).toBe(4);
  });

  it('each client has required top-level properties', () => {
    for (const client of CLIENTS) {
      expect(client).toHaveProperty('clientId');
      expect(client).toHaveProperty('avatar');
      expect(client).toHaveProperty('owner');
      expect(client).toHaveProperty('w2Income');
      expect(client).toHaveProperty('debt');
      expect(client).toHaveProperty('estate');
      expect(client).toHaveProperty('accounts');
    }
  });

  it('each client avatar has initials and color', () => {
    for (const client of CLIENTS) {
      expect(client.avatar.initials).toHaveLength(2);
      expect(client.avatar.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('each client owner has required fields', () => {
    for (const client of CLIENTS) {
      expect(client.owner).toHaveProperty('name');
      expect(client.owner).toHaveProperty('age');
      expect(client.owner).toHaveProperty('filingStatus');
      expect(client.owner).toHaveProperty('state');
      expect(client.owner).toHaveProperty('annualIncome');
      expect(typeof client.owner.age).toBe('number');
      expect(typeof client.owner.annualIncome).toBe('number');
    }
  });

  it('each client has at least one account', () => {
    for (const client of CLIENTS) {
      expect(client.accounts.length).toBeGreaterThan(0);
    }
  });

  it('each client has a debt array', () => {
    for (const client of CLIENTS) {
      expect(Array.isArray(client.debt)).toBe(true);
    }
  });

  it('Jordan Mitchell is the first client', () => {
    expect(CLIENTS[0].clientId).toBe('jordan-mitchell');
    expect(CLIENTS[0].owner.name).toBe('Jordan Mitchell');
  });

  it('clients represent diverse profiles', () => {
    const states = CLIENTS.map(c => c.owner.state);
    expect(new Set(states).size).toBe(4);

    const ages = CLIENTS.map(c => c.owner.age);
    expect(Math.min(...ages)).toBeLessThan(35);
    expect(Math.max(...ages)).toBeGreaterThan(60);
  });
});

describe('PORTFOLIO_DATA defaults', () => {
  it('starts with Jordan Mitchell (CLIENTS[0])', () => {
    expect(PORTFOLIO_DATA.clientId).toBe('jordan-mitchell');
    expect(PORTFOLIO_DATA.owner.name).toBe('Jordan Mitchell');
  });
});

describe('setActiveClient', () => {
  beforeEach(() => {
    setActiveClient('jordan-mitchell');
  });

  it('switches PORTFOLIO_DATA to the requested client', () => {
    setActiveClient('aisha-patel');
    expect(PORTFOLIO_DATA.clientId).toBe('aisha-patel');
    expect(PORTFOLIO_DATA.owner.name).toBe('Aisha Patel');
  });

  it('invalidates portfolio cache so computePortfolio returns new data', () => {
    const jordanTotal = computePortfolio().totalValue;
    setActiveClient('aisha-patel');
    const aishaTotal = computePortfolio().totalValue;
    expect(aishaTotal).not.toBe(jordanTotal);
  });

  it('does nothing for unknown clientId', () => {
    setActiveClient('nonexistent');
    expect(PORTFOLIO_DATA.clientId).toBe('jordan-mitchell');
  });

  it('can switch to each client and back', () => {
    for (const client of CLIENTS) {
      setActiveClient(client.clientId);
      expect(PORTFOLIO_DATA.clientId).toBe(client.clientId);
      expect(PORTFOLIO_DATA.owner.name).toBe(client.owner.name);
    }
    setActiveClient('jordan-mitchell');
    expect(PORTFOLIO_DATA.clientId).toBe('jordan-mitchell');
  });

  it('computeDebtSummary returns correct data after switch', () => {
    const jordanDebt = computeDebtSummary().totalBalance;
    setActiveClient('helen-park');
    const helenDebt = computeDebtSummary().totalBalance;
    expect(helenDebt).not.toBe(jordanDebt);
    expect(helenDebt).toBe(62000);
  });
});

describe('client data integrity per client', () => {
  it('Aisha Patel has correct profile', () => {
    const aisha = CLIENTS.find(c => c.clientId === 'aisha-patel');
    expect(aisha.owner.age).toBe(52);
    expect(aisha.owner.state).toBe('New York');
    expect(aisha.owner.filingStatus).toBe('Single');
    expect(aisha.owner.annualIncome).toBe(285000);
  });

  it('Carlos Reyes has correct profile', () => {
    const carlos = CLIENTS.find(c => c.clientId === 'carlos-reyes');
    expect(carlos.owner.age).toBe(29);
    expect(carlos.owner.state).toBe('Texas');
    expect(carlos.owner.annualIncome).toBe(140000);
    expect(carlos.debt).toHaveLength(3);
  });

  it('Helen Park has correct profile', () => {
    const helen = CLIENTS.find(c => c.clientId === 'helen-park');
    expect(helen.owner.age).toBe(67);
    expect(helen.owner.state).toBe('Florida');
    expect(helen.owner.annualIncome).toBe(72000);
    expect(helen.debt).toHaveLength(1);
  });
});
