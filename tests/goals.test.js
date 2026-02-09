// tests/goals.test.js — Test goals parsing, rendering, and helper functions
import { describe, it, expect, beforeEach } from 'vitest';

describe('extractAndUpdateGoals', () => {
  beforeEach(() => {
    // Reset goals state
    currentGoals = [];

    // Set up required DOM elements
    document.body.innerHTML = `
      <span id="goals-count">0</span>
      <div id="goals-list"></div>
      <div id="goals-empty" style="display:block"></div>
      <div id="goals-body" class="collapsed"></div>
      <button id="goals-toggle"></button>
    `;
  });

  it('returns text unchanged when no goals block present', () => {
    const input = 'Here is some advice about your portfolio.';
    const result = extractAndUpdateGoals(input);
    expect(result).toBe(input);
  });

  it('extracts goals and strips the block from visible text', () => {
    const goalsJson = JSON.stringify([
      { id: 'ret-1', goal: 'Retirement Savings', detail: 'Max out 401(k)', category: 'retirement', priority: 'high', status: 'identified' }
    ]);
    const input = `Here is some advice.\n\n<!--GOALS_JSON\n${goalsJson}\nGOALS_JSON-->`;
    const result = extractAndUpdateGoals(input);

    expect(result).toBe('Here is some advice.');
    expect(result).not.toContain('GOALS_JSON');
    expect(currentGoals).toHaveLength(1);
    expect(currentGoals[0].id).toBe('ret-1');
  });

  it('updates goal count badge', () => {
    const goalsJson = JSON.stringify([
      { id: 'a', goal: 'G1', detail: 'D1', category: 'tax', priority: 'high', status: 'identified' },
      { id: 'b', goal: 'G2', detail: 'D2', category: 'investment', priority: 'medium', status: 'exploring' },
    ]);
    const input = `Advice.\n\n<!--GOALS_JSON\n${goalsJson}\nGOALS_JSON-->`;
    extractAndUpdateGoals(input);

    expect(document.getElementById('goals-count').textContent).toBe('2');
  });

  it('handles malformed JSON gracefully', () => {
    const input = `Advice.\n\n<!--GOALS_JSON\n{not valid json}\nGOALS_JSON-->`;
    const result = extractAndUpdateGoals(input);
    expect(result).toBe('Advice.');
    expect(currentGoals).toHaveLength(0);
  });

  it('auto-expands goals panel when new goals are added', () => {
    const body = document.getElementById('goals-body');
    expect(body.classList.contains('collapsed')).toBe(true);

    const goalsJson = JSON.stringify([
      { id: 'new-1', goal: 'New Goal', detail: 'Detail', category: 'budget', priority: 'low', status: 'identified' }
    ]);
    extractAndUpdateGoals(`x\n\n<!--GOALS_JSON\n${goalsJson}\nGOALS_JSON-->`);

    expect(body.classList.contains('collapsed')).toBe(false);
  });
});

describe('formatGoalStatus', () => {
  it('capitalizes and joins hyphenated status', () => {
    expect(formatGoalStatus('action-plan')).toBe('Action Plan');
    expect(formatGoalStatus('identified')).toBe('Identified');
    expect(formatGoalStatus('exploring')).toBe('Exploring');
  });
});

describe('escapeHtml', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
  });

  it('handles plain text without changes', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });
});

describe('renderGoals', () => {
  beforeEach(() => {
    currentGoals = [];
    document.body.innerHTML = `
      <span id="goals-count">0</span>
      <div id="goals-list"></div>
      <div id="goals-empty" style="display:block"></div>
      <div id="goals-body"></div>
      <button id="goals-toggle"></button>
    `;
  });

  it('shows empty state when no goals', () => {
    renderGoals();
    expect(document.getElementById('goals-empty').style.display).toBe('block');
    expect(document.getElementById('goals-list').style.display).toBe('none');
  });

  it('renders goal cards when goals exist', () => {
    currentGoals = [
      { id: 'g1', goal: 'Save More', detail: 'Increase savings rate', category: 'budget', priority: 'high', status: 'identified' },
    ];
    renderGoals();

    expect(document.getElementById('goals-empty').style.display).toBe('none');
    expect(document.getElementById('goals-list').style.display).toBe('flex');
    const cards = document.querySelectorAll('.goal-card');
    expect(cards).toHaveLength(1);
    expect(cards[0].innerHTML).toContain('Save More');
  });

  it('adds newly-added class for new goals', () => {
    currentGoals = [
      { id: 'new-g', goal: 'New Goal', detail: 'D', category: 'tax', priority: 'medium', status: 'identified' },
    ];
    renderGoals(new Set(['new-g']));

    const card = document.querySelector('.goal-card');
    expect(card.classList.contains('newly-added')).toBe(true);
  });

  it('adds updated class for updated goals', () => {
    currentGoals = [
      { id: 'upd-g', goal: 'Updated Goal', detail: 'D', category: 'investment', priority: 'low', status: 'exploring' },
    ];
    renderGoals(new Set(), new Set(['upd-g']));

    const card = document.querySelector('.goal-card');
    expect(card.classList.contains('updated')).toBe(true);
  });
});

describe('resetGoals', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span id="goals-count">3</span>
      <div id="goals-list"><div>stuff</div></div>
      <div id="goals-empty" style="display:none"></div>
      <div id="goals-body"></div>
      <button id="goals-toggle" class="expanded"></button>
    `;
    currentGoals = [{ id: 'x', goal: 'X', detail: 'X', category: 'other', priority: 'low', status: 'identified' }];
  });

  it('clears all goals and resets UI', () => {
    resetGoals();

    expect(currentGoals).toHaveLength(0);
    expect(document.getElementById('goals-count').textContent).toBe('0');
    expect(document.getElementById('goals-body').classList.contains('collapsed')).toBe(true);
    expect(document.getElementById('goals-toggle').classList.contains('expanded')).toBe(false);
  });
});
