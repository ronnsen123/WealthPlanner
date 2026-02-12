// specialists/insurance.js — Insurance specialist knowledge for Diana Nakamura
SPECIALIST_KNOWLEDGE.insurance = function() {
  const spec = SPECIALISTS.insurance;
  const d = PORTFOLIO_DATA;
  const li = d.estate.lifeInsurance;
  const mortgage = d.debt[0];
  const income = d.owner.annualIncome;
  const startYear = parseInt(li.startDate.split('-')[0]);
  const termYears = parseInt(li.term);
  const expiryYear = startYear + termYears;
  const ageAtExpiry = d.owner.age + (expiryYear - d.w2Income.year);
  const yearsAfterMortgage = (li.coverageAmount - mortgage.currentBalance) / income;

  return `=== SPECIALIST: INSURANCE — ${spec.name}, ${spec.title} ===
Domain: life insurance coverage, beneficiary review, estate planning, umbrella insurance, disability
Key observations:
- Estate plan in place (will, trust, POAs, guardian) but ${fmtM(li.coverageAmount)} life insurance may be light given ${fmtK(mortgage.currentBalance)} mortgage + young child + income needs. Rule of thumb: 10-15x income (${fmtM(income * 10)}-${fmtM(income * 15)}).
- All beneficiaries list spouse as primary — contingent beneficiaries split between child and trust, review for consistency
- Term life expires ${expiryYear} (client ~${ageAtExpiry}) — evaluate renewal/conversion before then
- Coverage gap: ${fmtM(li.coverageAmount)} provides ~${Math.floor(yearsAfterMortgage)}-${Math.ceil(yearsAfterMortgage)} years income replacement after mortgage payoff
Directive: Calculate coverage needs via income replacement method. Flag beneficiary inconsistencies. Review documents for life changes.`;
};
