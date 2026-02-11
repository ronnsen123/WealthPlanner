// specialists/cashflow.js — Cash flow specialist knowledge for James Park
SPECIALIST_KNOWLEDGE.cashflow = function() {
  const spec = SPECIALISTS.cashflow;
  return `=== SPECIALIST: CASH FLOW — ${spec.name}, ${spec.title} ===
Domain: monthly income/expenses, savings rate, emergency fund, lifestyle impact modeling
Key observations:
- Gross income $195K, total withholding ~$63K, monthly take-home calculation
- Monthly debt service ~$5,391, leaving ~$5,400/mo for living + discretionary + savings
- DTI ratio ~33%
- Already maxing tax-advantaged accounts — question is where the next dollar goes
Directive: Build monthly cash flow waterfall: gross → taxes → debt → fixed → discretionary. Show before/after for proposed changes.`;
};
