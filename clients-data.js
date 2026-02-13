// clients-data.js — Multi-client portfolio data for RIA advisor platform

const CLIENTS = [
  // ===== CLIENT 1: Jordan Mitchell (existing client — moved from portfolio-data.js) =====
  {
    clientId: 'jordan-mitchell',
    avatar: { initials: 'JM', color: '#3b82f6' },

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
  },

  // ===== CLIENT 2: Aisha Patel — Pre-retiree, single, NY, high earner =====
  {
    clientId: 'aisha-patel',
    avatar: { initials: 'AP', color: '#8b5cf6' },

    owner: {
      name: "Aisha Patel",
      age: 52,
      filingStatus: "Single",
      state: "New York",
      annualIncome: 285000,
      taxBracketFederal: "35%",
      taxBracketState: "6.85%",
    },

    w2Income: {
      year: 2026,
      employer: "Goldman Sachs & Co.",
      employerEIN: "13-5XXXXXX",
      wagesBox1: 285000,
      federalWithheldBox2: 62700,
      socialSecurityWagesBox3: 168600,
      socialSecurityWithheldBox4: 10453.20,
      medicareWagesBox5: 285000,
      medicareWithheldBox6: 4132.50,
      stateWagesBox16: 285000,
      stateWithheldBox17: 19522.50,
      retirement401kBox12D: 30500,
      hsaBox12W: 4300,
      dependentCareFSABox10: 0,
      healthInsuranceBox12DD: 14200,
    },

    debt: [
      {
        id: "mortgage",
        type: "Mortgage",
        icon: "\u{1F3E0}",
        lender: "JPMorgan Chase",
        originalBalance: 520000,
        currentBalance: 285000,
        interestRate: 0.0375,
        monthlyPayment: 2408,
        term: "30-year fixed",
        originDate: "2017-05",
        propertyValue: 1250000,
      },
      {
        id: "rental-mortgage",
        type: "Investment Property Mortgage",
        icon: "\u{1F3E2}",
        lender: "Bank of America",
        originalBalance: 320000,
        currentBalance: 248000,
        interestRate: 0.055,
        monthlyPayment: 1817,
        term: "30-year fixed",
        originDate: "2020-09",
        propertyValue: 485000,
      },
    ],

    estate: {
      will: { status: "Executed", lastUpdated: "2024-03", attorney: "Chen & Associates LLP" },
      revocableTrust: { status: "Established", name: "Patel Living Trust", lastUpdated: "2024-03" },
      powerOfAttorney: { financial: "Brother \u2014 Raj Patel", healthcare: "Brother \u2014 Raj Patel" },
      beneficiaries: [
        { account: "401(k)", primary: "Patel Living Trust \u2014 100%", contingent: "Raj Patel (brother) \u2014 100%" },
        { account: "Roth IRA", primary: "Patel Living Trust \u2014 100%", contingent: "Charitable Foundation \u2014 100%" },
        { account: "Life Insurance", primary: "Patel Living Trust \u2014 100%", contingent: "Raj Patel (brother) \u2014 100%" },
      ],
      lifeInsurance: {
        type: "Term",
        provider: "MetLife",
        coverageAmount: 1500000,
        premium: 145,
        premiumFrequency: "monthly",
        term: "20 years",
        startDate: "2019-06",
        insured: "Aisha Patel",
      },
      umbrellaInsurance: {
        provider: "Chubb",
        coverageAmount: 2000000,
        annualPremium: 620,
      },
      guardianship: { child: "N/A" },
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
          { ticker: "FXAIX", name: "Fidelity 500 Index Fund", shares: 1200, costBasis: 142.00, currentPrice: 192.84, assetClass: "US Equity" },
          { ticker: "FSPSX", name: "Fidelity Intl Index Fund", shares: 800, costBasis: 42.50, currentPrice: 48.90, assetClass: "Intl Equity" },
          { ticker: "FXNAX", name: "Fidelity US Bond Index Fund", shares: 2200, costBasis: 11.80, currentPrice: 10.75, assetClass: "US Bond" },
        ]
      },
      {
        id: "roth-ira",
        name: "Roth IRA",
        type: "roth_ira",
        icon: "\u{1F331}",
        institution: "Vanguard",
        taxTreatment: "Tax-Free Growth",
        holdings: [
          { ticker: "VGT", name: "Vanguard Information Technology ETF", shares: 65, costBasis: 320.00, currentPrice: 558.40, assetClass: "US Equity" },
          { ticker: "VHT", name: "Vanguard Health Care ETF", shares: 80, costBasis: 235.00, currentPrice: 262.15, assetClass: "US Equity" },
        ]
      },
      {
        id: "taxable-brokerage",
        name: "Taxable Brokerage",
        type: "taxable",
        icon: "\u{1F4C8}",
        institution: "Schwab",
        taxTreatment: "Taxable",
        holdings: [
          { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", shares: 450, costBasis: 62.00, currentPrice: 82.47, assetClass: "US Equity" },
          { ticker: "SCHF", name: "Schwab International Equity ETF", shares: 600, costBasis: 32.80, currentPrice: 38.52, assetClass: "Intl Equity" },
          { ticker: "SCHZ", name: "Schwab US Aggregate Bond ETF", shares: 800, costBasis: 50.20, currentPrice: 47.85, assetClass: "US Bond" },
          { ticker: "O", name: "Realty Income Corp.", shares: 200, costBasis: 58.40, currentPrice: 62.30, assetClass: "US Equity" },
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
          { ticker: "VTI", name: "Vanguard Total Stock Market ETF", shares: 85, costBasis: 195.00, currentPrice: 268.42, assetClass: "US Equity" },
        ]
      },
    ]
  },

  // ===== CLIENT 3: Carlos & Maria Reyes — Young couple, TX, first-time homebuyers =====
  {
    clientId: 'carlos-reyes',
    avatar: { initials: 'CR', color: '#22c55e' },

    owner: {
      name: "Carlos & Maria Reyes",
      age: 29,
      filingStatus: "Married Filing Jointly",
      state: "Texas",
      annualIncome: 140000,
      taxBracketFederal: "22%",
      taxBracketState: "0%",
    },

    w2Income: {
      year: 2026,
      employer: "Dell Technologies (Carlos) / UT Health (Maria)",
      employerEIN: "74-2XXXXXX",
      wagesBox1: 140000,
      federalWithheldBox2: 18200,
      socialSecurityWagesBox3: 140000,
      socialSecurityWithheldBox4: 8680,
      medicareWagesBox5: 140000,
      medicareWithheldBox6: 2030,
      stateWagesBox16: 0,
      stateWithheldBox17: 0,
      retirement401kBox12D: 15000,
      hsaBox12W: 8550,
      dependentCareFSABox10: 0,
      healthInsuranceBox12DD: 12800,
    },

    debt: [
      {
        id: "student-loan-carlos",
        type: "Student Loan (Carlos)",
        icon: "\u{1F393}",
        lender: "Federal Direct (Nelnet)",
        originalBalance: 85000,
        currentBalance: 68500,
        interestRate: 0.055,
        monthlyPayment: 920,
        term: "10-year standard",
        originDate: "2022-01",
        propertyValue: null,
      },
      {
        id: "student-loan-maria",
        type: "Student Loan (Maria)",
        icon: "\u{1F393}",
        lender: "Federal Direct (MOHELA)",
        originalBalance: 120000,
        currentBalance: 104000,
        interestRate: 0.065,
        monthlyPayment: 1380,
        term: "10-year standard",
        originDate: "2023-06",
        propertyValue: null,
      },
      {
        id: "auto-loan",
        type: "Auto Loan",
        icon: "\u{1F697}",
        lender: "Capital One Auto",
        originalBalance: 28000,
        currentBalance: 19200,
        interestRate: 0.059,
        monthlyPayment: 540,
        term: "60 months",
        originDate: "2024-03",
        propertyValue: null,
      },
    ],

    estate: {
      will: { status: "Not Executed", lastUpdated: "N/A", attorney: "N/A" },
      revocableTrust: { status: "Not Established", name: "N/A", lastUpdated: "N/A" },
      powerOfAttorney: { financial: "Not Designated", healthcare: "Not Designated" },
      beneficiaries: [
        { account: "401(k) - Carlos", primary: "Maria Reyes (spouse) \u2014 100%", contingent: "Parents \u2014 50/50" },
        { account: "401(k) - Maria", primary: "Carlos Reyes (spouse) \u2014 100%", contingent: "Parents \u2014 50/50" },
      ],
      lifeInsurance: {
        type: "Term",
        provider: "Haven Life",
        coverageAmount: 500000,
        premium: 32,
        premiumFrequency: "monthly",
        term: "20 years",
        startDate: "2024-01",
        insured: "Carlos Reyes",
      },
      umbrellaInsurance: {
        provider: "N/A",
        coverageAmount: 0,
        annualPremium: 0,
      },
      guardianship: { child: "N/A" },
    },

    accounts: [
      {
        id: "retirement-401k-carlos",
        name: "401(k) - Carlos",
        type: "401k",
        icon: "\u{1F3E6}",
        institution: "Fidelity",
        taxTreatment: "Tax-Deferred",
        holdings: [
          { ticker: "VFFVX", name: "Vanguard Target Retirement 2055", shares: 420, costBasis: 38.50, currentPrice: 44.82, assetClass: "Target Date" },
        ]
      },
      {
        id: "retirement-401k-maria",
        name: "401(k) - Maria",
        type: "401k",
        icon: "\u{1F3E6}",
        institution: "TIAA",
        taxTreatment: "Tax-Deferred",
        holdings: [
          { ticker: "TIAA-CREF", name: "TIAA-CREF Lifecycle 2060", shares: 310, costBasis: 12.40, currentPrice: 14.85, assetClass: "Target Date" },
        ]
      },
      {
        id: "roth-ira-carlos",
        name: "Roth IRA - Carlos",
        type: "roth_ira",
        icon: "\u{1F331}",
        institution: "Vanguard",
        taxTreatment: "Tax-Free Growth",
        holdings: [
          { ticker: "VTI", name: "Vanguard Total Stock Market ETF", shares: 35, costBasis: 210.00, currentPrice: 268.42, assetClass: "US Equity" },
          { ticker: "VXUS", name: "Vanguard Total Intl Stock ETF", shares: 80, costBasis: 52.00, currentPrice: 59.17, assetClass: "Intl Equity" },
        ]
      },
      {
        id: "savings-hysa",
        name: "High-Yield Savings (Down Payment)",
        type: "savings",
        icon: "\u{1F3E0}",
        institution: "Marcus by Goldman Sachs",
        taxTreatment: "Taxable Interest",
        holdings: [
          { ticker: "CASH", name: "High-Yield Savings @ 4.5% APY", shares: 1, costBasis: 42000, currentPrice: 42000, assetClass: "Cash" },
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
          { ticker: "FZROX", name: "Fidelity ZERO Total Market Fund", shares: 220, costBasis: 14.80, currentPrice: 17.25, assetClass: "US Equity" },
        ]
      },
    ]
  },

  // ===== CLIENT 4: Helen Park — Retired widow, FL, RMD planning =====
  {
    clientId: 'helen-park',
    avatar: { initials: 'HP', color: '#f59e0b' },

    owner: {
      name: "Helen Park",
      age: 67,
      filingStatus: "Single",
      state: "Florida",
      annualIncome: 72000,
      taxBracketFederal: "12%",
      taxBracketState: "0%",
    },

    w2Income: {
      year: 2026,
      employer: "Retired \u2014 Pension & Social Security",
      employerEIN: "N/A",
      wagesBox1: 0,
      federalWithheldBox2: 3600,
      socialSecurityWagesBox3: 0,
      socialSecurityWithheldBox4: 0,
      medicareWagesBox5: 0,
      medicareWithheldBox6: 0,
      stateWagesBox16: 0,
      stateWithheldBox17: 0,
      retirement401kBox12D: 0,
      hsaBox12W: 0,
      dependentCareFSABox10: 0,
      healthInsuranceBox12DD: 0,
    },

    debt: [
      {
        id: "mortgage",
        type: "Mortgage",
        icon: "\u{1F3E0}",
        lender: "Rocket Mortgage",
        originalBalance: 180000,
        currentBalance: 62000,
        interestRate: 0.035,
        monthlyPayment: 808,
        term: "30-year fixed",
        originDate: "2012-08",
        propertyValue: 385000,
      },
    ],

    estate: {
      will: { status: "Executed", lastUpdated: "2025-01", attorney: "Greenwald Estate Law" },
      revocableTrust: { status: "Established", name: "Park Family Trust", lastUpdated: "2025-01" },
      powerOfAttorney: { financial: "Daughter \u2014 Jennifer Park-Lee", healthcare: "Daughter \u2014 Jennifer Park-Lee" },
      beneficiaries: [
        { account: "Traditional IRA", primary: "Park Family Trust \u2014 100%", contingent: "Grandchildren \u2014 equal shares" },
        { account: "Roth IRA", primary: "Jennifer Park-Lee (daughter) \u2014 50%, David Park (son) \u2014 50%", contingent: "Grandchildren \u2014 equal shares" },
        { account: "Life Insurance", primary: "Park Family Trust \u2014 100%", contingent: "Jennifer Park-Lee \u2014 100%" },
      ],
      lifeInsurance: {
        type: "Whole Life",
        provider: "New York Life",
        coverageAmount: 250000,
        premium: 210,
        premiumFrequency: "monthly",
        term: "Permanent",
        startDate: "1998-03",
        insured: "Helen Park",
      },
      umbrellaInsurance: {
        provider: "USAA",
        coverageAmount: 1000000,
        annualPremium: 290,
      },
      guardianship: { child: "N/A (adult children)" },
    },

    accounts: [
      {
        id: "traditional-ira",
        name: "Traditional IRA (Rollover)",
        type: "traditional_ira",
        icon: "\u{1F3E6}",
        institution: "Vanguard",
        taxTreatment: "Tax-Deferred",
        holdings: [
          { ticker: "VBIAX", name: "Vanguard Balanced Index Admiral", shares: 2800, costBasis: 38.20, currentPrice: 48.75, assetClass: "Target Date" },
          { ticker: "VBTLX", name: "Vanguard Total Bond Market Admiral", shares: 4200, costBasis: 10.80, currentPrice: 9.95, assetClass: "US Bond" },
          { ticker: "VTIAX", name: "Vanguard Total Intl Stock Admiral", shares: 1500, costBasis: 28.50, currentPrice: 33.40, assetClass: "Intl Equity" },
        ]
      },
      {
        id: "roth-ira",
        name: "Roth IRA",
        type: "roth_ira",
        icon: "\u{1F331}",
        institution: "Vanguard",
        taxTreatment: "Tax-Free Growth",
        holdings: [
          { ticker: "VTI", name: "Vanguard Total Stock Market ETF", shares: 120, costBasis: 180.00, currentPrice: 268.42, assetClass: "US Equity" },
          { ticker: "VIG", name: "Vanguard Dividend Appreciation ETF", shares: 200, costBasis: 145.00, currentPrice: 185.60, assetClass: "US Equity" },
        ]
      },
      {
        id: "taxable-brokerage",
        name: "Taxable Brokerage",
        type: "taxable",
        icon: "\u{1F4C8}",
        institution: "Vanguard",
        taxTreatment: "Taxable",
        holdings: [
          { ticker: "VTSAX", name: "Vanguard Total Stock Market Admiral", shares: 350, costBasis: 85.00, currentPrice: 120.45, assetClass: "US Equity" },
          { ticker: "VTIAX", name: "Vanguard Total Intl Stock Admiral", shares: 280, costBasis: 26.00, currentPrice: 33.40, assetClass: "Intl Equity" },
          { ticker: "VTABX", name: "Vanguard Total Intl Bond Admiral", shares: 500, costBasis: 21.50, currentPrice: 20.10, assetClass: "Intl Bond" },
        ]
      },
    ]
  },
];
