// app.js — App initialization, event wiring, API key management, chat UI

document.addEventListener('DOMContentLoaded', () => {
  // Render portfolio
  renderScenarioOverview(document.getElementById('scenario-overview'));
  renderTabbedSummary(document.getElementById('tabbed-summary'));
  renderPortfolioAccounts(document.getElementById('portfolio-accounts'));
  renderIncomeDetails(document.getElementById('income-details'));
  renderDebtDetails(document.getElementById('debt-details'));
  renderEstateDetails(document.getElementById('estate-details'));

  // Configure marked.js
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Wire up UI
  initLandingOverlay();
  initSpecialistPills();
  initApiKey();
  initChat();
  initGoalsPanel();
  initPanelDivider();
  showWelcomeMessage();
});

// ===== API Key Management =====

function initApiKey() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('api-key-btn');

  btn.addEventListener('click', () => connectApiKey());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') connectApiKey();
  });
}

function connectApiKey() {
  const input = document.getElementById('api-key-input');
  const key = input.value.trim();

  if (!key) return;

  ChatEngine.setApiKey(key);
  ChatEngine.systemPrompt = ChatEngine.buildSystemPrompt();

  // Update UI
  setConnectionStatus('connected');
  enableChat();

  // Collapse the input but keep button as "Reconnect"
  input.style.width = '0';
  input.style.padding = '0';
  input.style.border = 'none';
  input.style.overflow = 'hidden';
  const btn = document.getElementById('api-key-btn');
  btn.textContent = 'Change Key';
  btn.onclick = showApiKeyInput;
}

function showApiKeyInput() {
  const input = document.getElementById('api-key-input');
  input.style.width = '260px';
  input.style.padding = '7px 12px';
  input.style.border = '1px solid rgba(255,255,255,0.06)';
  input.style.overflow = 'visible';
  input.value = '';
  input.focus();

  const btn = document.getElementById('api-key-btn');
  btn.textContent = 'Connect';
  btn.onclick = () => connectApiKey();
}

function setConnectionStatus(status) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const advisorDot = document.getElementById('advisor-status-dot');
  const advisorText = document.getElementById('advisor-status-text');

  dot.className = 'status-dot';
  advisorDot.className = 'status-dot';

  if (status === 'connected') {
    dot.classList.add('connected');
    text.textContent = 'Connected';
    advisorDot.classList.add('connected');
    advisorText.textContent = 'Online';
  } else if (status === 'error') {
    dot.classList.add('error');
    text.textContent = 'Error';
    advisorDot.classList.add('error');
    advisorText.textContent = 'Error';
  } else {
    text.textContent = 'Not connected';
    advisorText.textContent = 'Offline';
  }
}

function enableChat() {
  document.getElementById('chat-input').disabled = false;
  document.getElementById('chat-send-btn').disabled = false;
  document.getElementById('chat-input').focus();
}

function disableChat() {
  document.getElementById('chat-input').disabled = true;
  document.getElementById('chat-send-btn').disabled = true;
}

// ===== Chat UI =====

let isSending = false;

function initChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const clearBtn = document.getElementById('clear-chat-btn');

  sendBtn.addEventListener('click', () => handleSend());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  clearBtn.addEventListener('click', () => {
    ChatEngine.clearHistory();
    document.getElementById('chat-messages').innerHTML = '';
    resetGoals();
    resetSpecialistIndicators();
    showWelcomeMessage();
  });
}

async function handleSend() {
  if (isSending) return;

  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  if (!ChatEngine.apiKey) {
    appendErrorMessage('Please enter your Claude API key first.');
    return;
  }

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Remove suggestions if present
  const suggestions = document.querySelector('.suggestions');
  if (suggestions) suggestions.remove();

  // Add user message
  appendMessage('user', text);

  // Show typing indicator
  isSending = true;
  document.getElementById('chat-send-btn').disabled = true;
  showTyping(true);
  resetSpecialistIndicators();

  // Create assistant bubble (we'll fill it as we stream)
  const assistantEl = createEmptyAssistantMessage();
  const bubbleEl = assistantEl.querySelector('.message-bubble');
  let accumulatedText = '';
  const consultedSpecialists = new Set();

  await ChatEngine.sendMessage(
    text,
    // onChunk
    (chunk, fullSoFar) => {
      showTyping(false);
      accumulatedText = fullSoFar;
      // Detect specialist markers during streaming
      const newIds = extractSpecialistIds(accumulatedText);
      for (const id of newIds) consultedSpecialists.add(id);
      if (consultedSpecialists.size > 0) updateSpecialistIndicators(consultedSpecialists);
      // Strip partial GOALS_JSON and specialist markers from streaming display
      let displayText = accumulatedText.replace(/<!--GOALS_JSON[\s\S]*$/, '').trim();
      displayText = stripSpecialistMarkers(displayText);
      displayText = stripPartialSpecialistMarkers(displayText);
      bubbleEl.innerHTML = marked.parse(displayText);
      scrollChatToBottom();
    },
    // onComplete
    (fullText) => {
      // Final specialist indicator update
      const finalIds = extractSpecialistIds(fullText);
      for (const id of finalIds) consultedSpecialists.add(id);
      if (consultedSpecialists.size > 0) updateSpecialistIndicators(consultedSpecialists);
      // Process goals and strip markers
      const cleanText = extractAndUpdateGoals(fullText);
      let displayText = stripSpecialistMarkers(cleanText);
      // Render specialist attribution badges
      displayText = renderSpecialistAttribution(displayText);
      bubbleEl.innerHTML = marked.parse(displayText);
      createFeedbackButtons(assistantEl);
      scrollChatToBottom();
      isSending = false;
      document.getElementById('chat-send-btn').disabled = false;
      document.getElementById('chat-input').focus();
    },
    // onError
    (errorMsg) => {
      showTyping(false);
      if (!accumulatedText) {
        // No text was streamed, remove the empty bubble
        assistantEl.remove();
      }
      appendErrorMessage(errorMsg);
      // If it looks like an auth error, show the API key input again
      if (errorMsg.toLowerCase().includes('api key') || errorMsg.toLowerCase().includes('auth') || errorMsg.toLowerCase().includes('401') || errorMsg.toLowerCase().includes('invalid')) {
        setConnectionStatus('error');
        showApiKeyInput();
      }
      isSending = false;
      document.getElementById('chat-send-btn').disabled = false;
    }
  );
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  if (role === 'user') {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = marked.parse(text);
  }

  div.appendChild(bubble);
  container.appendChild(div);
  scrollChatToBottom();
}

function createEmptyAssistantMessage() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message assistant';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  div.appendChild(bubble);
  container.appendChild(div);
  scrollChatToBottom();
  return div;
}

function appendErrorMessage(text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message assistant error';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  div.appendChild(bubble);
  container.appendChild(div);
  scrollChatToBottom();
}

function showTyping(show) {
  const indicator = document.getElementById('typing-indicator');
  indicator.classList.toggle('visible', show);
  if (show) scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById('chat-messages');
  container.scrollTop = container.scrollHeight;
}

// ===== Welcome Message =====

function showWelcomeMessage() {
  const p = computePortfolio();
  const container = document.getElementById('chat-messages');

  const div = document.createElement('div');
  div.className = 'message assistant welcome';

  const { totalBalance: debtTotal, totalMonthly: debtMonthly } = computeDebtSummary();
  const w2 = PORTFOLIO_DATA.w2Income;
  const estate = PORTFOLIO_DATA.estate;
  const totalWithheld = w2 ? (w2.federalWithheldBox2 + w2.socialSecurityWithheldBox4 + w2.medicareWithheldBox6 + w2.stateWithheldBox17) : 0;
  const takeHome = w2 ? (w2.wagesBox1 - totalWithheld) : 0;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = `
    <p>Welcome! I'm <strong>Morgan Chen</strong>, your lead financial planning advisor. I work with a team of <strong>7 specialist advisors</strong> who I'll bring in as needed based on your questions.</p>
    <p>I have a <strong>complete holistic view</strong> of your finances:</p>
    <ul>
      <li><strong>Portfolio:</strong> ${fmtCurrency.format(p.totalValue)} across ${p.accounts.length} accounts at Fidelity</li>
      <li><strong>Income:</strong> ${fmtCurrency.format(w2.wagesBox1)} W-2 wages (${fmtCurrency.format(takeHome)} take-home)</li>
      <li><strong>Debt:</strong> ${fmtCurrency.format(debtTotal)} total (${fmtCurrency.format(debtMonthly)}/mo payments)</li>
      <li><strong>Estate:</strong> Will, trust, POAs in place \u00b7 ${fmtCurrency.format(estate.lifeInsurance.coverageAmount)} life insurance</li>
    </ul>
    <p>Enter your Claude API key above to start chatting. I can advise across <strong>all dimensions</strong> \u2014 investments, taxes, debt strategy, insurance, estate planning, and cash flow.</p>
    <div class="suggestions">
      <button class="suggestion-btn" onclick="useSuggestion(this)">Give me a holistic financial health check</button>
      <button class="suggestion-btn" onclick="useSuggestion(this)">Should I pay off debt faster or invest more?</button>
      <button class="suggestion-btn" onclick="useSuggestion(this)">Is my life insurance coverage adequate?</button>
      <button class="suggestion-btn" onclick="useSuggestion(this)">What tax-loss harvesting opportunities do I have?</button>
      <button class="suggestion-btn" onclick="useSuggestion(this)">How should I use my DAF with the appreciated NVDA?</button>
      <button class="suggestion-btn" onclick="useSuggestion(this)">Review my monthly cash flow and savings rate</button>
    </div>
  `;

  div.appendChild(bubble);
  container.appendChild(div);
}

function useSuggestion(btn) {
  const text = btn.textContent;
  const input = document.getElementById('chat-input');
  input.value = text;
  input.focus();

  if (ChatEngine.apiKey) {
    handleSend();
  }
}

// ===== Landing Overlay =====

function initLandingOverlay() {
  const overlay = document.getElementById('landing-overlay');
  const cta = document.getElementById('landing-cta');
  if (!overlay || !cta) return;

  cta.addEventListener('click', () => {
    overlay.classList.add('fade-out');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, { once: true });
  });
}

// ===== Feedback Buttons =====

const messageFeedback = [];

function createFeedbackButtons(messageEl) {
  const row = document.createElement('div');
  row.className = 'feedback-row';

  const thumbUpSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`;
  const thumbDownSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L14 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>`;

  const btnUp = document.createElement('button');
  btnUp.className = 'feedback-btn';
  btnUp.title = 'Helpful';
  btnUp.innerHTML = thumbUpSvg;

  const btnDown = document.createElement('button');
  btnDown.className = 'feedback-btn';
  btnDown.title = 'Not helpful';
  btnDown.innerHTML = thumbDownSvg;

  const feedbackIndex = messageFeedback.length;
  messageFeedback.push(null);

  btnUp.addEventListener('click', () => {
    messageFeedback[feedbackIndex] = 'up';
    btnUp.classList.add('selected');
    btnUp.classList.remove('dimmed');
    btnDown.classList.remove('selected');
    btnDown.classList.add('dimmed');
  });

  btnDown.addEventListener('click', () => {
    messageFeedback[feedbackIndex] = 'down';
    btnDown.classList.add('selected');
    btnDown.classList.remove('dimmed');
    btnUp.classList.remove('selected');
    btnUp.classList.add('dimmed');
  });

  row.appendChild(btnUp);
  row.appendChild(btnDown);

  // Append feedback row after the bubble, inside the message div
  messageEl.appendChild(row);
}

// ===== Panel Divider (Resizable) =====

function initPanelDivider() {
  const divider = document.getElementById('panel-divider');
  const main = document.getElementById('app-main');
  let isDragging = false;

  divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const percent = (e.clientX / window.innerWidth) * 100;
    const clamped = Math.max(25, Math.min(75, percent));
    main.style.gridTemplateColumns = `${clamped}% 5px 1fr`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}
