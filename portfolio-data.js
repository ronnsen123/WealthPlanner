// portfolio-data.js — Active client reference and shared constants

// Active client data — swapped when advisor selects a client from the sidebar
var PORTFOLIO_DATA = CLIENTS[0];

function setActiveClient(clientId) {
  const client = CLIENTS.find(c => c.clientId === clientId);
  if (!client) return;
  PORTFOLIO_DATA = client;
  invalidatePortfolioCache();
}

// --- Tab Definitions ---

const TAB_DEFINITIONS = [
  { id: 'portfolio', label: 'Portfolio', icon: '\u{1F4CA}' },
  { id: 'income', label: 'Income', icon: '\u{1F4B0}' },
  { id: 'debt', label: 'Debt', icon: '\u{1F3E0}' },
  { id: 'estate', label: 'Estate', icon: '\u{1F4CB}' },
];

// --- Asset Class Colors ---

const ASSET_CLASS_COLORS = {
  "US Equity": "#3b82f6",
  "Intl Equity": "#8b5cf6",
  "US Bond": "#14b8a6",
  "Target Date": "#f59e0b",
  "Cash": "#6b7280",
  "Intl Bond": "#06b6d4",
};

// --- Formatters ---

const fmtCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtCurrencyPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPercent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
