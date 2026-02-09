// portfolio-compute.js — Portfolio and debt computation with memoization

// --- Memoization caches ---
let _portfolioCache = null;
let _debtCache = null;

function invalidatePortfolioCache() {
  _portfolioCache = null;
  _debtCache = null;
}

// --- Holding & Account computations ---

function computeHolding(h) {
  const currentValue = h.shares * h.currentPrice;
  const costBasisTotal = h.shares * h.costBasis;
  const gainLoss = currentValue - costBasisTotal;
  const gainLossPercent = costBasisTotal > 0 ? gainLoss / costBasisTotal : 0;
  return { ...h, currentValue, costBasisTotal, gainLoss, gainLossPercent };
}

function computeAccount(account) {
  const holdings = account.holdings.map(computeHolding);
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalCostBasis = holdings.reduce((s, h) => s + h.costBasisTotal, 0);
  const totalGainLoss = totalValue - totalCostBasis;
  const gainLossPercent = totalCostBasis > 0 ? totalGainLoss / totalCostBasis : 0;
  return { ...account, holdings, totalValue, totalCostBasis, totalGainLoss, gainLossPercent };
}

// --- Portfolio aggregate (memoized) ---

function computePortfolio() {
  if (_portfolioCache) return _portfolioCache;

  const accounts = PORTFOLIO_DATA.accounts.map(computeAccount);
  const totalValue = accounts.reduce((s, a) => s + a.totalValue, 0);
  const totalCostBasis = accounts.reduce((s, a) => s + a.totalCostBasis, 0);
  const totalGainLoss = totalValue - totalCostBasis;
  const gainLossPercent = totalCostBasis > 0 ? totalGainLoss / totalCostBasis : 0;

  // Asset allocation
  const allocationMap = {};
  for (const acct of accounts) {
    for (const h of acct.holdings) {
      allocationMap[h.assetClass] = (allocationMap[h.assetClass] || 0) + h.currentValue;
    }
  }
  const assetAllocation = {};
  for (const [cls, val] of Object.entries(allocationMap)) {
    assetAllocation[cls] = val / totalValue;
  }

  _portfolioCache = { accounts, totalValue, totalCostBasis, totalGainLoss, gainLossPercent, assetAllocation, owner: PORTFOLIO_DATA.owner };
  return _portfolioCache;
}

// --- Debt aggregate (memoized) ---

function computeDebtSummary() {
  if (_debtCache) return _debtCache;

  const debts = PORTFOLIO_DATA.debt || [];
  const totalBalance = debts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMonthly = debts.reduce((s, d) => s + d.monthlyPayment, 0);
  const mortgageEquity = debts.find(d => d.id === 'mortgage');
  const homeEquity = mortgageEquity ? (mortgageEquity.propertyValue - mortgageEquity.currentBalance) : 0;

  _debtCache = { debts, totalBalance, totalMonthly, homeEquity };
  return _debtCache;
}
