// goals.js — Goals panel management extracted from app.js

let currentGoals = [];

function initGoalsPanel() {
  const header = document.getElementById('goals-header');
  const toggle = document.getElementById('goals-toggle');
  const body = document.getElementById('goals-body');

  header.addEventListener('click', () => {
    const isCollapsed = body.classList.contains('collapsed');
    body.classList.toggle('collapsed');
    toggle.classList.toggle('expanded', isCollapsed);
  });
}

function extractAndUpdateGoals(fullText) {
  // Extract the GOALS_JSON block from the response
  const regex = /<!--GOALS_JSON\s*([\s\S]*?)\s*GOALS_JSON-->/;
  const match = fullText.match(regex);

  if (!match) return fullText; // No goals block found, return text as-is

  // Parse goals
  let newGoals;
  try {
    newGoals = JSON.parse(match[1]);
  } catch (e) {
    console.warn('Failed to parse goals JSON:', e);
    return fullText.replace(regex, '').trim();
  }

  // Determine which goals are new vs updated
  const previousIds = new Set(currentGoals.map(g => g.id));

  const addedIds = new Set();
  const updatedIds = new Set();

  for (const goal of newGoals) {
    if (!previousIds.has(goal.id)) {
      addedIds.add(goal.id);
    } else {
      // Check if status changed
      const prev = currentGoals.find(g => g.id === goal.id);
      if (prev && prev.status !== goal.status) {
        updatedIds.add(goal.id);
      }
    }
  }

  currentGoals = newGoals;
  renderGoals(addedIds, updatedIds);

  // Strip the GOALS_JSON block from visible text
  return fullText.replace(regex, '').trim();
}

function renderGoals(addedIds = new Set(), updatedIds = new Set()) {
  const list = document.getElementById('goals-list');
  const empty = document.getElementById('goals-empty');
  const count = document.getElementById('goals-count');

  count.textContent = currentGoals.length;

  // Animate the count badge
  if (addedIds.size > 0) {
    count.classList.remove('bumped');
    void count.offsetWidth; // force reflow
    count.classList.add('bumped');
  }

  if (currentGoals.length === 0) {
    empty.style.display = 'block';
    list.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  list.style.display = 'flex';

  // Auto-expand if it was collapsed and we got new goals
  if (addedIds.size > 0) {
    const body = document.getElementById('goals-body');
    const toggle = document.getElementById('goals-toggle');
    body.classList.remove('collapsed');
    toggle.classList.add('expanded');
  }

  const categoryLabels = {
    'retirement': 'Retirement',
    'tax': 'Tax',
    'education': 'Education',
    'investment': 'Investment',
    'charitable': 'Charitable',
    'budget': 'Budget',
    'insurance': 'Insurance',
    'estate': 'Estate',
    'other': 'Other',
  };

  list.innerHTML = currentGoals.map(goal => {
    let animClass = '';
    if (addedIds.has(goal.id)) animClass = 'newly-added';
    else if (updatedIds.has(goal.id)) animClass = 'updated';

    return `
      <div class="goal-card ${animClass}" data-goal-id="${goal.id}">
        <span class="goal-status-dot ${goal.status}"></span>
        <span class="goal-chip-label">${escapeHtml(goal.goal)}</span>
        <span class="goal-chip-priority ${goal.priority}">${goal.priority}</span>
        <div class="goal-tooltip">
          <div class="goal-tooltip-detail">${escapeHtml(goal.detail)}</div>
          <div class="goal-tooltip-meta">${categoryLabels[goal.category] || 'Other'} \u00b7 ${formatGoalStatus(goal.status)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function formatGoalStatus(status) {
  return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function resetGoals() {
  currentGoals = [];
  renderGoals();
  const body = document.getElementById('goals-body');
  const toggle = document.getElementById('goals-toggle');
  body.classList.add('collapsed');
  toggle.classList.remove('expanded');
}
