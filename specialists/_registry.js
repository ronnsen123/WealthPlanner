// specialists/_registry.js — Global registry for specialist knowledge functions
const SPECIALIST_KNOWLEDGE = {};

// --- Formatting helpers for specialist knowledge prompt text ---

/** Format large numbers as "$NNK" — e.g., 542000 → "$542K", 18400 → "$18.4K" */
function fmtK(num) {
  const k = num / 1000;
  return '$' + (k % 1 === 0 ? k : parseFloat(k.toFixed(1))) + 'K';
}

/** Format a decimal rate as percentage — e.g., 0.0625 → "6.25%", 0.05 → "5%" */
function fmtPct(decimal) {
  return (decimal * 100).toFixed(2).replace(/\.?0+$/, '') + '%';
}

/** Format dollars with commas — e.g., 5391 → "$5,391" */
function fmtDollars(num) {
  return '$' + Math.round(num).toLocaleString('en-US');
}

/** Format millions — e.g., 1000000 → "$1M", 1950000 → "$1.95M" */
function fmtM(num) {
  const m = num / 1000000;
  if (m === Math.floor(m)) return '$' + m + 'M';
  return '$' + (Math.round(m * 100) / 100).toString().replace(/0+$/, '') + 'M';
}
