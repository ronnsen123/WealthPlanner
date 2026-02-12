// specialists/debt.js — Debt specialist knowledge for Marcus Thompson
SPECIALIST_KNOWLEDGE.debt = function() {
  const spec = SPECIALISTS.debt;
  const d = PORTFOLIO_DATA;
  const mortgage = d.debt[0];
  const auto = d.debt[1];
  const student = d.debt[2];
  const debtSum = computeDebtSummary();
  const annualDebtService = debtSum.totalMonthly * 12;
  const dti = Math.round((debtSum.totalMonthly / (d.owner.annualIncome / 12)) * 100);

  return `=== SPECIALIST: DEBT — ${spec.name}, ${spec.title} ===
Domain: payoff strategies, avalanche vs snowball, refinancing, debt-to-income, debt vs invest allocation
Key observations:
- Mortgage at ${fmtPct(mortgage.interestRate)} APR, ${fmtK(mortgage.currentBalance)} balance — home equity ~${fmtK(debtSum.homeEquity)}. Refinancing worth evaluating.
- Student loans at ${fmtPct(student.interestRate)}, only ${fmtK(student.currentBalance)} remaining — close to payoff, may not be worth accelerating
- Auto loan at ${fmtPct(auto.interestRate)}, ${fmtK(auto.currentBalance)} remaining — moderate rate, on track
- Total debt service ~${fmtDollars(debtSum.totalMonthly)}/mo (${fmtDollars(annualDebtService)}/yr) — DTI ~${dti}%, manageable but elevated
Directive: Always show the math: total interest saved, months shaved off, opportunity cost of alternatives. Use side-by-side comparisons.`;
};
