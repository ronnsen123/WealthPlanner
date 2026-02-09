// render-helpers.js — Shared HTML generation utilities for portfolio renderers

/**
 * Build a hero section with a label, large value, and optional subtitle
 * @param {Object} opts - { label, value, sub, subClass, valueStyle }
 * @returns {string} HTML string
 */
function buildHeroSection({ label, value, sub = '', subClass = '', valueStyle = '' }) {
  const subHtml = sub ? `<div class="tab-hero-sub ${subClass}">${sub}</div>` : '';
  const styleAttr = valueStyle ? ` style="${valueStyle}"` : '';
  return `
    <div class="tab-hero">
      <div class="tab-hero-label">${label}</div>
      <div class="tab-hero-value"${styleAttr}>${value}</div>
      ${subHtml}
    </div>`;
}

/**
 * Build a horizontal row of stat items
 * @param {Array<{label: string, value: string, style?: string, flex?: string}>} stats
 * @returns {string} HTML string
 */
function buildStatsRow(stats) {
  const items = stats.map(s => {
    const style = [s.flex ? `flex:${s.flex}` : '', s.style || ''].filter(Boolean).join(';');
    const styleAttr = style ? ` style="${style}"` : '';
    return `<div class="tab-stat"${styleAttr}><span class="tab-stat-label">${s.label}</span><span class="tab-stat-value"${s.valueStyle ? ` style="${s.valueStyle}"` : ''}>${s.value}</span></div>`;
  }).join('');
  return `<div class="tab-stats-row">${items}</div>`;
}

/**
 * Build a 3-column detail grid of label/value pairs
 * @param {Array<{label: string, value: string, valueStyle?: string}>} items
 * @returns {string} HTML string
 */
function buildDetailGrid(items) {
  const cells = items.map(i => {
    const styleAttr = i.valueStyle ? ` style="${i.valueStyle}"` : '';
    return `<div class="detail-item"><span class="detail-item-label">${i.label}</span><span class="detail-item-value"${styleAttr}>${i.value}</span></div>`;
  }).join('');
  return `<div class="detail-grid">${cells}</div>`;
}

/**
 * Build a collapsible account section (details/summary)
 * @param {Object} opts - { icon, name, meta, value, valueSub, valueStyle, body, open }
 * @returns {string} HTML string
 */
function buildAccountSection({ icon, name, meta, value = '', valueSub = '', valueStyle = '', body, open = false }) {
  const rightHtml = value ? `
    <div class="account-header-right">
      <span class="account-value"${valueStyle ? ` style="${valueStyle}"` : ''}>${value}</span>
      ${valueSub ? `<span class="account-gainloss"${valueStyle ? '' : ' style="color:var(--color-text-muted)"'}>${valueSub}</span>` : ''}
    </div>` : '';

  return `
    <details class="account-section"${open ? ' open' : ''}>
      <summary class="account-header">
        <div class="account-header-left">
          <span class="account-icon">${icon}</span>
          <div class="account-title-group">
            <span class="account-name">${name}</span>
            <span class="account-meta">${meta}</span>
          </div>
        </div>
        ${rightHtml}
      </summary>
      <div class="account-body">${body}</div>
    </details>`;
}

/**
 * Build a table with headers and rows
 * @param {Array<{text: string, style?: string}>} headers
 * @param {Array<Array<{text: string, className?: string, style?: string}>>} rows
 * @returns {string} HTML string
 */
function buildTable(headers, rows) {
  const thead = headers.map(h =>
    `<th${h.style ? ` style="${h.style}"` : ''}>${h.text}</th>`
  ).join('');

  const tbody = rows.map(row => {
    const cells = row.map(cell =>
      `<td${cell.className ? ` class="${cell.className}"` : ''}${cell.style ? ` style="${cell.style}"` : ''}>${cell.text}</td>`
    ).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <table class="holdings-table">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>`;
}
