// App State
const state = {
  isOnline: false,
  isAuthenticated: false,
  authToken: null,
  schema: [],          // Active fields list
  drafts: [],          // Local drafts stored in localStorage
  dbRecords: [],       // Records fetched from SQLite
  activeTab: 'data-entry',
  formCreatorSchema: [], // Working copy of schema inside Form Creator
  lanUrl: ''
};

// Selectors
const DOM = {
  connectionBadge: document.getElementById('connection-badge'),
  connectionText: DOMTextSelector('#connection-badge .badge-text'),
  connectionTroubleshootLink: document.getElementById('connection-troubleshoot-link'),
  authBtn: document.getElementById('auth-btn'),
  authBtnText: document.getElementById('auth-btn-text'),
  menuToggle: document.getElementById('menu-toggle'),
  appSidebar: document.getElementById('app-sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  navItems: document.querySelectorAll('.nav-item'),
  tabPanels: document.querySelectorAll('.tab-panel'),
  
  // Tab 1: Data Entry
  dataEntryForm: document.getElementById('data-entry-form'),
  dynamicInputs: document.getElementById('dynamic-inputs-container'),
  saveDraftBtn: document.getElementById('save-draft-btn'),
  clearFieldsBtn: document.getElementById('clear-fields-btn'),
  draftSummaryText: document.getElementById('draft-summary-text'),
  draftsPreviewTable: document.getElementById('drafts-preview-table'),
  draftsTableHeader: document.getElementById('drafts-table-header'),
  draftsTableBody: document.getElementById('drafts-table-body'),
  draftsCountBadge: document.getElementById('drafts-count-badge'),
  
  // Tab 2: Form Creator
  addFieldBtn: document.getElementById('add-field-btn'),
  resetCreatorBtn: document.getElementById('reset-creator-btn'),
  fieldsListBody: document.getElementById('fields-list-body'),
  saveSchemaBtn: document.getElementById('save-schema-btn'),
  creatorAdminWarning: document.getElementById('creator-admin-warning'),
  changeCredentialsForm: document.getElementById('change-credentials-form'),
  changeAdminUsername: document.getElementById('change-admin-username'),
  changeAdminPassword: document.getElementById('change-admin-password'),
  submitCredentialsBtn: document.getElementById('submit-credentials-btn'),
  
  // Tab 3: Verify & Push
  syncTableBody: document.getElementById('sync-table-body'),
  syncTableHeader: document.getElementById('sync-table-header'),
  pushSelectedBtn: document.getElementById('push-selected-btn'),
  pushCountText: document.getElementById('push-count-text'),
  selectAllDraftsBtn: document.getElementById('select-all-drafts-btn'),
  deselectAllDraftsBtn: document.getElementById('deselect-all-drafts-btn'),
  headerSelectAll: document.getElementById('header-select-all'),
  syncNetworkWarning: document.getElementById('sync-network-warning'),
  syncWarningText: document.getElementById('sync-warning-text'),
  rejectSelectedBtn: document.getElementById('reject-selected-btn'),
  rejectCountText: document.getElementById('reject-count-text'),
  
  // Tab 4: Database reports
  dbTableHeader: document.getElementById('db-table-header'),
  dbTableBody: document.getElementById('db-table-body'),
  filterMonth: document.getElementById('filter-month'),
  filterYear: document.getElementById('filter-year'),
  refreshDbBtn: document.getElementById('refresh-db-btn'),
  summaryTotal: document.getElementById('summary-total-records'),
  summaryVerified: document.getElementById('summary-verified-records'),
  summaryUnverified: document.getElementById('summary-unverified-records'),
  sessionStatusDisplay: document.getElementById('session-status-display'),
  cloudBackupBtn: document.getElementById('cloud-backup-btn'),
  cloudBackupDownloadLink: document.getElementById('cloud-backup-download-link'),
  
  // Auth Modal
  authModal: document.getElementById('auth-modal'),
  loginForm: document.getElementById('login-form'),
  loginUsername: document.getElementById('login-username'),
  loginPassword: document.getElementById('login-password'),
  loginError: document.getElementById('login-error'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  cancelLoginBtn: document.getElementById('cancel-login-btn'),
  loginOtpSection: document.getElementById('login-otp-section'),
  loginOtp: document.getElementById('login-otp'),
  totpStatusBadge: document.getElementById('totp-status-badge'),
  totpActions: document.getElementById('totp-actions'),
  totpSetupSection: document.getElementById('totp-setup-section'),
  totpQrImg: document.getElementById('totp-qr-img'),
  totpManualSecret: document.getElementById('totp-manual-secret'),
  totpSetupCode: document.getElementById('totp-setup-code'),
  confirmTotpBtn: document.getElementById('confirm-totp-btn'),
  cancelTotpSetupBtn: document.getElementById('cancel-totp-setup-btn'),

  // Theme Toggle
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeToggleIcon: document.getElementById('theme-toggle-icon'),

  // Enlarged QR Code Selectors
  qrModal: document.getElementById('qr-modal'),
  modalQrImg: document.getElementById('modal-qr-img'),
  qrModalUrl: document.getElementById('qr-modal-url'),
  qrModalTimer: document.getElementById('qr-modal-timer'),

  // Excel Import Selectors
  excelImportFile: document.getElementById('excel-import-file'),
  excelDropZone: document.getElementById('excel-drop-zone'),
  importMappingPreview: document.getElementById('import-mapping-preview'),
  importPreviewHeaders: document.getElementById('import-preview-headers'),
  importPreviewBody: document.getElementById('import-preview-body'),
  confirmImportBtn: document.getElementById('confirm-import-btn'),
  cancelImportBtn: document.getElementById('cancel-import-btn'),
  importRowCount: document.getElementById('import-row-count'),
  
  // Headers Creator Selectors
  loadHeadersBtn: document.getElementById('load-headers-btn'),
  headersExcelFile: document.getElementById('headers-excel-file'),
  
  // Sort Selector
  filterSort: document.getElementById('filter-sort'),

  // Print Preview Selectors
  printModal: document.getElementById('print-modal'),
  printPreviewBtn: document.getElementById('print-preview-btn'),
  closePrintModalBtn: document.getElementById('close-print-modal-btn'),
  cancelPrintBtn: document.getElementById('cancel-print-btn'),
  verifyPrintBtn: document.getElementById('verify-print-btn'),
  printPreviewHeaderText: document.getElementById('print-preview-header-text'),
  printTableHeader: document.getElementById('print-table-header'),
  printTableBody: document.getElementById('print-table-body'),

  // Edit Modal & Duplicate Selectors
  editModal: document.getElementById('edit-modal'),
  editForm: document.getElementById('edit-form'),
  editInputsContainer: document.getElementById('edit-inputs-container'),
  closeEditModalBtn: document.getElementById('close-edit-modal-btn'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  editModalTitle: document.getElementById('edit-modal-title'),
  dbDuplicateAlert: document.getElementById('db-duplicate-alert'),
  clearDraftsBtn: document.getElementById('clear-drafts-btn'),
  clearDatabaseBtn: document.getElementById('clear-database-btn'),

  // Analytics Selectors
  analysisTimeframe: document.getElementById('analysis-timeframe'),
  analysisYear: document.getElementById('analysis-year'),
  analysisMonth: document.getElementById('analysis-month'),
  analysisFromDate: document.getElementById('analysis-from-date'),
  analysisToDate: document.getElementById('analysis-to-date'),
  analysisYearGroup: document.getElementById('analysis-year-group'),
  analysisMonthGroup: document.getElementById('analysis-month-group'),
  analysisCustomGroup: document.getElementById('analysis-custom-group'),
  monthlyLoadCard: document.getElementById('monthly-load-card'),
  kpiTotalDeliveries: document.getElementById('kpi-total-deliveries'),
  kpiAvgWeight: document.getElementById('kpi-avg-weight'),
  kpiFpRate: document.getElementById('kpi-fp-rate'),
  kpiFpProgress: document.getElementById('kpi-fp-progress'),
  kpiLbwRate: document.getElementById('kpi-lbw-rate'),
  kpiLbwProgress: document.getElementById('kpi-lbw-progress'),
  kpiGenderRatio: document.getElementById('kpi-gender-ratio'),
  kpiHighRisk: document.getElementById('kpi-high-risk'),
  topAddressesList: document.getElementById('top-addresses-list'),
  
  // QR Code Selectors
  sidebarQrContainer: document.getElementById('sidebar-qr-container'),
  sidebarQrImg: document.getElementById('sidebar-qr-img'),

  // Secure Credentials Selectors
  changeCurrentPassword: document.getElementById('change-current-password'),
  changeAdmin2fa: document.getElementById('change-admin-2fa'),
  loginErrorText: document.getElementById('login-error-text')
};

// Helper for finding elements inside selectors safely
function DOMTextSelector(selector) {
  return {
    get textContent() {
      const el = document.querySelector(selector);
      return el ? el.textContent : '';
    },
    set textContent(val) {
      const el = document.querySelector(selector);
      if (el) el.textContent = val;
    }
  };
}

// Helper to strip any leading dashes and spaces from field titles in the UI
function getFieldDisplayTitle(field) {
  if (!field || !field.title) return '';
  return field.title.replace(/^[-\s]+/, '');
}

// Safe event listener helper to prevent script crashes on cached or missing DOM elements
function safeAddListener(el, event, handler) {
  if (el) {
    el.addEventListener(event, handler);
  }
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Load token from session storage
  const savedToken = sessionStorage.getItem('authToken');
  if (savedToken) {
    state.isAuthenticated = true;
    state.authToken = savedToken;
    fetchTotpStatus();
  }
  updateAuthUI();

  // Set default server URL
  state.lanUrl = window.location.origin;

  // Load drafts from localStorage
  loadDraftsFromStorage();

  // Initialize Theme (Day / Night mode)
  initTheme();

  // Setup Event Listeners
  setupEventListeners();

  // Initialize Speech Recognition API
  initSpeechRecognition();

  // Initial Check Connectivity and Fetch Schema
  checkConnectivity().then(() => {
    fetchSchema().then(() => {
      renderDataEntryForm();
      renderDraftsTable();
    });
  });

  // Start periodic LAN server connectivity check (every 5 seconds)
  setInterval(checkConnectivity, 5000);
});

// -------------------------------------------------------------
// STORAGE & LOCAL STATE
// -------------------------------------------------------------

function loadDraftsFromStorage() {
  const stored = localStorage.getItem('drafts');
  state.drafts = stored ? JSON.parse(stored) : [];
  updateDraftCountBadges();
}

function saveDraftsToStorage() {
  localStorage.setItem('drafts', JSON.stringify(state.drafts));
  updateDraftCountBadges();
}

function updateDraftCountBadges() {
  const count = state.drafts.length;
  DOM.draftsCountBadge.textContent = count;
  if (count > 0) {
    DOM.draftsCountBadge.classList.remove('hidden');
  } else {
    DOM.draftsCountBadge.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// NETWORKING & ONLINE CHECK
// -------------------------------------------------------------

async function checkConnectivity() {
  try {
    // Ping API endpoint to ensure we are connected to the LAN database
    const response = await fetch('/api/schema', { method: 'GET', cache: 'no-cache' });
    if (response.ok) {
      if (!state.isOnline) {
        state.isOnline = true;
        updateConnectivityUI();
        // Auto fetch DB records when online
        fetchDatabaseRecords();
      }
    } else {
      throw new Error('Server returned error');
    }
  } catch (err) {
    console.warn('Connectivity check failed:', err);
    if (state.isOnline || state.isOnline === undefined) {
      state.isOnline = false;
      updateConnectivityUI();
    }
  }
}

function updateConnectivityUI() {
  if (state.isOnline) {
    DOM.connectionBadge.className = 'badge online';
    DOM.connectionText.textContent = 'Online';
    DOM.syncNetworkWarning.className = 'alert-box alert-warning hidden';
    DOM.saveSchemaBtn.disabled = !state.isAuthenticated;
    
    // Enable/disable push button based on drafts count
    updatePushSelectedBtnState();
  } else {
    DOM.connectionBadge.className = 'badge offline';
    DOM.connectionText.textContent = 'Offline';
    DOM.syncNetworkWarning.className = 'alert-box alert-danger';
    DOM.syncWarningText.innerHTML = `⚠️ Offline: Reconnect to the internet or hosted server to push drafts to the database.`;
    DOM.saveSchemaBtn.disabled = true;
    DOM.pushSelectedBtn.disabled = true;
  }
}

// QR code features removed for cloud hosting

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------

async function openLoginModal() {
  DOM.loginUsername.value = '';
  DOM.loginPassword.value = '';
  state.loginTempToken = null;
  const credentialsSec = document.getElementById('login-credentials-section');
  if (credentialsSec) credentialsSec.classList.remove('hidden');
  if (DOM.loginOtp) DOM.loginOtp.value = '';
  
  // Directly check if TOTP is enabled to display the field immediately
  try {
    const res = await fetch('/api/login/totp-status');
    if (res.ok) {
      const data = await res.json();
      if (data.enabled) {
        if (DOM.loginOtpSection) DOM.loginOtpSection.classList.remove('hidden');
        if (DOM.loginOtp) DOM.loginOtp.setAttribute('required', 'true');
      } else {
        if (DOM.loginOtpSection) DOM.loginOtpSection.classList.add('hidden');
        if (DOM.loginOtp) DOM.loginOtp.removeAttribute('required');
      }
    }
  } catch (err) {
    console.warn('Failed to fetch TOTP status on login open:', err);
    if (DOM.loginOtpSection) DOM.loginOtpSection.classList.add('hidden');
  }

  const submitBtn = document.getElementById('submit-login-btn');
  if (submitBtn) submitBtn.textContent = 'Login';
  DOM.loginError.classList.add('hidden');
  DOM.authModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  DOM.authModal.classList.remove('active');
  document.body.style.overflow = '';
}

async function handleLogin(e) {
  e.preventDefault();
  
  // If we are in the OTP verification step
  if (state.loginTempToken) {
    const code = DOM.loginOtp.value.trim();
    if (!code || code.length !== 6) {
      if (DOM.loginErrorText) DOM.loginErrorText.textContent = 'Please enter a 6-digit code.';
      DOM.loginError.classList.remove('hidden');
      return;
    }
    
    try {
      const response = await fetch('/api/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: state.loginTempToken, code })
      });
      
      if (response.ok) {
        const data = await response.json();
        state.isAuthenticated = true;
        state.authToken = data.token;
        sessionStorage.setItem('authToken', data.token);
        state.loginTempToken = null;
        
        updateAuthUI();
        closeLoginModal();
        
        renderFormCreator();
        fetchDatabaseRecords();
        fetchTotpStatus();
      } else {
        const err = await response.json();
        if (DOM.loginErrorText) DOM.loginErrorText.textContent = err.error || 'Invalid 2FA code.';
        DOM.loginError.classList.remove('hidden');
      }
    } catch (err) {
      alert('Network error verifying 2FA. Ensure LAN is connected.');
    }
    return;
  }

  // Standard username and password step
  const username = DOM.loginUsername.value.trim();
  const password = DOM.loginPassword.value;
  const code = DOM.loginOtp ? DOM.loginOtp.value.trim() : '';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, code })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.requireOtp) {
        // Switch to OTP step
        state.loginTempToken = data.tempToken;
        const credentialsSec = document.getElementById('login-credentials-section');
        if (credentialsSec) credentialsSec.classList.add('hidden');
        if (DOM.loginOtpSection) DOM.loginOtpSection.classList.remove('hidden');
        if (DOM.loginOtp) {
          DOM.loginOtp.value = '';
          DOM.loginOtp.focus();
          DOM.loginOtp.setAttribute('required', 'true');
        }
        const submitBtn = document.getElementById('submit-login-btn');
        if (submitBtn) submitBtn.textContent = 'Verify 2FA';
        DOM.loginError.classList.add('hidden');
      } else {
        state.isAuthenticated = true;
        state.authToken = data.token;
        sessionStorage.setItem('authToken', data.token);
        
        updateAuthUI();
        closeLoginModal();
        
        renderFormCreator();
        fetchDatabaseRecords();
        fetchTotpStatus();
      }
    } else {
      const err = await response.json();
      if (DOM.loginErrorText) DOM.loginErrorText.textContent = err.error || 'Invalid User ID, Password or 2FA code.';
      DOM.loginError.classList.remove('hidden');
    }
  } catch (err) {
    alert('Network error authenticating. Ensure LAN is connected.');
  }
}

function handleLogout() {
  state.isAuthenticated = false;
  state.authToken = null;
  sessionStorage.removeItem('authToken');
  updateAuthUI();
  
  // Refresh views
  renderFormCreator();
  renderDBTable();
  resetTotpUI();
}

async function handleUpdateCredentials(e) {
  e.preventDefault();
  if (!state.isOnline || !state.isAuthenticated) return;

  const currentPassword = DOM.changeCurrentPassword ? DOM.changeCurrentPassword.value : '';
  const newUsername = DOM.changeAdminUsername.value.trim();
  const newPassword = DOM.changeAdminPassword.value;
  const code = DOM.changeAdmin2fa ? DOM.changeAdmin2fa.value.trim() : '';

  if (!currentPassword) {
    alert('Current password is required to update credentials.');
    return;
  }

  if (!newUsername || !newPassword) {
    alert('Both new User ID and new Password fields are required.');
    return;
  }

  if (!code || code.length !== 6) {
    alert('A 6-digit 2FA Authenticator Code is required.');
    return;
  }

  try {
    DOM.submitCredentialsBtn.disabled = true;
    DOM.submitCredentialsBtn.textContent = 'Updating...';

    const response = await fetch('/api/settings/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ currentPassword, newUsername, newPassword, code })
    });

    if (response.ok) {
      alert('Admin credentials updated successfully! Please log in again with your new credentials.');
      if (DOM.changeCurrentPassword) DOM.changeCurrentPassword.value = '';
      if (DOM.changeAdmin2fa) DOM.changeAdmin2fa.value = '';
      DOM.changeAdminUsername.value = '';
      DOM.changeAdminPassword.value = '';
      handleLogout();
    } else {
      const err = await response.json();
      alert('Error updating credentials: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Network error updating credentials. Ensure LAN server is reachable.');
  } finally {
    DOM.submitCredentialsBtn.disabled = false;
    DOM.submitCredentialsBtn.textContent = 'Update Credentials';
  }
}

function updateAuthUI() {
  const authBtnIcon = DOM.authBtn.querySelector('.btn-icon');
  
  // Show/hide nav items based on authentication
  DOM.navItems.forEach(item => {
    if (item.dataset.tab === 'data-entry') {
      item.style.display = 'flex';
    } else {
      item.style.display = state.isAuthenticated ? 'flex' : 'none';
    }
  });

  if (state.isAuthenticated) {
    DOM.authBtn.className = 'btn btn-secondary';
    DOM.authBtnText.textContent = 'Admin Logout';
    if (authBtnIcon) authBtnIcon.textContent = '🔓';
    DOM.sessionStatusDisplay.className = 'status-logged-in';
    DOM.sessionStatusDisplay.textContent = 'Admin Mode';
    DOM.creatorAdminWarning.className = 'alert-box alert-warning hidden';
    DOM.saveSchemaBtn.removeAttribute('disabled');
    DOM.submitCredentialsBtn.removeAttribute('disabled');
    if (DOM.clearDatabaseBtn) DOM.clearDatabaseBtn.removeAttribute('disabled');
    if (DOM.cloudBackupBtn) DOM.cloudBackupBtn.removeAttribute('disabled');
  } else {
    DOM.authBtn.className = 'btn btn-secondary';
    DOM.authBtnText.textContent = 'Admin Login';
    if (authBtnIcon) authBtnIcon.textContent = '🔒';
    DOM.sessionStatusDisplay.className = 'status-logged-out';
    DOM.sessionStatusDisplay.textContent = 'Guest Mode';
    DOM.creatorAdminWarning.className = 'alert-box alert-warning';
    DOM.saveSchemaBtn.setAttribute('disabled', 'true');
    DOM.submitCredentialsBtn.setAttribute('disabled', 'true');
    if (DOM.clearDatabaseBtn) DOM.clearDatabaseBtn.setAttribute('disabled', 'true');
    if (DOM.cloudBackupBtn) DOM.cloudBackupBtn.setAttribute('disabled', 'true');
    if (DOM.cloudBackupDownloadLink) DOM.cloudBackupDownloadLink.classList.add('hidden');
    
    // Fallback if the user logs out from a restricted tab
    if (state.activeTab !== 'data-entry') {
      switchToTab('data-entry');
    }
  }
}

// -------------------------------------------------------------
// API CALLS (SCHEMA & DATA)
// -------------------------------------------------------------

async function fetchSchema() {
  try {
    const response = await fetch('/api/schema');
    if (response.ok) {
      const schema = await response.json();
      state.schema = schema;
      // Cache schema in localStorage for offline drafting
      localStorage.setItem('cached_schema', JSON.stringify(schema));
    }
  } catch (err) {
    console.warn('Could not fetch schema from LAN. Falling back to cached schema.');
    const cached = localStorage.getItem('cached_schema');
    if (cached) {
      state.schema = JSON.parse(cached);
    } else {
      // Fallback default schema if offline and no cache
      state.schema = [
        { id: 'date', title: 'Date', type: 'date' },
        { id: 'item_name', title: 'Item Name', type: 'text' },
        { id: 'quantity', title: 'Quantity', type: 'number' },
        { id: 'remarks', title: 'Remarks', type: 'text' }
      ];
    }
  }
  
  // Synchronize dynamic schemas inside Form Creator
  state.formCreatorSchema = JSON.parse(JSON.stringify(state.schema));
}

async function saveSchema() {
  if (!state.isOnline || !state.isAuthenticated) return;
  
  try {
    const response = await fetch('/api/schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify(state.formCreatorSchema)
    });

    if (response.ok) {
      alert('Form schema saved successfully to server SQLite!');
      await fetchSchema();
      renderDataEntryForm();
      renderDraftsTable();
    } else {
      const err = await response.json();
      alert('Error saving schema: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to connect to LAN server to save schema.');
  }
}

async function fetchDatabaseRecords() {
  if (!state.isOnline) return;

  try {
    const response = await fetch('/api/entries');
    if (response.ok) {
      state.dbRecords = await response.json();
      renderDBTable();
      populateYearFilters();

      // Update serial numbers on data entry form once records are loaded
      const dateInput = document.getElementById('input-date');
      if (dateInput) {
        autoFillDateDependentFields(dateInput.value);
      }

      // Update analytics dashboard if currently active
      if (state.activeTab === 'data-analysis') {
        initAnalyticsUI();
        renderAnalytics();
      }
    }
  } catch (err) {
    console.error('Error fetching entries', err);
  }
}

// -------------------------------------------------------------
// TAB 1: DATA ENTRY RENDERER & ACTIONS
// -------------------------------------------------------------

function renderDataEntryForm() {
  DOM.dynamicInputs.innerHTML = '';
  
  if (state.schema.length === 0) {
    DOM.dynamicInputs.innerHTML = '<div class="loading-placeholder">No fields configured. Go to Form Creator.</div>';
    return;
  }

  state.schema.forEach(field => {
    const isHiddenField = field.id === 'annual_serial' || field.id === 'monthly_sl_no';
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    if (isHiddenField) {
      formGroup.style.display = 'none';
    }
    
    const label = document.createElement('label');
    label.setAttribute('for', `input-${field.id}`);
    label.textContent = getFieldDisplayTitle(field);
    
    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-select';
      input.id = `input-${field.id}`;
      input.name = field.id;
      // If we support options in future, add them. Otherwise default options:
      const opts = field.options || ['Option 1', 'Option 2'];
      opts.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    } else if (field.type === 'time' && field.timeFormat === '12h') {
      // Create hidden input for values
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.id = `input-${field.id}`;
      hiddenInput.name = field.id;
      formGroup.appendChild(hiddenInput);

      // Render 12h time picker select inputs
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'time-12h-wrapper';
      selectWrapper.style.display = 'flex';
      selectWrapper.style.gap = '6px';

      const selHour = document.createElement('select');
      selHour.id = `select-h-${field.id}`;
      selHour.className = 'form-select';
      selHour.style.padding = '8px';
      selHour.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const val = (i + 1).toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
      }).join('');
      selHour.value = '12';

      const selMin = document.createElement('select');
      selMin.id = `select-m-${field.id}`;
      selMin.className = 'form-select';
      selMin.style.padding = '8px';
      selMin.innerHTML = Array.from({ length: 60 }, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
      }).join('');
      selMin.value = '00';

      const selAmpm = document.createElement('select');
      selAmpm.id = `select-a-${field.id}`;
      selAmpm.className = 'form-select';
      selAmpm.style.padding = '8px';
      selAmpm.innerHTML = '<option value="AM">AM</option><option value="PM">PM</option>';
      selAmpm.value = 'AM';

      selectWrapper.appendChild(selHour);
      selectWrapper.appendChild(selMin);
      selectWrapper.appendChild(selAmpm);

      const updateHiddenVal = () => {
        hiddenInput.value = `${selHour.value}:${selMin.value} ${selAmpm.value}`;
      };

      selHour.addEventListener('change', updateHiddenVal);
      selMin.addEventListener('change', updateHiddenVal);
      selAmpm.addEventListener('change', updateHiddenVal);
      updateHiddenVal(); // Set initial default

      input = selectWrapper;
    } else {
      input = document.createElement('input');
      input.className = 'form-control';
      if (isHiddenField) {
        input.type = 'hidden';
      } else {
        input.type = field.type || 'text';
      }
      
      // Auto pre-fill date input with today
      if (field.type === 'date') {
        input.value = new Date().toISOString().split('T')[0];
        
        input.addEventListener('change', () => {
          autoFillDateDependentFields(input.value);
        });
        input.addEventListener('input', () => {
          autoFillDateDependentFields(input.value);
        });
      }
      
      input.id = `input-${field.id}`;
      input.name = field.id;
      input.required = (field.id === 'date'); // Require Date at least
    }
    
    formGroup.appendChild(label);
    
    // Add voice recognition capability to selected text and number fields
    if (field.voiceEnabled === true && field.type !== 'date' && field.type !== 'time' && field.type !== 'select') {
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'input-with-accessory';

      const micBtn = document.createElement('button');
      micBtn.type = 'button';
      micBtn.className = 'mic-btn';
      micBtn.innerHTML = '🎤';
      micBtn.title = 'Speak value (Offline Voice Entry)';
      micBtn.setAttribute('aria-label', `Voice input for ${getFieldDisplayTitle(field)}`);
      
      micBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSpeechListening(input.id, micBtn);
      });

      inputWrapper.appendChild(input);
      inputWrapper.appendChild(micBtn);
      formGroup.appendChild(inputWrapper);
    } else {
      formGroup.appendChild(input);
    }
    
    DOM.dynamicInputs.appendChild(formGroup);
  });

  // Auto-fill dependent fields (Month and Serials) on initial render
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    autoFillDateDependentFields(dateInput.value);
  }
}

// Helper to auto-generate Month Name, Annual Serial, and Monthly Serial based on date selection
function autoFillDateDependentFields(dateVal) {
  if (!dateVal) return;

  const parts = dateVal.split('-');
  if (parts.length !== 3) return;
  const yearStr = parts[0];
  const monthStr = parts[1]; // "01"-"12"

  // 1. Month Name
  const monthField = state.schema.find(f => f.id === 'month' || f.title.toLowerCase() === 'month' || f.title.toLowerCase() === 'month name');
  if (monthField) {
    try {
      const dateObj = new Date(dateVal + 'T00:00:00');
      const monthName = dateObj.toLocaleString('default', { month: 'long' });
      const monthInput = document.getElementById(`input-${monthField.id}`);
      if (monthInput) {
        monthInput.value = monthName;
        monthInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (e) {
      console.error('Error parsing date for month name:', e);
    }
  }

  // Combine database records and drafts to find all records
  const allRecords = [];
  state.dbRecords.forEach(rec => {
    allRecords.push({
      date: rec.date,
      data: rec.data
    });
  });
  state.drafts.forEach(draft => {
    allRecords.push({
      date: draft.date,
      data: draft.data
    });
  });

  // 2. Annual Serial
  const annualField = state.schema.find(f => f.id === 'annual_serial' || f.title.toLowerCase().includes('annual'));
  if (annualField) {
    let maxVal = 0;
    allRecords.forEach(rec => {
      if (rec.date && rec.date.startsWith(yearStr)) {
        const val = parseInt(rec.data[annualField.id]);
        if (!isNaN(val) && val > maxVal) {
          maxVal = val;
        }
      }
    });
    const annualInput = document.getElementById(`input-${annualField.id}`);
    if (annualInput) {
      annualInput.value = maxVal + 1;
      annualInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // 3. Monthly Serial
  const monthlyField = state.schema.find(f => f.id === 'monthly_sl_no' || f.title.toLowerCase().includes('monthly'));
  if (monthlyField) {
    let maxVal = 0;
    const yearMonthStr = `${yearStr}-${monthStr}`;
    allRecords.forEach(rec => {
      if (rec.date && rec.date.startsWith(yearMonthStr)) {
        const val = parseInt(rec.data[monthlyField.id]);
        if (!isNaN(val) && val > maxVal) {
          maxVal = val;
        }
      }
    });
    const monthlyInput = document.getElementById(`input-${monthlyField.id}`);
    if (monthlyInput) {
      monthlyInput.value = maxVal + 1;
      monthlyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

function handleSaveDraft(e) {
  e.preventDefault();
  
  const formData = {};
  let targetDate = new Date().toISOString().split('T')[0];

  state.schema.forEach(field => {
    const input = document.getElementById(`input-${field.id}`);
    if (input) {
      formData[field.id] = input.value;
      if (field.id === 'date' && input.value) {
        targetDate = input.value;
      }
    }
  });

  const draftEntry = {
    localId: Date.now(),
    date: targetDate,
    verified: false,
    data: formData
  };

  state.drafts.push(draftEntry);
  saveDraftsToStorage();
  
  // Transition animation: slide current row out and flash success
  DOM.dynamicInputs.style.transform = 'translateX(50px)';
  DOM.dynamicInputs.style.opacity = '0';
  
  setTimeout(() => {
    // Reset fields except date
    clearEntryFields();
    
    // Clear and slide back in
    DOM.dynamicInputs.style.transform = 'translateX(0)';
    DOM.dynamicInputs.style.opacity = '1';
    
    // Refresh tables
    renderDraftsTable();
    renderSyncTable();
  }, 200);
}

function renderDraftsTable() {
  // Clear headers & body
  DOM.draftsTableHeader.innerHTML = '';
  DOM.draftsTableBody.innerHTML = '';

  if (state.schema.length === 0) return;

  // Add Headers dynamically following schema ordering
  state.schema.forEach(field => {
    const th = document.createElement('th');
    th.textContent = getFieldDisplayTitle(field);
    DOM.draftsTableHeader.appendChild(th);
  });

  // Check empty drafts
  if (state.drafts.length === 0) {
    DOM.draftSummaryText.textContent = 'No draft entries';
    DOM.draftsTableBody.innerHTML = `
      <tr>
        <td colspan="100%" class="text-center text-muted py-4">No drafts saved yet. Enter a row above to save a draft.</td>
      </tr>
    `;
    return;
  }

  DOM.draftSummaryText.textContent = `${state.drafts.length} draft entries saved locally`;

  // Add Rows (show last 5 drafts on data entry tab for overview)
  const previewDrafts = [...state.drafts].reverse().slice(0, 5);
  
  previewDrafts.forEach(draft => {
    const tr = document.createElement('tr');
    
    state.schema.forEach(field => {
      const td = document.createElement('td');
      if (field.id === 'date') {
        td.textContent = formatDateDisplay(draft.date);
      } else {
        td.textContent = formatDisplayValue(draft.data[field.id], field);
      }
      tr.appendChild(td);
    });

    DOM.draftsTableBody.appendChild(tr);
  });
}

// -------------------------------------------------------------
// TAB 2: FORM CREATOR
// -------------------------------------------------------------

function renderFormCreator() {
  DOM.fieldsListBody.innerHTML = '';

  state.formCreatorSchema.forEach((field, index) => {
    const tr = document.createElement('tr');

    // Pos badge
    const posTd = document.createElement('td');
    posTd.innerHTML = `<span class="position-badge">${index + 1}</span>`;
    tr.appendChild(posTd);

    // Field title input
    const titleTd = document.createElement('td');
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'form-control';
    titleInput.value = field.title;
    titleInput.disabled = (field.id === 'date'); // Lock date title
    titleInput.addEventListener('input', (e) => {
      state.formCreatorSchema[index].title = e.target.value;
    });
    titleTd.appendChild(titleInput);
    tr.appendChild(titleTd);

    // Field type selector
    const typeTd = document.createElement('td');
    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-select';
    typeSelect.disabled = (field.id === 'date'); // Lock date type
    
    const types = [
      { value: 'text', text: 'Plain Text' },
      { value: 'number', text: 'Number' },
      { value: 'date', text: 'Date' },
      { value: 'time', text: 'Time' },
      { value: 'select', text: 'Dropdown List' }
    ];
    
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value;
      opt.textContent = t.text;
      if (field.type === t.value) opt.selected = true;
      typeSelect.appendChild(opt);
    });

    typeSelect.addEventListener('change', (e) => {
      state.formCreatorSchema[index].type = e.target.value;
      // Initialize default options for select dropdown
      if (e.target.value === 'select' && !state.formCreatorSchema[index].options) {
        state.formCreatorSchema[index].options = ['Option 1', 'Option 2'];
      }
      renderFormCreator();
    });
    typeTd.appendChild(typeSelect);

    // 12-Hour format setting checkbox for Time fields (rendered below type select)
    if (field.type === 'time') {
      const formatWrapper = document.createElement('div');
      formatWrapper.className = 'mt-1';
      formatWrapper.style.display = 'flex';
      formatWrapper.style.alignItems = 'center';
      formatWrapper.style.gap = '6px';
      
      const formatCheckbox = document.createElement('input');
      formatCheckbox.type = 'checkbox';
      formatCheckbox.id = `time-format-${field.id}`;
      formatCheckbox.checked = field.timeFormat === '12h';
      formatCheckbox.addEventListener('change', (e) => {
        state.formCreatorSchema[index].timeFormat = e.target.checked ? '12h' : '24h';
      });
      
      const formatLabel = document.createElement('label');
      formatLabel.setAttribute('for', `time-format-${field.id}`);
      formatLabel.textContent = '12-hour AM/PM';
      formatLabel.style.fontSize = '0.75rem';
      formatLabel.style.color = 'var(--text-muted)';
      
      formatWrapper.appendChild(formatCheckbox);
      formatWrapper.appendChild(formatLabel);
      typeTd.appendChild(formatWrapper);
    }

    tr.appendChild(typeTd);

    // Dynamic Options Input for Dropdown List (rendered below Title input)
    if (field.type === 'select') {
      const optionsInput = document.createElement('input');
      optionsInput.type = 'text';
      optionsInput.className = 'form-control mt-1';
      optionsInput.placeholder = 'Options (comma-separated, e.g. Yes, No, N/A)';
      optionsInput.value = field.options ? field.options.join(', ') : '';
      optionsInput.addEventListener('input', (e) => {
        state.formCreatorSchema[index].options = e.target.value
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      });
      titleTd.appendChild(optionsInput);
    }

    // Voice typing toggle checkbox
    const voiceTd = document.createElement('td');
    const voiceCheckbox = document.createElement('input');
    voiceCheckbox.type = 'checkbox';
    voiceCheckbox.checked = !!field.voiceEnabled;
    voiceCheckbox.disabled = (field.id === 'date' || field.id === 'time');
    voiceCheckbox.addEventListener('change', (e) => {
      state.formCreatorSchema[index].voiceEnabled = e.target.checked;
    });
    voiceTd.appendChild(voiceCheckbox);
    tr.appendChild(voiceTd);

    // Actions
    const actionTd = document.createElement('td');
    actionTd.className = 'actions-col';

    const upBtn = document.createElement('button');
    upBtn.className = 'btn btn-link p-1';
    upBtn.textContent = '▲';
    upBtn.title = 'Move Up';
    upBtn.disabled = (index === 0);
    upBtn.style.marginRight = '4px';
    upBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const temp = state.formCreatorSchema[index];
      state.formCreatorSchema[index] = state.formCreatorSchema[index - 1];
      state.formCreatorSchema[index - 1] = temp;
      renderFormCreator();
    });
    actionTd.appendChild(upBtn);

    const downBtn = document.createElement('button');
    downBtn.className = 'btn btn-link p-1';
    downBtn.textContent = '▼';
    downBtn.title = 'Move Down';
    downBtn.disabled = (index === state.formCreatorSchema.length - 1);
    downBtn.style.marginRight = '8px';
    downBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const temp = state.formCreatorSchema[index];
      state.formCreatorSchema[index] = state.formCreatorSchema[index + 1];
      state.formCreatorSchema[index + 1] = temp;
      renderFormCreator();
    });
    actionTd.appendChild(downBtn);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-link text-warning p-1';
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.disabled = (field.id === 'date'); // Require date
    
    deleteBtn.addEventListener('click', () => {
      state.formCreatorSchema.splice(index, 1);
      renderFormCreator();
    });

    actionTd.appendChild(deleteBtn);
    tr.appendChild(actionTd);

    DOM.fieldsListBody.appendChild(tr);
  });
}

function addNewField() {
  const fieldId = `field_${Date.now()}`;
  state.formCreatorSchema.push({
    id: fieldId,
    title: 'New Column Label',
    type: 'text',
    voiceEnabled: false,
    options: []
  });
  renderFormCreator();
}

function resetFormCreator() {
  if (confirm('Are you sure you want to revert modifications?')) {
    state.formCreatorSchema = JSON.parse(JSON.stringify(state.schema));
    renderFormCreator();
  }
}

// -------------------------------------------------------------
// TAB 3: VERIFY & PUSH SYSTEM
// -------------------------------------------------------------

function renderSyncTable() {
  DOM.syncTableHeader.innerHTML = '';
  DOM.syncTableBody.innerHTML = '';

  if (state.schema.length === 0) return;

  // Render headers
  const selectTh = document.createElement('th');
  selectTh.width = '40';
  selectTh.appendChild(DOM.headerSelectAll);
  DOM.syncTableHeader.appendChild(selectTh);

  state.schema.forEach(field => {
    const th = document.createElement('th');
    th.textContent = getFieldDisplayTitle(field);
    DOM.syncTableHeader.appendChild(th);
  });

  const actionsTh = document.createElement('th');
  actionsTh.className = 'actions-col';
  actionsTh.textContent = 'Actions';
  DOM.syncTableHeader.appendChild(actionsTh);

  // Render rows
  if (state.drafts.length === 0) {
    DOM.syncTableBody.innerHTML = `
      <tr>
        <td colspan="100%" class="text-center text-muted py-4">No local drafts to push. Use the Data Entry view to add records.</td>
      </tr>
    `;
    updatePushSelectedBtnState();
    return;
  }

  state.drafts.forEach((draft, index) => {
    const tr = document.createElement('tr');
    tr.dataset.localId = draft.localId;

    // Checkbox selector
    const checkTd = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'draft-selector';
    checkbox.checked = draft.verified; // Default verify means ready to push
    checkbox.addEventListener('change', (e) => {
      state.drafts[index].verified = e.target.checked;
      saveDraftsToStorage();
      updatePushSelectedBtnState();
    });
    checkTd.appendChild(checkbox);
    tr.appendChild(checkTd);

    // Fields dynamically following schema ordering
    state.schema.forEach(field => {
      const td = document.createElement('td');
      if (field.id === 'date') {
        td.textContent = formatDateDisplay(draft.date);
      } else {
        td.textContent = formatDisplayValue(draft.data[field.id], field);
      }
      tr.appendChild(td);
    });

    // Action col (Edit and Reject draft)
    const actionTd = document.createElement('td');
    actionTd.className = 'actions-col';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-link p-0';
    editBtn.style.marginRight = '8px';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openEditModal(draft, index, true));
    actionTd.appendChild(editBtn);
    
    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'btn btn-link text-danger p-0';
    rejectBtn.style.color = 'var(--danger)';
    rejectBtn.innerHTML = 'Reject';
    rejectBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reject and delete this draft entry?')) {
        state.drafts.splice(index, 1);
        saveDraftsToStorage();
        renderSyncTable();
        renderDraftsTable();
        
        // Recalculate auto-generated serials
        const dateInput = document.getElementById('input-date');
        if (dateInput) {
          autoFillDateDependentFields(dateInput.value);
        }
      }
    });
    actionTd.appendChild(rejectBtn);
    tr.appendChild(actionTd);

    DOM.syncTableBody.appendChild(tr);
  });

  updatePushSelectedBtnState();
}

function updatePushSelectedBtnState() {
  const verifiedCount = state.drafts.filter(d => d.verified).length;
  DOM.pushCountText.textContent = verifiedCount;
  
  if (state.isOnline && verifiedCount > 0) {
    DOM.pushSelectedBtn.removeAttribute('disabled');
  } else {
    DOM.pushSelectedBtn.setAttribute('disabled', 'true');
  }

  // Reject selected button
  if (DOM.rejectSelectedBtn && DOM.rejectCountText) {
    DOM.rejectCountText.textContent = verifiedCount;
    if (verifiedCount > 0) {
      DOM.rejectSelectedBtn.removeAttribute('disabled');
    } else {
      DOM.rejectSelectedBtn.setAttribute('disabled', 'true');
    }
  }
}

function rejectSelectedDrafts() {
  const toReject = state.drafts.filter(d => d.verified);
  if (toReject.length === 0) return;

  if (!confirm(`Are you sure you want to reject and delete the ${toReject.length} selected draft entry/entries?`)) {
    return;
  }

  // Keep only the drafts that are NOT verified (not selected to push/reject)
  state.drafts = state.drafts.filter(d => !d.verified);
  saveDraftsToStorage();
  
  // Refresh views
  renderSyncTable();
  renderDraftsTable();
  
  // Recalculate auto-generated serials
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    autoFillDateDependentFields(dateInput.value);
  }

  alert('Selected drafts rejected and deleted.');
}

function selectAllDrafts(val) {
  state.drafts.forEach(d => d.verified = val);
  saveDraftsToStorage();
  
  // Update checkbox UI elements
  document.querySelectorAll('.draft-selector').forEach(cb => cb.checked = val);
  DOM.headerSelectAll.checked = val;
  updatePushSelectedBtnState();
}

async function pushSelectedDrafts() {
  if (!state.isOnline) {
    alert('You are currently offline. Please reconnect to the LAN server to push.');
    return;
  }
  
  if (!state.isAuthenticated) {
    openLoginModal();
    return;
  }

  const toPush = state.drafts.filter(d => d.verified);
  if (toPush.length === 0) return;

  try {
    DOM.pushSelectedBtn.disabled = true;
    DOM.pushSelectedBtn.textContent = 'Pushing...';
    
    const response = await fetch('/api/entries/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify(toPush)
    });

    if (response.ok) {
      const res = await response.json();
      alert(`Pushed ${res.count} records to SQLite successfully!`);
      
      // Filter out pushed drafts
      state.drafts = state.drafts.filter(d => !d.verified);
      saveDraftsToStorage();
      
      // Refresh views
      renderSyncTable();
      renderDraftsTable();
      fetchDatabaseRecords();
    } else {
      const err = await response.json();
      alert('Error pushing drafts: ' + (err.error || 'Server error'));
    }
  } catch (err) {
    alert('Failed to connect to LAN server during push.');
  } finally {
    DOM.pushSelectedBtn.textContent = `Push Selected (0) to Database`;
    updatePushSelectedBtnState();
  }
}

// -------------------------------------------------------------
// TAB 4: DATABASE REPORTS VIEWER
// -------------------------------------------------------------

function populateYearFilters() {
  const years = new Set();
  state.dbRecords.forEach(rec => {
    if (rec.date) {
      const yr = rec.date.split('-')[0];
      if (yr && yr.length === 4) years.add(yr);
    }
  });

  // Save current selected value
  const currentVal = DOM.filterYear.value;
  DOM.filterYear.innerHTML = '<option value="all">All Years</option>';
  
  Array.from(years).sort().reverse().forEach(yr => {
    const opt = document.createElement('option');
    opt.value = yr;
    opt.textContent = yr;
    DOM.filterYear.appendChild(opt);
  });

  DOM.filterYear.value = currentVal;
  if (!DOM.filterYear.value) DOM.filterYear.value = 'all';
}

function renderDBTable() {
  DOM.dbTableHeader.innerHTML = '';
  DOM.dbTableBody.innerHTML = '';

  if (state.schema.length === 0) return;

  // Headers
  const statusTh = document.createElement('th');
  statusTh.textContent = 'Status';
  DOM.dbTableHeader.appendChild(statusTh);

  state.schema.forEach(field => {
    const th = document.createElement('th');
    th.textContent = getFieldDisplayTitle(field);
    DOM.dbTableHeader.appendChild(th);
  });

  const actionsTh = document.createElement('th');
  actionsTh.className = 'actions-col';
  actionsTh.textContent = 'Actions';
  DOM.dbTableHeader.appendChild(actionsTh);

  // Filters
  const selectedMonth = DOM.filterMonth.value; // 'all' or '01'-'12'
  const selectedYear = DOM.filterYear.value;   // 'all' or '2026'

  let filteredRecords = state.dbRecords.filter(rec => {
    if (!rec.date) return false;
    const [yr, mo] = rec.date.split('-');
    
    const matchMonth = (selectedMonth === 'all' || mo === selectedMonth);
    const matchYear = (selectedYear === 'all' || yr === selectedYear);
    return matchMonth && matchYear;
  });

  // Sort by Year of the date first to keep years separated, then by annual serial number based on user filter sort choice
  const sortOrder = DOM.filterSort ? DOM.filterSort.value : 'desc';
  filteredRecords.sort((a, b) => {
    const yearA = (a.date || '').split('-')[0] || '';
    const yearB = (b.date || '').split('-')[0] || '';
    if (yearA !== yearB) {
      return sortOrder === 'asc' ? yearA.localeCompare(yearB) : yearB.localeCompare(yearA);
    }

    const serialA = parseInt(a.data.annual_serial) || 0;
    const serialB = parseInt(b.data.annual_serial) || 0;
    if (serialA !== serialB) {
      return sortOrder === 'asc' ? serialA - serialB : serialB - serialA;
    }
    return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
  });

  // Update Summary cards — counts reflect only the filtered database records
  const total = filteredRecords.length;
  const verified = filteredRecords.filter(r => r.verified === 1).length;
  const unverified = total - verified;

  DOM.summaryTotal.textContent = total;
  DOM.summaryVerified.textContent = verified;
  DOM.summaryUnverified.textContent = unverified;

  // Run duplicate entries detection
  const duplicateIds = checkDuplicates(filteredRecords);
  if (duplicateIds.size > 0) {
    if (DOM.dbDuplicateAlert) DOM.dbDuplicateAlert.classList.remove('hidden');
  } else {
    if (DOM.dbDuplicateAlert) DOM.dbDuplicateAlert.classList.add('hidden');
  }

  if (filteredRecords.length === 0) {
    DOM.dbTableBody.innerHTML = `
      <tr>
        <td colspan="100%" class="text-center text-muted py-4">No records found matching filters.</td>
      </tr>
    `;
    return;
  }

  filteredRecords.forEach(rec => {
    const tr = document.createElement('tr');
    const isDuplicate = duplicateIds.has(rec.id);
    if (isDuplicate) {
      tr.style.backgroundColor = 'rgba(218, 54, 55, 0.08)';
      tr.style.borderLeft = '4px solid var(--danger)';
    }

    // Status Badge
    const statusTd = document.createElement('td');
    const badge = document.createElement('span');
    if (rec.verified === 1) {
      badge.className = 'badge online';
      badge.innerHTML = '✔ Verified';
    } else {
      badge.className = 'badge offline';
      badge.innerHTML = '⏳ Unverified';
    }
    statusTd.appendChild(badge);

    if (isDuplicate) {
      const dupBadge = document.createElement('span');
      dupBadge.className = 'badge offline';
      dupBadge.style.color = 'var(--danger)';
      dupBadge.style.borderColor = 'rgba(218, 54, 55, 0.4)';
      dupBadge.style.backgroundColor = 'rgba(218, 54, 55, 0.1)';
      dupBadge.style.marginLeft = '8px';
      dupBadge.innerHTML = '⚠️ Duplicate';
      statusTd.appendChild(dupBadge);
    }
    tr.appendChild(statusTd);

    // Fields values dynamically following schema ordering
    state.schema.forEach(field => {
      const td = document.createElement('td');
      if (field.id === 'date') {
        td.textContent = formatDateDisplay(rec.date);
      } else {
        td.textContent = formatDisplayValue(rec.data[field.id], field);
      }
      tr.appendChild(td);
    });

    // Actions (Verify toggle, Edit, delete)
    const actionTd = document.createElement('td');
    actionTd.className = 'actions-col';
    
    // Verify btn
    const verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-link p-0 mr-2';
    verifyBtn.style.marginRight = '8px';
    verifyBtn.textContent = rec.verified === 1 ? 'Unverify' : 'Verify';
    verifyBtn.disabled = !state.isAuthenticated || !state.isOnline;
    verifyBtn.addEventListener('click', () => toggleVerifyRecord(rec.id, rec.verified !== 1));
    actionTd.appendChild(verifyBtn);

    // Edit btn
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-link p-0 mr-2';
    editBtn.style.marginRight = '8px';
    editBtn.textContent = 'Edit';
    editBtn.disabled = !state.isAuthenticated || !state.isOnline;
    editBtn.addEventListener('click', () => openEditModal(rec, null, false));
    actionTd.appendChild(editBtn);

    // Delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-link text-warning p-0';
    deleteBtn.textContent = 'Delete';
    deleteBtn.disabled = !state.isAuthenticated || !state.isOnline;
    deleteBtn.addEventListener('click', () => deleteRecord(rec.id));
    actionTd.appendChild(deleteBtn);

    tr.appendChild(actionTd);

    DOM.dbTableBody.appendChild(tr);
  });
}

async function toggleVerifyRecord(id, newStatus) {
  if (!state.isOnline || !state.isAuthenticated) return;

  // Revert for verification flow (when unverifying a verified record)
  if (newStatus === false) {
    const record = state.dbRecords.find(r => r.id === id);
    if (record) {
      if (!confirm('Are you sure you want to unverify this record? It will be deleted from the database and reverted back to local drafts for correction/verification.')) {
        return;
      }
      
      try {
        // 1. Add back to local drafts
        const revertedDraft = {
          localId: Date.now(),
          date: record.date,
          verified: false,
          data: { ...record.data }
        };
        state.drafts.push(revertedDraft);
        saveDraftsToStorage();
        
        // 2. Call delete API to remove from DB
        const response = await fetch(`/api/entries/delete/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.authToken}`
          }
        });
        
        if (response.ok) {
          alert('Record reverted to local drafts successfully!');
          fetchDatabaseRecords();
          renderDraftsTable();
          renderSyncTable();
          // Switch to Verify & Push tab
          switchToTab('sync-console');
        } else {
          alert('Error reverting record: Failed to delete from server database.');
        }
      } catch (err) {
        alert('Connection failed while reverting record.');
      }
      return;
    }
  }

  try {
    const response = await fetch(`/api/entries/verify/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ verified: newStatus })
    });

    if (response.ok) {
      fetchDatabaseRecords();
    } else {
      alert('Error updating status');
    }
  } catch (err) {
    alert('Connection failed');
  }
}

async function deleteRecord(id) {
  if (!state.isOnline || !state.isAuthenticated) return;
  if (!confirm('Are you sure you want to permanently delete record #' + id + '?')) return;

  try {
    const response = await fetch(`/api/entries/delete/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.authToken}`
      }
    });

    if (response.ok) {
      fetchDatabaseRecords();
    } else {
      alert('Error deleting entry');
    }
  } catch (err) {
    alert('Connection failed');
  }
}

async function handleClearDrafts() {
  if (state.drafts.length === 0) {
    alert('There are no local drafts to clear.');
    return;
  }

  if (!confirm('Are you sure you want to permanently clear ALL local drafts stored on this device? This action is irreversible.')) {
    return;
  }

  // Check 2FA if online
  let code = '';
  if (state.isOnline && state.isAuthenticated) {
    try {
      const statusRes = await fetch('/api/settings/totp/status', {
        headers: { 'Authorization': `Bearer ${state.authToken}` }
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.enabled) {
          code = prompt('Enter 6-digit 2FA Authenticator Code to confirm clearing local drafts:');
          if (code === null) return;
          if (!code.trim()) {
            alert('2FA Code is required.');
            return;
          }
          
          // Verify code via API
          const verifyRes = await fetch('/api/settings/totp/verify-action', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.authToken}`
            },
            body: JSON.stringify({ code })
          });
          if (!verifyRes.ok) {
            const err = await verifyRes.json();
            alert('Verification failed: ' + (err.error || 'Invalid code'));
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to verify 2FA for drafts clearing:', err);
    }
  }

  state.drafts = [];
  saveDraftsToStorage();
  
  // Re-render related tables/views
  renderDraftsTable();
  renderSyncTable();
  
  // Recalculate auto-generated serials
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    autoFillDateDependentFields(dateInput.value);
  }

  alert('Local drafts cleared successfully.');
}

async function handleClearDatabase() {
  if (!state.isOnline) {
    alert('Offline: Reconnect to the LAN host to clear database records.');
    return;
  }
  
  if (!state.isAuthenticated) {
    openLoginModal();
    return;
  }

  if (!confirm('Are you sure you want to permanently clear ALL records from the central SQLite database? This action is irreversible.')) {
    return;
  }

  if (!confirm('FINAL WARNING: This will completely wipe all database records from Postgres and reset sequence. Are you absolutely certain?')) {
    return;
  }

  // Check 2FA
  let code = '';
  try {
    const statusRes = await fetch('/api/settings/totp/status', {
      headers: { 'Authorization': `Bearer ${state.authToken}` }
    });
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.enabled) {
        code = prompt('Enter 6-digit 2FA Authenticator Code to confirm wiping the database:');
        if (code === null) return;
        if (!code.trim()) {
          alert('2FA Code is required.');
          return;
        }
      }
    }
  } catch (err) {
    console.warn('Failed to verify 2FA for database wipe:', err);
  }

  try {
    DOM.clearDatabaseBtn.disabled = true;
    DOM.clearDatabaseBtn.textContent = 'Clearing...';

    const response = await fetch('/api/entries/clear-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ code })
    });

    if (response.ok) {
      alert('All database records cleared successfully!');
      state.dbRecords = [];
      renderDBTable();
      populateYearFilters();
      
      // Recalculate auto-generated serials
      const dateInput = document.getElementById('input-date');
      if (dateInput) {
        autoFillDateDependentFields(dateInput.value);
      }
    } else {
      const err = await response.json();
      alert('Error clearing database: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Network error. Failed to clear database.');
  } finally {
    DOM.clearDatabaseBtn.disabled = false;
    DOM.clearDatabaseBtn.textContent = 'Clear SQLite Database';
    updateAuthUI(); // Keep synced with auth state
  }
}

async function handleCloudBackup() {
  if (!state.isOnline || !state.isAuthenticated) return;

  try {
    DOM.cloudBackupBtn.disabled = true;
    DOM.cloudBackupBtn.querySelector('span').textContent = 'Generating Backup...';
    DOM.cloudBackupDownloadLink.classList.add('hidden');

    const response = await fetch('/api/backup/export', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.authToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        DOM.cloudBackupDownloadLink.href = data.url;
        DOM.cloudBackupDownloadLink.classList.remove('hidden');
        alert('Cloud backup generated successfully!');
      } else {
        alert('Backup failed: ' + (data.error || 'Unknown response'));
      }
    } else {
      const err = await response.json();
      alert('Backup failed: ' + (err.error || 'Server error'));
    }
  } catch (err) {
    alert('Connection failed while generating cloud backup.');
  } finally {
    DOM.cloudBackupBtn.disabled = false;
    DOM.cloudBackupBtn.querySelector('span').textContent = 'Generate Cloud Backup';
  }
}

// Helper to reset and clear all data entry fields
function clearEntryFields() {
  state.schema.forEach(field => {
    if (field.type === 'date') return;
    
    const input = document.getElementById(`input-${field.id}`);
    if (input) input.value = '';
    
    if (field.type === 'time' && field.timeFormat === '12h') {
      const hSel = document.getElementById(`select-h-${field.id}`);
      const mSel = document.getElementById(`select-m-${field.id}`);
      const aSel = document.getElementById(`select-a-${field.id}`);
      if (hSel && mSel && aSel) {
        hSel.value = '12';
        mSel.value = '00';
        aSel.value = 'AM';
        // Update the hidden input
        const hiddenInput = document.querySelector(`input[id="input-${field.id}"]`);
        if (hiddenInput) hiddenInput.value = '12:00 AM';
      }
    }
  });

  // Re-fill dependent month and serial number fields
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    autoFillDateDependentFields(dateInput.value);
  }
}

// Helper to format yyyy-mm-dd to dd-mm-yyyy for display
function formatDateDisplay(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}-${mm}-${yyyy}`;
  }
  return dateStr;
}

// Helper to format displayed values (adds grams to weights, formats 12h time, etc.)
function formatDisplayValue(val, field) {
  if (val === undefined || val === null || val === '') return '-';
  
  // Format Date
  if (field.type === 'date') {
    return formatDateDisplay(val);
  }
  
  // Format 12h time
  if (field.type === 'time' && field.timeFormat === '12h') {
    const valStr = val.toString().trim().toUpperCase();
    if (valStr.includes('AM') || valStr.includes('PM')) {
      return val;
    }
    return convertExcelTime(val, true);
  }
  
  // Format Weight field suffix: only append if it is a pure number and not empty
  const isWeightField = field.id.toLowerCase().includes('weight') || field.title.toLowerCase().includes('weight');
  if (isWeightField) {
    const strVal = val.toString().trim();
    if (!isNaN(Number(strVal)) && strVal !== '') {
      return `${strVal} grams`;
    }
  }
  
  return val;
}

// Helper to programmatically switch tabs
function switchToTab(tabId) {
  const item = Array.from(DOM.navItems).find(nav => nav.dataset.tab === tabId);
  if (item) {
    DOM.navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    DOM.tabPanels.forEach(panel => panel.classList.remove('active'));
    const panel = document.getElementById(`tab-${tabId}`);
    if (panel) panel.classList.add('active');
    
    state.activeTab = tabId;
    
    if (tabId === 'form-creator') {
      renderFormCreator();
    } else if (tabId === 'sync-console') {
      renderSyncTable();
    } else if (tabId === 'db-viewer') {
      fetchDatabaseRecords();
    } else if (tabId === 'data-analysis') {
      initAnalyticsUI();
      if (state.isOnline) {
        fetchDatabaseRecords();
      } else {
        renderAnalytics();
      }
    } else if (tabId === 'settings') {
      fetchTotpStatus();
    }
  }
}

// -------------------------------------------------------------
// EVENT LISTENERS & NAVIGATION
// -------------------------------------------------------------

function setupEventListeners() {
  // Navigation Tabs switching
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchToTab(item.dataset.tab);
      closeMobileMenu();
    });
  });

  // Mobile Menu Navigation drawer
  DOM.menuToggle.addEventListener('click', () => {
    const isOpen = DOM.appSidebar.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  DOM.sidebarOverlay.addEventListener('click', closeMobileMenu);

  function openMobileMenu() {
    DOM.appSidebar.classList.add('active');
    DOM.sidebarOverlay.classList.add('active');
    document.body.classList.add('menu-active');
  }

  function closeMobileMenu() {
    DOM.appSidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
    document.body.classList.remove('menu-active');
  }

  // Data Entry Form Actions
  DOM.dataEntryForm.addEventListener('submit', handleSaveDraft);
  DOM.clearFieldsBtn.addEventListener('click', clearEntryFields);

  // Auth Button (login modal opener)
  DOM.authBtn.addEventListener('click', () => {
    if (state.isAuthenticated) {
      if (confirm('Are you sure you want to log out of Admin mode?')) {
        handleLogout();
      }
    } else {
      openLoginModal();
    }
  });

  // Auth modal actions
  DOM.closeModalBtn.addEventListener('click', closeLoginModal);
  DOM.cancelLoginBtn.addEventListener('click', closeLoginModal);
  DOM.authModal.addEventListener('click', (e) => {
    if (e.target === DOM.authModal) closeLoginModal();
  });
  DOM.loginForm.addEventListener('submit', handleLogin);

  // Form Creator Actions
  DOM.addFieldBtn.addEventListener('click', addNewField);
  DOM.resetCreatorBtn.addEventListener('click', resetFormCreator);
  DOM.saveSchemaBtn.addEventListener('click', saveSchema);
  if (DOM.changeCredentialsForm) DOM.changeCredentialsForm.addEventListener('submit', handleUpdateCredentials);


  // Theme Toggle
  if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Sync Table Actions
  DOM.headerSelectAll.addEventListener('change', (e) => {
    selectAllDrafts(e.target.checked);
  });
  DOM.selectAllDraftsBtn.addEventListener('click', () => selectAllDrafts(true));
  DOM.deselectAllDraftsBtn.addEventListener('click', () => selectAllDrafts(false));
  DOM.pushSelectedBtn.addEventListener('click', pushSelectedDrafts);
  safeAddListener(DOM.rejectSelectedBtn, 'click', rejectSelectedDrafts);

  // DB Viewer filters
  DOM.filterMonth.addEventListener('change', renderDBTable);
  DOM.filterYear.addEventListener('change', renderDBTable);
  if (DOM.filterSort) DOM.filterSort.addEventListener('change', renderDBTable);
  DOM.refreshDbBtn.addEventListener('click', fetchDatabaseRecords);

  // Print Preview Actions
  if (DOM.printPreviewBtn) DOM.printPreviewBtn.addEventListener('click', openPrintModal);
  if (DOM.closePrintModalBtn) DOM.closePrintModalBtn.addEventListener('click', closePrintModal);
  if (DOM.cancelPrintBtn) DOM.cancelPrintBtn.addEventListener('click', closePrintModal);
  if (DOM.verifyPrintBtn) DOM.verifyPrintBtn.addEventListener('click', handleVerifyAndPrint);
  if (DOM.printModal) {
    DOM.printModal.addEventListener('click', (e) => {
      if (e.target === DOM.printModal) closePrintModal();
    });
  }

  // Excel drag and drop listeners
  const dropZone = DOM.excelDropZone;
  if (dropZone) {
    safeAddListener(dropZone, 'dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    safeAddListener(dropZone, 'dragleave', () => {
      dropZone.classList.remove('dragover');
    });
    safeAddListener(dropZone, 'drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        DOM.excelImportFile.files = e.dataTransfer.files;
        handleExcelImport({ target: DOM.excelImportFile });
      }
    });
  }

  safeAddListener(DOM.excelImportFile, 'change', handleExcelImport);
  safeAddListener(DOM.confirmImportBtn, 'click', handleConfirmImport);
  safeAddListener(DOM.cancelImportBtn, 'click', () => {
    state.pendingImportDrafts = null;
    DOM.importMappingPreview.classList.add('hidden');
    DOM.excelImportFile.value = '';
    const p = DOM.excelDropZone ? DOM.excelDropZone.querySelector('p') : null;
    if (p) p.textContent = 'Drag and drop your spreadsheet here or click to select';
  });

  // Load headers listener in Form Creator
  safeAddListener(DOM.loadHeadersBtn, 'click', () => {
    DOM.headersExcelFile.click();
  });
  safeAddListener(DOM.headersExcelFile, 'change', handleLoadHeadersFromExcel);

  // 2FA Actions
  safeAddListener(DOM.confirmTotpBtn, 'click', confirmTotpSetup);
  safeAddListener(DOM.cancelTotpSetupBtn, 'click', cancelTotpSetup);

  // Danger Zone Actions
  safeAddListener(DOM.clearDraftsBtn, 'click', handleClearDrafts);
  safeAddListener(DOM.clearDatabaseBtn, 'click', handleClearDatabase);
  safeAddListener(DOM.cloudBackupBtn, 'click', handleCloudBackup);

  // Analytics Filter Triggers
  if (DOM.analysisTimeframe) {
    DOM.analysisTimeframe.addEventListener('change', () => {
      initAnalyticsUI();
      renderAnalytics();
    });
  }
  if (DOM.analysisYear) DOM.analysisYear.addEventListener('change', renderAnalytics);
  if (DOM.analysisMonth) DOM.analysisMonth.addEventListener('change', renderAnalytics);
  if (DOM.analysisFromDate) DOM.analysisFromDate.addEventListener('change', renderAnalytics);
  if (DOM.analysisToDate) DOM.analysisToDate.addEventListener('change', renderAnalytics);

  // Edit Modal Event Listeners
  if (DOM.closeEditModalBtn) DOM.closeEditModalBtn.addEventListener('click', closeEditModal);
  if (DOM.cancelEditBtn) DOM.cancelEditBtn.addEventListener('click', closeEditModal);
  if (DOM.editModal) {
    DOM.editModal.addEventListener('click', (e) => {
      if (e.target === DOM.editModal) closeEditModal();
    });
  }
  if (DOM.editForm) DOM.editForm.addEventListener('submit', handleEditSubmit);
}

// -------------------------------------------------------------
// DUPLICATE MATCHING & EDIT MODAL SYSTEM
// -------------------------------------------------------------

function checkDuplicates(records) {
  const duplicates = new Set();
  
  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const r1 = records[i];
      const r2 = records[j];
      
      const name1 = (r1.data.name || '').toString().trim().toLowerCase();
      const name2 = (r2.data.name || '').toString().trim().toLowerCase();
      
      const time1 = (r1.data.timeob || '').toString().trim().toLowerCase();
      const time2 = (r2.data.timeob || '').toString().trim().toLowerCase();

      const date1 = r1.date || '';
      const date2 = r2.date || '';

      if (date1 === date2 && name1 === name2 && name1 !== '') {
        const wo1 = (r1.data.wo || '').toString().trim().toLowerCase();
        const wo2 = (r2.data.wo || '').toString().trim().toLowerCase();
        
        const addr1 = (r1.data.address || '').toString().trim().toLowerCase();
        const addr2 = (r2.data.address || '').toString().trim().toLowerCase();

        const matchTime = (time1 === time2 && time1 !== '');
        const matchWo = (wo1 === wo2 && wo1 !== '');
        const matchAddr = (addr1 === addr2 && addr1 !== '');

        if (matchTime || matchWo || matchAddr) {
          duplicates.add(r1.id);
          duplicates.add(r2.id);
        }
      }
    }
  }
  return duplicates;
}

let editingItem = null;

function openEditModal(item, index, isDraft) {
  editingItem = { item, index, isDraft };
  DOM.editModalTitle.textContent = isDraft ? 'Edit Local Draft' : `Edit Record #${item.id}`;
  
  DOM.editInputsContainer.innerHTML = '';
  
  const dataValues = item.data || {};
  const dateValue = item.date || '';

  state.schema.forEach(field => {
    const isHiddenField = field.id === 'annual_serial' || field.id === 'monthly_sl_no';
    const isAuto = field.id === 'annual_serial' || field.id === 'monthly_sl_no' || field.id === 'month';

    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    if (isHiddenField) {
      formGroup.style.display = 'none';
    }
    
    const label = document.createElement('label');
    label.setAttribute('for', `edit-input-${field.id}`);
    label.textContent = getFieldDisplayTitle(field);
    formGroup.appendChild(label);

    const currentValue = field.id === 'date' ? dateValue : (dataValues[field.id] || '');

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-select';
      input.id = `edit-input-${field.id}`;
      input.name = field.id;
      const opts = field.options || [];
      opts.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
      input.value = currentValue;
    } else if (field.type === 'time' && field.timeFormat === '12h') {
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'time-12h-wrapper';
      selectWrapper.style.display = 'flex';
      selectWrapper.style.gap = '6px';

      const selHour = document.createElement('select');
      selHour.id = `edit-select-h-${field.id}`;
      selHour.className = 'form-select';
      selHour.style.padding = '8px';
      selHour.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const val = (i + 1).toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
      }).join('');

      const selMin = document.createElement('select');
      selMin.id = `edit-select-m-${field.id}`;
      selMin.className = 'form-select';
      selMin.style.padding = '8px';
      selMin.innerHTML = Array.from({ length: 60 }, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
      }).join('');

      const selAmpm = document.createElement('select');
      selAmpm.id = `edit-select-a-${field.id}`;
      selAmpm.className = 'form-select';
      selAmpm.style.padding = '8px';
      selAmpm.innerHTML = '<option value="AM">AM</option><option value="PM">PM</option>';

      selectWrapper.appendChild(selHour);
      selectWrapper.appendChild(selMin);
      selectWrapper.appendChild(selAmpm);

      let hVal = '12';
      let mVal = '00';
      let aVal = 'AM';
      if (currentValue) {
        const parts = currentValue.trim().match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
        if (parts) {
          hVal = parts[1];
          mVal = parts[2];
          aVal = parts[3].toUpperCase();
        }
      }
      selHour.value = hVal;
      selMin.value = mVal;
      selAmpm.value = aVal;

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.id = `edit-input-${field.id}`;
      hiddenInput.name = field.id;
      hiddenInput.value = currentValue || `${hVal}:${mVal} ${aVal}`;
      formGroup.appendChild(hiddenInput);

      const updateHiddenVal = () => {
        hiddenInput.value = `${selHour.value}:${selMin.value} ${selAmpm.value}`;
      };
      selHour.addEventListener('change', updateHiddenVal);
      selMin.addEventListener('change', updateHiddenVal);
      selAmpm.addEventListener('change', updateHiddenVal);

      input = selectWrapper;
    } else {
      input = document.createElement('input');
      input.className = 'form-control';
      if (isHiddenField) {
        input.type = 'hidden';
      } else {
        input.type = field.type || 'text';
      }
      input.id = `edit-input-${field.id}`;
      input.name = field.id;
      input.value = currentValue;
      input.required = (field.id === 'date');
    }

    if (isAuto) {
      input.setAttribute('readonly', 'true');
      input.style.opacity = '0.7';
    }

    formGroup.appendChild(input);
    DOM.editInputsContainer.appendChild(formGroup);
  });

  DOM.editModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  DOM.editModal.classList.remove('active');
  document.body.style.overflow = '';
  editingItem = null;
}

async function handleEditSubmit(e) {
  e.preventDefault();
  if (!editingItem) return;

  const { item, index, isDraft } = editingItem;
  
  const updatedData = {};
  let targetDate = new Date().toISOString().split('T')[0];

  state.schema.forEach(field => {
    const input = document.getElementById(`edit-input-${field.id}`);
    if (input) {
      updatedData[field.id] = input.value;
      if (field.id === 'date' && input.value) {
        targetDate = input.value;
      }
    }
  });

  if (isDraft) {
    state.drafts[index].date = targetDate;
    state.drafts[index].data = updatedData;
    saveDraftsToStorage();
    renderSyncTable();
    renderDraftsTable();
    
    const dateInput = document.getElementById('input-date');
    if (dateInput) {
      autoFillDateDependentFields(dateInput.value);
    }
    
    closeEditModal();
    alert('Local draft updated successfully.');
  } else {
    if (!state.isOnline) {
      alert('You are currently offline. Cannot edit database records.');
      return;
    }
    if (!state.isAuthenticated) {
      alert('Admin login required to edit records.');
      openLoginModal();
      return;
    }

    try {
      const submitBtn = DOM.editForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      const response = await fetch(`/api/entries/update/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken}`
        },
        body: JSON.stringify({
          date: targetDate,
          data: updatedData
        })
      });

      if (response.ok) {
        alert('Record updated successfully!');
        closeEditModal();
        fetchDatabaseRecords();
      } else {
        const err = await response.json();
        alert('Error updating record: ' + (err.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error updating record.');
    } finally {
      const submitBtn = DOM.editForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Changes';
    }
  }
}

// -------------------------------------------------------------
// OFFLINE VOICE RECOGNITION (WEB SPEECH API)
// -------------------------------------------------------------

let recognition = null;
let activeSpeechInput = null;
let activeSpeechButton = null;

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    if (activeSpeechButton) {
      activeSpeechButton.classList.add('listening');
      activeSpeechButton.innerHTML = '🛑'; // Click to stop
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (activeSpeechInput) {
      if (activeSpeechInput.type === 'number') {
        // Parse digits for number inputs
        const parsedNum = parseFloat(transcript.replace(/[^0-9.]/g, ''));
        activeSpeechInput.value = isNaN(parsedNum) ? '' : parsedNum;
      } else {
        // Trim trailing periods (Edge voice recognition helper)
        activeSpeechInput.value = transcript.replace(/\.+$/, '').trim();
      }
      // Trigger input event to simulate typing
      activeSpeechInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    
    let errorMsg = `Microphone error: "${event.error}".`;
    if (event.error === 'network') {
      errorMsg += '\n\nPossible Reasons:\n' +
                  '1. Internet Connection Required: Chrome\'s speech recognition requires active internet to contact Google servers. If this device is in an offline LAN or local-only network, voice typing is unavailable.\n' +
                  '2. Insecure / Self-Signed SSL context: Chrome blocks Web Speech API on self-signed LAN IP connections. You must bypass this by visiting chrome://flags/#unsafely-treat-insecure-origin-as-secure and adding "https://<HOST_IP>:3080" as a secure origin.';
    } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      errorMsg += '\n\nMicrophone access is blocked. Please check your browser settings or click the site settings icon to allow microphone permission.';
    } else {
      errorMsg += '\n\nPlease verify your microphone permissions or check network/internet connectivity.';
    }
    
    alert(errorMsg);
    stopListening();
  };

  recognition.onend = () => {
    stopListening();
  };
}

function toggleSpeechListening(inputId, buttonEl) {
  if (!recognition) {
    alert('Voice recognition is not supported on this browser. Use Chrome/Safari.');
    return;
  }

  const input = document.getElementById(inputId);
  if (!input) return;

  if (activeSpeechInput === input) {
    recognition.stop();
    stopListening();
    return;
  }

  if (activeSpeechInput) {
    recognition.stop();
  }

  activeSpeechInput = input;
  activeSpeechButton = buttonEl;

  try {
    recognition.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    stopListening();
  }
}

function stopListening() {
  if (activeSpeechButton) {
    activeSpeechButton.classList.remove('listening');
    activeSpeechButton.innerHTML = '🎤';
  }
  activeSpeechInput = null;
  activeSpeechButton = null;
}

// -------------------------------------------------------------
// THEME MANAGEMENT (DAY / NIGHT MODE)
// -------------------------------------------------------------

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-mode');
    if (DOM.themeToggleIcon) DOM.themeToggleIcon.textContent = '🌙';
  } else {
    document.body.classList.remove('light-mode');
    if (DOM.themeToggleIcon) DOM.themeToggleIcon.textContent = '☀';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  if (DOM.themeToggleIcon) {
    DOM.themeToggleIcon.textContent = isLight ? '🌙' : '☀';
  }
}

// -------------------------------------------------------------
// PRINT PREVIEW SYSTEM
// -------------------------------------------------------------

function openPrintModal() {
  const monthText = DOM.filterMonth.options[DOM.filterMonth.selectedIndex].text.toUpperCase();
  const yearText = DOM.filterYear.value === 'all' ? 'ALL YEARS' : DOM.filterYear.value;
  DOM.printPreviewHeaderText.textContent = `CHC TANGI OT DATA FOR THE MONTH ${monthText} ${yearText}`;

  DOM.printTableHeader.innerHTML = '';
  DOM.printTableBody.innerHTML = '';

  if (state.schema.length === 0) return;

  // Headers
  state.schema.forEach(field => {
    const th = document.createElement('th');
    th.textContent = getFieldDisplayTitle(field);
    DOM.printTableHeader.appendChild(th);
  });

  // Filtered records list
  const selectedMonth = DOM.filterMonth.value;
  const selectedYear = DOM.filterYear.value;

  let filteredRecords = state.dbRecords.filter(rec => {
    if (!rec.date) return false;
    const [yr, mo] = rec.date.split('-');
    const matchMonth = (selectedMonth === 'all' || mo === selectedMonth);
    const matchYear = (selectedYear === 'all' || yr === selectedYear);
    return matchMonth && matchYear;
  });

  // Sort chronological order matching filter toolbar choice
  const sortOrder = DOM.filterSort ? DOM.filterSort.value : 'desc';
  filteredRecords.sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    if (dateA !== dateB) {
      return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
    }
    return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
  });

  if (filteredRecords.length === 0) {
    DOM.printTableBody.innerHTML = `
      <tr>
        <td colspan="${state.schema.length}" class="text-center text-muted py-4">No records found matching current filters.</td>
      </tr>
    `;
  } else {
    filteredRecords.forEach(rec => {
      const tr = document.createElement('tr');
      state.schema.forEach(field => {
        const td = document.createElement('td');
        if (field.id === 'date') {
          td.textContent = formatDateDisplay(rec.date);
        } else {
          td.textContent = formatDisplayValue(rec.data[field.id], field);
        }
        tr.appendChild(td);
      });
      DOM.printTableBody.appendChild(tr);
    });
  }

  DOM.printModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePrintModal() {
  DOM.printModal.classList.remove('active');
  document.body.style.overflow = '';
}

async function handleVerifyAndPrint() {
  const selectedMonth = DOM.filterMonth.value;
  const selectedYear = DOM.filterYear.value;

  const filtered = state.dbRecords.filter(rec => {
    if (!rec.date) return false;
    const [yr, mo] = rec.date.split('-');
    const matchMonth = (selectedMonth === 'all' || mo === selectedMonth);
    const matchYear = (selectedYear === 'all' || yr === selectedYear);
    return matchMonth && matchYear;
  });

  const unverified = filtered.filter(rec => rec.verified === 0);

  if (unverified.length > 0) {
    if (!state.isAuthenticated) {
      alert('Login required to verify records before printing.');
      openLoginModal();
      return;
    }

    try {
      DOM.verifyPrintBtn.disabled = true;
      DOM.verifyPrintBtn.textContent = 'Verifying...';

      const promises = unverified.map(rec => {
        return fetch(`/api/entries/verify/${rec.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.authToken}`
          },
          body: JSON.stringify({ verified: true })
        });
      });

      await Promise.all(promises);
      await fetchDatabaseRecords();
      alert('All unverified records in the report have been verified!');
    } catch (err) {
      alert('Network error verifying entries. Reconnect to LAN server.');
      DOM.verifyPrintBtn.disabled = false;
      DOM.verifyPrintBtn.textContent = 'Verify and Print';
      return;
    } finally {
      DOM.verifyPrintBtn.disabled = false;
      DOM.verifyPrintBtn.textContent = 'Verify and Print';
    }
  }

  // Refresh print preview layout with updated verified records before firing dialog
  openPrintModal();
  setTimeout(() => {
    window.print();
  }, 300);
}

// -------------------------------------------------------------
// EXCEL & CSV SPREADSHEET IMPORTER
// -------------------------------------------------------------

// Helper to slugify header names to DB safe IDs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')           // Replace spaces with _
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Convert Excel serial number date to ISO string date
function convertExcelDate(serial) {
  try {
    // Excel serial date is timezone-naive.
    // Convert to UTC milliseconds to avoid any local timezone offsets.
    // Excel leap year bug: Excel incorrectly assumes 1900 was a leap year.
    // 25569 is the number of days between 1899-12-30 and 1970-01-01.
    const msPerDay = 86400000;
    const date = new Date(Math.round((serial - 25569) * msPerDay));
    const yyyy = date.getUTCFullYear();
    const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd = date.getUTCDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (err) {
    console.error('Error parsing Excel serial date', err);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

// Parse generic date string into ISO YYYY-MM-DD format timezone-safely
function parseDateString(val) {
  if (!val) return null;
  const str = val.toString().trim();
  
  // Try YYYY-MM-DD or YYYY/MM/DD
  const matchIso = str.match(/^(\d{4})[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12]\d|3[01])(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (matchIso) {
    const yyyy = matchIso[1];
    const mm = matchIso[2].padStart(2, '0');
    const dd = matchIso[3].padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Try DD-MM-YYYY or DD/MM/YYYY
  const matchDmY = str.match(/^(0?[1-9]|[12]\d|3[01])[-/](0?[1-9]|1[0-2])[-/](\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (matchDmY) {
    const dd = matchDmY[1].padStart(2, '0');
    const mm = matchDmY[2].padStart(2, '0');
    const yyyy = matchDmY[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  let testStr = str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(testStr)) {
    testStr = testStr.replace(/-/g, '/');
  }
  
  const parsedDate = new Date(testStr);
  if (!isNaN(parsedDate.getTime())) {
    const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/.test(str);
    const yyyy = hasTimezone ? parsedDate.getUTCFullYear() : parsedDate.getFullYear();
    const mm = ((hasTimezone ? parsedDate.getUTCMonth() : parsedDate.getMonth()) + 1).toString().padStart(2, '0');
    const dd = (hasTimezone ? parsedDate.getUTCDate() : parsedDate.getDate()).toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  return null;
}

// Convert Excel fractional serial time or generic string to HH:MM (or HH:MM AM/PM if format12h is true)
function convertExcelTime(val, format12h = false) {
  let hours = 0;
  let minutes = 0;
  
  if (typeof val === 'number') {
    const total_seconds = Math.round(val * 24 * 3600);
    hours = Math.floor(total_seconds / 3600);
    minutes = Math.floor((total_seconds % 3600) / 60);
  } else {
    const str = val.toString().trim();
    const match24 = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (match24) {
      hours = parseInt(match24[1]);
      minutes = parseInt(match24[2]);
    } else {
      const match12 = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/i);
      if (match12) {
        hours = parseInt(match12[1]);
        minutes = parseInt(match12[2]);
        const ampm = match12[4].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
      } else {
        return str; // Return as is if unparseable
      }
    }
  }
  
  if (format12h) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let h12 = hours % 12;
    if (h12 === 0) h12 = 12;
    return `${h12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

// Parse headers from chosen Excel/CSV spreadsheet inside Form Creator
function handleLoadHeadersFromExcel(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        alert('Empty worksheet. No columns found.');
        return;
      }
      
      const headers = jsonData[0];
      if (!headers || headers.length === 0) {
        alert('Could not find header columns in the first row.');
        return;
      }

      const fields = [];
      headers.forEach(header => {
        if (!header) return;
        const cleanHeader = header.toString().trim();
        const slug = slugify(cleanHeader);
        
        if (slug && slug !== 'date') {
          // Check uniqueness
          let uniqueSlug = slug;
          let counter = 1;
          while (fields.some(f => f.id === uniqueSlug) || uniqueSlug === 'date') {
            uniqueSlug = `${slug}_${counter}`;
            counter++;
          }
          fields.push({
            id: uniqueSlug,
            title: cleanHeader,
            type: 'text',
            voiceEnabled: false,
            options: []
          });
        }
      });

      // Always prepend Date field as index 0
      fields.unshift({
        id: 'date',
        title: 'Date',
        type: 'date',
        voiceEnabled: false
      });

      state.formCreatorSchema = fields;
      renderFormCreator();
      alert(`Loaded ${fields.length - 1} custom fields from spreadsheet headers! You can now adjust their types and save the schema.`);
    } catch (err) {
      console.error(err);
      alert('Error parsing spreadsheet file: ' + err.message);
    } finally {
      // Clear value so the same file can be loaded again
      e.target.value = '';
    }
  };
  reader.readAsArrayBuffer(file);
}

// Parse Excel / CSV rows into local drafts mapping to current schema fields
function handleExcelImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const dropZoneParagraph = DOM.excelDropZone ? DOM.excelDropZone.querySelector('p') : null;
  if (dropZoneParagraph) {
    dropZoneParagraph.textContent = `Selected file: ${file.name}`;
  }

  if (state.schema.length === 0) {
    alert('Please define and save a form schema in Form Creator first.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rowDataList = XLSX.utils.sheet_to_json(worksheet);

      if (rowDataList.length === 0) {
        alert('No data rows found in the selected spreadsheet.');
        return;
      }

      // Read sheet headers to inspect columns
      const sheetHeaders = Object.keys(rowDataList[0]);

      // Establish column to schema field mappings case-insensitively
      const mapping = {}; // field.id -> sheetHeader
      state.schema.forEach(field => {
        const matchedHeader = sheetHeaders.find(h => {
          const normH = h.toString().trim().toLowerCase();
          const normTitle = field.title.toString().trim().toLowerCase();
          const normId = field.id.toString().trim().toLowerCase();
          return normH === normTitle || normH === normId || slugify(normH) === slugify(normTitle) || slugify(normH) === slugify(normId);
        });
        if (matchedHeader) {
          mapping[field.id] = matchedHeader;
        }
      });

      // Show mapping/preview
      renderImportPreview(rowDataList, mapping);
    } catch (err) {
      console.error(err);
      alert('Error reading spreadsheet: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Render column mapping and parsed data preview to UI before final verification
function renderImportPreview(rowDataList, mapping) {
  DOM.importPreviewHeaders.innerHTML = '';
  DOM.importPreviewBody.innerHTML = '';

  // 1. Render Table Headers
  state.schema.forEach(field => {
    const th = document.createElement('th');
    const titleSpan = document.createElement('span');
    titleSpan.style.display = 'block';
    titleSpan.textContent = getFieldDisplayTitle(field);
    th.appendChild(titleSpan);

    const mappingSpan = document.createElement('span');
    mappingSpan.className = 'text-muted';
    mappingSpan.style.fontSize = '0.75rem';
    mappingSpan.style.fontWeight = '400';
    if (mapping[field.id]) {
      mappingSpan.textContent = `← "${mapping[field.id]}"`;
      mappingSpan.style.color = 'var(--success)';
    } else {
      mappingSpan.textContent = '(Unmapped/Empty)';
      mappingSpan.style.color = 'var(--text-muted)';
    }
    th.appendChild(mappingSpan);
    DOM.importPreviewHeaders.appendChild(th);
  });

  // 2. Parse and build rows
  const parsedDrafts = [];
  let baseDate = new Date().toISOString().split('T')[0];

  // Track running max serial numbers per year and year-month
  const runningMaxAnnual = {};
  const runningMaxMonthly = {};

  const annualField = state.schema.find(f => f.id === 'annual_serial' || f.title.toLowerCase().includes('annual'));
  const monthlyField = state.schema.find(f => f.id === 'monthly_sl_no' || f.title.toLowerCase().includes('monthly'));

  const updateRunningMaxes = (recDate, recData) => {
    if (!recDate) return;
    const yr = recDate.split('-')[0];
    const yrMo = recDate.substring(0, 7);

    if (annualField) {
      const val = parseInt(recData[annualField.id]);
      if (!isNaN(val)) {
        runningMaxAnnual[yr] = Math.max(runningMaxAnnual[yr] || 0, val);
      }
    }
    if (monthlyField) {
      const val = parseInt(recData[monthlyField.id]);
      if (!isNaN(val)) {
        runningMaxMonthly[yrMo] = Math.max(runningMaxMonthly[yrMo] || 0, val);
      }
    }
  };

  // Populate from existing records
  state.dbRecords.forEach(rec => updateRunningMaxes(rec.date, rec.data));
  // Populate from existing drafts
  state.drafts.forEach(draft => updateRunningMaxes(draft.date, draft.data));

  rowDataList.forEach(row => {
    const data = {};
    let rowDate = baseDate;

    state.schema.forEach(field => {
      const mappedHeader = mapping[field.id];
      let val = mappedHeader !== undefined ? row[mappedHeader] : undefined;

      if (val !== undefined && val !== null) {
        if (field.type === 'date') {
          if (typeof val === 'number') {
            val = convertExcelDate(val);
          } else {
            const isoDate = parseDateString(val);
            if (isoDate) {
              val = isoDate;
            }
          }
        } else if (field.type === 'time') {
          val = convertExcelTime(val, field.timeFormat === '12h');
        }
        data[field.id] = val.toString().trim();
      } else {
        data[field.id] = field.type === 'date' ? rowDate : '';
      }

      if (field.id === 'date' && data[field.id]) {
        rowDate = data[field.id];
      }
    });

    // Update base date to maintain continuity if no dates specified
    baseDate = rowDate;

    const yr = rowDate.split('-')[0];
    const yrMo = rowDate.substring(0, 7);

    // Auto-generate Month Name
    const monthField = state.schema.find(f => f.id === 'month' || f.title.toLowerCase() === 'month' || f.title.toLowerCase() === 'month name');
    if (monthField && (!data[monthField.id] || data[monthField.id] === '')) {
      try {
        const dateObj = new Date(rowDate + 'T00:00:00');
        data[monthField.id] = dateObj.toLocaleString('default', { month: 'long' });
      } catch (e) {
        console.error('Error generating month name during Excel import:', e);
      }
    }

    // Auto-generate Annual Serial
    if (annualField && (!data[annualField.id] || data[annualField.id] === '')) {
      const nextVal = (runningMaxAnnual[yr] || 0) + 1;
      data[annualField.id] = nextVal.toString();
      runningMaxAnnual[yr] = nextVal;
    } else if (annualField && data[annualField.id]) {
      const val = parseInt(data[annualField.id]);
      if (!isNaN(val)) {
        runningMaxAnnual[yr] = Math.max(runningMaxAnnual[yr] || 0, val);
      }
    }

    // Auto-generate Monthly Serial
    if (monthlyField && (!data[monthlyField.id] || data[monthlyField.id] === '')) {
      const nextVal = (runningMaxMonthly[yrMo] || 0) + 1;
      data[monthlyField.id] = nextVal.toString();
      runningMaxMonthly[yrMo] = nextVal;
    } else if (monthlyField && data[monthlyField.id]) {
      const val = parseInt(data[monthlyField.id]);
      if (!isNaN(val)) {
        runningMaxMonthly[yrMo] = Math.max(runningMaxMonthly[yrMo] || 0, val);
      }
    }

    parsedDrafts.push({
      localId: Date.now() + Math.random(),
      date: rowDate,
      verified: false,
      data: data
    });
  });

  state.pendingImportDrafts = parsedDrafts;

  // 3. Render all preview rows with formatting
  parsedDrafts.forEach(draft => {
    const tr = document.createElement('tr');
    state.schema.forEach(field => {
      const td = document.createElement('td');
      td.textContent = formatDisplayValue(draft.data[field.id], field);
      tr.appendChild(td);
    });
    DOM.importPreviewBody.appendChild(tr);
  });

  // 4. Update count and display
  DOM.importRowCount.textContent = parsedDrafts.length;
  DOM.confirmImportBtn.removeAttribute('disabled');
  DOM.importMappingPreview.classList.remove('hidden');
}

// Save pending parsed drafts to local drafts store
function handleConfirmImport() {
  if (!state.pendingImportDrafts || state.pendingImportDrafts.length === 0) return;

  state.drafts.push(...state.pendingImportDrafts);
  saveDraftsToStorage();

  alert(`Successfully imported ${state.pendingImportDrafts.length} rows to local drafts!`);

  // Clear state and inputs
  state.pendingImportDrafts = null;
  DOM.importMappingPreview.classList.add('hidden');
  DOM.excelImportFile.value = '';
  
  const p = DOM.excelDropZone ? DOM.excelDropZone.querySelector('p') : null;
  if (p) p.textContent = 'Drag and drop your spreadsheet here or click to select';

  // Refresh tables
  renderDraftsTable();
  renderSyncTable();

  // Switch tab to Verify & Push
  switchToTab('sync-console');
}

// -------------------------------------------------------------
// DATA ANALYTICS & INTERACTIVE CHARTING SYSTEM
// -------------------------------------------------------------

// Active Chart.js instances
let chartGenderInstance = null;
let chartFpInstance = null;
let chartShiftsInstance = null;
let chartWeekdayInstance = null;
let chartMonthlyLoadInstance = null;
let chartAgeInstance = null;

function initAnalyticsUI() {
  const timeframe = DOM.analysisTimeframe ? DOM.analysisTimeframe.value : 'till-date';
  
  // Toggle filter groups visibility based on chosen timeframe
  if (timeframe === 'till-date') {
    if (DOM.analysisYearGroup) DOM.analysisYearGroup.classList.add('hidden');
    if (DOM.analysisMonthGroup) DOM.analysisMonthGroup.classList.add('hidden');
    if (DOM.analysisCustomGroup) DOM.analysisCustomGroup.classList.add('hidden');
  } else if (timeframe === 'annual') {
    if (DOM.analysisYearGroup) DOM.analysisYearGroup.classList.remove('hidden');
    if (DOM.analysisMonthGroup) DOM.analysisMonthGroup.classList.add('hidden');
    if (DOM.analysisCustomGroup) DOM.analysisCustomGroup.classList.add('hidden');
  } else if (timeframe === 'monthly') {
    if (DOM.analysisYearGroup) DOM.analysisYearGroup.classList.remove('hidden');
    if (DOM.analysisMonthGroup) DOM.analysisMonthGroup.classList.remove('hidden');
    if (DOM.analysisCustomGroup) DOM.analysisCustomGroup.classList.add('hidden');
  } else if (timeframe === 'custom') {
    if (DOM.analysisYearGroup) DOM.analysisYearGroup.classList.add('hidden');
    if (DOM.analysisMonthGroup) DOM.analysisMonthGroup.classList.add('hidden');
    if (DOM.analysisCustomGroup) DOM.analysisCustomGroup.classList.remove('hidden');
  }
  
  // Populate the Year filter select dynamically if it has no options yet
  if (DOM.analysisYear && DOM.analysisYear.options.length === 0) {
    const years = new Set();
    state.dbRecords.forEach(rec => {
      if (rec.date) {
        const yr = rec.date.split('-')[0];
        if (yr && yr.length === 4) years.add(yr);
      }
    });
    
    // Fallback to current year if no data is present yet
    if (years.size === 0) {
      years.add(new Date().getFullYear().toString());
    }
    
    DOM.analysisYear.innerHTML = Array.from(years).sort().reverse().map(yr => {
      return `<option value="${yr}">${yr}</option>`;
    }).join('');
  }

  // Pre-fill date inputs for Custom Range if empty
  if (DOM.analysisFromDate && !DOM.analysisFromDate.value) {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    DOM.analysisFromDate.value = thirtyDaysAgo.toISOString().split('T')[0];
  }
  if (DOM.analysisToDate && !DOM.analysisToDate.value) {
    DOM.analysisToDate.value = new Date().toISOString().split('T')[0];
  }
}

function renderAnalytics() {
  if (!state.dbRecords || state.dbRecords.length === 0) {
    if (DOM.kpiTotalDeliveries) DOM.kpiTotalDeliveries.textContent = '0';
    if (DOM.kpiAvgWeight) DOM.kpiAvgWeight.textContent = '0g';
    if (DOM.kpiFpRate) DOM.kpiFpRate.textContent = '0%';
    if (DOM.kpiFpProgress) DOM.kpiFpProgress.style.width = '0%';
    if (DOM.kpiLbwRate) DOM.kpiLbwRate.textContent = '0 (0%)';
    if (DOM.kpiLbwProgress) DOM.kpiLbwProgress.style.width = '0%';
    if (DOM.kpiGenderRatio) DOM.kpiGenderRatio.textContent = 'N/A';
    if (DOM.kpiHighRisk) DOM.kpiHighRisk.textContent = '0';
    if (DOM.topAddressesList) DOM.topAddressesList.innerHTML = '<li class="text-muted">No data available</li>';
    return;
  }

  // 1. Timeframe Filter Calculation
  const timeframe = DOM.analysisTimeframe ? DOM.analysisTimeframe.value : 'till-date';
  let filtered = [];

  if (timeframe === 'till-date') {
    filtered = [...state.dbRecords];
  } else if (timeframe === 'annual') {
    const selectedYear = DOM.analysisYear ? DOM.analysisYear.value : '';
    filtered = state.dbRecords.filter(rec => rec.date && rec.date.startsWith(selectedYear));
  } else if (timeframe === 'monthly') {
    const selectedYear = DOM.analysisYear ? DOM.analysisYear.value : '';
    const selectedMonth = DOM.analysisMonth ? DOM.analysisMonth.value : '';
    const yearMonth = `${selectedYear}-${selectedMonth}`;
    filtered = state.dbRecords.filter(rec => rec.date && rec.date.startsWith(yearMonth));
  } else if (timeframe === 'custom') {
    const fromDate = DOM.analysisFromDate ? DOM.analysisFromDate.value : '';
    const toDate = DOM.analysisToDate ? DOM.analysisToDate.value : '';
    filtered = state.dbRecords.filter(rec => {
      if (!rec.date) return false;
      return rec.date >= fromDate && rec.date <= toDate;
    });
  }

  // Show/Hide Monthly Birth Load Chart dynamically
  if (timeframe === 'monthly') {
    if (DOM.monthlyLoadCard) DOM.monthlyLoadCard.style.display = 'none';
  } else {
    if (DOM.monthlyLoadCard) DOM.monthlyLoadCard.style.display = 'flex';
  }

  // 2. Metrics Aggregations
  const totalCount = filtered.length;
  let totalWeight = 0;
  let validWeightCount = 0;
  let lbwCount = 0;
  let fpAdoptedCount = 0;
  let highRiskCount = 0;
  
  let maleCount = 0;
  let femaleCount = 0;
  let otherGenderCount = 0;

  const fpCounts = { BTL: 0, PPIUCD: 0, NONE: 0 };
  const shiftCounts = { 'Forenoon (6 AM - 12 PM)': 0, 'Afternoon (12 PM - 9 PM)': 0, 'Night (9 PM - 6 AM)': 0, 'Unknown': 0 };
  const weekdayCounts = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };
  const monthlyCounts = {};
  const ageCounts = { '< 20': 0, '20-25': 0, '26-30': 0, '> 30': 0, 'Unknown': 0 };
  const addressCounts = {};

  filtered.forEach(rec => {
    // Baby Gender
    const gender = (rec.data.sexob || '').toString().trim().toLowerCase();
    if (gender === 'male' || gender === 'mch') maleCount++;
    else if (gender === 'female' || gender === 'fch') femaleCount++;
    else if (gender === 'others' || gender === 'other') otherGenderCount++;

    // Family Planning
    const fp = (rec.data.fp_option || '').toString().trim().toUpperCase();
    if (fpCounts[fp] !== undefined) {
      fpCounts[fp]++;
    } else {
      fpCounts['NONE']++;
    }
    if (fp === 'BTL' || fp === 'PPIUCD') {
      fpAdoptedCount++;
    }

    // Birth Weight
    const w = parseFloat(rec.data.weightob);
    if (!isNaN(w) && w > 0) {
      totalWeight += w;
      validWeightCount++;
      if (w < 2200) {
        lbwCount++;
      }
    }

    // Delivery Shift
    const shift = getShiftName(rec.data.timeob);
    if (shiftCounts[shift] !== undefined) {
      shiftCounts[shift]++;
    } else {
      shiftCounts['Unknown']++;
    }

    // Day of the Week
    if (rec.date) {
      try {
        const dObj = new Date(rec.date + 'T00:00:00');
        const weekdayName = dObj.toLocaleDateString('default', { weekday: 'long' });
        if (weekdayCounts[weekdayName] !== undefined) {
          weekdayCounts[weekdayName]++;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // High-Risk Deliveries (Mother's age <20 or >35, or baby weight <2200g)
    let isHighRisk = false;
    const age = parseInt(rec.data.age);
    if (!isNaN(age) && (age < 20 || age > 35)) {
      isHighRisk = true;
    }
    if (!isNaN(w) && w > 0 && w < 2200) {
      isHighRisk = true;
    }
    if (isHighRisk) {
      highRiskCount++;
    }

    // Address list ranking
    const addr = (rec.data.address || '').toString().trim();
    if (addr) {
      const normalizedAddr = addr.toUpperCase();
      addressCounts[normalizedAddr] = (addressCounts[normalizedAddr] || 0) + 1;
    }

    // Monthly Birth Load groupings
    if (rec.date) {
      const parts = rec.date.split('-');
      if (parts.length === 3) {
        const yr = parts[0];
        const mo = parts[1];
        if (timeframe === 'till-date') {
          const key = `${yr}-${mo}`;
          monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        } else {
          monthlyCounts[mo] = (monthlyCounts[mo] || 0) + 1;
        }
      }
    }

    // Maternal Age distribution
    if (!isNaN(age)) {
      if (age < 20) ageCounts['< 20']++;
      else if (age >= 20 && age <= 25) ageCounts['20-25']++;
      else if (age >= 26 && age <= 30) ageCounts['26-30']++;
      else ageCounts['> 30']++;
    } else {
      ageCounts['Unknown']++;
    }
  });

  // Shift categoriser helper
  function getShiftName(timeStr) {
    if (!timeStr) return 'Unknown';
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (!match) return 'Unknown';
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    const totalMinutes = hours * 60 + minutes;
    
    // 6:00 AM (360 mins) to 12:00 PM (720 mins)
    if (totalMinutes >= 360 && totalMinutes < 720) {
      return 'Forenoon (6 AM - 12 PM)';
    }
    // 12:00 PM (720 mins) to 9:00 PM (1260 mins)
    if (totalMinutes >= 720 && totalMinutes < 1260) {
      return 'Afternoon (12 PM - 9 PM)';
    }
    // 9:00 PM (1260 mins) to 6:00 AM (360 mins)
    return 'Night (9 PM - 6 AM)';
  }

  // 3. Render KPI values
  if (DOM.kpiTotalDeliveries) DOM.kpiTotalDeliveries.textContent = totalCount;
  
  const avgWeight = validWeightCount > 0 ? Math.round(totalWeight / validWeightCount) : 0;
  if (DOM.kpiAvgWeight) DOM.kpiAvgWeight.textContent = `${avgWeight}g`;

  const fpRate = totalCount > 0 ? Math.round((fpAdoptedCount / totalCount) * 100) : 0;
  if (DOM.kpiFpRate) DOM.kpiFpRate.textContent = `${fpRate}%`;
  if (DOM.kpiFpProgress) DOM.kpiFpProgress.style.width = `${fpRate}%`;

  const lbwPercent = totalCount > 0 ? ((lbwCount / totalCount) * 100).toFixed(1) : '0.0';
  if (DOM.kpiLbwRate) DOM.kpiLbwRate.textContent = `${lbwCount} (${lbwPercent}%)`;
  if (DOM.kpiLbwProgress) DOM.kpiLbwProgress.style.width = `${lbwPercent}%`;

  let genderRatioText = 'N/A';
  if (femaleCount > 0) {
    const ratio = Math.round((maleCount / femaleCount) * 1000);
    genderRatioText = `${ratio} M / 1000 F`;
  } else if (maleCount > 0) {
    genderRatioText = `${maleCount} M / 0 F`;
  }
  if (DOM.kpiGenderRatio) DOM.kpiGenderRatio.textContent = genderRatioText;

  if (DOM.kpiHighRisk) DOM.kpiHighRisk.textContent = highRiskCount;

  // 4. Populate Top 3 Villages/Locations List
  const sortedAddresses = Object.entries(addressCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (DOM.topAddressesList) {
    if (sortedAddresses.length === 0) {
      DOM.topAddressesList.innerHTML = '<li class="text-muted" style="background: none; border: none; padding: 0;">No data available</li>';
    } else {
      DOM.topAddressesList.innerHTML = sortedAddresses.map(([addr, count]) => {
        const pluralText = count === 1 ? 'delivery' : 'deliveries';
        return `<li><strong>${addr}</strong>: ${count} ${pluralText}</li>`;
      }).join('');
    }
  }

  // 5. Instantiating Chart.js Elements
  const fontColor = document.body.classList.contains('light-mode') ? '#24292f' : '#8b949e';
  const gridColor = document.body.classList.contains('light-mode') ? '#d0d7de' : '#30363d';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: fontColor, font: { family: 'Inter', size: 11 } }
      }
    }
  };

  // --- CHART 1: GENDER DISTRIBUTION (DOUGHNUT) ---
  if (chartGenderInstance) chartGenderInstance.destroy();
  const canvasGender = document.getElementById('chart-gender');
  if (canvasGender) {
    chartGenderInstance = new Chart(canvasGender.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female', 'Others'],
        datasets: [{
          data: [maleCount, femaleCount, otherGenderCount],
          backgroundColor: ['#2ea44f', '#ff7b00', '#d29922'],
          borderColor: gridColor,
          borderWidth: 1
        }]
      },
      options: commonOptions
    });
  }

  // --- CHART 2: FAMILY PLANNING ADOPTION (HORIZONTAL BAR) ---
  if (chartFpInstance) chartFpInstance.destroy();
  const canvasFp = document.getElementById('chart-fp');
  if (canvasFp) {
    chartFpInstance = new Chart(canvasFp.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['BTL', 'PPIUCD', 'NONE'],
        datasets: [{
          label: 'Adoptions Count',
          data: [fpCounts.BTL, fpCounts.PPIUCD, fpCounts.NONE],
          backgroundColor: ['#ff7b00', '#2ea44f', '#8b949e'],
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        ...commonOptions,
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: fontColor } },
          y: { grid: { display: false }, ticks: { color: fontColor } }
        }
      }
    });
  }

  // --- CHART 3: DELIVERY SHIFTS (PIE) ---
  if (chartShiftsInstance) chartShiftsInstance.destroy();
  const canvasShifts = document.getElementById('chart-shifts');
  if (canvasShifts) {
    chartShiftsInstance = new Chart(canvasShifts.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Forenoon (6 AM-12 PM)', 'Afternoon (12-9 PM)', 'Night (9 PM-6 AM)'],
        datasets: [{
          data: [
            shiftCounts['Forenoon (6 AM - 12 PM)'],
            shiftCounts['Afternoon (12 PM - 9 PM)'],
            shiftCounts['Night (9 PM - 6 AM)']
          ],
          backgroundColor: ['#d29922', '#ff7b00', '#8b949e'],
          borderColor: gridColor,
          borderWidth: 1
        }]
      },
      options: commonOptions
    });
  }

  // --- CHART 4: WEEKDAY BIRTH LOAD (VERTICAL BAR) ---
  if (chartWeekdayInstance) chartWeekdayInstance.destroy();
  const canvasWeekday = document.getElementById('chart-weekday');
  if (canvasWeekday) {
    chartWeekdayInstance = new Chart(canvasWeekday.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Deliveries',
          data: [
            weekdayCounts.Monday,
            weekdayCounts.Tuesday,
            weekdayCounts.Wednesday,
            weekdayCounts.Thursday,
            weekdayCounts.Friday,
            weekdayCounts.Saturday,
            weekdayCounts.Sunday
          ],
          backgroundColor: '#ff7b00',
          borderRadius: 4
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: { grid: { display: false }, ticks: { color: fontColor } },
          y: { grid: { color: gridColor }, ticks: { color: fontColor } }
        }
      }
    });
  }

  // --- CHART 5: MONTHLY BIRTH LOAD (LINE/BAR) — ONLY FOR ANNUAL/LONG VIEWS ---
  if (timeframe !== 'monthly') {
    let monthlyLabels = [];
    let monthlyValues = [];

    if (timeframe === 'till-date') {
      const sortedKeys = Object.keys(monthlyCounts).sort();
      monthlyLabels = sortedKeys.map(k => {
        const [y, m] = k.split('-');
        const dObj = new Date(y, parseInt(m) - 1, 1);
        return dObj.toLocaleDateString('default', { month: 'short', year: '2-digit' });
      });
      monthlyValues = sortedKeys.map(k => monthlyCounts[k]);
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyLabels = monthNames;
      monthlyValues = Array.from({ length: 12 }, (_, idx) => {
        const key = (idx + 1).toString().padStart(2, '0');
        return monthlyCounts[key] || 0;
      });
    }

    if (chartMonthlyLoadInstance) chartMonthlyLoadInstance.destroy();
    const canvasMonthlyLoad = document.getElementById('chart-monthly-load');
    if (canvasMonthlyLoad) {
      chartMonthlyLoadInstance = new Chart(canvasMonthlyLoad.getContext('2d'), {
        type: 'line',
        data: {
          labels: monthlyLabels,
          datasets: [{
            label: 'Deliveries',
            data: monthlyValues,
            borderColor: '#ff7b00',
            backgroundColor: 'rgba(255, 123, 0, 0.15)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          ...commonOptions,
          scales: {
            x: { grid: { display: false }, ticks: { color: fontColor } },
            y: { grid: { color: gridColor }, ticks: { color: fontColor } }
          }
        }
      });
    }
  }

  // --- CHART 6: MATERNAL AGE DISTRIBUTION (BAR) ---
  if (chartAgeInstance) chartAgeInstance.destroy();
  const canvasAge = document.getElementById('chart-age');
  if (canvasAge) {
    chartAgeInstance = new Chart(canvasAge.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['< 20', '20-25', '26-30', '> 30'],
        datasets: [{
          label: 'Mothers',
          data: [ageCounts['< 20'], ageCounts['20-25'], ageCounts['26-30'], ageCounts['> 30']],
          backgroundColor: '#2ea44f',
          borderRadius: 4
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: { grid: { display: false }, ticks: { color: fontColor } },
          y: { grid: { color: gridColor }, ticks: { color: fontColor } }
        }
      }
    });
  }
}

// -------------------------------------------------------------
// TWO-FACTOR AUTHENTICATION (TOTP)
// -------------------------------------------------------------

async function fetchTotpStatus() {
  if (!state.isOnline || !state.isAuthenticated) return;
  try {
    const response = await fetch('/api/settings/totp/status', {
      headers: { 'Authorization': `Bearer ${state.authToken}` }
    });
    if (response.ok) {
      const data = await response.json();
      renderTotpStatus(data.enabled);
    }
  } catch (err) {
    console.error('Error fetching TOTP status:', err);
  }
}

function renderTotpStatus(enabled) {
  if (!DOM.totpStatusBadge || !DOM.totpActions) return;

  if (enabled) {
    DOM.totpStatusBadge.className = 'text-success';
    DOM.totpStatusBadge.textContent = 'Enabled';
    DOM.totpActions.innerHTML = `<button type="button" id="disable-totp-btn" class="btn btn-secondary" style="border-color: var(--danger); color: var(--danger);">Disable 2FA</button>`;
    
    const disableBtn = document.getElementById('disable-totp-btn');
    if (disableBtn) {
      disableBtn.addEventListener('click', disableTotp);
    }
    if (DOM.totpSetupSection) DOM.totpSetupSection.classList.add('hidden');
  } else {
    DOM.totpStatusBadge.className = 'text-warning';
    DOM.totpStatusBadge.textContent = 'Disabled';
    DOM.totpActions.innerHTML = `<button type="button" id="enable-totp-btn" class="btn btn-primary">Enable 2FA</button>`;
    
    const enableBtn = document.getElementById('enable-totp-btn');
    if (enableBtn) {
      enableBtn.addEventListener('click', initTotpSetup);
    }
  }
}

function resetTotpUI() {
  if (DOM.totpStatusBadge) {
    DOM.totpStatusBadge.className = 'text-warning';
    DOM.totpStatusBadge.textContent = 'Disabled';
  }
  if (DOM.totpActions) DOM.totpActions.innerHTML = '';
  if (DOM.totpSetupSection) DOM.totpSetupSection.classList.add('hidden');
  if (DOM.totpSetupCode) DOM.totpSetupCode.value = '';
}

async function initTotpSetup() {
  if (!state.isOnline || !state.isAuthenticated) return;
  try {
    const response = await fetch('/api/settings/totp/setup', {
      headers: { 'Authorization': `Bearer ${state.authToken}` }
    });
    if (response.ok) {
      const data = await response.json();
      if (DOM.totpQrImg) DOM.totpQrImg.src = data.qrUrl;
      if (DOM.totpManualSecret) DOM.totpManualSecret.textContent = data.secret;
      if (DOM.totpSetupSection) DOM.totpSetupSection.classList.remove('hidden');
      if (DOM.totpSetupCode) {
        DOM.totpSetupCode.value = '';
        DOM.totpSetupCode.focus();
      }
    } else {
      alert('Failed to initiate 2FA setup.');
    }
  } catch (err) {
    alert('Network error initiating 2FA setup.');
  }
}

function cancelTotpSetup() {
  if (DOM.totpSetupSection) DOM.totpSetupSection.classList.add('hidden');
  if (DOM.totpSetupCode) DOM.totpSetupCode.value = '';
}

async function confirmTotpSetup() {
  const code = DOM.totpSetupCode.value.trim();
  if (!code || code.length !== 6) {
    alert('Please enter a valid 6-digit code.');
    return;
  }
  try {
    const response = await fetch('/api/settings/totp/enable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ code })
    });
    if (response.ok) {
      alert('Two-Factor Authentication enabled successfully!');
      fetchTotpStatus();
    } else {
      const err = await response.json();
      alert('Verification failed: ' + (err.error || 'Invalid code'));
    }
  } catch (err) {
    alert('Network error enabling 2FA.');
  }
}

async function disableTotp() {
  const currentPassword = prompt('Enter your admin password to confirm disabling Two-Factor Authentication:');
  if (currentPassword === null) return;
  if (!currentPassword.trim()) {
    alert('Password confirmation is required.');
    return;
  }
  try {
    const response = await fetch('/api/settings/totp/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ currentPassword })
    });
    if (response.ok) {
      alert('Two-Factor Authentication has been disabled.');
      fetchTotpStatus();
    } else {
      const err = await response.json();
      alert('Failed to disable 2FA: ' + (err.error || 'Incorrect password'));
    }
  } catch (err) {
    alert('Network error disabling 2FA.');
  }
}
