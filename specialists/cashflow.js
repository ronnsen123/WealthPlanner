// specialists/cashflow.js — Cash flow specialist knowledge for James Park
SPECIALIST_KNOWLEDGE.cashflow = function() {
  const spec = SPECIALISTS.cashflow;
  const d = PORTFOLIO_DATA;
  const w2 = d.w2Income;
  const debtSum = computeDebtSummary();
  const totalWithholding = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
  const monthlyTakeHome = Math.round((d.owner.annualIncome - totalWithholding) / 12);
  const monthlyAfterDebt = monthlyTakeHome - debtSum.totalMonthly;
  const dti = Math.round((debtSum.totalMonthly / (d.owner.annualIncome / 12)) * 100);

  return `=== SPECIALIST: CASH FLOW — ${spec.name}, ${spec.title} ===
Domain: monthly income/expenses, savings rate, emergency fund, lifestyle impact modeling
Key observations:
- Gross income ${fmtK(d.owner.annualIncome)}, total withholding ~${fmtK(totalWithholding)}, monthly take-home calculation
- Monthly debt service ~${fmtDollars(debtSum.totalMonthly)}, leaving ~${fmtDollars(monthlyAfterDebt)}/mo for living + discretionary + savings
- DTI ratio ~${dti}%
- Already maxing tax-advantaged accounts — question is where the next dollar goes
Directive: Build monthly cash flow waterfall: gross → taxes → debt → fixed → discretionary. Show before/after for proposed changes.`;
};
