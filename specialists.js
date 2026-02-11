// specialists.js — Specialist advisor definitions and UI management

const SPECIALISTS = {
  tax: {
    id: 'tax',
    name: 'Alex Rivera',
    title: 'Tax Optimization',
    initials: 'AR',
    color: '#ef4444',
    icon: '\u{1F9FE}'
  },
  retirement: {
    id: 'retirement',
    name: 'Priya Patel',
    title: 'Retirement Projections',
    initials: 'PP',
    color: '#8b5cf6',
    icon: '\u{1F4CA}'
  },
  debt: {
    id: 'debt',
    name: 'Marcus Thompson',
    title: 'Debt Strategy',
    initials: 'MT',
    color: '#f59e0b',
    icon: '\u{1F4B3}'
  },
  rebalancing: {
    id: 'rebalancing',
    name: 'Sarah Kim',
    title: 'Portfolio Rebalancing',
    initials: 'SK',
    color: '#3b82f6',
    icon: '\u2696\uFE0F'
  },
  insurance: {
    id: 'insurance',
    name: 'Diana Nakamura',
    title: 'Insurance & Estate',
    initials: 'DN',
    color: '#14b8a6',
    icon: '\u{1F6E1}\uFE0F'
  },
  cashflow: {
    id: 'cashflow',
    name: 'James Park',
    title: 'Cash Flow & Budget',
    initials: 'JP',
    color: '#22c55e',
    icon: '\u{1F4B0}'
  },
  goals: {
    id: 'goals',
    name: 'Elena Vasquez',
    title: 'Goal Tracking',
    initials: 'EV',
    color: '#ec4899',
    icon: '\u{1F3AF}'
  }
};

// ===== Specialist Pill Rendering =====

function initSpecialistPills() {
  const container = document.getElementById('specialist-pills');
  if (!container) return;

  for (const spec of Object.values(SPECIALISTS)) {
    const pill = document.createElement('div');
    pill.className = 'specialist-pill';
    pill.id = 'specialist-pill-' + spec.id;
    pill.dataset.specialistId = spec.id;
    pill.title = spec.name + ' \u2014 ' + spec.title;
    pill.innerHTML =
      '<span class="specialist-pill-avatar" style="background:' + spec.color + '">' + spec.initials + '</span>' +
      '<span class="specialist-pill-name">' + spec.name.split(' ')[0] + '</span>';
    container.appendChild(pill);
  }
}

// ===== Specialist Indicator Management =====

function updateSpecialistIndicators(consultedSet) {
  for (const id of Object.keys(SPECIALISTS)) {
    const pill = document.getElementById('specialist-pill-' + id);
    if (!pill) continue;
    if (consultedSet.has(id)) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  }
}

function resetSpecialistIndicators() {
  for (const id of Object.keys(SPECIALISTS)) {
    const pill = document.getElementById('specialist-pill-' + id);
    if (pill) pill.classList.remove('active');
  }
}

// ===== Extract Specialist Markers from Response Text =====

function extractSpecialistIds(text) {
  const ids = new Set();
  const regex = /<!--SPECIALIST:(\w+)-->/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (SPECIALISTS[match[1]]) {
      ids.add(match[1]);
    }
  }
  return ids;
}

function stripSpecialistMarkers(text) {
  return text.replace(/<!--SPECIALIST:\w+-->/g, '');
}

function stripPartialSpecialistMarkers(text) {
  // Remove partial markers at the end of streaming text
  return text.replace(/<!--SPECIALIST[^>]*$/, '');
}

// ===== Specialist Attribution Rendering =====

function escapeRegexChars(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSpecialistAttribution(text) {
  for (const spec of Object.values(SPECIALISTS)) {
    const pattern = new RegExp(
      '\\*\\*' + escapeRegexChars(spec.name) + ',\\s*' + escapeRegexChars(spec.title) + ':\\*\\*',
      'g'
    );
    const badge =
      '<div class="specialist-attribution" style="border-color:' + spec.color + '">' +
      '<span class="specialist-avatar" style="background:' + spec.color + '">' + spec.initials + '</span>' +
      '<span class="specialist-name">' + spec.name + '</span>' +
      '<span class="specialist-title">' + spec.title + '</span>' +
      '</div>';
    text = text.replace(pattern, badge);
  }
  return text;
}
