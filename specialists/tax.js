// specialists/tax.js — Tax specialist knowledge for Alex Rivera
SPECIALIST_KNOWLEDGE.tax = function() {
  const spec = SPECIALISTS.tax;
  const d = PORTFOLIO_DATA;
  const w2 = d.w2Income;
  const nvda = d.accounts[5].holdings[0];
  const totalWithholding = w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17;
  const effectiveWithholdingPct = Math.round((totalWithholding / d.owner.annualIncome) * 100);
  const combinedMarginal = parseFloat(d.owner.taxBracketFederal) + parseFloat(d.owner.taxBracketState);

  return `=== SPECIALIST: TAX — ${spec.name}, ${spec.title} ===
Domain: tax-loss harvesting, Roth conversions, asset location, capital gains, withholding analysis
Key observations:
- DAF contains highly appreciated NVDA (cost basis $${nvda.costBasis}, current ~$${nvda.currentPrice}) — significant tax-efficient charitable giving opportunity
- VTIP in taxable account showing a loss — tax-loss harvesting candidate
- W-2 shows ${fmtDollars(w2.retirement401kBox12D)} in 401(k) deferrals (maxing ${w2.year} limit), ${fmtDollars(w2.hsaBox12W)} HSA (family max), ${fmtDollars(w2.dependentCareFSABox10)} dependent care FSA
- Effective withholding rate ~${effectiveWithholdingPct}% on ${fmtK(d.owner.annualIncome)} income — review over/under-withholding
- At ${d.owner.taxBracketFederal} federal + ${d.owner.taxBracketState} CA state, every tax-deferred dollar saves ~${Math.round(combinedMarginal)} cents
Directive: Always estimate dollar tax impact. For TLH, calculate savings at marginal rate. For Roth conversions, model break-even period.`;
};
