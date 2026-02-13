// client-sidebar.js — Client sidebar UI, switching logic, and per-client chat persistence

let currentClientId = CLIENTS[0].clientId;
const clientChatStates = {};

// ===== Sidebar Rendering =====

function initClientSidebar() {
  const list = document.getElementById('client-list');
  if (!list) return;

  for (const client of CLIENTS) {
    const card = document.createElement('div');
    card.className = 'client-card' + (client.clientId === currentClientId ? ' active' : '');
    card.id = 'client-card-' + client.clientId;
    card.dataset.clientId = client.clientId;

    const incomeLabel = client.owner.annualIncome >= 1000
      ? '$' + Math.round(client.owner.annualIncome / 1000) + 'K'
      : '$' + client.owner.annualIncome;

    card.innerHTML =
      '<div class="client-card-row">' +
        '<div class="client-card-avatar" style="background:' + client.avatar.color + '">' + client.avatar.initials + '</div>' +
        '<div class="client-card-info">' +
          '<div class="client-card-name">' + client.owner.name + '</div>' +
          '<div class="client-card-meta">' + client.owner.age + ' · ' + client.owner.state + ' · ' + incomeLabel + '</div>' +
        '</div>' +
      '</div>';

    card.addEventListener('click', () => {
      if (client.clientId === currentClientId) return;
      switchClient(client.clientId);
    });

    list.appendChild(card);
  }

  // Wire up sidebar toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }
}

// ===== Client Switching =====

function switchClient(clientId) {
  // 1. Save current chat state
  saveClientChatState(currentClientId);

  // 2. Swap active client data
  setActiveClient(clientId);
  currentClientId = clientId;

  // 3. Re-render portfolio panel
  renderScenarioOverview(document.getElementById('scenario-overview'));
  renderTabbedSummary(document.getElementById('tabbed-summary'));
  renderPortfolioAccounts(document.getElementById('portfolio-accounts'));
  renderIncomeDetails(document.getElementById('income-details'));
  renderDebtDetails(document.getElementById('debt-details'));
  renderEstateDetails(document.getElementById('estate-details'));

  // 4. Rebuild system prompt for new client
  if (ChatEngine.apiKey) {
    ChatEngine.systemPrompt = ChatEngine.buildSystemPrompt();
  }

  // 5. Restore chat state (or show welcome if first visit)
  restoreClientChatState(clientId);

  // 6. Update sidebar selection highlight
  updateSidebarSelection(clientId);

  // 7. Reset specialist indicators
  resetSpecialistIndicators();
}

// ===== Sidebar Selection =====

function updateSidebarSelection(clientId) {
  const cards = document.querySelectorAll('.client-card');
  for (const card of cards) {
    if (card.dataset.clientId === clientId) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  }
}

// ===== Per-Client Chat Persistence =====

function saveClientChatState(clientId) {
  if (!clientId) return;
  clientChatStates[clientId] = {
    history: [...ChatEngine.conversationHistory],
    goals: getCurrentGoalsState(),
    messagesHTML: document.getElementById('chat-messages').innerHTML,
  };
}

function restoreClientChatState(clientId) {
  const state = clientChatStates[clientId];
  const messagesContainer = document.getElementById('chat-messages');

  if (state && state.history.length > 0) {
    // Restore previous conversation
    ChatEngine.conversationHistory = [...state.history];
    restoreGoalsState(state.goals);
    messagesContainer.innerHTML = state.messagesHTML;
  } else {
    // First visit — show welcome message
    ChatEngine.clearHistory();
    messagesContainer.innerHTML = '';
    resetGoals();
    showWelcomeMessage();
  }
}

// ===== Sidebar Toggle =====

function toggleSidebar() {
  const sidebar = document.getElementById('client-sidebar');
  if (!sidebar) return;

  sidebar.classList.toggle('collapsed');

  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '\u25B6' : '\u25C0';
  }
}
