// portfolio-data.js — Portfolio data model, constants, and formatters

const PORTFOLIO_DATA = {
  owner: {
    name: "Jordan Mitchell",
    age: 38,
    filingStatus: "Married Filing Jointly",
    state: "California",
    annualIncome: 195000,
    taxBracketFederal: "24%",
    taxBracketState: "9.3%",
  },

  w2Income: {
    year: 2026,
    employer: "Apex Technologies, Inc.",
    employerEIN: "94-3XXXXXX",
    wagesBox1: 195000,
    federalWithheldBox2: 35100,
    socialSecurityWagesBox3: 168600,
    socialSecurityWithheldBox4: 10453.20,
    medicareWagesBox5: 195000,
    medicareWithheldBox6: 2827.50,
    stateWagesBox16: 195000,
    stateWithheldBox17: 14820,
    retirement401kBox12D: 23500,
    hsaBox12W: 8550,
    dependentCareFSABox10: 5000,
    healthInsuranceBox12DD: 18600,
  },

  debt: [
    {
      id: "mortgage",
      type: "Mortgage",
      icon: "\u{1F3E0}",
      lender: "Wells Fargo",
      originalBalance: 680000,
      currentBalance: 542000,
      interestRate: 0.0625,
      monthlyPayment: 4186,
      term: "30-year fixed",
      originDate: "2021-03",
      propertyValue: 985000,
    },
    {
      id: "auto-loan",
      type: "Auto Loan",
      icon: "\u{1F697}",
      lender: "Fidelity Auto Finance",
      originalBalance: 38000,
      currentBalance: 14200,
      interestRate: 0.049,
      monthlyPayment: 720,
      term: "60 months",
      originDate: "2023-06",
      propertyValue: null,
    },
    {
      id: "student-loan",
      type: "Student Loan",
      icon: "\u{1F393}",
      lender: "Federal Direct (MOHELA)",
      originalBalance: 62000,
      currentBalance: 18400,
      interestRate: 0.045,
      monthlyPayment: 485,
      term: "10-year standard",
      originDate: "2014-09",
      propertyValue: null,
    },
  ],

  estate: {
    will: { status: "Executed", lastUpdated: "2023-11", attorney: "Martinez & Park LLP" },
    revocableTrust: { status: "Established", name: "Mitchell Family Revocable Trust", lastUpdated: "2023-11" },
    powerOfAttorney: { financial: "Spouse \u2014 Casey Mitchell", healthcare: "Spouse \u2014 Casey Mitchell" },
    beneficiaries: [
      { account: "401(k)", primary: "Casey Mitchell (spouse) \u2014 100%", contingent: "Child \u2014 100%" },
      { account: "Roth IRA", primary: "Casey Mitchell (spouse) \u2014 100%", contingent: "Child \u2014 100%" },
      { account: "Life Insurance", primary: "Casey Mitchell (spouse) \u2014 100%", contingent: "Mitchell Family Trust \u2014 100%" },
      { account: "HSA", primary: "Casey Mitchell (spouse) \u2014 100%", contingent: "Child \u2014 100%" },
    ],
    lifeInsurance: {
      type: "Term",
      provider: "Northwestern Mutual",
      coverageAmount: 1000000,
      premium: 85,
      premiumFrequency: "monthly",
      term: "20 years",
      startDate: "2022-01",
      insured: "Jordan Mitchell",
    },
    umbrellaInsurance: {
      provider: "State Farm",
      coverageAmount: 1000000,
      annualPremium: 380,
    },
    guardianship: { child: "Designated: Sarah Mitchell (sister) & spouse" },
  },

  accounts: [
    {
      id: "retirement-401k",
      name: "401(k) Retirement",
      type: "401k",
      icon: "\u{1F3E6}",
      institution: "Fidelity",
      taxTreatment: "Tax-Deferred",
      holdings: [
        { ticker: "VTI", name: "Vanguard Total Stock Market ETF", shares: 380, costBasis: 198.50, currentPrice: 268.42, assetClass: "US Equity" },
        { ticker: "VXUS", name: "Vanguard Total Intl Stock ETF", shares: 520, costBasis: 52.30, currentPrice: 59.17, assetClass: "Intl Equity" },
        { ticker: "BND", name: "Vanguard Total Bond Market ETF", shares: 420, costBasis: 78.10, currentPrice: 72.85, assetClass: "US Bond" },
        { ticker: "VFIFX", name: "Vanguard Target Retirement 2050", shares: 250, costBasis: 42.80, currentPrice: 49.63, assetClass: "Target Date" },
      ]
    },
    {
      id: "roth-ira",
      name: "Roth IRA",
      type: "roth_ira",
      icon: "\u{1F331}",
      institution: "Fidelity",
      taxTreatment: "Tax-Free Growth",
      holdings: [
        { ticker: "QQQ", name: "Invesco QQQ Trust", shares: 48, costBasis: 380.20, currentPrice: 485.73, assetClass: "US Equity" },
        { ticker: "AAPL", name: "Apple Inc.", shares: 40, costBasis: 142.50, currentPrice: 237.85, assetClass: "US Equity" },
        { ticker: "MSFT", name: "Microsoft Corp.", shares: 22, costBasis: 285.00, currentPrice: 418.92, assetClass: "US Equity" },
        { ticker: "AMZN", name: "Amazon.com Inc.", shares: 30, costBasis: 128.40, currentPrice: 198.15, assetClass: "US Equity" },
      ]
    },
    {
      id: "taxable-brokerage",
      name: "Taxable Brokerage",
      type: "taxable",
      icon: "\u{1F4C8}",
      institution: "Fidelity",
      taxTreatment: "Taxable",
      holdings: [
        { ticker: "VOO", name: "Vanguard S&P 500 ETF", shares: 120, costBasis: 375.00, currentPrice: 502.38, assetClass: "US Equity" },
        { ticker: "FDVV", name: "Fidelity High Dividend ETF", shares: 280, costBasis: 68.50, currentPrice: 82.45, assetClass: "US Equity" },
        { ticker: "GOOGL", name: "Alphabet Inc.", shares: 65, costBasis: 118.30, currentPrice: 175.62, assetClass: "US Equity" },
        { ticker: "BND", name: "Vanguard Total Bond Market ETF", shares: 180, costBasis: 76.40, currentPrice: 72.85, assetClass: "US Bond" },
        { ticker: "VTIP", name: "Vanguard Short-Term Infl-Prot ETF", shares: 120, costBasis: 49.20, currentPrice: 48.37, assetClass: "US Bond" },
      ]
    },
    {
      id: "529-education",
      name: "529 Education Savings",
      type: "529",
      icon: "\u{1F393}",
      institution: "Fidelity",
      taxTreatment: "Tax-Free (Qualified)",
      beneficiary: "Child (age 8)",
      holdings: [
        { ticker: "VGIT", name: "Vanguard Intermed-Term Treasury ETF", shares: 150, costBasis: 60.50, currentPrice: 58.92, assetClass: "US Bond" },
        { ticker: "VTI", name: "Vanguard Total Stock Market ETF", shares: 70, costBasis: 210.00, currentPrice: 268.42, assetClass: "US Equity" },
        { ticker: "VXUS", name: "Vanguard Total Intl Stock ETF", shares: 180, costBasis: 54.00, currentPrice: 59.17, assetClass: "Intl Equity" },
      ]
    },
    {
      id: "hsa",
      name: "HSA (Health Savings)",
      type: "hsa",
      icon: "\u{1F3E5}",
      institution: "Fidelity",
      taxTreatment: "Triple Tax-Advantaged",
      holdings: [
        { ticker: "FXAIX", name: "Fidelity 500 Index Fund", shares: 48, costBasis: 155.00, currentPrice: 192.84, assetClass: "US Equity" },
        { ticker: "FXNAX", name: "Fidelity US Bond Index Fund", shares: 350, costBasis: 11.20, currentPrice: 10.75, assetClass: "US Bond" },
      ]
    },
    {
      id: "daf-charitable",
      name: "Donor-Advised Fund",
      type: "daf",
      icon: "\u{1F49D}",
      institution: "Fidelity Charitable",
      taxTreatment: "Tax-Deductible Donation",
      holdings: [
        { ticker: "NVDA", name: "NVIDIA Corp.", shares: 45, costBasis: 45.00, currentPrice: 482.30, assetClass: "US Equity" },
        { ticker: "TSLA", name: "Tesla Inc.", shares: 35, costBasis: 210.00, currentPrice: 248.50, assetClass: "US Equity" },
      ]
    }
  ]
};

// --- Tab Definitions ---

const TAB_DEFINITIONS = [
  { id: 'portfolio', label: 'Portfolio', icon: '\u{1F4CA}' },
  { id: 'income', label: 'Income', icon: '\u{1F4B0}' },
  { id: 'debt', label: 'Debt', icon: '\u{1F3E0}' },
  { id: 'estate', label: 'Estate', icon: '\u{1F4CB}' },
];

// --- Asset Class Colors ---

const ASSET_CLASS_COLORS = {
  "US Equity": "#3b82f6",
  "Intl Equity": "#8b5cf6",
  "US Bond": "#14b8a6",
  "Target Date": "#f59e0b",
};

// --- Formatters ---

const fmtCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtCurrencyPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPercent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
