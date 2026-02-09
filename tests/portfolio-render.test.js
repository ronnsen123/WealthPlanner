// tests/portfolio-render.test.js — Test DOM rendering functions
import { describe, it, expect, beforeEach } from 'vitest';

describe('renderScenarioOverview', () => {
  let container;

  beforeEach(() => {
    invalidatePortfolioCache();
    container = document.createElement('div');
  });

  it('renders owner name and age', () => {
    renderScenarioOverview(container);
    expect(container.innerHTML).toContain('Jordan Mitchell');
    expect(container.innerHTML).toContain('38-year-old');
  });

  it('renders scenario tag and stats', () => {
    renderScenarioOverview(container);
    expect(container.innerHTML).toContain('SCENARIO');
    expect(container.innerHTML).toContain('24%');
    expect(container.innerHTML).toContain('9.3%');
  });
});

describe('renderTabbedSummary', () => {
  let container;

  beforeEach(() => {
    invalidatePortfolioCache();
    container = document.createElement('div');

    // Create the detail section elements that tab switching depends on
    for (const id of ['portfolio-accounts', 'income-details', 'debt-details', 'estate-details']) {
      if (!document.getElementById(id)) {
        const el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el);
      }
    }
  });

  it('creates 4 tab buttons', () => {
    renderTabbedSummary(container);
    const buttons = container.querySelectorAll('.tab-btn');
    expect(buttons).toHaveLength(4);
  });

  it('first tab (Portfolio) is active by default', () => {
    renderTabbedSummary(container);
    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('portfolio');
    const activePanel = container.querySelector('.tab-panel.active');
    expect(activePanel.dataset.panel).toBe('portfolio');
  });

  it('clicking Debt tab activates it and deactivates Portfolio', () => {
    renderTabbedSummary(container);
    const debtBtn = container.querySelector('.tab-btn[data-tab="debt"]');
    debtBtn.click();

    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('debt');

    const activePanel = container.querySelector('.tab-panel.active');
    expect(activePanel.dataset.panel).toBe('debt');
  });

  it('tab switching hides portfolio-accounts and shows debt-details', () => {
    renderTabbedSummary(container);
    const debtBtn = container.querySelector('.tab-btn[data-tab="debt"]');
    debtBtn.click();

    expect(document.getElementById('portfolio-accounts').style.display).toBe('none');
    expect(document.getElementById('debt-details').style.display).toBe('');
    expect(document.getElementById('income-details').style.display).toBe('none');
    expect(document.getElementById('estate-details').style.display).toBe('none');
  });

  it('Portfolio tab shows total portfolio value', () => {
    renderTabbedSummary(container);
    const portfolioPanel = container.querySelector('#tab-panel-portfolio');
    expect(portfolioPanel.innerHTML).toContain('Total Portfolio Value');
    expect(portfolioPanel.innerHTML).toContain('$');
  });

  it('Income tab shows gross wages', () => {
    renderTabbedSummary(container);
    const incomePanel = container.querySelector('#tab-panel-income');
    expect(incomePanel.innerHTML).toContain('$195,000');
    expect(incomePanel.innerHTML).toContain('Apex');
  });

  it('Debt tab shows total outstanding debt', () => {
    renderTabbedSummary(container);
    const debtPanel = container.querySelector('#tab-panel-debt');
    expect(debtPanel.innerHTML).toContain('Total Outstanding Debt');
    expect(debtPanel.innerHTML).toContain('Home Equity');
  });

  it('Estate tab shows estate plan status', () => {
    renderTabbedSummary(container);
    const estatePanel = container.querySelector('#tab-panel-estate');
    expect(estatePanel.innerHTML).toContain('Up to Date');
    expect(estatePanel.innerHTML).toContain('$1,000,000');
  });
});

describe('renderPortfolioAccounts', () => {
  let container;

  beforeEach(() => {
    invalidatePortfolioCache();
    container = document.createElement('div');
  });

  it('creates 6 account sections', () => {
    renderPortfolioAccounts(container);
    const sections = container.querySelectorAll('.account-section');
    expect(sections).toHaveLength(6);
  });

  it('includes ticker cells for holdings', () => {
    renderPortfolioAccounts(container);
    const tickers = container.querySelectorAll('.ticker-cell');
    expect(tickers.length).toBeGreaterThan(10); // 21 total holdings
  });

  it('shows 401(k) account with VTI', () => {
    renderPortfolioAccounts(container);
    expect(container.innerHTML).toContain('401(k) Retirement');
    expect(container.innerHTML).toContain('VTI');
  });
});

describe('renderDebtDetails', () => {
  let container;

  beforeEach(() => {
    invalidatePortfolioCache();
    container = document.createElement('div');
  });

  it('renders 3 debt detail sections', () => {
    renderDebtDetails(container);
    const sections = container.querySelectorAll('.account-section');
    expect(sections).toHaveLength(3);
  });

  it('shows DTI ratio summary', () => {
    renderDebtDetails(container);
    expect(container.innerHTML).toContain('Debt-to-Income Ratio');
    expect(container.innerHTML).toContain('dti-bar-fill');
  });

  it('includes equity note for mortgage', () => {
    renderDebtDetails(container);
    expect(container.innerHTML).toContain('Property value');
    expect(container.innerHTML).toContain('Equity');
  });
});

describe('renderEstateDetails', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders life insurance section', () => {
    renderEstateDetails(container);
    expect(container.innerHTML).toContain('Life Insurance');
    expect(container.innerHTML).toContain('Northwestern Mutual');
  });

  it('renders beneficiary table', () => {
    renderEstateDetails(container);
    expect(container.innerHTML).toContain('Beneficiary Designations');
    expect(container.innerHTML).toContain('401(k)');
    expect(container.innerHTML).toContain('Casey Mitchell');
  });

  it('renders legal documents section', () => {
    renderEstateDetails(container);
    expect(container.innerHTML).toContain('Legal Documents');
    expect(container.innerHTML).toContain('Executed');
    expect(container.innerHTML).toContain('Established');
  });
});

describe('renderIncomeDetails', () => {
  let container;

  beforeEach(() => {
    invalidatePortfolioCache();
    container = document.createElement('div');
  });

  it('renders W-2 employment income section', () => {
    renderIncomeDetails(container);
    expect(container.innerHTML).toContain('W-2 Employment Income');
    expect(container.innerHTML).toContain('$195,000');
  });

  it('renders pre-tax deductions', () => {
    renderIncomeDetails(container);
    expect(container.innerHTML).toContain('Pre-Tax Deductions');
    expect(container.innerHTML).toContain('401(k) Deferral');
    expect(container.innerHTML).toContain('HSA Contribution');
  });

  it('renders monthly cash flow', () => {
    renderIncomeDetails(container);
    expect(container.innerHTML).toContain('Monthly Cash Flow');
    expect(container.innerHTML).toContain('Take-Home');
    expect(container.innerHTML).toContain('Debt Payments');
    expect(container.innerHTML).toContain('After Debt Service');
  });
});

describe('portfolioToPlainText', () => {
  beforeEach(() => {
    invalidatePortfolioCache();
  });

  it('includes client profile', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('CLIENT PROFILE');
    expect(text).toContain('Jordan Mitchell');
    expect(text).toContain('38');
  });

  it('includes all 6 accounts', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('401(k) Retirement');
    expect(text).toContain('Roth IRA');
    expect(text).toContain('Taxable Brokerage');
    expect(text).toContain('529 Education');
    expect(text).toContain('HSA (Health Savings)');
    expect(text).toContain('Donor-Advised Fund');
  });

  it('includes asset allocation section', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('ASSET ALLOCATION');
    expect(text).toContain('US Equity');
  });

  it('includes W-2 income data', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('W-2 INCOME');
    expect(text).toContain('Apex Technologies');
  });

  it('includes debt obligations', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('DEBT OBLIGATIONS');
    expect(text).toContain('Mortgage');
    expect(text).toContain('Student Loan');
  });

  it('includes estate plan', () => {
    const text = portfolioToPlainText();
    expect(text).toContain('ESTATE PLAN');
    expect(text).toContain('Northwestern Mutual');
    expect(text).toContain('Beneficiaries');
  });
});
