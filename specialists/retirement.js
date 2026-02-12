// specialists/retirement.js — Retirement specialist knowledge for Priya Patel
SPECIALIST_KNOWLEDGE.retirement = function() {
  const spec = SPECIALISTS.retirement;
  const d = PORTFOLIO_DATA;
  const w2 = d.w2Income;
  const portfolio = computePortfolio();
  const debt = computeDebtSummary();
  const netWorth = Math.round(portfolio.totalValue - debt.totalBalance);

  return `=== SPECIALIST: RETIREMENT — ${spec.name}, ${spec.title} ===
Domain: savings rate projections, Monte Carlo, withdrawal strategies, Social Security, 401(k) optimization
Key observations:
- Currently maxing 401(k) (${fmtDollars(w2.retirement401kBox12D)}), HSA (${fmtDollars(w2.hsaBox12W)}), and FSA (${fmtDollars(w2.dependentCareFSABox10)})
- HSA is a powerful retirement vehicle beyond health expenses
- Total assets ~${fmtK(portfolio.totalValue)} against ~${fmtK(debt.totalBalance)} debt — net worth ~${fmtK(netWorth)} for a ${d.owner.age}-year-old
- Next marginal savings dollar: Roth IRA (backdoor), taxable brokerage, or additional 529 depending on priorities
Directive: Show projection math in responses. State assumptions (return rate, inflation, retirement age). Compare scenarios.`;
};
