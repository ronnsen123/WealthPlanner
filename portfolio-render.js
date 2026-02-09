// portfolio-render.js — All portfolio DOM rendering functions

// --- Scenario Overview ---

function renderScenarioOverview(container) {
  const o = PORTFOLIO_DATA.owner;
  const p = computePortfolio();

  const equityPct = (p.assetAllocation['US Equity'] || 0) + (p.assetAllocation['Intl Equity'] || 0);
  const bondPct = (p.assetAllocation['US Bond'] || 0);

  container.innerHTML = `
    <div class="scenario-card">
      <div class="scenario-header">
        <span class="scenario-tag">SCENARIO</span>
        <span class="scenario-title">Meet ${o.name}</span>
      </div>
      <p class="scenario-bio">
        ${o.name} is a <strong>${o.age}-year-old</strong> software engineering manager in <strong>${o.state}</strong>,
        filing as <strong>${o.filingStatus}</strong> with an annual household income of
        <strong>${fmtCurrency.format(o.annualIncome)}</strong>. They have one child, age 8.
      </p>
      <div class="scenario-stats">
        <div class="scenario-stat">
          <span class="scenario-stat-value">${o.taxBracketFederal}</span>
          <span class="scenario-stat-label">Federal Bracket</span>
        </div>
        <div class="scenario-stat">
          <span class="scenario-stat-value">${o.taxBracketState}</span>
          <span class="scenario-stat-label">State Tax (CA)</span>
        </div>
        <div class="scenario-stat">
          <span class="scenario-stat-value">${fmtPercent.format(equityPct)}</span>
          <span class="scenario-stat-label">Equities</span>
        </div>
        <div class="scenario-stat">
          <span class="scenario-stat-value">${fmtPercent.format(bondPct)}</span>
          <span class="scenario-stat-label">Bonds</span>
        </div>
      </div>
      <p class="scenario-prompt">
        Review the portfolio below and chat with the AI financial planner on the right.
        Ask about rebalancing, tax strategies, retirement planning, education funding, or charitable giving.
      </p>
    </div>
  `;
}

// --- Tabbed Summary Card ---

function renderTabbedSummary(container) {
  const tabButtons = TAB_DEFINITIONS.map((t, i) =>
    `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${t.id}">${t.icon} ${t.label}</button>`
  ).join('');

  container.innerHTML = `
    <div class="tabbed-summary">
      <div class="tab-bar">${tabButtons}</div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="portfolio" id="tab-panel-portfolio"></div>
        <div class="tab-panel" data-panel="income" id="tab-panel-income"></div>
        <div class="tab-panel" data-panel="debt" id="tab-panel-debt"></div>
        <div class="tab-panel" data-panel="estate" id="tab-panel-estate"></div>
      </div>
    </div>
  `;

  // Render each tab's content
  renderTabPortfolio(container.querySelector('#tab-panel-portfolio'));
  renderTabIncome(container.querySelector('#tab-panel-income'));
  renderTabDebt(container.querySelector('#tab-panel-debt'));
  renderTabEstate(container.querySelector('#tab-panel-estate'));

  // Wire tab switching — also toggle portfolio-accounts & detail sections visibility
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      container.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');

      // Show/hide the portfolio accounts tree & contextual detail sections
      const activeTab = btn.dataset.tab;
      const accountsEl = document.getElementById('portfolio-accounts');
      const debtDetailsEl = document.getElementById('debt-details');
      const estateDetailsEl = document.getElementById('estate-details');
      const incomeDetailsEl = document.getElementById('income-details');

      if (accountsEl) accountsEl.style.display = activeTab === 'portfolio' ? '' : 'none';
      if (debtDetailsEl) debtDetailsEl.style.display = activeTab === 'debt' ? '' : 'none';
      if (estateDetailsEl) estateDetailsEl.style.display = activeTab === 'estate' ? '' : 'none';
      if (incomeDetailsEl) incomeDetailsEl.style.display = activeTab === 'income' ? '' : 'none';
    });
  });
}

// --- Tab Content Renderers ---

function renderTabPortfolio(panel) {
  const p = computePortfolio();
  const glClass = p.totalGainLoss >= 0 ? 'gain' : 'loss';
  const glSign = p.totalGainLoss >= 0 ? '+' : '';

  let allocationBars = '';
  const sortedAlloc = Object.entries(p.assetAllocation).sort((a, b) => b[1] - a[1]);
  for (const [cls, pct] of sortedAlloc) {
    const color = ASSET_CLASS_COLORS[cls] || '#64748b';
    allocationBars += `<div class="alloc-segment" style="width:${(pct * 100).toFixed(1)}%;background:${color}" title="${cls}: ${fmtPercent.format(pct)}"></div>`;
  }
  let allocationLegend = '';
  for (const [cls, pct] of sortedAlloc) {
    const color = ASSET_CLASS_COLORS[cls] || '#64748b';
    allocationLegend += `<span class="legend-item"><span class="legend-dot" style="background:${color}"></span>${cls} ${fmtPercent.format(pct)}</span>`;
  }

  panel.innerHTML = `
    ${buildHeroSection({
      label: 'Total Portfolio Value',
      value: fmtCurrency.format(p.totalValue),
      sub: `${glSign}${fmtCurrency.format(p.totalGainLoss)} (${fmtPercent.format(p.gainLossPercent)})`,
      subClass: glClass,
    })}
    ${buildStatsRow([
      { label: 'Cost Basis', value: fmtCurrency.format(p.totalCostBasis) },
      { label: 'Accounts', value: String(p.accounts.length) },
      { label: 'Holdings', value: String(p.accounts.reduce((s, a) => s + a.holdings.length, 0)) },
    ])}
    <div class="allocation-section-mini">
      <div class="allocation-bar">${allocationBars}</div>
      <div class="allocation-legend">${allocationLegend}</div>
    </div>
  `;
}

function renderTabIncome(panel) {
  const w2 = PORTFOLIO_DATA.w2Income;
  if (!w2) { panel.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:20px;">No income data available.</p>'; return; }

  const totalWithheld = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
  const effectiveRate = totalWithheld / w2.wagesBox1;
  const takeHome = w2.wagesBox1 - totalWithheld;

  panel.innerHTML = `
    ${buildHeroSection({
      label: `Gross Wages &middot; ${w2.employer}`,
      value: fmtCurrency.format(w2.wagesBox1),
      sub: `Eff. Withholding Rate ${fmtPercent.format(effectiveRate)}`,
      subClass: '',
    })}
    <div class="w2-grid">
      <div class="w2-card"><div class="w2-card-label">Federal (Box 2)</div><div class="w2-card-value w2-negative">${fmtCurrency.format(w2.federalWithheldBox2)}</div></div>
      <div class="w2-card"><div class="w2-card-label">State CA (Box 17)</div><div class="w2-card-value w2-negative">${fmtCurrency.format(w2.stateWithheldBox17)}</div></div>
      <div class="w2-card"><div class="w2-card-label">SS + Medicare</div><div class="w2-card-value w2-negative">${fmtCurrency.format(w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6)}</div></div>
    </div>
    <div class="w2-deductions">
      <div class="w2-deductions-title">Pre-Tax Deductions</div>
      <table class="w2-table">
        <tbody>
          <tr><td class="w2-item-label">401(k) <span class="w2-box-ref">12(D)</span></td><td class="w2-item-value">${fmtCurrency.format(w2.retirement401kBox12D)}</td></tr>
          <tr><td class="w2-item-label">HSA <span class="w2-box-ref">12(W)</span></td><td class="w2-item-value">${fmtCurrency.format(w2.hsaBox12W)}</td></tr>
          <tr><td class="w2-item-label">Dep. Care FSA <span class="w2-box-ref">Box 10</span></td><td class="w2-item-value">${fmtCurrency.format(w2.dependentCareFSABox10)}</td></tr>
          <tr><td class="w2-item-label">Health Ins. <span class="w2-box-ref">12(DD)</span></td><td class="w2-item-value">${fmtCurrency.format(w2.healthInsuranceBox12DD)}</td></tr>
        </tbody>
      </table>
    </div>
    ${buildStatsRow([
      { label: 'Take-Home', value: fmtCurrency.format(takeHome), flex: '1', valueStyle: 'color:var(--color-gain)' },
      { label: 'Tax Year', value: String(w2.year), flex: '1' },
    ])}
  `;
}

function renderTabDebt(panel) {
  const { debts, totalBalance, totalMonthly, homeEquity } = computeDebtSummary();
  if (debts.length === 0) { panel.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:20px;">No debt data available.</p>'; return; }

  const debtRows = debts.map(d => {
    const paidPct = 1 - (d.currentBalance / d.originalBalance);
    return `
      <div class="debt-row">
        <div class="debt-row-header">
          <span class="debt-row-icon">${d.icon}</span>
          <span class="debt-row-type">${d.type}</span>
          <span class="debt-row-lender">${d.lender}</span>
          <span class="debt-row-balance">${fmtCurrency.format(d.currentBalance)}</span>
        </div>
        <div class="debt-row-details">
          <span>${fmtPercent.format(d.interestRate)} APR</span>
          <span>${fmtCurrency.format(d.monthlyPayment)}/mo</span>
          <span>${d.term}</span>
        </div>
        <div class="debt-progress">
          <div class="debt-progress-bar" style="width:${(paidPct * 100).toFixed(0)}%"></div>
        </div>
        <div class="debt-progress-label">${fmtPercent.format(paidPct)} paid off</div>
      </div>`;
  }).join('');

  panel.innerHTML = `
    ${buildHeroSection({
      label: 'Total Outstanding Debt',
      value: fmtCurrency.format(totalBalance),
      valueStyle: 'color:var(--color-loss)',
      sub: `${fmtCurrency.format(totalMonthly)}/mo total payments`,
    })}
    ${buildStatsRow([
      { label: 'Home Equity', value: fmtCurrency.format(homeEquity), valueStyle: 'color:var(--color-gain)' },
      { label: 'Debts', value: String(debts.length) },
      { label: 'Avg Rate', value: fmtPercent.format(debts.reduce((s,d) => s + d.interestRate * d.currentBalance, 0) / totalBalance) },
    ])}
    <div class="debt-list">${debtRows}</div>
  `;
}

function renderTabEstate(panel) {
  const e = PORTFOLIO_DATA.estate;
  if (!e) { panel.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:20px;">No estate data available.</p>'; return; }

  const beneRows = e.beneficiaries.map(b =>
    `<tr><td class="w2-item-label">${b.account}</td><td class="w2-item-value" style="font-size:11px">${b.primary}</td></tr>`
  ).join('');

  const coverageTotal = (e.lifeInsurance?.coverageAmount || 0) + (e.umbrellaInsurance?.coverageAmount || 0);

  panel.innerHTML = `
    ${buildHeroSection({
      label: 'Estate Plan Status',
      value: 'Up to Date',
      valueStyle: 'font-size:28px;color:var(--color-gain)',
      sub: `Last reviewed ${e.will.lastUpdated} &middot; ${e.will.attorney}`,
    })}
    ${buildStatsRow([
      { label: 'Life Insurance', value: fmtCurrency.format(e.lifeInsurance.coverageAmount) },
      { label: 'Umbrella', value: fmtCurrency.format(e.umbrellaInsurance.coverageAmount) },
      { label: 'Total Coverage', value: fmtCurrency.format(coverageTotal) },
    ])}
    <div class="estate-docs">
      <div class="estate-doc-row">
        <span class="estate-doc-icon">\u2705</span>
        <span class="estate-doc-label">Will</span>
        <span class="estate-doc-status">${e.will.status}</span>
      </div>
      <div class="estate-doc-row">
        <span class="estate-doc-icon">\u2705</span>
        <span class="estate-doc-label">Revocable Trust</span>
        <span class="estate-doc-status">${e.revocableTrust.name}</span>
      </div>
      <div class="estate-doc-row">
        <span class="estate-doc-icon">\u2705</span>
        <span class="estate-doc-label">Financial POA</span>
        <span class="estate-doc-status">${e.powerOfAttorney.financial}</span>
      </div>
      <div class="estate-doc-row">
        <span class="estate-doc-icon">\u2705</span>
        <span class="estate-doc-label">Healthcare POA</span>
        <span class="estate-doc-status">${e.powerOfAttorney.healthcare}</span>
      </div>
      <div class="estate-doc-row">
        <span class="estate-doc-icon">\u{1F476}</span>
        <span class="estate-doc-label">Guardian</span>
        <span class="estate-doc-status">${e.guardianship.child}</span>
      </div>
    </div>
    <div class="w2-deductions">
      <div class="w2-deductions-title">Primary Beneficiaries</div>
      <table class="w2-table"><tbody>${beneRows}</tbody></table>
    </div>
    ${buildStatsRow([
      { label: 'Life Policy', value: `${e.lifeInsurance.type} \u00b7 ${e.lifeInsurance.term} \u00b7 $${e.lifeInsurance.premium}/mo`, flex: '1', valueStyle: 'font-size:11px' },
    ])}
  `;
}

// --- Contextual Detail Sections (shown below tabs per active tab) ---

function renderDebtDetails(container) {
  const debts = PORTFOLIO_DATA.debt || [];
  if (debts.length === 0) { container.innerHTML = ''; return; }

  const { totalBalance, totalMonthly } = computeDebtSummary();
  const annualDebtService = totalMonthly * 12;
  const dtiRatio = annualDebtService / PORTFOLIO_DATA.owner.annualIncome;

  let html = '';
  for (const d of debts) {
    const paidPct = 1 - (d.currentBalance / d.originalBalance);
    const equityNote = d.propertyValue
      ? `<span class="detail-note">Property value: ${fmtCurrency.format(d.propertyValue)} \u00b7 Equity: ${fmtCurrency.format(d.propertyValue - d.currentBalance)}</span>`
      : '';

    // Estimate payoff timeline
    const monthlyRate = d.interestRate / 12;
    let monthsRemaining = '\u2014';
    if (monthlyRate > 0 && d.monthlyPayment > d.currentBalance * monthlyRate) {
      const n = -Math.log(1 - (d.currentBalance * monthlyRate / d.monthlyPayment)) / Math.log(1 + monthlyRate);
      const years = Math.ceil(n / 12);
      monthsRemaining = `~${years} yr${years > 1 ? 's' : ''} remaining`;
    }

    const detailGrid = buildDetailGrid([
      { label: 'Original Balance', value: fmtCurrency.format(d.originalBalance) },
      { label: 'Current Balance', value: fmtCurrency.format(d.currentBalance), valueStyle: 'color:var(--color-loss)' },
      { label: 'Monthly Payment', value: fmtCurrency.format(d.monthlyPayment) },
      { label: 'Interest Rate', value: fmtPercent.format(d.interestRate) },
      { label: 'Paid Off', value: fmtPercent.format(paidPct), valueStyle: 'color:var(--color-gain)' },
      { label: 'Timeline', value: monthsRemaining },
    ]);

    html += buildAccountSection({
      icon: d.icon,
      name: d.type,
      meta: `${d.lender} \u00b7 ${d.term} \u00b7 Since ${d.originDate}`,
      value: fmtCurrency.format(d.currentBalance),
      valueStyle: 'color:var(--color-loss)',
      valueSub: `${fmtPercent.format(d.interestRate)} APR`,
      body: `${detailGrid}${equityNote}`,
    });
  }

  // Add DTI ratio summary card
  html += `
    <div class="dti-summary">
      <div class="dti-header">
        <span class="dti-label">Debt-to-Income Ratio</span>
        <span class="dti-value ${dtiRatio > 0.36 ? 'dti-high' : dtiRatio > 0.28 ? 'dti-medium' : 'dti-low'}">${fmtPercent.format(dtiRatio)}</span>
      </div>
      <div class="dti-bar-track">
        <div class="dti-bar-fill ${dtiRatio > 0.36 ? 'dti-high' : dtiRatio > 0.28 ? 'dti-medium' : 'dti-low'}" style="width:${Math.min(dtiRatio * 100, 100).toFixed(0)}%"></div>
        <div class="dti-threshold" style="left:28%"><span>28%</span></div>
        <div class="dti-threshold" style="left:36%"><span>36%</span></div>
      </div>
      <div class="dti-note">Annual debt service: ${fmtCurrency.format(annualDebtService)} on ${fmtCurrency.format(PORTFOLIO_DATA.owner.annualIncome)} income</div>
    </div>`;

  container.innerHTML = html;
}

function renderEstateDetails(container) {
  const e = PORTFOLIO_DATA.estate;
  if (!e) { container.innerHTML = ''; return; }

  let html = '';

  // Life Insurance detail card
  if (e.lifeInsurance) {
    const li = e.lifeInsurance;
    const startYear = parseInt(li.startDate.split('-')[0]);
    const termYears = parseInt(li.term);
    const expiryYear = startYear + termYears;

    html += buildAccountSection({
      icon: '\u{1F6E1}\uFE0F',
      name: `Life Insurance \u2014 ${li.type} ${li.term}`,
      meta: `${li.provider} \u00b7 Insured: ${li.insured}`,
      value: fmtCurrency.format(li.coverageAmount),
      valueSub: `$${li.premium}/${li.premiumFrequency}`,
      body: buildDetailGrid([
        { label: 'Coverage', value: fmtCurrency.format(li.coverageAmount) },
        { label: 'Premium', value: `$${li.premium}/${li.premiumFrequency}` },
        { label: 'Term', value: li.term },
        { label: 'Start', value: li.startDate },
        { label: 'Expires', value: String(expiryYear) },
        { label: 'Annual Cost', value: fmtCurrency.format(li.premium * 12) },
      ]),
      open: true,
    });
  }

  // Umbrella Insurance
  if (e.umbrellaInsurance) {
    const ui = e.umbrellaInsurance;
    html += buildAccountSection({
      icon: '\u2602\uFE0F',
      name: 'Umbrella Insurance',
      meta: ui.provider,
      value: fmtCurrency.format(ui.coverageAmount),
      valueSub: `$${ui.annualPremium}/yr`,
      body: buildDetailGrid([
        { label: 'Coverage', value: fmtCurrency.format(ui.coverageAmount) },
        { label: 'Annual Premium', value: fmtCurrency.format(ui.annualPremium) },
      ]),
    });
  }

  // Beneficiary Designations detail
  if (e.beneficiaries && e.beneficiaries.length > 0) {
    const beneTable = buildTable(
      [{ text: 'Account' }, { text: 'Primary' }, { text: 'Contingent' }],
      e.beneficiaries.map(b => [
        { text: b.account, className: 'ticker-cell', style: 'color:var(--color-text-light);font-family:var(--font-sans)' },
        { text: b.primary, style: 'color:var(--color-text-light);font-size:12px' },
        { text: b.contingent, style: 'color:var(--color-text-muted);font-size:12px' },
      ])
    );

    html += buildAccountSection({
      icon: '\u{1F465}',
      name: 'Beneficiary Designations',
      meta: `${e.beneficiaries.length} accounts designated`,
      body: beneTable,
      open: true,
    });
  }

  // Legal Documents
  html += buildAccountSection({
    icon: '\u{1F4C4}',
    name: 'Legal Documents',
    meta: `${e.will.attorney} \u00b7 Last updated ${e.will.lastUpdated}`,
    body: buildDetailGrid([
      { label: 'Will', value: e.will.status },
      { label: 'Trust', value: e.revocableTrust.status },
      { label: 'Financial POA', value: e.powerOfAttorney.financial, valueStyle: 'font-size:11px' },
      { label: 'Healthcare POA', value: e.powerOfAttorney.healthcare, valueStyle: 'font-size:11px' },
      { label: 'Guardian', value: e.guardianship.child, valueStyle: 'font-size:11px' },
      { label: 'Trust Name', value: e.revocableTrust.name, valueStyle: 'font-size:10px' },
    ]),
  });

  container.innerHTML = html;
}

function renderIncomeDetails(container) {
  const w2 = PORTFOLIO_DATA.w2Income;
  if (!w2) { container.innerHTML = ''; return; }

  const totalWithheld = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
  const takeHome = w2.wagesBox1 - totalWithheld;
  const totalPreTax = w2.retirement401kBox12D + w2.hsaBox12W + w2.dependentCareFSABox10;
  const monthlyTakeHome = takeHome / 12;
  const { totalMonthly: debtPayments } = computeDebtSummary();
  const monthlyAfterDebt = monthlyTakeHome - debtPayments;

  const w2Table = buildTable(
    [{ text: 'Category' }, { text: 'Box' }, { text: 'Amount', style: 'text-align:right' }],
    [
      [{ text: 'Gross Wages' }, { text: 'Box 1', style: 'color:var(--color-text-muted)' }, { text: fmtCurrency.format(w2.wagesBox1), className: 'num-cell' }],
      [{ text: 'Federal Tax Withheld' }, { text: 'Box 2', style: 'color:var(--color-text-muted)' }, { text: `(${fmtCurrency.format(w2.federalWithheldBox2)})`, className: 'num-cell loss' }],
      [{ text: 'Social Security Withheld' }, { text: 'Box 4', style: 'color:var(--color-text-muted)' }, { text: `(${fmtCurrency.format(w2.socialSecurityWithheldBox4)})`, className: 'num-cell loss' }],
      [{ text: 'Medicare Withheld' }, { text: 'Box 6', style: 'color:var(--color-text-muted)' }, { text: `(${fmtCurrency.format(w2.medicareWithheldBox6)})`, className: 'num-cell loss' }],
      [{ text: 'State Tax Withheld (CA)' }, { text: 'Box 17', style: 'color:var(--color-text-muted)' }, { text: `(${fmtCurrency.format(w2.stateWithheldBox17)})`, className: 'num-cell loss' }],
    ]
  );

  const w2Section = buildAccountSection({
    icon: '\u{1F4BC}',
    name: 'W-2 Employment Income',
    meta: `${w2.employer} \u00b7 EIN ${w2.employerEIN} \u00b7 Tax Year ${w2.year}`,
    value: fmtCurrency.format(w2.wagesBox1),
    valueSub: 'Gross wages',
    body: w2Table,
    open: true,
  });

  const preTaxSection = buildAccountSection({
    icon: '\u{1F3E6}',
    name: 'Pre-Tax Deductions & Benefits',
    meta: `${fmtCurrency.format(totalPreTax)} total pre-tax savings`,
    value: fmtCurrency.format(totalPreTax),
    valueStyle: 'color:var(--color-gain)',
    body: buildDetailGrid([
      { label: '401(k) Deferral', value: fmtCurrency.format(w2.retirement401kBox12D) },
      { label: 'HSA Contribution', value: fmtCurrency.format(w2.hsaBox12W) },
      { label: 'Dep. Care FSA', value: fmtCurrency.format(w2.dependentCareFSABox10) },
      { label: 'Health Insurance', value: fmtCurrency.format(w2.healthInsuranceBox12DD) },
    ]),
  });

  container.innerHTML = `
    ${w2Section}
    ${preTaxSection}
    <div class="dti-summary">
      <div class="dti-header">
        <span class="dti-label">Monthly Cash Flow</span>
      </div>
      <div class="cash-flow-grid">
        <div class="cash-flow-item">
          <span class="cash-flow-label">Take-Home (Monthly)</span>
          <span class="cash-flow-value" style="color:var(--color-gain)">${fmtCurrency.format(monthlyTakeHome)}</span>
        </div>
        <div class="cash-flow-item">
          <span class="cash-flow-label">Debt Payments</span>
          <span class="cash-flow-value" style="color:var(--color-loss)">\u2212${fmtCurrency.format(debtPayments)}</span>
        </div>
        <div class="cash-flow-item">
          <span class="cash-flow-label">After Debt Service</span>
          <span class="cash-flow-value" style="color:${monthlyAfterDebt >= 0 ? 'var(--color-gain)' : 'var(--color-loss)'}">${fmtCurrency.format(monthlyAfterDebt)}</span>
        </div>
      </div>
    </div>`;
}

// --- Portfolio Accounts Tree ---

function renderPortfolioAccounts(container) {
  const p = computePortfolio();
  let html = '';

  for (const acct of p.accounts) {
    const glClass = acct.totalGainLoss >= 0 ? 'gain' : 'loss';
    const glSign = acct.totalGainLoss >= 0 ? '+' : '';

    let holdingsRows = '';
    for (const h of acct.holdings) {
      const hGlClass = h.gainLoss >= 0 ? 'gain' : 'loss';
      const hGlSign = h.gainLoss >= 0 ? '+' : '';
      holdingsRows += `
        <tr>
          <td class="ticker-cell">${h.ticker}</td>
          <td class="name-cell">${h.name}</td>
          <td class="num-cell">${fmtNumber.format(h.shares)}</td>
          <td class="num-cell">${fmtCurrencyPrecise.format(h.costBasis)}</td>
          <td class="num-cell">${fmtCurrencyPrecise.format(h.currentPrice)}</td>
          <td class="num-cell">${fmtCurrency.format(h.currentValue)}</td>
          <td class="num-cell ${hGlClass}">${hGlSign}${fmtCurrency.format(h.gainLoss)}</td>
          <td class="num-cell ${hGlClass}">${hGlSign}${fmtPercent.format(h.gainLossPercent)}</td>
        </tr>`;
    }

    const beneficiaryBadge = acct.beneficiary ? `<span class="beneficiary-badge">${acct.beneficiary}</span>` : '';

    html += `
      <details class="account-section" open>
        <summary class="account-header">
          <div class="account-header-left">
            <span class="account-icon">${acct.icon}</span>
            <div class="account-title-group">
              <span class="account-name">${acct.name}</span>
              <span class="account-meta">${acct.institution} &middot; ${acct.taxTreatment} ${beneficiaryBadge}</span>
            </div>
          </div>
          <div class="account-header-right">
            <span class="account-value">${fmtCurrency.format(acct.totalValue)}</span>
            <span class="account-gainloss ${glClass}">${glSign}${fmtCurrency.format(acct.totalGainLoss)} (${fmtPercent.format(acct.gainLossPercent)})</span>
          </div>
        </summary>
        <div class="account-body">
          <table class="holdings-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th>Shares</th>
                <th>Cost Basis</th>
                <th>Price</th>
                <th>Value</th>
                <th>Gain/Loss</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>${holdingsRows}</tbody>
          </table>
        </div>
      </details>`;
  }

  container.innerHTML = html;
}

// --- Text Serializer (for AI system prompt) ---

function portfolioToPlainText() {
  const p = computePortfolio();
  const lines = [];

  lines.push("=== CLIENT PROFILE ===");
  lines.push(`Name: ${p.owner.name} | Age: ${p.owner.age} | Filing: ${p.owner.filingStatus} | State: ${p.owner.state}`);
  lines.push(`Annual Income: ${fmtCurrency.format(p.owner.annualIncome)} | Federal Bracket: ${p.owner.taxBracketFederal} | State Bracket: ${p.owner.taxBracketState}`);
  lines.push("");
  lines.push("=== PORTFOLIO OVERVIEW ===");
  lines.push(`Total Value: ${fmtCurrency.format(p.totalValue)} | Cost Basis: ${fmtCurrency.format(p.totalCostBasis)} | Gain/Loss: ${p.totalGainLoss >= 0 ? '+' : ''}${fmtCurrency.format(p.totalGainLoss)} (${fmtPercent.format(p.gainLossPercent)})`);
  lines.push("");

  for (const acct of p.accounts) {
    lines.push(`=== ACCOUNT: ${acct.name} (${acct.institution}) | Tax Treatment: ${acct.taxTreatment} ===`);
    if (acct.beneficiary) lines.push(`Beneficiary: ${acct.beneficiary}`);
    lines.push(`Total Value: ${fmtCurrency.format(acct.totalValue)} | Gain/Loss: ${acct.totalGainLoss >= 0 ? '+' : ''}${fmtCurrency.format(acct.totalGainLoss)} (${fmtPercent.format(acct.gainLossPercent)})`);
    for (const h of acct.holdings) {
      const gl = h.gainLoss >= 0 ? '+' : '';
      lines.push(`  ${h.ticker.padEnd(6)} | ${h.name.padEnd(40)} | ${String(h.shares).padStart(5)} shares | Cost: ${fmtCurrencyPrecise.format(h.costBasis).padStart(10)} | Price: ${fmtCurrencyPrecise.format(h.currentPrice).padStart(10)} | Value: ${fmtCurrency.format(h.currentValue).padStart(10)} | ${gl}${fmtCurrency.format(h.gainLoss)} (${fmtPercent.format(h.gainLossPercent)})`);
    }
    lines.push("");
  }

  lines.push("=== ASSET ALLOCATION ===");
  for (const [cls, pct] of Object.entries(p.assetAllocation).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${cls}: ${fmtPercent.format(pct)}`);
  }

  // W-2 Income
  const w2 = PORTFOLIO_DATA.w2Income;
  if (w2) {
    lines.push("");
    lines.push("=== W-2 INCOME (Current Year) ===");
    lines.push(`Employer: ${w2.employer} | Tax Year: ${w2.year}`);
    lines.push(`Box 1 \u2014 Wages: ${fmtCurrency.format(w2.wagesBox1)}`);
    lines.push(`Box 2 \u2014 Federal Withheld: ${fmtCurrency.format(w2.federalWithheldBox2)}`);
    lines.push(`Box 3 \u2014 SS Wages: ${fmtCurrency.format(w2.socialSecurityWagesBox3)} | Box 4 \u2014 SS Withheld: ${fmtCurrency.format(w2.socialSecurityWithheldBox4)}`);
    lines.push(`Box 5 \u2014 Medicare Wages: ${fmtCurrency.format(w2.medicareWagesBox5)} | Box 6 \u2014 Medicare Withheld: ${fmtCurrency.format(w2.medicareWithheldBox6)}`);
    lines.push(`Box 16 \u2014 State Wages: ${fmtCurrency.format(w2.stateWagesBox16)} | Box 17 \u2014 State Withheld: ${fmtCurrency.format(w2.stateWithheldBox17)}`);
    lines.push(`Box 12(D) \u2014 401(k) Deferral: ${fmtCurrency.format(w2.retirement401kBox12D)}`);
    lines.push(`Box 12(W) \u2014 HSA Contribution: ${fmtCurrency.format(w2.hsaBox12W)}`);
    lines.push(`Box 10 \u2014 Dependent Care FSA: ${fmtCurrency.format(w2.dependentCareFSABox10)}`);
    lines.push(`Box 12(DD) \u2014 Employer Health Insurance: ${fmtCurrency.format(w2.healthInsuranceBox12DD)}`);
    const totalWithheld = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
    const effectiveRate = totalWithheld / w2.wagesBox1;
    lines.push(`Total Tax Withheld: ${fmtCurrency.format(totalWithheld)} (Effective withholding rate: ${fmtPercent.format(effectiveRate)})`);
  }

  // Debt
  const debts = PORTFOLIO_DATA.debt;
  if (debts && debts.length > 0) {
    const { totalBalance, totalMonthly, homeEquity } = computeDebtSummary();
    lines.push("");
    lines.push("=== DEBT OBLIGATIONS ===");
    lines.push(`Total Outstanding: ${fmtCurrency.format(totalBalance)} | Total Monthly Payments: ${fmtCurrency.format(totalMonthly)} | Home Equity: ${fmtCurrency.format(homeEquity)}`);
    for (const d of debts) {
      lines.push(`  ${d.type} (${d.lender}): Balance ${fmtCurrency.format(d.currentBalance)} of ${fmtCurrency.format(d.originalBalance)} | ${fmtPercent.format(d.interestRate)} APR | ${fmtCurrency.format(d.monthlyPayment)}/mo | ${d.term}`);
    }
  }

  // Estate
  const estate = PORTFOLIO_DATA.estate;
  if (estate) {
    lines.push("");
    lines.push("=== ESTATE PLAN ===");
    lines.push(`Will: ${estate.will.status} (${estate.will.lastUpdated}) | Attorney: ${estate.will.attorney}`);
    lines.push(`Trust: ${estate.revocableTrust.name} \u2014 ${estate.revocableTrust.status}`);
    lines.push(`POA Financial: ${estate.powerOfAttorney.financial} | POA Healthcare: ${estate.powerOfAttorney.healthcare}`);
    lines.push(`Guardian: ${estate.guardianship.child}`);
    lines.push(`Life Insurance: ${estate.lifeInsurance.type} ${estate.lifeInsurance.term} \u2014 ${fmtCurrency.format(estate.lifeInsurance.coverageAmount)} (${estate.lifeInsurance.provider}, $${estate.lifeInsurance.premium}/mo)`);
    lines.push(`Umbrella Insurance: ${fmtCurrency.format(estate.umbrellaInsurance.coverageAmount)} (${estate.umbrellaInsurance.provider}, $${estate.umbrellaInsurance.annualPremium}/yr)`);
    lines.push("Beneficiaries:");
    for (const b of estate.beneficiaries) {
      lines.push(`  ${b.account}: Primary \u2014 ${b.primary} | Contingent \u2014 ${b.contingent}`);
    }
  }

  return lines.join('\n');
}
