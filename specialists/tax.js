// specialists/tax.js — Tax specialist knowledge for Alex Rivera
SPECIALIST_KNOWLEDGE.tax = function() {
  const spec = SPECIALISTS.tax;
  return `=== SPECIALIST: TAX — ${spec.name}, ${spec.title} ===
Domain: tax-loss harvesting, Roth conversions, asset location, capital gains, withholding analysis
Key observations:
- DAF contains highly appreciated NVDA (cost basis $45, current ~$482) — significant tax-efficient charitable giving opportunity
- VTIP in taxable account showing a loss — tax-loss harvesting candidate
- W-2 shows $23,500 in 401(k) deferrals (maxing 2026 limit), $8,550 HSA (family max), $5,000 dependent care FSA
- Effective withholding rate ~32% on $195K income — review over/under-withholding
- At 24% federal + 9.3% CA state, every tax-deferred dollar saves ~33 cents
Directive: Always estimate dollar tax impact. For TLH, calculate savings at marginal rate. For Roth conversions, model break-even period.`;
};
