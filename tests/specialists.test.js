// tests/specialists.test.js — Tests for specialist data model, pill rendering, marker parsing, attribution
import { describe, it, expect, beforeEach } from 'vitest';

describe('SPECIALISTS data model', () => {
  it('contains exactly 7 specialists', () => {
    expect(Object.keys(SPECIALISTS)).toHaveLength(7);
  });

  it('has all expected specialist IDs', () => {
    const ids = Object.keys(SPECIALISTS);
    expect(ids).toContain('tax');
    expect(ids).toContain('retirement');
    expect(ids).toContain('debt');
    expect(ids).toContain('rebalancing');
    expect(ids).toContain('insurance');
    expect(ids).toContain('cashflow');
    expect(ids).toContain('goals');
  });

  it('each specialist has required properties', () => {
    for (const spec of Object.values(SPECIALISTS)) {
      expect(spec).toHaveProperty('id');
      expect(spec).toHaveProperty('name');
      expect(spec).toHaveProperty('title');
      expect(spec).toHaveProperty('initials');
      expect(spec).toHaveProperty('color');
      expect(spec).toHaveProperty('icon');
    }
  });

  it('initials are exactly 2 characters', () => {
    for (const spec of Object.values(SPECIALISTS)) {
      expect(spec.initials).toHaveLength(2);
    }
  });

  it('colors are valid hex codes', () => {
    for (const spec of Object.values(SPECIALISTS)) {
      expect(spec.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('IDs match object keys', () => {
    for (const [key, spec] of Object.entries(SPECIALISTS)) {
      expect(spec.id).toBe(key);
    }
  });
});

describe('initSpecialistPills', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="specialist-pills"></div>';
  });

  it('creates 7 pill elements', () => {
    initSpecialistPills();
    const pills = document.querySelectorAll('.specialist-pill');
    expect(pills).toHaveLength(7);
  });

  it('each pill has correct data-specialist-id', () => {
    initSpecialistPills();
    const pills = document.querySelectorAll('.specialist-pill');
    const ids = Array.from(pills).map(p => p.dataset.specialistId);
    expect(ids).toContain('tax');
    expect(ids).toContain('retirement');
    expect(ids).toContain('debt');
  });

  it('pills display specialist first name', () => {
    initSpecialistPills();
    const taxPill = document.getElementById('specialist-pill-tax');
    expect(taxPill.textContent).toContain('Alex');
  });

  it('does nothing if container is missing', () => {
    document.body.innerHTML = '<div>No container</div>';
    expect(() => initSpecialistPills()).not.toThrow();
  });
});

describe('updateSpecialistIndicators', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="specialist-pills"></div>';
    initSpecialistPills();
  });

  it('adds active class to consulted specialists', () => {
    updateSpecialistIndicators(new Set(['tax', 'debt']));
    expect(document.getElementById('specialist-pill-tax').classList.contains('active')).toBe(true);
    expect(document.getElementById('specialist-pill-debt').classList.contains('active')).toBe(true);
    expect(document.getElementById('specialist-pill-retirement').classList.contains('active')).toBe(false);
  });

  it('removes active class from non-consulted specialists', () => {
    updateSpecialistIndicators(new Set(['tax']));
    updateSpecialistIndicators(new Set(['debt']));
    expect(document.getElementById('specialist-pill-tax').classList.contains('active')).toBe(false);
    expect(document.getElementById('specialist-pill-debt').classList.contains('active')).toBe(true);
  });
});

describe('resetSpecialistIndicators', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="specialist-pills"></div>';
    initSpecialistPills();
    updateSpecialistIndicators(new Set(['tax', 'retirement', 'debt']));
  });

  it('removes active class from all pills', () => {
    resetSpecialistIndicators();
    const activePills = document.querySelectorAll('.specialist-pill.active');
    expect(activePills).toHaveLength(0);
  });
});

describe('extractSpecialistIds', () => {
  it('extracts valid specialist IDs from text', () => {
    const text = 'Some text <!--SPECIALIST:tax--> more text <!--SPECIALIST:debt--> end';
    const ids = extractSpecialistIds(text);
    expect(ids.has('tax')).toBe(true);
    expect(ids.has('debt')).toBe(true);
    expect(ids.size).toBe(2);
  });

  it('ignores invalid specialist IDs', () => {
    const text = '<!--SPECIALIST:invalid--> some text';
    const ids = extractSpecialistIds(text);
    expect(ids.size).toBe(0);
  });

  it('returns empty set for text with no markers', () => {
    const ids = extractSpecialistIds('Just a normal response');
    expect(ids.size).toBe(0);
  });

  it('handles all 7 specialist IDs', () => {
    const text = '<!--SPECIALIST:tax--><!--SPECIALIST:retirement--><!--SPECIALIST:debt--><!--SPECIALIST:rebalancing--><!--SPECIALIST:insurance--><!--SPECIALIST:cashflow--><!--SPECIALIST:goals-->';
    const ids = extractSpecialistIds(text);
    expect(ids.size).toBe(7);
  });
});

describe('stripSpecialistMarkers', () => {
  it('removes all specialist markers from text', () => {
    const text = 'Before <!--SPECIALIST:tax--> After <!--SPECIALIST:debt--> End';
    expect(stripSpecialistMarkers(text)).toBe('Before  After  End');
  });

  it('returns unchanged text if no markers', () => {
    const text = 'No markers here';
    expect(stripSpecialistMarkers(text)).toBe(text);
  });
});

describe('stripPartialSpecialistMarkers', () => {
  it('removes partial marker at end of text', () => {
    expect(stripPartialSpecialistMarkers('Some text <!--SPECIALIST')).toBe('Some text ');
    expect(stripPartialSpecialistMarkers('Some text <!--SPECIALIST:ta')).toBe('Some text ');
  });

  it('does not affect complete markers', () => {
    const text = 'Some text <!--SPECIALIST:tax--> more';
    expect(stripPartialSpecialistMarkers(text)).toBe(text);
  });

  it('returns unchanged text without partial markers', () => {
    expect(stripPartialSpecialistMarkers('Normal text')).toBe('Normal text');
  });
});

describe('renderSpecialistAttribution', () => {
  it('replaces attribution pattern with styled HTML for Alex Rivera', () => {
    const text = '**Alex Rivera, Tax Optimization:** Some tax advice';
    const result = renderSpecialistAttribution(text);
    expect(result).toContain('specialist-attribution');
    expect(result).toContain('AR');
    expect(result).toContain('Alex Rivera');
    expect(result).toContain('#ef4444');
    expect(result).not.toContain('**Alex Rivera');
  });

  it('handles multiple specialist attributions', () => {
    const text = '**Alex Rivera, Tax Optimization:** Tax advice\n**Marcus Thompson, Debt Strategy:** Debt advice';
    const result = renderSpecialistAttribution(text);
    expect(result).toContain('AR');
    expect(result).toContain('MT');
  });

  it('leaves text unchanged if no attribution patterns found', () => {
    const text = 'Just normal financial advice from Morgan Chen.';
    expect(renderSpecialistAttribution(text)).toBe(text);
  });
});
