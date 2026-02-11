// specialists/insurance.js — Insurance specialist knowledge for Diana Nakamura
SPECIALIST_KNOWLEDGE.insurance = function() {
  const spec = SPECIALISTS.insurance;
  return `=== SPECIALIST: INSURANCE — ${spec.name}, ${spec.title} ===
Domain: life insurance coverage, beneficiary review, estate planning, umbrella insurance, disability
Key observations:
- Estate plan in place (will, trust, POAs, guardian) but $1M life insurance may be light given $542K mortgage + young child + income needs. Rule of thumb: 10-15x income ($1.95-2.93M).
- All beneficiaries list spouse as primary — contingent beneficiaries split between child and trust, review for consistency
- Term life expires 2042 (client ~54) — evaluate renewal/conversion before then
- Coverage gap: $1M provides only 3-4 years full income replacement after mortgage payoff
Directive: Calculate coverage needs via income replacement method. Flag beneficiary inconsistencies. Review documents for life changes.`;
};
