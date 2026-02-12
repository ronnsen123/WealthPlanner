// tests/format-helpers.test.js — Tests for specialist knowledge formatting helpers
import { describe, it, expect } from 'vitest';

describe('fmtK', () => {
  it('formats round thousands', () => {
    expect(fmtK(542000)).toBe('$542K');
    expect(fmtK(195000)).toBe('$195K');
    expect(fmtK(5000)).toBe('$5K');
  });

  it('formats partial thousands with one decimal', () => {
    expect(fmtK(18400)).toBe('$18.4K');
    expect(fmtK(14200)).toBe('$14.2K');
    expect(fmtK(8550)).toBe('$8.6K');
  });

  it('handles large values', () => {
    expect(fmtK(574600)).toBe('$574.6K');
    expect(fmtK(443000)).toBe('$443K');
  });
});

describe('fmtPct', () => {
  it('formats decimal rates as percentages', () => {
    expect(fmtPct(0.0625)).toBe('6.25%');
    expect(fmtPct(0.049)).toBe('4.9%');
    expect(fmtPct(0.045)).toBe('4.5%');
  });

  it('removes trailing zeros', () => {
    expect(fmtPct(0.05)).toBe('5%');
    expect(fmtPct(0.1)).toBe('10%');
  });
});

describe('fmtDollars', () => {
  it('formats with commas', () => {
    expect(fmtDollars(5391)).toBe('$5,391');
    expect(fmtDollars(23500)).toBe('$23,500');
    expect(fmtDollars(64692)).toBe('$64,692');
  });

  it('rounds to whole dollars', () => {
    expect(fmtDollars(5391.6)).toBe('$5,392');
    expect(fmtDollars(10453.2)).toBe('$10,453');
  });

  it('handles small amounts', () => {
    expect(fmtDollars(85)).toBe('$85');
    expect(fmtDollars(380)).toBe('$380');
  });
});

describe('fmtM', () => {
  it('formats round millions', () => {
    expect(fmtM(1000000)).toBe('$1M');
    expect(fmtM(2000000)).toBe('$2M');
  });

  it('formats fractional millions', () => {
    expect(fmtM(1950000)).toBe('$1.95M');
    expect(fmtM(1500000)).toBe('$1.5M');
  });
});
