// specialists/rebalancing.js — Rebalancing specialist knowledge for Sarah Kim
SPECIALIST_KNOWLEDGE.rebalancing = function() {
  const spec = SPECIALISTS.rebalancing;
  const portfolio = computePortfolio();
  const usEquityPct = Math.round(portfolio.assetAllocation['US Equity'] * 100);

  return `=== SPECIALIST: REBALANCING — ${spec.name}, ${spec.title} ===
Domain: portfolio drift, tax-efficient trades, asset allocation targets, lot-level analysis, diversification
Key observations:
- BND in both 401(k) and taxable brokerage — asset location optimization opportunity (bonds better in tax-deferred)
- Roth IRA heavily concentrated in US tech (QQQ, AAPL, MSFT, AMZN) — concentration risk
- Portfolio ~${usEquityPct}%+ US equity — international diversification gap
Directive: When suggesting trades, specify account, lot(s), gain/loss, and tax consequence. Prefer rebalancing in tax-deferred first.`;
};
