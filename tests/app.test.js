// tests/app.test.js — Tests for landing overlay and feedback buttons
import { describe, it, expect, beforeEach } from 'vitest';

describe('initLandingOverlay', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="landing-overlay">
        <div class="landing-content">
          <button id="landing-cta">Get Started</button>
        </div>
      </div>
    `;
    initLandingOverlay();
  });

  it('adds fade-out class on CTA click', () => {
    const overlay = document.getElementById('landing-overlay');
    const cta = document.getElementById('landing-cta');

    cta.click();

    expect(overlay.classList.contains('fade-out')).toBe(true);
  });

  it('removes overlay on transitionend', () => {
    const overlay = document.getElementById('landing-overlay');
    const cta = document.getElementById('landing-cta');

    cta.click();
    overlay.dispatchEvent(new Event('transitionend'));

    expect(document.getElementById('landing-overlay')).toBeNull();
  });

  it('does nothing if overlay element is missing', () => {
    document.body.innerHTML = '<div>No overlay here</div>';
    // Should not throw
    expect(() => initLandingOverlay()).not.toThrow();
  });
});

describe('createFeedbackButtons', () => {
  let messageEl;

  beforeEach(() => {
    // Reset feedback array
    messageFeedback.length = 0;

    messageEl = document.createElement('div');
    messageEl.className = 'message assistant';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = 'Some AI response';
    messageEl.appendChild(bubble);
    document.body.innerHTML = '';
    document.body.appendChild(messageEl);
  });

  it('creates a feedback-row with two buttons', () => {
    createFeedbackButtons(messageEl);

    const row = messageEl.querySelector('.feedback-row');
    expect(row).not.toBeNull();
    const buttons = row.querySelectorAll('.feedback-btn');
    expect(buttons).toHaveLength(2);
  });

  it('buttons have correct titles', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    expect(buttons[0].title).toBe('Helpful');
    expect(buttons[1].title).toBe('Not helpful');
  });

  it('buttons contain SVG icons', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    expect(buttons[0].querySelector('svg')).not.toBeNull();
    expect(buttons[1].querySelector('svg')).not.toBeNull();
  });

  it('appends feedback row to the given messageEl', () => {
    createFeedbackButtons(messageEl);

    expect(messageEl.children).toHaveLength(2); // bubble + feedback-row
    expect(messageEl.lastChild.className).toBe('feedback-row');
  });

  it('adds null entry to messageFeedback array', () => {
    createFeedbackButtons(messageEl);

    expect(messageFeedback).toHaveLength(1);
    expect(messageFeedback[0]).toBeNull();
  });

  it('thumbs up click sets selected on up, dimmed on down', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    buttons[0].click();

    expect(buttons[0].classList.contains('selected')).toBe(true);
    expect(buttons[1].classList.contains('dimmed')).toBe(true);
  });

  it('thumbs down click sets selected on down, dimmed on up', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    buttons[1].click();

    expect(buttons[1].classList.contains('selected')).toBe(true);
    expect(buttons[0].classList.contains('dimmed')).toBe(true);
  });

  it('stores "up" in messageFeedback on thumbs up click', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    buttons[0].click();

    expect(messageFeedback[0]).toBe('up');
  });

  it('stores "down" in messageFeedback on thumbs down click', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');
    buttons[1].click();

    expect(messageFeedback[0]).toBe('down');
  });

  it('switching from up to down updates both buttons and feedback', () => {
    createFeedbackButtons(messageEl);

    const buttons = messageEl.querySelectorAll('.feedback-btn');

    // Click thumbs up first
    buttons[0].click();
    expect(messageFeedback[0]).toBe('up');
    expect(buttons[0].classList.contains('selected')).toBe(true);

    // Switch to thumbs down
    buttons[1].click();
    expect(messageFeedback[0]).toBe('down');
    expect(buttons[1].classList.contains('selected')).toBe(true);
    expect(buttons[1].classList.contains('dimmed')).toBe(false);
    expect(buttons[0].classList.contains('selected')).toBe(false);
    expect(buttons[0].classList.contains('dimmed')).toBe(true);
  });

  it('tracks multiple messages independently', () => {
    const messageEl2 = document.createElement('div');
    messageEl2.className = 'message assistant';

    createFeedbackButtons(messageEl);
    createFeedbackButtons(messageEl2);

    expect(messageFeedback).toHaveLength(2);
    expect(messageFeedback[0]).toBeNull();
    expect(messageFeedback[1]).toBeNull();

    // Click thumbs up on first, thumbs down on second
    messageEl.querySelectorAll('.feedback-btn')[0].click();
    messageEl2.querySelectorAll('.feedback-btn')[1].click();

    expect(messageFeedback[0]).toBe('up');
    expect(messageFeedback[1]).toBe('down');
  });
});
