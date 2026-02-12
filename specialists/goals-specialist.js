// specialists/goals-specialist.js — Goals specialist knowledge for Elena Vasquez
SPECIALIST_KNOWLEDGE.goals = function() {
  const spec = SPECIALISTS.goals;
  const portfolio = computePortfolio();
  const edu529 = portfolio.accounts[3];
  const beneficiaryStr = PORTFOLIO_DATA.accounts[3].beneficiary;
  const childAge = parseInt(beneficiaryStr.match(/age (\d+)/)[1]);
  const yearsToCollege = 18 - childAge;

  return `=== SPECIALIST: GOALS — ${spec.name}, ${spec.title} ===
Domain: goal progress tracking, milestone planning, priority ranking, cross-goal resource allocation
Key observations:
- 529 has ~${fmtK(edu529.totalValue)} for child age ${childAge} — ~${yearsToCollege} years to college, may be light for CA private university costs
- Multiple competing priorities: retirement, education, debt payoff, charitable giving
Directive: For each goal, assess progress %, pace (on track/behind/ahead), key milestones, and single most impactful next action.`;
};
