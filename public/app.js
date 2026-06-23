// App State
const state = {
  isOnline: false,
  isAuthenticated: false,
  authToken: null,
  schema: [],          // Active fields list
  drafts: [],          // Local drafts stored in localStorage
  deletedDrafts: [],   // Trash bin for deleted drafts
  deletedDbRecords: [],// Soft-deleted database records fetched from server
  dbRecords: [],       // Records fetched from SQLite
  activeTab: 'data-entry',
  formCreatorSchema: [], // Working copy of schema inside Form Creator
  formCreatorActiveIndex: 0,
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

  // Trash Bin Selectors
  deletedDraftsCard: document.getElementById('deleted-drafts-card'),
  deletedDraftsSummaryText: document.getElementById('deleted-drafts-summary-text'),
  deletedDraftsTableHeader: document.getElementById('deleted-drafts-table-header'),
  deletedDraftsTableBody: document.getElementById('deleted-drafts-table-body'),
  selectAllDeletedBtn: document.getElementById('select-all-deleted-btn'),
  deselectAllDeletedBtn: document.getElementById('deselect-all-deleted-btn'),
  restoreSelectedBtn: document.getElementById('restore-selected-btn'),
  deletePermanentlyBtn: document.getElementById('delete-permanently-btn'),
  headerSelectAllDeleted: document.getElementById('header-select-all-deleted'),
  restoreCountText: document.getElementById('restore-count-text'),
  deletePermanentlyCountText: document.getElementById('delete-permanently-count-text'),
  
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
  
  // Tab 3: Verify & Push (now mapped to Data Entry drafts elements)
  syncTableBody: document.getElementById('drafts-table-body'),
  syncTableHeader: document.getElementById('drafts-table-header'),
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
  localBackupExportBtn: document.getElementById('local-backup-export-btn'),
  localBackupRestoreBtn: document.getElementById('local-backup-restore-btn'),
  localBackupRestoreFile: document.getElementById('local-backup-restore-file'),
  exportExcelBtn: document.getElementById('export-excel-btn'),
  
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
  totpToggleBtn: document.getElementById('totp-toggle-btn'),
  totpSetupModal: document.getElementById('totp-setup-modal'),
  closeTotpSetupBtn: document.getElementById('close-totp-setup-btn'),
  totpQrImg: document.getElementById('totp-qr-img'),
  totpManualSecret: document.getElementById('totp-manual-secret'),
  totpSetupCode: document.getElementById('totp-setup-code'),
  confirmTotpBtn: document.getElementById('confirm-totp-btn'),
  cancelTotpSetupBtn: document.getElementById('cancel-totp-setup-btn'),
  totpDisableInlineCode: document.getElementById('totp-disable-inline-code'),

  // Theme Toggle
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeToggleIcon: document.getElementById('theme-toggle-icon'),
  voiceTypingBtns: document.querySelectorAll('.mic-button-round'),

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
  importDuplicateAlert: document.getElementById('import-duplicate-alert'),
  importDuplicateAlertText: document.getElementById('import-duplicate-alert-text'),
  
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
  clearUsersBtn: document.getElementById('clear-users-btn'),

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
  loginErrorText: document.getElementById('login-error-text'),

  // Header and Change Password Modal Selectors
  userProfileHeader: document.getElementById('user-profile-header'),
  loggedInUserName: document.getElementById('logged-in-user-name'),
  headerChangePasswordBtn: document.getElementById('header-change-password-btn'),
  changePasswordModal: document.getElementById('change-password-modal'),
  closeChangePasswordBtn: document.getElementById('close-change-password-btn'),
  cancelChangePasswordBtn: document.getElementById('cancel-change-password-btn'),
  changeUserPasswordForm: document.getElementById('change-user-password-form'),
  defaultAdminWarning: document.getElementById('default-admin-warning'),
  changeUserUsername: document.getElementById('change-user-username'),
  changeUserCurrentPassword: document.getElementById('change-user-current-password'),
  changeUserNewPassword: document.getElementById('change-user-new-password'),
  changeUserConfirmNewPassword: document.getElementById('change-user-confirm-new-password'),
  changeUserTotp: document.getElementById('change-user-totp'),
  confirmCredentialsCheckbox: document.getElementById('confirm-credentials-checkbox'),
  submitChangePasswordBtn: document.getElementById('submit-change-password-btn'),
  changePasswordModalTitle: document.getElementById('change-password-modal-title'),
  adminCreateUserBtn: document.getElementById('admin-create-user-btn'),

  // Audit Selectors
  auditDbBtn: document.getElementById('audit-db-btn'),
  auditModal: document.getElementById('audit-modal'),
  closeAuditModalBtn: document.getElementById('close-audit-modal-btn'),
  cancelAuditBtn: document.getElementById('cancel-audit-btn'),
  auditTableBody: document.getElementById('audit-table-body'),
  saveAuditChangesBtn: document.getElementById('save-audit-changes-btn'),
  auditPrevYearBtn: document.getElementById('audit-prev-year-btn'),
  auditCurrentYearText: document.getElementById('audit-current-year-text'),
  auditNextYearBtn: document.getElementById('audit-next-year-btn')
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
  try {
    // Load token from session storage
    const savedToken = sessionStorage.getItem('authToken');
    if (savedToken) {
      state.isAuthenticated = true;
      state.authToken = savedToken;
      fetchTotpStatus();
      fetchUserProfile();
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

    // Restore active tab position on refresh
    const savedTab = sessionStorage.getItem('activeTab');

    // Initial Check Connectivity and Fetch Schema
    checkConnectivity().then(() => {
      fetchSchema().then(() => {
        renderDataEntryForm();
        renderDraftsTable();
        
        // Restore tab position or fallback to default
        if (savedTab) {
          switchToTab(savedTab);
        } else {
          switchToTab('data-entry');
        }
      }).catch(err => console.error("Error in fetchSchema chain:", err));
    }).catch(err => console.error("Error in checkConnectivity chain:", err));

    // Restore temporary login state if browser was reloaded during 2FA entry
    const tempToken = localStorage.getItem('loginTempToken') || sessionStorage.getItem('loginTempToken');
    const tempPassword = localStorage.getItem('loginTempPassword') || sessionStorage.getItem('loginTempPassword');
    const tempUsername = localStorage.getItem('loginTempUsername') || sessionStorage.getItem('loginTempUsername');
    const modalState = localStorage.getItem('loginModalOpen') || sessionStorage.getItem('loginModalOpen');
    
    if (tempToken && modalState === 'totp-setup') {
      state.loginTempToken = tempToken;
      try {
        fetch('/api/login/totp-setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempToken })
        }).then(res => {
          if (res.ok) return res.json();
        }).then(setupData => {
          if (setupData) {
            DOM.totpManualSecret.textContent = setupData.secret;
            DOM.totpQrImg.src = setupData.qrUrl;
            DOM.totpSetupCode.value = '';
            
            DOM.totpSetupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        });
      } catch (err) {
        console.error("Error restoring TOTP setup:", err);
      }
    } else if (tempToken && tempPassword && modalState === 'otp') {
      state.loginTempToken = tempToken;
      state.loginTempPassword = tempPassword;
      if (DOM.loginUsername && tempUsername) DOM.loginUsername.value = tempUsername;
      
      openLoginModal(true);
      
      const credentialsSec = document.getElementById('login-credentials-section');
      if (credentialsSec) credentialsSec.classList.add('hidden');
      if (DOM.loginUsername) DOM.loginUsername.removeAttribute('required');
      if (DOM.loginPassword) DOM.loginPassword.removeAttribute('required');
      if (DOM.loginOtpSection) DOM.loginOtpSection.classList.remove('hidden');
      if (DOM.loginOtp) {
        DOM.loginOtp.value = '';
        DOM.loginOtp.focus();
        DOM.loginOtp.setAttribute('required', 'true');
      }
      const submitBtn = document.getElementById('submit-login-btn');
      if (submitBtn) submitBtn.textContent = 'Verify 2FA';
    }

    // Start periodic LAN server connectivity check (every 5 seconds)
    setInterval(checkConnectivity, 5000);
  } catch (globalInitError) {
    console.error("GLOBAL INITIALIZATION ERROR:", globalInitError);
    alert("App initialization failed! Error: " + globalInitError.message + "\nCheck browser console or click the debug button if visible.");
  }
});

// -------------------------------------------------------------
// STORAGE & LOCAL STATE
// -------------------------------------------------------------

async function loadDraftsFromStorage() {
  const storedEncrypted = localStorage.getItem('drafts_encrypted');
  const storedPlaintext = localStorage.getItem('drafts');
  
  if (storedEncrypted) {
    if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
      try {
        const encryptedObj = JSON.parse(storedEncrypted);
        const decryptedText = await window.SecurityEngine.decryptPayload(encryptedObj.ciphertext, encryptedObj.iv);
        state.drafts = JSON.parse(decryptedText);
      } catch (e) {
        console.error('Failed to decrypt local drafts from storage:', e);
        state.drafts = [];
      }
    } else {
      // Vault is currently locked, keep drafts empty for now until unlocked
      state.drafts = [];
    }
  } else if (storedPlaintext) {
    try {
      state.drafts = JSON.parse(storedPlaintext);
      // Migrate plaintext drafts to encrypted if vault is unlocked
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        await saveDraftsToStorage();
      }
    } catch (e) {
      console.error('Failed to parse plaintext drafts from storage:', e);
      state.drafts = [];
    }
  } else {
    state.drafts = [];
  }
  updateDraftCountBadges();
  
  // Load deleted drafts from storage
  await loadDeletedDraftsFromStorage();
  renderDeletedDraftsTable();
}

async function loadDeletedDraftsFromStorage() {
  const storedEncrypted = localStorage.getItem('deleted_drafts_encrypted');
  const storedPlaintext = localStorage.getItem('deleted_drafts');
  
  if (storedEncrypted) {
    if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
      try {
        const encryptedObj = JSON.parse(storedEncrypted);
        const decryptedText = await window.SecurityEngine.decryptPayload(encryptedObj.ciphertext, encryptedObj.iv);
        state.deletedDrafts = JSON.parse(decryptedText);
      } catch (e) {
        console.error('Failed to decrypt deleted drafts from storage:', e);
        state.deletedDrafts = [];
      }
    } else {
      state.deletedDrafts = [];
    }
  } else if (storedPlaintext) {
    try {
      state.deletedDrafts = JSON.parse(storedPlaintext);
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        await saveDeletedDraftsToStorage();
      }
    } catch (e) {
      console.error('Failed to parse plaintext deleted drafts:', e);
      state.deletedDrafts = [];
    }
  } else {
    state.deletedDrafts = [];
  }
}

async function saveDeletedDraftsToStorage() {
  if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
    try {
      const plaintext = JSON.stringify(state.deletedDrafts);
      const encrypted = await window.SecurityEngine.encryptPayload(plaintext);
      localStorage.setItem('deleted_drafts_encrypted', JSON.stringify(encrypted));
      localStorage.removeItem('deleted_drafts');
    } catch (e) {
      console.error('Failed to encrypt and save deleted drafts:', e);
    }
  }
}

async function saveDraftsToStorage() {
  if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
    try {
      const plaintext = JSON.stringify(state.drafts);
      const encrypted = await window.SecurityEngine.encryptPayload(plaintext);
      localStorage.setItem('drafts_encrypted', JSON.stringify(encrypted));
      localStorage.removeItem('drafts'); // Purge any plaintext backup
    } catch (e) {
      console.error('Failed to encrypt and save local drafts:', e);
    }
  }
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
    if (DOM.connectionBadge) DOM.connectionBadge.className = 'badge online';
    if (DOM.connectionText) DOM.connectionText.textContent = 'Online';
    if (DOM.syncNetworkWarning) DOM.syncNetworkWarning.className = 'alert-box alert-warning hidden';
    if (DOM.saveSchemaBtn) DOM.saveSchemaBtn.disabled = !state.isAuthenticated;
    
    // Enable/disable push button based on drafts count
    updatePushSelectedBtnState();
  } else {
    if (DOM.connectionBadge) DOM.connectionBadge.className = 'badge offline';
    if (DOM.connectionText) DOM.connectionText.textContent = 'Offline';
    if (DOM.syncNetworkWarning) DOM.syncNetworkWarning.className = 'alert-box alert-danger';
    if (DOM.syncWarningText) DOM.syncWarningText.innerHTML = `⚠️ Offline: Reconnect to the internet or hosted server to push drafts to the database.`;
    if (DOM.saveSchemaBtn) DOM.saveSchemaBtn.disabled = true;
    if (DOM.pushSelectedBtn) DOM.pushSelectedBtn.disabled = true;
  }
}

// QR code features removed for cloud hosting

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------

async function openLoginModal(isRestore = false) {
  if (!isRestore) {
    DOM.loginUsername.value = '';
    DOM.loginPassword.value = '';
    state.loginTempToken = null;
    sessionStorage.removeItem('loginTempToken');
    sessionStorage.removeItem('loginTempPassword');
    sessionStorage.removeItem('loginTempUsername');
    sessionStorage.removeItem('loginModalOpen');
    localStorage.removeItem('loginTempToken');
    localStorage.removeItem('loginTempPassword');
    localStorage.removeItem('loginTempUsername');
    localStorage.removeItem('loginModalOpen');
  }
  state.authModalMode = 'login'; // Reset to login mode

  const credentialsSec = document.getElementById('login-credentials-section');
  if (credentialsSec) credentialsSec.classList.remove('hidden');
  if (DOM.loginUsername) DOM.loginUsername.setAttribute('required', 'true');
  if (DOM.loginPassword) DOM.loginPassword.setAttribute('required', 'true');
  
  if (DOM.loginOtpSection) DOM.loginOtpSection.classList.add('hidden');
  if (DOM.loginOtp) {
    DOM.loginOtp.value = '';
    DOM.loginOtp.removeAttribute('required');
  }

  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('login-modal-subtitle');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');
  const submitBtn = document.getElementById('submit-login-btn');

  if (title) title.textContent = 'Account Authentication';
  if (subtitle) subtitle.textContent = 'Log in or register to manage data entry schemas and synchronize encrypted records.';
  if (toggleText) {
    toggleText.style.display = '';
    toggleText.textContent = "Don't have an account? ";
  }
  if (toggleLink) {
    toggleLink.style.display = '';
    toggleLink.textContent = 'Register here';
  }
  if (submitBtn) submitBtn.textContent = 'Login';
  
  DOM.loginError.classList.add('hidden');
  DOM.authModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openAdminRegisterModal() {
  if (!state.isAuthenticated || state.userRole !== 'admin') return;
  state.authModalMode = 'register';
  
  const credentialsSec = document.getElementById('login-credentials-section');
  if (credentialsSec) credentialsSec.classList.remove('hidden');
  if (DOM.loginUsername) DOM.loginUsername.setAttribute('required', 'true');
  if (DOM.loginPassword) DOM.loginPassword.setAttribute('required', 'true');
  
  if (DOM.loginOtpSection) DOM.loginOtpSection.classList.add('hidden');
  if (DOM.loginOtp) {
    DOM.loginOtp.value = '';
    DOM.loginOtp.removeAttribute('required');
  }

  DOM.loginUsername.value = '';
  DOM.loginPassword.value = '';

  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('login-modal-subtitle');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');
  const submitBtn = document.getElementById('submit-login-btn');

  if (title) title.textContent = 'Create New Team Account';
  if (subtitle) subtitle.textContent = 'Register a new user account under admin authorization.';
  if (toggleText) toggleText.style.display = 'none';
  if (toggleLink) toggleLink.style.display = 'none';
  if (submitBtn) submitBtn.textContent = 'Create Account';
  
  DOM.loginError.classList.add('hidden');
  DOM.authModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  DOM.authModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear temp state
  state.loginTempToken = null;
  state.loginTempPassword = null;
  sessionStorage.removeItem('loginTempToken');
  sessionStorage.removeItem('loginTempPassword');
  sessionStorage.removeItem('loginTempUsername');
  sessionStorage.removeItem('loginModalOpen');
  localStorage.removeItem('loginTempToken');
  localStorage.removeItem('loginTempPassword');
  localStorage.removeItem('loginTempUsername');
  localStorage.removeItem('loginModalOpen');
}

async function handleLogin(e) {
  e.preventDefault();
  
  // Registration flow
  if (state.authModalMode === 'register') {
    const username = DOM.loginUsername.value.trim();
    const password = DOM.loginPassword.value;
    if (!username || !password) {
      if (DOM.loginErrorText) DOM.loginErrorText.textContent = 'Please fill out all fields.';
      DOM.loginError.classList.remove('hidden');
      return;
    }

    try {
      const newSaltBytes = window.crypto.getRandomValues(new Uint8Array(16));
      const newSaltB64 = window.SecurityEngine.uint8ArrayToBase64(newSaltBytes);
      const newKek = await window.SecurityEngine.deriveKek(password, newSaltB64);

      const keypair = await window.SecurityEngine.generateKeyPair();
      const encPrivate = await window.SecurityEngine.encryptPrivateKey(keypair.privateKey, newKek);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          publicKey: keypair.publicKeyB64,
          encryptedPrivateKey: JSON.stringify(encPrivate),
          salt: newSaltB64
        })
      });

      if (response.ok) {
        if (state.isAuthenticated && state.userRole === 'admin') {
          alert('Registration successful! Consider Revoking the old ID');
          closeLoginModal();
          if (typeof loadTeamAccounts === 'function') {
            await loadTeamAccounts();
          }
        } else {
          alert('Registration successful! Please log in now.');
          // Toggle back to login mode
          const toggleLink = document.getElementById('auth-toggle-link');
          if (toggleLink) toggleLink.click();
        }
      } else {
        const err = await response.json();
        if (DOM.loginErrorText) DOM.loginErrorText.textContent = err.error || 'Registration failed.';
        DOM.loginError.classList.remove('hidden');
      }
    } catch (err) {
      alert('Network error registering account.');
    }
    return;
  }

  // If we are in the OTP verification step
  if (state.loginTempToken && !state.loginTempToken.startsWith('temp-setup-')) {
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
        
        await fetchUserProfile(state.loginTempPassword);
        state.loginTempPassword = null;
        
        sessionStorage.removeItem('loginTempToken');
        sessionStorage.removeItem('loginTempPassword');
        sessionStorage.removeItem('loginTempUsername');
        sessionStorage.removeItem('loginModalOpen');
        localStorage.removeItem('loginTempToken');
        localStorage.removeItem('loginTempPassword');
        localStorage.removeItem('loginTempUsername');
        localStorage.removeItem('loginModalOpen');
        
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
      alert('Network error verifying 2FA. Check your connectivity.');
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
      
      if (data.requireTotpSetup) {
        // Enforce mandatory TOTP Setup Wizard
        state.loginTempToken = data.tempToken;
        sessionStorage.setItem('loginTempToken', data.tempToken);
        sessionStorage.setItem('loginModalOpen', 'totp-setup');
        localStorage.setItem('loginTempToken', data.tempToken);
        localStorage.setItem('loginModalOpen', 'totp-setup');
        try {
          const setupRes = await fetch('/api/login/totp-setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tempToken: data.tempToken })
          });
          if (setupRes.ok) {
            const setupData = await setupRes.json();
            DOM.totpManualSecret.textContent = setupData.secret;
            DOM.totpQrImg.src = setupData.qrUrl;
            DOM.totpSetupCode.value = '';
            
            DOM.totpSetupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          } else {
            alert('Failed to initiate mandatory 2FA setup.');
          }
        } catch (err) {
          alert('Network error initiating 2FA setup.');
        }
        return;
      }
      
      if (data.requireOtp) {
        // Switch to OTP step
        state.loginTempPassword = password;
        state.loginTempToken = data.tempToken;
        sessionStorage.setItem('loginTempPassword', password);
        sessionStorage.setItem('loginTempToken', data.tempToken);
        sessionStorage.setItem('loginTempUsername', username);
        sessionStorage.setItem('loginModalOpen', 'otp');
        localStorage.setItem('loginTempPassword', password);
        localStorage.setItem('loginTempToken', data.tempToken);
        localStorage.setItem('loginTempUsername', username);
        localStorage.setItem('loginModalOpen', 'otp');

        const credentialsSec = document.getElementById('login-credentials-section');
        if (credentialsSec) credentialsSec.classList.add('hidden');
        if (DOM.loginUsername) DOM.loginUsername.removeAttribute('required');
        if (DOM.loginPassword) DOM.loginPassword.removeAttribute('required');
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
        
        sessionStorage.removeItem('loginTempToken');
        sessionStorage.removeItem('loginTempPassword');
        sessionStorage.removeItem('loginTempUsername');
        sessionStorage.removeItem('loginModalOpen');
        localStorage.removeItem('loginTempToken');
        localStorage.removeItem('loginTempPassword');
        localStorage.removeItem('loginTempUsername');
        localStorage.removeItem('loginModalOpen');
        
        await fetchUserProfile(password);
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
    alert('Network error authenticating. Check your connectivity.');
  }
}

function handleLogout() {
  if (window.SecurityEngine) {
    window.SecurityEngine.lockVault();
  }
  state.isAuthenticated = false;
  state.authToken = null;
  state.userRole = null;
  state.deletedDbRecords = [];
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('activeTab');
  updateAuthUI();
  resetSettingsRoleCards();
  
  // Refresh views
  renderFormCreator();
  renderDBTable();
  renderDeletedDraftsTable();
  resetTotpUI();
}

function openChangePasswordModal(isForced = false) {
  if (!state.isAuthenticated) return;

  if (DOM.changePasswordModal) {
    DOM.changePasswordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Set Username/User ID input field value
  if (DOM.changeUserUsername) {
    DOM.changeUserUsername.value = state.username || '';
    if (state.userRole === 'admin') {
      DOM.changeUserUsername.removeAttribute('readonly');
      DOM.changeUserUsername.style.opacity = '1';
      DOM.changeUserUsername.style.cursor = 'text';
    } else {
      DOM.changeUserUsername.setAttribute('readonly', 'true');
      DOM.changeUserUsername.style.opacity = '0.7';
      DOM.changeUserUsername.style.cursor = 'not-allowed';
    }
  }

  // Reset fields
  if (DOM.changeUserCurrentPassword) DOM.changeUserCurrentPassword.value = '';
  if (DOM.changeUserNewPassword) DOM.changeUserNewPassword.value = '';
  if (DOM.changeUserConfirmNewPassword) DOM.changeUserConfirmNewPassword.value = '';
  if (DOM.changeUserTotp) DOM.changeUserTotp.value = '';
  if (DOM.confirmCredentialsCheckbox) DOM.confirmCredentialsCheckbox.checked = false;
  if (DOM.submitChangePasswordBtn) DOM.submitChangePasswordBtn.disabled = true;

  // Setup title & warning
  if (DOM.changePasswordModalTitle) {
    DOM.changePasswordModalTitle.textContent = state.userRole === 'admin' ? '🔐 Change Admin Credentials' : '🔐 Change Password';
  }

  if (isForced || state.isDefaultAdmin) {
    if (DOM.defaultAdminWarning) DOM.defaultAdminWarning.classList.remove('hidden');
    // Hide Close/Cancel buttons in forced mode
    if (DOM.closeChangePasswordBtn) DOM.closeChangePasswordBtn.classList.add('hidden');
    if (DOM.cancelChangePasswordBtn) DOM.cancelChangePasswordBtn.classList.add('hidden');
  } else {
    if (DOM.defaultAdminWarning) DOM.defaultAdminWarning.classList.add('hidden');
    if (DOM.closeChangePasswordBtn) DOM.closeChangePasswordBtn.classList.remove('hidden');
    if (DOM.cancelChangePasswordBtn) DOM.cancelChangePasswordBtn.classList.remove('hidden');
  }
}

function closeChangePasswordModal() {
  if (state.isDefaultAdmin) {
    alert("You must change your default admin credentials before using the application.");
    return;
  }
  if (DOM.changePasswordModal) {
    DOM.changePasswordModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function validateChangePasswordForm() {
  const currentPasswordVal = DOM.changeUserCurrentPassword ? DOM.changeUserCurrentPassword.value : '';
  const newPasswordVal = DOM.changeUserNewPassword ? DOM.changeUserNewPassword.value : '';
  const confirmNewPasswordVal = DOM.changeUserConfirmNewPassword ? DOM.changeUserConfirmNewPassword.value : '';
  const checkboxChecked = DOM.confirmCredentialsCheckbox ? DOM.confirmCredentialsCheckbox.checked : false;
  
  let isValid = currentPasswordVal.length > 0 &&
                newPasswordVal.length > 0 &&
                newPasswordVal === confirmNewPasswordVal &&
                checkboxChecked;
                
  if (DOM.submitChangePasswordBtn) {
    DOM.submitChangePasswordBtn.disabled = !isValid;
  }
}

async function handleChangePasswordSubmit(e) {
  e.preventDefault();
  if (!state.isAuthenticated || !state.isOnline) return;

  const currentPassword = DOM.changeUserCurrentPassword.value;
  const newUsername = DOM.changeUserUsername.value.trim();
  const newPassword = DOM.changeUserNewPassword.value;
  const confirmNewPassword = DOM.changeUserConfirmNewPassword.value;
  const code = DOM.changeUserTotp.value.trim();

  if (newPassword !== confirmNewPassword) {
    alert("New passwords do not match.");
    return;
  }

  if (!DOM.confirmCredentialsCheckbox.checked) {
    alert("Please check the confirmation checkbox before submitting.");
    return;
  }

  DOM.submitChangePasswordBtn.disabled = true;
  DOM.submitChangePasswordBtn.textContent = 'Updating...';

  // Derive old KEK
  let oldKek = sessionStorage.getItem('encryptionKek');
  if (!oldKek && currentPassword && state.userSaltB64) {
    try {
      oldKek = await window.SecurityEngine.deriveKek(currentPassword, state.userSaltB64);
    } catch (err) {
      console.warn("Could not derive old KEK:", err);
    }
  }

  // Generate new salt and new KEK
  const newSaltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const newSaltB64 = window.SecurityEngine.uint8ArrayToBase64(newSaltBytes);
  let newKek;
  try {
    newKek = await window.SecurityEngine.deriveKek(newPassword, newSaltB64);
  } catch (err) {
    alert("Failed to derive new KEK: " + err.message);
    DOM.submitChangePasswordBtn.disabled = false;
    DOM.submitChangePasswordBtn.textContent = 'Update Credentials';
    return;
  }

  let privateKey;
  let publicKeyB64 = state.publicKey;
  let encryptedPrivateKeyStr = state.encryptedPrivateKey;
  let wrappedVaultKeyStr = null;

  if (state.encryptedPrivateKey && oldKek) {
    try {
      const encPrivObj = JSON.parse(state.encryptedPrivateKey);
      privateKey = await window.SecurityEngine.decryptPrivateKey(encPrivObj.ciphertext, encPrivObj.iv, oldKek);
      const newEncPrivate = await window.SecurityEngine.encryptPrivateKey(privateKey, newKek);
      encryptedPrivateKeyStr = JSON.stringify(newEncPrivate);
    } catch (err) {
      alert("Verification failed: Could not decrypt private key. Check your current password.");
      DOM.submitChangePasswordBtn.disabled = false;
      DOM.submitChangePasswordBtn.textContent = 'Update Credentials';
      return;
    }
  } else {
    // Generate new keypair if none existed (e.g. default admin first login)
    try {
      const keypair = await window.SecurityEngine.generateKeyPair();
      privateKey = keypair.privateKey;
      publicKeyB64 = keypair.publicKeyB64;
      const newEncPrivate = await window.SecurityEngine.encryptPrivateKey(privateKey, newKek);
      encryptedPrivateKeyStr = JSON.stringify(newEncPrivate);
      
      // Wrap the active vault key
      wrappedVaultKeyStr = await window.SecurityEngine.wrapVaultKey(publicKeyB64);
    } catch (err) {
      alert("Failed to generate secure credentials: " + err.message);
      DOM.submitChangePasswordBtn.disabled = false;
      DOM.submitChangePasswordBtn.textContent = 'Update Credentials';
      return;
    }
  }

  const isAdminUpdate = state.userRole === 'admin';
  const url = isAdminUpdate ? '/api/settings/credentials' : '/api/settings/change-password';
  
  const requestBody = isAdminUpdate 
    ? { currentPassword, newUsername, newPassword, code, publicKey: publicKeyB64, encryptedPrivateKey: encryptedPrivateKeyStr, wrappedVaultKey: wrappedVaultKeyStr, salt: newSaltB64 }
    : { currentPassword, newPassword, code, encryptedPrivateKey: encryptedPrivateKeyStr, salt: newSaltB64 };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      alert(isAdminUpdate ? 'Admin credentials updated successfully! Please log in again.' : 'Password updated successfully! Please log in again.');
      
      if (isAdminUpdate && state.username === 'admin' && newUsername !== 'admin') {
        alert("Consider Revoking the old ID");
      }

      state.isDefaultAdmin = false;
      sessionStorage.removeItem('encryptionKek');
      closeChangePasswordModal();
      handleLogout();
    } else {
      const err = await response.json();
      alert('Error updating credentials: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Network error updating credentials.');
  } finally {
    DOM.submitChangePasswordBtn.disabled = false;
    DOM.submitChangePasswordBtn.textContent = 'Update Credentials';
  }
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

  DOM.submitCredentialsBtn.disabled = true;
  DOM.submitCredentialsBtn.textContent = 'Updating...';

  // Derive old KEK
  let oldKek = sessionStorage.getItem('encryptionKek');
  if (!oldKek && currentPassword && state.userSaltB64) {
    try {
      oldKek = await window.SecurityEngine.deriveKek(currentPassword, state.userSaltB64);
    } catch (err) {
      console.warn("Could not derive old KEK:", err);
    }
  }

  // Generate new salt and new KEK
  const newSaltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const newSaltB64 = window.SecurityEngine.uint8ArrayToBase64(newSaltBytes);
  let newKek;
  try {
    newKek = await window.SecurityEngine.deriveKek(newPassword, newSaltB64);
  } catch (err) {
    alert("Failed to derive new KEK: " + err.message);
    DOM.submitCredentialsBtn.disabled = false;
    DOM.submitCredentialsBtn.textContent = 'Update Credentials';
    return;
  }

  let privateKey;
  let publicKeyB64 = state.publicKey;
  let encryptedPrivateKeyStr = state.encryptedPrivateKey;
  let wrappedVaultKeyStr = null;

  if (state.encryptedPrivateKey && oldKek) {
    try {
      const encPrivObj = JSON.parse(state.encryptedPrivateKey);
      privateKey = await window.SecurityEngine.decryptPrivateKey(encPrivObj.ciphertext, encPrivObj.iv, oldKek);
      const newEncPrivate = await window.SecurityEngine.encryptPrivateKey(privateKey, newKek);
      encryptedPrivateKeyStr = JSON.stringify(newEncPrivate);
    } catch (err) {
      alert("Verification failed: Could not decrypt private key. Check your current password.");
      DOM.submitCredentialsBtn.disabled = false;
      DOM.submitCredentialsBtn.textContent = 'Update Credentials';
      return;
    }
  } else {
    // Generate new keypair if none existed
    try {
      const keypair = await window.SecurityEngine.generateKeyPair();
      privateKey = keypair.privateKey;
      publicKeyB64 = keypair.publicKeyB64;
      const newEncPrivate = await window.SecurityEngine.encryptPrivateKey(privateKey, newKek);
      encryptedPrivateKeyStr = JSON.stringify(newEncPrivate);
      wrappedVaultKeyStr = await window.SecurityEngine.wrapVaultKey(publicKeyB64);
    } catch (err) {
      alert("Failed to generate secure credentials: " + err.message);
      DOM.submitCredentialsBtn.disabled = false;
      DOM.submitCredentialsBtn.textContent = 'Update Credentials';
      return;
    }
  }

  try {
    const response = await fetch('/api/settings/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ 
        currentPassword, 
        newUsername, 
        newPassword, 
        code,
        publicKey: publicKeyB64,
        encryptedPrivateKey: encryptedPrivateKeyStr,
        wrappedVaultKey: wrappedVaultKeyStr,
        salt: newSaltB64
      })
    });

    if (response.ok) {
      alert('Admin credentials updated successfully! Please log in again with your new credentials.');
      if (DOM.changeCurrentPassword) DOM.changeCurrentPassword.value = '';
      if (DOM.changeAdmin2fa) DOM.changeAdmin2fa.value = '';
      DOM.changeAdminUsername.value = '';
      DOM.changeAdminPassword.value = '';
      sessionStorage.removeItem('encryptionKek');
      handleLogout();
    } else {
      const err = await response.json();
      alert('Error updating credentials: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Network error updating credentials. Check your connectivity.');
  } finally {
    DOM.submitCredentialsBtn.disabled = false;
    DOM.submitCredentialsBtn.textContent = 'Update Credentials';
  }
}

function updateAuthUI() {
  const authBtnIcon = DOM.authBtn.querySelector('.btn-icon');
  
  // Show/hide nav items based on authentication and roles
  DOM.navItems.forEach(item => {
    const tab = item.dataset.tab;
    if (!state.isAuthenticated) {
      // Guest mode
      if (tab === 'data-entry' || tab === 'break-game') {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    } else {
      // Authenticated mode
      if (state.userRole === 'admin') {
        item.style.display = 'flex';
      } else if (state.userRole === 'viewer') {
        // Viewers see ONLY Reports and Analytics
        if (tab === 'db-viewer' || tab === 'data-analysis') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      } else if (state.userRole === 'user') {
        // Dataentry users see ONLY Data Entry and Quick Break
        if (tab === 'data-entry' || tab === 'break-game') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      } else {
        if (tab === 'data-entry' || tab === 'break-game') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      }
    }
  });

  // Toggle debug console visibility based on authentication
  const debugBtn = document.getElementById('debug-toggle-btn');
  const debugPanel = document.getElementById('debug-overlay-panel');

  const guestPrompt = document.getElementById('data-entry-guest-prompt');
  const formCard = document.getElementById('data-entry-form-card');
  const draftsCard = document.getElementById('drafts-preview-card');

  if (state.isAuthenticated) {
    if (guestPrompt) guestPrompt.style.display = 'none';
    if (formCard) formCard.style.display = 'block';
    if (draftsCard) draftsCard.style.display = 'block';

    DOM.authBtn.className = 'btn btn-secondary';
    DOM.authBtn.title = 'Logout';
    DOM.authBtn.setAttribute('aria-label', 'Logout');
    DOM.authBtnText.textContent = 'Logout';
    if (authBtnIcon) authBtnIcon.textContent = '🔓';

    if (DOM.userProfileHeader) {
      DOM.userProfileHeader.classList.remove('hidden');
      if (DOM.loggedInUserName) {
        DOM.loggedInUserName.textContent = state.username || 'user';
      }
    }

    let roleName = 'User';
    if (state.userRole === 'admin') roleName = 'Admin';
    else if (state.userRole === 'viewer') roleName = 'Viewer';
    DOM.sessionStatusDisplay.className = 'status-logged-in';
    DOM.sessionStatusDisplay.textContent = `${roleName} Mode`;

    DOM.creatorAdminWarning.className = 'alert-box alert-warning hidden';
    DOM.saveSchemaBtn.removeAttribute('disabled');
    DOM.submitCredentialsBtn.removeAttribute('disabled');
    if (DOM.clearDatabaseBtn) DOM.clearDatabaseBtn.removeAttribute('disabled');
    if (DOM.clearUsersBtn) DOM.clearUsersBtn.removeAttribute('disabled');
    if (DOM.localBackupExportBtn) DOM.localBackupExportBtn.removeAttribute('disabled');
    if (DOM.localBackupRestoreBtn) DOM.localBackupRestoreBtn.removeAttribute('disabled');
  } else {
    if (guestPrompt) guestPrompt.style.display = 'block';
    if (formCard) formCard.style.display = 'none';
    if (draftsCard) draftsCard.style.display = 'none';

    if (DOM.userProfileHeader) {
      DOM.userProfileHeader.classList.add('hidden');
    }

    DOM.authBtn.className = 'btn btn-secondary';
    DOM.authBtn.title = 'Login';
    DOM.authBtn.setAttribute('aria-label', 'Login');
    DOM.authBtnText.textContent = 'Login';
    if (authBtnIcon) authBtnIcon.textContent = '🔒';
    DOM.sessionStatusDisplay.className = 'status-logged-out';
    DOM.sessionStatusDisplay.textContent = 'Guest Mode';
    DOM.creatorAdminWarning.className = 'alert-box alert-warning';
    DOM.saveSchemaBtn.setAttribute('disabled', 'true');
    DOM.submitCredentialsBtn.setAttribute('disabled', 'true');
    if (DOM.clearDatabaseBtn) DOM.clearDatabaseBtn.setAttribute('disabled', 'true');
    if (DOM.clearUsersBtn) DOM.clearUsersBtn.setAttribute('disabled', 'true');
    if (DOM.localBackupExportBtn) DOM.localBackupExportBtn.setAttribute('disabled', 'true');
    if (DOM.localBackupRestoreBtn) DOM.localBackupRestoreBtn.setAttribute('disabled', 'true');
    
    // Fallback if the user logs out from a restricted tab
    if (state.activeTab !== 'data-entry' && state.activeTab !== 'break-game') {
      switchToTab('data-entry');
    }
  }

  // Always show debug toggle button to allow inspection of logs in case of runtime errors
  if (debugBtn) debugBtn.style.display = 'flex';
}

async function fetchUserProfile(loginPassword = null) {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;
  try {
    const res = await fetch('/api/bootstrap', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      state.userRole = data.role;
      state.username = data.username;
      state.isDefaultAdmin = data.isDefaultAdmin;
      state.encryptedPrivateKey = data.encryptedPrivateKey;
      state.publicKey = data.publicKey;
      state.userSaltB64 = data.salt;
      updateAuthUI();
      updateSettingsRoleCards(data.role);

      if (state.isDefaultAdmin) {
        // Automatically pop up the password change modal in forced mode
        openChangePasswordModal(true);
      }

      // E2EE Asymmetric Key Unwrapping
      let kek = sessionStorage.getItem('encryptionKek');
      if (!kek && loginPassword && data.salt) {
        try {
          kek = await window.SecurityEngine.deriveKek(loginPassword, data.salt);
          sessionStorage.setItem('encryptionKek', kek);
        } catch (deriveErr) {
          console.error("Failed to derive KEK from password:", deriveErr);
        }
      }

      if (kek && data.encryptedPrivateKey && data.wrappedVaultKey) {
        try {
          const encPrivObj = JSON.parse(data.encryptedPrivateKey);
          let privateKey;
          try {
            privateKey = await window.SecurityEngine.decryptPrivateKey(encPrivObj.ciphertext, encPrivObj.iv, kek);
          } catch (decErr) {
            throw decErr;
          }

          await window.SecurityEngine.unwrapVaultKey(data.wrappedVaultKey, privateKey, data.role === 'admin');
          
          const keyStatusInput = document.getElementById('display-key-status');
          if (keyStatusInput) {
            keyStatusInput.value = 'RAM VOLATILE LOCKED-IN';
          }
          
          // Load and decrypt drafts once vault key is established
          await loadDraftsFromStorage();
          renderDraftsTable();
          renderSyncTable();

          // Re-fetch database records now that we have the correct vault key
          if (state.activeTab === 'db-viewer' || state.activeTab === 'data-analysis') {
            fetchDatabaseRecords();
          }
        } catch (cryptErr) {
          console.error("Failed to decrypt E2EE private key or unwrap vault key:", cryptErr);
        }
      } else if (data.vaultKey) {
        try {
          await window.SecurityEngine.unlockVault(data.vaultKey, data.role === 'admin');
          console.log('Cryptographic boundary established for onboarding.');
          
          const keyStatusInput = document.getElementById('display-key-status');
          if (keyStatusInput) {
            keyStatusInput.value = 'RAM VOLATILE LOCKED-IN';
          }
          
          await loadDraftsFromStorage();
          renderDraftsTable();
          renderSyncTable();

          if (state.activeTab === 'db-viewer' || state.activeTab === 'data-analysis') {
            fetchDatabaseRecords();
          }
        } catch (cryptErr) {
          console.error("Failed to unlock onboarding vault:", cryptErr);
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
  }
}

function updateSettingsRoleCards(role) {
  const adminPanel = document.getElementById('admin-management-panel');
  const adminCredentialsCard = document.getElementById('admin-credentials-card');
  const dangerZoneCard = document.getElementById('danger-zone-card');
  const localBackupCard = document.getElementById('local-backup-card');
  
  if (role === 'admin') {
    if (adminPanel) adminPanel.classList.remove('hidden');
    if (adminCredentialsCard) adminCredentialsCard.classList.remove('hidden');
    if (dangerZoneCard) dangerZoneCard.classList.remove('hidden');
    if (localBackupCard) localBackupCard.classList.remove('hidden');
  } else {
    if (adminPanel) adminPanel.classList.add('hidden');
    if (adminCredentialsCard) adminCredentialsCard.classList.add('hidden');
    if (dangerZoneCard) dangerZoneCard.classList.add('hidden');
    if (localBackupCard) localBackupCard.classList.add('hidden');
  }
}

function resetSettingsRoleCards() {
  const adminPanel = document.getElementById('admin-management-panel');
  const adminCredentialsCard = document.getElementById('admin-credentials-card');
  const dangerZoneCard = document.getElementById('danger-zone-card');
  const localBackupCard = document.getElementById('local-backup-card');
  
  if (adminPanel) adminPanel.classList.add('hidden');
  if (adminCredentialsCard) adminCredentialsCard.classList.add('hidden');
  if (dangerZoneCard) dangerZoneCard.classList.add('hidden');
  if (localBackupCard) localBackupCard.classList.add('hidden');
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
    console.warn('Could not fetch schema from server. Falling back to cached schema.');
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
    alert('Failed to save schema. Check your connectivity.');
  }
}

// Client-side helper to recalculate serial numbers sequentially (sorted by date and time)
function recalculateClientSerials() {
  const records = state.dbRecords || [];
  if (records.length === 0) return;

  // Find schema fields for time
  const timeField = state.schema.find(f => f.type === 'time' || f.id.toLowerCase().includes('time') || f.id.toLowerCase().includes('timeob'));
  const timeFieldId = timeField ? timeField.id : 'timeob';

  // Helper to convert 12h or 24h time string to minutes since midnight
  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 9999;
    const cleanStr = timeStr.toString().trim();
    
    // Check if 12h format (e.g. "03:15 PM" or "12:05 AM")
    const match12 = cleanStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (match12) {
      let hours = parseInt(match12[1]);
      const minutes = parseInt(match12[2]);
      const ampm = match12[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    }

    // Check if 24h format (e.g. "15:15" or "00:05")
    const match24 = cleanStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const hours = parseInt(match24[1]);
      const minutes = parseInt(match24[2]);
      return hours * 60 + minutes;
    }

    return 9999;
  }

  // Sort sequentially: 1st by date ascending, 2nd by time ascending, 3rd by DB ID ascending
  records.sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    const dateCompare = dateA.localeCompare(dateB);
    if (dateCompare !== 0) return dateCompare;

    const timeA = parseTimeToMinutes(a.data ? a.data[timeFieldId] : '');
    const timeB = parseTimeToMinutes(b.data ? b.data[timeFieldId] : '');
    if (timeA !== timeB) return timeA - timeB;

    return a.id - b.id;
  });

  const annualCounters = {};
  const monthlyCounters = {};

  const annualField = state.schema.find(f => f.id === 'annual_serial' || f.title.toLowerCase().includes('annual'));
  const monthlyField = state.schema.find(f => f.id === 'monthly_sl_no' || f.title.toLowerCase().includes('monthly'));

  const annualFieldId = annualField ? annualField.id : 'annual_serial';
  const monthlyFieldId = monthlyField ? monthlyField.id : 'monthly_sl_no';

  for (const rec of records) {
    if (!rec.date) continue;
    const parts = rec.date.split('-');
    if (parts.length !== 3) continue;
    const year = parts[0];
    const month = parts[1];
    const yearMonth = `${year}-${month}`;

    annualCounters[year] = (annualCounters[year] || 0) + 1;
    monthlyCounters[yearMonth] = (monthlyCounters[yearMonth] || 0) + 1;

    if (!rec.data) {
      rec.data = {};
    }
    rec.data[annualFieldId] = annualCounters[year];
    rec.data[monthlyFieldId] = monthlyCounters[yearMonth];
  }
}

async function fetchDatabaseRecords() {
  if (!state.isOnline) return;

  try {
    const response = await fetch('/api/entries?_t=' + Date.now());
    if (response.ok) {
      state.dbRecords = await response.json();
      
      // Decrypt database records inline if key is loaded in memory
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        const selectedMonth = DOM.filterMonth ? DOM.filterMonth.value : 'all';
        const selectedYear = DOM.filterYear ? DOM.filterYear.value : 'all';
        
        const priorityRecords = [];
        const otherRecords = [];
        
        for (const rec of state.dbRecords) {
          if (rec.data && rec.data.ciphertext && rec.data.iv) {
            if (!rec.date) {
              otherRecords.push(rec);
              continue;
            }
            const [yr, mo] = rec.date.split('-');
            const matchMonth = (selectedMonth === 'all' || mo === selectedMonth);
            const matchYear = (selectedYear === 'all' || yr === selectedYear);
            if (matchMonth && matchYear) {
              priorityRecords.push(rec);
            } else {
              otherRecords.push(rec);
            }
          }
        }
        
        // 1. Decrypt priority records first in parallel
        if (priorityRecords.length > 0) {
          await Promise.all(priorityRecords.map(async (rec) => {
            try {
              const decText = await window.SecurityEngine.decryptPayload(rec.data.ciphertext, rec.data.iv);
              rec.encryptedData = rec.data;
              rec.data = JSON.parse(decText);
            } catch (e) {
              console.warn('Failed to decrypt priority record', rec.id, e);
            }
          }));
          
          // Render immediately once priority records are decrypted
          recalculateClientSerials();
          renderDBTable();
          populateYearFilters();
        }
        
        // 2. Decrypt remaining records in parallel in the background
        if (otherRecords.length > 0) {
          Promise.all(otherRecords.map(async (rec) => {
            try {
              const decText = await window.SecurityEngine.decryptPayload(rec.data.ciphertext, rec.data.iv);
              rec.encryptedData = rec.data;
              rec.data = JSON.parse(decText);
            } catch (e) {
              console.warn('Failed to decrypt background record', rec.id, e);
            }
          })).then(() => {
            recalculateClientSerials();
            // Re-render if the user switched filter, or just update the table quietly
            renderDBTable();
          });
        }
      }
      
      // Recalculate serial numbers client-side (after decryption)
      recalculateClientSerials();
      
      renderDBTable();
      populateYearFilters();

      // Update reports count badge
      const reportsBadge = document.getElementById('reports-count-badge');
      if (reportsBadge) {
        reportsBadge.textContent = state.dbRecords.length;
      }

      // Fetch deleted database records to keep Trash Bin synchronized
      if (state.isAuthenticated) {
        await fetchDeletedDbRecords();
      }

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

async function fetchDeletedDbRecords() {
  if (!state.isOnline || !state.isAuthenticated) return;
  try {
    const response = await fetch('/api/entries/trash?_t=' + Date.now(), {
      headers: {
        'Authorization': `Bearer ${state.authToken}`
      }
    });
    if (response.ok) {
      state.deletedDbRecords = await response.json();
      
      // Decrypt deleted db records
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        await Promise.all(state.deletedDbRecords.map(async (rec) => {
          if (rec.data && rec.data.ciphertext && rec.data.iv) {
            try {
              const decText = await window.SecurityEngine.decryptPayload(rec.data.ciphertext, rec.data.iv);
              rec.encryptedData = rec.data;
              rec.data = JSON.parse(decText);
            } catch (e) {
              console.warn('Failed to decrypt deleted record', rec.id, e);
            }
          }
        }));
      }
      renderDeletedDraftsTable();
    }
  } catch (err) {
    console.error('Error fetching deleted database records:', err);
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
    formGroup.appendChild(input);
    
    // Track active voice-enabled field to receive voice typing input
    if (field.voiceEnabled === true && field.type !== 'date') {
      if (field.type === 'time' && field.timeFormat === '12h') {
        const hiddenInput = formGroup.querySelector(`input[id="input-${field.id}"]`);
        const selects = input.querySelectorAll('select');
        selects.forEach(sel => {
          sel.addEventListener('focus', () => {
            state.lastActiveVoiceInput = hiddenInput.id;
            highlightActiveVoiceInput(hiddenInput);
          });
          sel.addEventListener('blur', () => {
            if (!activeSpeechInput) {
              selects.forEach(s => s.classList.remove('voice-active'));
            }
          });
        });
      } else {
        input.addEventListener('focus', () => {
          state.lastActiveVoiceInput = input.id;
          highlightActiveVoiceInput(input);
        });
        input.addEventListener('blur', () => {
          if (!activeSpeechInput) {
            input.classList.remove('voice-active');
          }
        });
      }
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
  renderSyncTable();
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
    voiceCheckbox.disabled = (field.id === 'date' || field.type === 'date');
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

  // Mobile Single-Field Card UI Synchronization
  const totalCount = state.formCreatorSchema.length;
  const totalFieldsSpan = document.getElementById('creator-total-fields-count');
  if (totalFieldsSpan) totalFieldsSpan.textContent = totalCount;
  const totalFieldsSpanTop = document.getElementById('creator-total-fields-count-top');
  if (totalFieldsSpanTop) totalFieldsSpanTop.textContent = totalCount;

  if (state.formCreatorActiveIndex === undefined || state.formCreatorActiveIndex >= totalCount) {
    state.formCreatorActiveIndex = 0;
  }
  
  const currentIdxSpan = document.getElementById('creator-current-field-index');
  if (currentIdxSpan) currentIdxSpan.textContent = totalCount > 0 ? (state.formCreatorActiveIndex + 1) : 0;
  const currentIdxSpanTop = document.getElementById('creator-current-field-index-top');
  if (currentIdxSpanTop) currentIdxSpanTop.textContent = totalCount > 0 ? (state.formCreatorActiveIndex + 1) : 0;

  const prevBtn = document.getElementById('creator-prev-field-btn');
  const nextBtnEl = document.getElementById('creator-next-field-btn');
  if (prevBtn) prevBtn.disabled = (state.formCreatorActiveIndex === 0);
  if (nextBtnEl) nextBtnEl.disabled = (state.formCreatorActiveIndex >= totalCount - 1);

  const mobileContainer = document.getElementById('mobile-field-editor-container');
  if (mobileContainer) {
    mobileContainer.innerHTML = '';
    if (totalCount > 0) {
      const field = state.formCreatorSchema[state.formCreatorActiveIndex];
      const index = state.formCreatorActiveIndex;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.style.display = 'flex';
      actionsDiv.style.justifyContent = 'space-between';
      actionsDiv.style.alignItems = 'center';
      
      const posLabel = document.createElement('span');
      posLabel.innerHTML = `Position: <span class="position-badge">${index + 1}</span>`;
      
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-danger';
      delBtn.style.padding = '4px 8px';
      delBtn.style.fontSize = '0.75rem';
      delBtn.textContent = '🗑️ Delete';
      delBtn.disabled = (field.id === 'date');
      delBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.formCreatorSchema.splice(index, 1);
        if (state.formCreatorActiveIndex > 0) state.formCreatorActiveIndex--;
        renderFormCreator();
      });
      
      actionsDiv.appendChild(posLabel);
      actionsDiv.appendChild(delBtn);
      mobileContainer.appendChild(actionsDiv);
      
      const titleGroup = document.createElement('div');
      titleGroup.className = 'form-group';
      const titleLabel = document.createElement('label');
      titleLabel.textContent = 'Field Title (Display Name)';
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'form-control';
      titleInput.value = field.title;
      titleInput.disabled = (field.id === 'date');
      titleInput.addEventListener('input', (e) => {
        state.formCreatorSchema[index].title = e.target.value;
      });
      titleGroup.appendChild(titleLabel);
      titleGroup.appendChild(titleInput);
      mobileContainer.appendChild(titleGroup);

      if (field.type === 'select') {
        const optionsGroup = document.createElement('div');
        optionsGroup.className = 'form-group';
        const optionsLabel = document.createElement('label');
        optionsLabel.textContent = 'Options (comma-separated)';
        const optionsInput = document.createElement('input');
        optionsInput.type = 'text';
        optionsInput.className = 'form-control';
        optionsInput.placeholder = 'e.g. Yes, No, N/A';
        optionsInput.value = field.options ? field.options.join(', ') : '';
        optionsInput.addEventListener('input', (e) => {
          state.formCreatorSchema[index].options = e.target.value
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        });
        optionsGroup.appendChild(optionsLabel);
        optionsGroup.appendChild(optionsInput);
        mobileContainer.appendChild(optionsGroup);
      }
      
      const typeGroup = document.createElement('div');
      typeGroup.className = 'form-group';
      const typeLabel = document.createElement('label');
      typeLabel.textContent = 'Data Type';
      const typeSelect = document.createElement('select');
      typeSelect.className = 'form-select';
      typeSelect.disabled = (field.id === 'date');
      
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
        if (e.target.value === 'select' && !state.formCreatorSchema[index].options) {
          state.formCreatorSchema[index].options = ['Option 1', 'Option 2'];
        }
        renderFormCreator();
      });
      typeGroup.appendChild(typeLabel);
      typeGroup.appendChild(typeSelect);
      mobileContainer.appendChild(typeGroup);
      
      if (field.type === 'time') {
        const formatGroup = document.createElement('div');
        formatGroup.style.display = 'flex';
        formatGroup.style.alignItems = 'center';
        formatGroup.style.gap = '8px';
        formatGroup.style.marginTop = '4px';
        
        const formatCheckbox = document.createElement('input');
        formatCheckbox.type = 'checkbox';
        formatCheckbox.id = `mobile-time-format-${field.id}`;
        formatCheckbox.checked = field.timeFormat === '12h';
        formatCheckbox.addEventListener('change', (e) => {
          state.formCreatorSchema[index].timeFormat = e.target.checked ? '12h' : '24h';
        });
        
        const formatLabel = document.createElement('label');
        formatLabel.setAttribute('for', `mobile-time-format-${field.id}`);
        formatLabel.textContent = 'Enable 12-hour format AM/PM';
        formatLabel.style.fontSize = '0.8rem';
        formatLabel.style.marginBottom = '0';
        
        formatGroup.appendChild(formatCheckbox);
        formatGroup.appendChild(formatLabel);
        mobileContainer.appendChild(formatGroup);
      }
      
      const voiceGroup = document.createElement('div');
      voiceGroup.style.display = 'flex';
      voiceGroup.style.alignItems = 'center';
      voiceGroup.style.gap = '8px';
      voiceGroup.style.marginTop = '4px';
      
      const voiceCheckbox = document.createElement('input');
      voiceCheckbox.type = 'checkbox';
      voiceCheckbox.id = `mobile-voice-${field.id}`;
      voiceCheckbox.checked = !!field.voiceEnabled;
      voiceCheckbox.disabled = (field.id === 'date' || field.type === 'date');
      voiceCheckbox.addEventListener('change', (e) => {
        state.formCreatorSchema[index].voiceEnabled = e.target.checked;
      });
      
      const voiceLabel = document.createElement('label');
      voiceLabel.setAttribute('for', `mobile-voice-${field.id}`);
      voiceLabel.textContent = 'Enable Voice Input helper';
      voiceLabel.style.fontSize = '0.8rem';
      voiceLabel.style.marginBottom = '0';
      
      voiceGroup.appendChild(voiceCheckbox);
      voiceGroup.appendChild(voiceLabel);
      mobileContainer.appendChild(voiceGroup);
    } else {
      mobileContainer.innerHTML = '<p class="text-center text-muted">No fields defined yet. Click Add Field above.</p>';
    }
  }
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
    DOM.draftSummaryText.textContent = 'No draft entries';
    DOM.syncTableBody.innerHTML = `
      <tr>
        <td colspan="100%" class="text-center text-muted py-4">No local drafts to push. Use the Data Entry view to add records.</td>
      </tr>
    `;
    updatePushSelectedBtnState();
    return;
  }

  DOM.draftSummaryText.textContent = `${state.drafts.length} draft entries saved locally`;

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
    rejectBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to move this draft entry to the Trash Bin?')) {
        const deletedItem = state.drafts.splice(index, 1)[0];
        deletedItem.verified = false;
        state.deletedDrafts.push(deletedItem);
        await saveDraftsToStorage();
        await saveDeletedDraftsToStorage();
        renderSyncTable();
        renderDeletedDraftsTable();
        
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
  const countEl = document.getElementById('push-count-text');
  if (countEl) countEl.textContent = verifiedCount;
  
  if (state.isOnline && verifiedCount > 0) {
    DOM.pushSelectedBtn.removeAttribute('disabled');
  } else {
    DOM.pushSelectedBtn.setAttribute('disabled', 'true');
  }

  // Reject selected button (Move to Trash)
  if (DOM.rejectSelectedBtn) {
    const rejectCountEl = document.getElementById('reject-count-text');
    if (rejectCountEl) rejectCountEl.textContent = verifiedCount;
    if (verifiedCount > 0) {
      DOM.rejectSelectedBtn.removeAttribute('disabled');
    } else {
      DOM.rejectSelectedBtn.setAttribute('disabled', 'true');
    }
  }
}

async function rejectSelectedDrafts() {
  const toReject = state.drafts.filter(d => d.verified);
  if (toReject.length === 0) return;

  if (!confirm(`Are you sure you want to move the ${toReject.length} selected draft entry/entries to the Trash Bin?`)) {
    return;
  }

  const remainingDrafts = [];
  state.drafts.forEach(d => {
    if (d.verified) {
      d.verified = false;
      state.deletedDrafts.push(d);
    } else {
      remainingDrafts.push(d);
    }
  });

  state.drafts = remainingDrafts;
  await saveDraftsToStorage();
  await saveDeletedDraftsToStorage();
  
  // Refresh views
  renderSyncTable();
  renderDeletedDraftsTable();
  
  // Recalculate auto-generated serials
  const dateInput = document.getElementById('input-date');
  if (dateInput) {
    autoFillDateDependentFields(dateInput.value);
  }

  alert('Selected drafts moved to Trash.');
}

function selectAllDrafts(val) {
  state.drafts.forEach(d => d.verified = val);
  saveDraftsToStorage();
  
  // Update checkbox UI elements
  document.querySelectorAll('.draft-selector').forEach(cb => cb.checked = val);
  DOM.headerSelectAll.checked = val;
  updatePushSelectedBtnState();
}

// -------------------------------------------------------------
// TRASH BIN: DELETED DRAFTS RENDERER & ACTIONS
// -------------------------------------------------------------

function renderDeletedDraftsTable() {
  DOM.deletedDraftsTableHeader.innerHTML = '';
  DOM.deletedDraftsTableBody.innerHTML = '';

  if (state.schema.length === 0) return;

  // Render headers
  const selectTh = document.createElement('th');
  selectTh.width = '40';
  selectTh.appendChild(DOM.headerSelectAllDeleted);
  DOM.deletedDraftsTableHeader.appendChild(selectTh);

  state.schema.forEach(field => {
    const th = document.createElement('th');
    th.textContent = getFieldDisplayTitle(field);
    DOM.deletedDraftsTableHeader.appendChild(th);
  });

  const actionsTh = document.createElement('th');
  actionsTh.className = 'actions-col';
  actionsTh.textContent = 'Actions';
  DOM.deletedDraftsTableHeader.appendChild(actionsTh);

  // Combine local drafts and database records
  const localTrash = state.deletedDrafts.map((d, index) => ({
    ...d,
    type: 'draft',
    index: index
  }));
  const dbTrash = (state.deletedDbRecords || []).map((r, index) => ({
    ...r,
    type: 'db',
    index: index
  }));
  const combinedTrash = [...localTrash, ...dbTrash];
  const count = combinedTrash.length;

  DOM.deletedDraftsSummaryText.textContent = count > 0 ? `${count} items in trash` : 'Trash bin is empty';

  if (count === 0) {
    DOM.deletedDraftsTableBody.innerHTML = `
      <tr>
        <td colspan="100%" class="text-center text-muted py-4">Trash bin is empty.</td>
      </tr>
    `;
    updateDeletedCountBtnState();
    return;
  }

  combinedTrash.forEach((item) => {
    const tr = document.createElement('tr');
    if (item.type === 'draft') {
      tr.dataset.localId = item.localId;
    } else {
      tr.dataset.dbId = item.id;
    }

    // Checkbox selector
    const checkTd = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'deleted-selector';
    checkbox.checked = !!item.selectedForAction;
    checkbox.addEventListener('change', (e) => {
      if (item.type === 'draft') {
        state.deletedDrafts[item.index].selectedForAction = e.target.checked;
        saveDeletedDraftsToStorage();
      } else {
        state.deletedDbRecords[item.index].selectedForAction = e.target.checked;
      }
      updateDeletedCountBtnState();
    });
    checkTd.appendChild(checkbox);
    tr.appendChild(checkTd);

    // Fields
    state.schema.forEach(field => {
      const td = document.createElement('td');
      if (field.id === 'date') {
        td.textContent = formatDateDisplay(item.date);
      } else {
        td.textContent = formatDisplayValue(item.data[field.id], field);
      }
      tr.appendChild(td);
    });

    // Actions col
    const actionTd = document.createElement('td');
    actionTd.className = 'actions-col';

    // Restore btn
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn btn-link text-success p-0';
    restoreBtn.style.marginRight = '8px';
    restoreBtn.textContent = 'Restore';
    restoreBtn.addEventListener('click', async () => {
      if (item.type === 'draft') {
        const restored = state.deletedDrafts.splice(item.index, 1)[0];
        restored.verified = false;
        state.drafts.push(restored);
        await saveDraftsToStorage();
        await saveDeletedDraftsToStorage();
        renderSyncTable();
        renderDeletedDraftsTable();
      } else {
        try {
          const response = await fetch(`/api/entries/restore/${item.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${state.authToken}`
            }
          });
          if (response.ok) {
            await fetchDatabaseRecords();
          } else {
            alert('Failed to restore record');
          }
        } catch (e) {
          alert('Network error restoring record');
        }
      }
    });
    actionTd.appendChild(restoreBtn);

    // Permanent delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-link text-danger p-0';
    deleteBtn.style.color = 'var(--danger)';
    deleteBtn.textContent = 'Delete Forever';
    deleteBtn.addEventListener('click', async () => {
      const entityName = item.type === 'draft' ? 'draft' : 'database record';
      if (confirm(`⚠️ WARNING: Are you sure you want to permanently delete this ${entityName}? This action cannot be undone!`)) {
        if (item.type === 'draft') {
          state.deletedDrafts.splice(item.index, 1);
          await saveDeletedDraftsToStorage();
          renderDeletedDraftsTable();
        } else {
          try {
            const response = await fetch(`/api/entries/delete-permanent/${item.id}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${state.authToken}`
              }
            });
            if (response.ok) {
              await fetchDatabaseRecords();
            } else {
              alert('Failed to permanently delete record');
            }
          } catch (e) {
            alert('Network error permanently deleting record');
          }
        }
      }
    });
    actionTd.appendChild(deleteBtn);

    tr.appendChild(actionTd);
    DOM.deletedDraftsTableBody.appendChild(tr);
  });

  updateDeletedCountBtnState();
}

function updateDeletedCountBtnState() {
  const localCount = state.deletedDrafts.filter(d => d.selectedForAction).length;
  const dbCount = (state.deletedDbRecords || []).filter(d => d.selectedForAction).length;
  const selectedCount = localCount + dbCount;
  DOM.restoreCountText.textContent = selectedCount;
  DOM.deletePermanentlyCountText.textContent = selectedCount;

  if (selectedCount > 0) {
    DOM.restoreSelectedBtn.removeAttribute('disabled');
    DOM.deletePermanentlyBtn.removeAttribute('disabled');
  } else {
    DOM.restoreSelectedBtn.setAttribute('disabled', 'true');
    DOM.deletePermanentlyBtn.setAttribute('disabled', 'true');
  }
}

function selectAllDeleted(val) {
  state.deletedDrafts.forEach(d => d.selectedForAction = val);
  saveDeletedDraftsToStorage();
  
  if (state.deletedDbRecords) {
    state.deletedDbRecords.forEach(d => d.selectedForAction = val);
  }
  
  document.querySelectorAll('.deleted-selector').forEach(cb => cb.checked = val);
  DOM.headerSelectAllDeleted.checked = val;
  updateDeletedCountBtnState();
}

async function restoreSelectedDeleted() {
  const toRestoreLocal = state.deletedDrafts.filter(d => d.selectedForAction);
  const toRestoreDb = (state.deletedDbRecords || []).filter(d => d.selectedForAction);
  const totalCount = toRestoreLocal.length + toRestoreDb.length;
  if (totalCount === 0) return;

  if (toRestoreLocal.length > 0) {
    state.deletedDrafts = state.deletedDrafts.filter(d => !d.selectedForAction);
    toRestoreLocal.forEach(d => {
      d.verified = false;
      delete d.selectedForAction;
      state.drafts.push(d);
    });
    await saveDraftsToStorage();
    await saveDeletedDraftsToStorage();
    renderSyncTable();
  }

  if (toRestoreDb.length > 0) {
    for (const item of toRestoreDb) {
      try {
        await fetch(`/api/entries/restore/${item.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.authToken}`
          }
        });
      } catch (e) {
        console.error('Failed to restore database record', item.id, e);
      }
    }
    await fetchDatabaseRecords();
  }

  renderDeletedDraftsTable();
  alert(`Restored ${totalCount} items back to active entries.`);
}

async function deletePermanentlySelected() {
  const toDeleteLocal = state.deletedDrafts.filter(d => d.selectedForAction);
  const toDeleteDb = (state.deletedDbRecords || []).filter(d => d.selectedForAction);
  const totalCount = toDeleteLocal.length + toDeleteDb.length;
  if (totalCount === 0) return;

  if (!confirm(`⚠️ WARNING: Are you absolutely sure you want to PERMANENTLY delete the ${totalCount} selected items? This action is irreversible!`)) {
    return;
  }

  if (toDeleteLocal.length > 0) {
    state.deletedDrafts = state.deletedDrafts.filter(d => !d.selectedForAction);
    await saveDeletedDraftsToStorage();
  }

  if (toDeleteDb.length > 0) {
    for (const item of toDeleteDb) {
      try {
        await fetch(`/api/entries/delete-permanent/${item.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.authToken}`
          }
        });
      } catch (e) {
        console.error('Failed to permanently delete database record', item.id, e);
      }
    }
    await fetchDatabaseRecords();
  }

  renderDeletedDraftsTable();
  alert(`Permanently deleted ${totalCount} items.`);
}

async function pushSelectedDrafts() {
  if (!state.isOnline) {
    alert('You are currently offline. Check your connectivity.');
    return;
  }
  
  if (!state.isAuthenticated) {
    openLoginModal();
    return;
  }

  const toPush = state.drafts.filter(d => d.verified);
  if (toPush.length === 0) return;

  DOM.pushSelectedBtn.disabled = true;
  DOM.pushSelectedBtn.innerHTML = '<span>Pushing...</span>';

  try {
    // Encrypt drafts on-the-fly before transmission
    const encryptedToPush = [];
    for (const draft of toPush) {
      let draftDate = draft.date;
      if (!draftDate || typeof draftDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(draftDate.trim())) {
        draftDate = new Date().toISOString().split('T')[0];
      } else {
        draftDate = draftDate.trim();
      }
      draft.date = draftDate;

      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        try {
          const plainString = JSON.stringify(draft.data);
          const encrypted = await window.SecurityEngine.encryptPayload(plainString);
          encryptedToPush.push({
            date: draft.date,
            verified: draft.verified,
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv
          });
        } catch (encErr) {
          console.error('Failed to encrypt draft on push:', encErr);
          alert('Failed to encrypt one or more drafts. Sync aborted.');
          DOM.pushSelectedBtn.disabled = false;
          DOM.pushSelectedBtn.innerHTML = `<span>Push (<span id="push-count-text">${toPush.length}</span>)</span>`;
          return;
        }
      } else {
        encryptedToPush.push(draft);
      }
    }

    const response = await fetch('/api/entries/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify(encryptedToPush)
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
      let errMsg = 'Server error';
      try {
        const err = await response.json();
        errMsg = err.error || errMsg;
      } catch (parseErr) {
        try {
          errMsg = await response.text();
        } catch (textErr) {}
      }
      alert('Error pushing drafts: ' + errMsg);
    }
  } catch (err) {
    console.error('Push error:', err);
    alert('Failed to connect to the server. Check your connectivity.');
  } finally {
    DOM.pushSelectedBtn.innerHTML = '<span>Push (<span id="push-count-text">0</span>)</span>';
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

  filteredRecords.forEach((rec, index) => {
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
    deleteBtn.addEventListener('click', () => deleteRecord(rec, index + 1));
    actionTd.appendChild(deleteBtn);

    tr.appendChild(actionTd);

    DOM.dbTableBody.appendChild(tr);
  });
}

let auditAnomalies = [];
let activeAuditYear = '';

function getAvailableYears() {
  const years = [];
  if (DOM.filterYear) {
    Array.from(DOM.filterYear.options).forEach(opt => {
      if (opt.value !== 'all' && opt.value !== '') {
        years.push(opt.value);
      }
    });
  }
  // Sort years chronologically
  years.sort((a, b) => parseInt(a) - parseInt(b));
  
  // If no years found, fallback to current year
  if (years.length === 0) {
    years.push(new Date().getFullYear().toString());
  }
  return years;
}

function updateAuditYearSelectorUI() {
  if (DOM.auditCurrentYearText) {
    DOM.auditCurrentYearText.textContent = activeAuditYear;
  }
}

function runDatabaseAuditScan() {
  auditAnomalies = [];
  if (!state.dbRecords || state.dbRecords.length === 0) return;

  const filteredRecords = state.dbRecords.filter(rec => {
    if (!rec.date) return false;
    const [yr] = rec.date.split('-');
    return yr === activeAuditYear;
  });

  // Let's compute column statistics to find "not at par" values
  const columnStats = {};
  state.schema.forEach(field => {
    columnStats[field.id] = {
      totalNonEmpty: 0,
      numericCount: 0,
      values: []
    };
  });

  // First pass: collect statistics
  filteredRecords.forEach(rec => {
    state.schema.forEach(field => {
      const val = rec.data ? rec.data[field.id] : undefined;
      if (val !== undefined && val !== null) {
        const valStr = String(val).trim();
        if (valStr !== "" && !valStr.includes('?') && !valStr.includes('*')) {
          columnStats[field.id].totalNonEmpty++;
          columnStats[field.id].values.push(valStr);
          if (!isNaN(Number(valStr))) {
            columnStats[field.id].numericCount++;
          }
        }
      }
    });
  });

  // Determine dominant types for columns
  state.schema.forEach(field => {
    const stats = columnStats[field.id];
    stats.isDominantNumeric = stats.totalNonEmpty > 0 && (stats.numericCount / stats.totalNonEmpty) >= 0.8;
  });

  // Second pass: detect anomalies
  filteredRecords.forEach(rec => {
    state.schema.forEach(field => {
      const val = rec.data ? rec.data[field.id] : undefined;
      const valStr = (val === undefined || val === null) ? "" : String(val).trim();

      let isAnomaly = false;
      let issue = "";
      let suggestion = "";

      // Rule 1: Blank cells
      if (valStr === "") {
        isAnomaly = true;
        issue = "Blank Cell";
        suggestion = "Provide missing value";
      }
      // Rule 2: Placeholder "?"
      else if (valStr.includes('?')) {
        isAnomaly = true;
        issue = "Contains '?' placeholder";
        suggestion = "Review and enter actual value";
      }
      // Rule 3: Placeholder "*"
      else if (valStr.includes('*')) {
        isAnomaly = true;
        issue = "Contains '*' placeholder";
        suggestion = "Review and enter actual value";
      }
      // Rule 4: Schema Type Mismatch or dominant column type mismatch ("not at par")
      else {
        // Check schema-defined type mismatch
        if (field.type === 'number' && isNaN(Number(valStr))) {
          isAnomaly = true;
          issue = "Type Mismatch: Expected number";
          suggestion = "Enter a valid numeric value";
        } else if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(valStr)) {
          isAnomaly = true;
          issue = "Type Mismatch: Expected date (YYYY-MM-DD)";
          suggestion = "Enter date in YYYY-MM-DD format";
        }
        // Column-level statistical "not at par" anomaly
        else if (columnStats[field.id].isDominantNumeric && isNaN(Number(valStr))) {
          isAnomaly = true;
          issue = "Not at par: Column is mostly numeric";
          suggestion = "Convert to pure number";
        }
      }

      if (isAnomaly) {
        auditAnomalies.push({
          recordId: rec.id,
          date: rec.date || "",
          field: field,
          val: valStr,
          issue: issue,
          suggestion: suggestion,
          record: rec
        });
      }
    });
  });
}

function renderAuditTable() {
  if (!DOM.auditTableBody) return;

  DOM.auditTableBody.innerHTML = '';

  if (auditAnomalies.length === 0) {
    DOM.auditTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">No anomalies detected. Your database is clean!</td>
      </tr>
    `;
    if (DOM.saveAuditChangesBtn) DOM.saveAuditChangesBtn.disabled = true;
    return;
  }

  // Pre-fill save button status as disabled initially until user changes an input
  if (DOM.saveAuditChangesBtn) DOM.saveAuditChangesBtn.disabled = true;

  auditAnomalies.forEach((anomaly, index) => {
    const tr = document.createElement('tr');
    
    // Record ID
    const tdId = document.createElement('td');
    tdId.textContent = anomaly.recordId;
    tr.appendChild(tdId);

    // Date
    const tdDate = document.createElement('td');
    tdDate.textContent = anomaly.date;
    tr.appendChild(tdDate);

    // Field Title
    const tdField = document.createElement('td');
    tdField.textContent = getFieldDisplayTitle(anomaly.field);
    tr.appendChild(tdField);

    // Detected Value
    const tdVal = document.createElement('td');
    tdVal.style.fontFamily = 'monospace';
    tdVal.textContent = anomaly.val === "" ? "(blank)" : anomaly.val;
    if (anomaly.val === "") {
      tdVal.style.color = '#d29922'; // warn color
    }
    tr.appendChild(tdVal);

    // Issue / Suggestion
    const tdIssue = document.createElement('td');
    tdIssue.innerHTML = `<span style="color: #f85149; font-weight: bold;">${anomaly.issue}</span><br><small class="text-muted">${anomaly.suggestion}</small>`;
    tr.appendChild(tdIssue);

    // Corrective Input
    const tdInput = document.createElement('td');
    let inputHtml = '';
    if (anomaly.field.type === 'number') {
      inputHtml = `<input type="number" step="any" class="form-input audit-correction-input" data-index="${index}" value="${!isNaN(Number(anomaly.val)) ? anomaly.val : ''}" style="padding: 4px 8px; width: 100%;">`;
    } else if (anomaly.field.type === 'date') {
      inputHtml = `<input type="date" class="form-input audit-correction-input" data-index="${index}" value="${anomaly.val}" style="padding: 4px 8px; width: 100%;">`;
    } else {
      inputHtml = `<input type="text" class="form-input audit-correction-input" data-index="${index}" value="${anomaly.val}" style="padding: 4px 8px; width: 100%;">`;
    }
    tdInput.innerHTML = inputHtml;
    tr.appendChild(tdInput);

    DOM.auditTableBody.appendChild(tr);
  });

  // Track changes to enable/disable Save button
  const inputs = DOM.auditTableBody.querySelectorAll('.audit-correction-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      // Check if at least one value is different from original
      let anyChange = false;
      inputs.forEach(inp => {
        const idx = parseInt(inp.dataset.index);
        const originalVal = auditAnomalies[idx].val;
        if (inp.value !== originalVal) {
          anyChange = true;
        }
      });
      if (DOM.saveAuditChangesBtn) DOM.saveAuditChangesBtn.disabled = !anyChange;
    });
  });
}

async function saveAuditedCorrections() {
  if (!state.isOnline) {
    alert('You are currently offline. Cannot save corrections.');
    return;
  }
  if (!state.isAuthenticated) {
    alert('Admin login required to save audit changes.');
    openLoginModal();
    return;
  }

  const inputs = DOM.auditTableBody.querySelectorAll('.audit-correction-input');
  
  // Group changes by record ID
  const updatesByRecord = {};
  
  inputs.forEach(inp => {
    const idx = parseInt(inp.dataset.index);
    const anomaly = auditAnomalies[idx];
    const originalVal = anomaly.val;
    const newVal = inp.value;

    if (newVal !== originalVal) {
      const recId = anomaly.recordId;
      if (!updatesByRecord[recId]) {
        // Deep copy the original data object
        updatesByRecord[recId] = {
          record: anomaly.record,
          updatedData: JSON.parse(JSON.stringify(anomaly.record.data))
        };
      }
      updatesByRecord[recId].updatedData[anomaly.field.id] = newVal;
    }
  });

  const recordIdsToUpdate = Object.keys(updatesByRecord);
  if (recordIdsToUpdate.length === 0) return;

  if (DOM.saveAuditChangesBtn) {
    DOM.saveAuditChangesBtn.disabled = true;
    DOM.saveAuditChangesBtn.textContent = 'Saving Corrections...';
  }

  try {
    let successCount = 0;
    
    for (const recId of recordIdsToUpdate) {
      const { record, updatedData } = updatesByRecord[recId];
      let targetDate = record.date;
      if (updatedData.date) {
        targetDate = updatedData.date;
      }

      // Handle E2EE encryption if active
      let payload = updatedData;
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        try {
          const plainString = JSON.stringify(updatedData);
          const encrypted = await window.SecurityEngine.encryptPayload(plainString);
          payload = {
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv
          };
        } catch (encErr) {
          console.error(`Failed to encrypt record ID ${recId} during audit save:`, encErr);
          alert(`Encryption failed for record ID ${recId}. Save aborted.`);
          throw encErr;
        }
      }

      const response = await fetch(`/api/entries/update/${recId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken}`
        },
        body: JSON.stringify({
          date: targetDate,
          data: payload
        })
      });

      if (response.ok) {
        successCount++;
      } else {
        const err = await response.json();
        console.error(`Failed to update record ID ${recId}:`, err.error);
      }
    }

    alert(`Successfully updated ${successCount} of ${recordIdsToUpdate.length} record(s).`);
    closeAuditModal();
    await fetchDatabaseRecords();
  } catch (err) {
    console.error('Error saving audit corrections:', err);
    alert('An error occurred while saving corrections.');
  } finally {
    if (DOM.saveAuditChangesBtn) {
      DOM.saveAuditChangesBtn.disabled = false;
      DOM.saveAuditChangesBtn.textContent = 'Save Audited Corrections';
    }
  }
}

function openAuditModal() {
  if (!state.isAuthenticated) {
    alert('Admin login required to perform database audit.');
    openLoginModal();
    return;
  }

  const years = getAvailableYears();
  const selectedYear = DOM.filterYear ? DOM.filterYear.value : 'all';
  if (selectedYear !== 'all' && years.includes(selectedYear)) {
    activeAuditYear = selectedYear;
  } else {
    activeAuditYear = years[years.length - 1];
  }

  updateAuditYearSelectorUI();
  runDatabaseAuditScan();
  renderAuditTable();
  
  if (DOM.auditModal) {
    DOM.auditModal.classList.add('active');
  }
  document.body.style.overflow = 'hidden';
}

function closeAuditModal() {
  if (DOM.auditModal) {
    DOM.auditModal.classList.remove('active');
  }
  document.body.style.overflow = '';
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
          // Switch to Data Entry tab
          switchToTab('data-entry');
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

async function deleteRecord(rec, rowNum) {
  if (!state.isOnline || !state.isAuthenticated) return;

  let info = '';
  if (state.schema.length > 0) {
    const firstField = state.schema.find(f => f.id !== 'annual_serial' && f.id !== 'monthly_sl_no');
    if (firstField && rec.data && rec.data[firstField.id]) {
      info = `${getFieldDisplayTitle(firstField)}: ${rec.data[firstField.id]}`;
    }
  }

  const displayMsg = `Are you sure you want to delete this record and move it to the Trash Bin?\n\nRow: ${rowNum}\nDate: ${rec.date || 'N/A'}${info ? '\n' + info : ''}`;
  if (!confirm(displayMsg)) return;

  try {
    const response = await fetch(`/api/entries/delete/${rec.id}`, {
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
    alert('Offline: Check your connectivity to clear database records.');
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

async function handleClearUsers() {
  if (!state.isOnline) {
    alert('Offline: Check your connectivity to clear user accounts.');
    return;
  }
  
  if (!state.isAuthenticated) {
    openLoginModal();
    return;
  }

  if (!confirm('Are you sure you want to permanently delete ALL user accounts except the master admin? This action is irreversible.')) {
    return;
  }

  if (!confirm('FINAL WARNING: All other users will be immediately logged out and deleted. Are you absolutely certain?')) {
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
        code = prompt('Enter 6-digit 2FA Authenticator Code to confirm clearing user accounts:');
        if (code === null) return;
        if (!code.trim()) {
          alert('2FA Code is required.');
          return;
        }
      }
    }
  } catch (err) {
    console.warn('Failed to verify 2FA for users clearing:', err);
  }

  try {
    DOM.clearUsersBtn.disabled = true;
    DOM.clearUsersBtn.textContent = 'Clearing Users...';

    const response = await fetch('/api/admin/clear-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ code })
    });

    if (response.ok) {
      const data = await response.json();
      alert(`User accounts cleared successfully! Cleared ${data.clearedCount || 0} user(s).`);
      
      // Reload team accounts in view
      if (typeof loadTeamAccounts === 'function') {
        loadTeamAccounts();
      }
    } else {
      const err = await response.json();
      alert('Error clearing users: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Network error. Failed to clear user accounts.');
  } finally {
    DOM.clearUsersBtn.disabled = false;
    DOM.clearUsersBtn.textContent = 'Clear All Users';
    updateAuthUI();
  }
}

async function handleLocalBackupExport() {
  if (!state.isOnline) {
    alert("Offline: Check your connectivity to export a database backup.");
    return;
  }
  
  try {
    DOM.localBackupExportBtn.disabled = true;
    DOM.localBackupExportBtn.querySelector('span').textContent = 'Exporting...';
    
    const response = await fetch('/api/entries');
    if (!response.ok) {
      throw new Error("Failed to fetch database entries");
    }
    
    const rows = await response.json();
    if (rows.length === 0) {
      alert("No database records found to export.");
      return;
    }
    
    const csvHeader = 'ID,Created At,Verified,Date,Data\n';
    const csvRows = rows.map(r => {
      const parsedData = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      const dataEscaped = JSON.stringify(parsedData).replace(/"/g, '""');
      return `${r.id},"${r.created_at}",${r.verified},"${r.date}","${dataEscaped}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Backup CSV file exported and downloaded successfully!');
  } catch (err) {
    alert('Failed to generate local CSV backup: ' + err.message);
  } finally {
    DOM.localBackupExportBtn.disabled = false;
    DOM.localBackupExportBtn.querySelector('span').textContent = 'Export CSV Backup';
  }
}

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

async function handleLocalBackupRestore(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!state.isOnline) {
    alert("Offline: Check your connectivity to restore database records.");
    DOM.localBackupRestoreFile.value = '';
    return;
  }
  
  if (!state.isAuthenticated) {
    openLoginModal();
    DOM.localBackupRestoreFile.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(event) {
    const text = event.target.result;
    
    const parsedLines = parseCSV(text);
    if (parsedLines.length <= 1) {
      alert("Invalid or empty CSV backup file.");
      DOM.localBackupRestoreFile.value = '';
      return;
    }
    
    const header = parsedLines[0].map(h => h.trim().toUpperCase());
    if (!header.includes("DATA") || !header.includes("DATE")) {
      alert("Invalid CSV format. The backup must contain 'Date' and 'Data' columns.");
      DOM.localBackupRestoreFile.value = '';
      return;
    }
    
    const records = [];
    const dataIndex = header.indexOf("DATA");
    const dateIndex = header.indexOf("DATE");
    const idIndex = header.indexOf("ID");
    const verifiedIndex = header.indexOf("VERIFIED");
    const createdAtIndex = header.indexOf("CREATED AT");

    for (let i = 1; i < parsedLines.length; i++) {
      const row = parsedLines[i];
      if (row.length <= Math.max(dataIndex, dateIndex)) continue;
      
      const id = idIndex !== -1 ? parseInt(row[idIndex]) || null : null;
      const created_at = createdAtIndex !== -1 ? row[createdAtIndex] : '';
      const verified = verifiedIndex !== -1 ? (row[verifiedIndex] === '1' || row[verifiedIndex].toLowerCase() === 'true') : false;
      const date = row[dateIndex] || '';
      let data = {};
      try {
        data = JSON.parse(row[dataIndex]);
      } catch (err) {
        console.warn('Skipping record parsing error:', err);
        continue;
      }
      
      records.push({ id, created_at, verified, date, data });
    }
    
    if (records.length === 0) {
      alert("No valid records found in the backup file.");
      DOM.localBackupRestoreFile.value = '';
      return;
    }
    
    if (!confirm(`Are you absolutely sure you want to RESTORE ${records.length} records? This will completely overwrite and replace the current database. This action is irreversible.`)) {
      DOM.localBackupRestoreFile.value = '';
      return;
    }
    
    let code = '';
    try {
      const statusRes = await fetch('/api/settings/totp/status', {
        headers: { 'Authorization': `Bearer ${state.authToken}` }
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.enabled) {
          code = prompt('Enter 6-digit 2FA Authenticator Code to confirm database restoration:');
          if (code === null) {
            DOM.localBackupRestoreFile.value = '';
            return;
          }
          if (!code.trim()) {
            alert('2FA Code is required.');
            DOM.localBackupRestoreFile.value = '';
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to verify 2FA status for restore:', err);
    }
    
    try {
      DOM.localBackupRestoreBtn.disabled = true;
      DOM.localBackupRestoreBtn.querySelector('span').textContent = 'Restoring...';
      
      if (code) {
        const verifyRes = await fetch('/api/settings/totp/verify-action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.authToken}`
          },
          body: JSON.stringify({ code })
        });
        if (!verifyRes.ok) {
          const errData = await verifyRes.json();
          alert('Verification failed: ' + (errData.error || 'Invalid 2FA code'));
          DOM.localBackupRestoreFile.value = '';
          return;
        }
      }
      
      const response = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken}`
        },
        body: JSON.stringify(records)
      });
      
      if (response.ok) {
        const resData = await response.json();
        alert(`Database restored successfully! ${resData.count} records imported.`);
        fetchDatabaseRecords();
      } else {
        const errData = await response.json();
        alert('Restore failed: ' + (errData.error || 'Server error'));
      }
    } catch (err) {
      alert('Failed to send restore backup request to server.');
    } finally {
      DOM.localBackupRestoreBtn.disabled = false;
      DOM.localBackupRestoreBtn.querySelector('span').textContent = 'Restore from CSV Backup';
      DOM.localBackupRestoreFile.value = '';
    }
  };
  reader.readAsText(file);
}

function handleExportExcel() {
  const records = state.dbRecords || [];
  if (records.length === 0) {
    alert("No records available in database to export.");
    return;
  }
  
  const selectedMonth = DOM.filterMonth.value;
  const selectedYear = DOM.filterYear.value;
  
  let filteredRecords = records.filter(rec => {
    if (!rec.date) return false;
    const [yr, mo] = rec.date.split('-');
    const matchMonth = (selectedMonth === 'all' || mo === selectedMonth);
    const matchYear = (selectedYear === 'all' || yr === selectedYear);
    return matchMonth && matchYear;
  });
  
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

  if (filteredRecords.length === 0) {
    alert("No records matching the active filters to export.");
    return;
  }
  
  const excelData = filteredRecords.map(rec => {
    const row = {};
    row["Status"] = rec.verified === 1 ? "Verified" : "Unverified";
    
    state.schema.forEach(field => {
      const displayTitle = getFieldDisplayTitle(field);
      let val = field.id === 'date' ? rec.date : rec.data[field.id];
      
      if (field.id === 'date') {
        row[displayTitle] = formatDateDisplay(val);
      } else {
        row[displayTitle] = formatDisplayValue(val, field);
      }
    });
    return row;
  });

  try {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OT Records");
    
    const yearSuffix = selectedYear === 'all' ? 'AllYears' : selectedYear;
    const monthSuffix = selectedMonth === 'all' ? 'AllMonths' : selectedMonth;
    const filename = `OT_Records_${yearSuffix}_${monthSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  } catch (err) {
    alert("Failed to export Excel file: " + err.message);
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

// Helper to format yyyy-mm-dd to dd/mm/yyyy for display
function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
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
  // Security Enforcement: Limit access to tabs by role
  if (state.isAuthenticated) {
    if (state.userRole === 'user' && tabId !== 'data-entry' && tabId !== 'break-game') {
      tabId = 'data-entry';
    } else if (state.userRole === 'viewer' && tabId !== 'db-viewer' && tabId !== 'data-analysis') {
      tabId = 'db-viewer';
    }
  } else {
    if (tabId !== 'data-entry' && tabId !== 'break-game') {
      tabId = 'data-entry';
    }
  }

  const item = Array.from(DOM.navItems).find(nav => nav.dataset.tab === tabId);
  if (item) {
    DOM.navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    DOM.tabPanels.forEach(panel => panel.classList.remove('active'));
    const panel = document.getElementById(`tab-${tabId}`);
    if (panel) panel.classList.add('active');
    
    state.activeTab = tabId;
    sessionStorage.setItem('activeTab', tabId);
    
    if (tabId === 'form-creator') {
      renderFormCreator();
    } else if (tabId === 'db-viewer') {
      fetchDatabaseRecords();
      renderDeletedDraftsTable();
    } else if (tabId === 'data-analysis') {
      initAnalyticsUI();
      if (state.isOnline) {
        fetchDatabaseRecords();
      } else {
        renderAnalytics();
      }
    } else if (tabId === 'settings') {
      fetchTotpStatus();
      if (typeof loadTeamAccounts === 'function') {
        loadTeamAccounts();
      }
    } else if (tabId === 'break-game') {
      initBreakGame();
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

  const toggleLink = document.getElementById('auth-toggle-link');
  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('auth-modal-title');
      const subtitle = document.getElementById('login-modal-subtitle');
      const toggleText = document.getElementById('auth-toggle-text');
      const submitBtn = document.getElementById('submit-login-btn');
      
      if (state.authModalMode === 'register') {
        state.authModalMode = 'login';
        if (title) title.textContent = 'Account Authentication';
        if (subtitle) subtitle.textContent = 'Log in or register to manage data entry schemas and synchronize encrypted records.';
        if (toggleText) toggleText.textContent = "Don't have an account? ";
        toggleLink.textContent = 'Register here';
        if (submitBtn) submitBtn.textContent = 'Login';
        if (DOM.loginOtpSection) {
          DOM.loginOtpSection.classList.add('hidden');
        }
        if (DOM.loginOtp) {
          DOM.loginOtp.value = '';
          DOM.loginOtp.removeAttribute('required');
        }
      } else {
        state.authModalMode = 'register';
        if (title) title.textContent = 'Create New Account';
        if (subtitle) subtitle.textContent = 'Register a new client-side account to sync data and manage vaults.';
        if (toggleText) toggleText.textContent = "Already have an account? ";
        toggleLink.textContent = 'Login here';
        if (submitBtn) submitBtn.textContent = 'Register';
        if (DOM.loginOtpSection) DOM.loginOtpSection.classList.add('hidden');
        if (DOM.loginOtp) {
          DOM.loginOtp.removeAttribute('required');
        }
      }
      
      DOM.loginError.classList.add('hidden');
    });
  }

  // Form Creator Actions
  DOM.addFieldBtn.addEventListener('click', addNewField);
  DOM.resetCreatorBtn.addEventListener('click', resetFormCreator);
  DOM.saveSchemaBtn.addEventListener('click', saveSchema);
  if (DOM.changeCredentialsForm) DOM.changeCredentialsForm.addEventListener('submit', handleUpdateCredentials);

  // Change Password Modal Events
  if (DOM.headerChangePasswordBtn) {
    DOM.headerChangePasswordBtn.addEventListener('click', () => openChangePasswordModal(false));
  }
  if (DOM.closeChangePasswordBtn) {
    DOM.closeChangePasswordBtn.addEventListener('click', closeChangePasswordModal);
  }
  if (DOM.cancelChangePasswordBtn) {
    DOM.cancelChangePasswordBtn.addEventListener('click', closeChangePasswordModal);
  }
  if (DOM.changePasswordModal) {
    DOM.changePasswordModal.addEventListener('click', (e) => {
      if (e.target === DOM.changePasswordModal) {
        closeChangePasswordModal();
      }
    });
  }

  if (DOM.changeUserCurrentPassword) DOM.changeUserCurrentPassword.addEventListener('input', validateChangePasswordForm);
  if (DOM.changeUserNewPassword) DOM.changeUserNewPassword.addEventListener('input', validateChangePasswordForm);
  if (DOM.changeUserConfirmNewPassword) DOM.changeUserConfirmNewPassword.addEventListener('input', validateChangePasswordForm);
  if (DOM.confirmCredentialsCheckbox) DOM.confirmCredentialsCheckbox.addEventListener('change', validateChangePasswordForm);

  if (DOM.changeUserPasswordForm) {
    DOM.changeUserPasswordForm.addEventListener('submit', handleChangePasswordSubmit);
  }


  // Theme Toggle
  if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Voice Typing
  if (DOM.voiceTypingBtns) {
    DOM.voiceTypingBtns.forEach(btn => {
      btn.addEventListener('click', toggleGlobalVoiceTyping);
    });
  }

  // Sync Table Actions
  DOM.headerSelectAll.addEventListener('change', (e) => {
    selectAllDrafts(e.target.checked);
  });
  safeAddListener(DOM.selectAllDraftsBtn, 'click', () => selectAllDrafts(true));
  safeAddListener(DOM.deselectAllDraftsBtn, 'click', () => selectAllDrafts(false));
  DOM.pushSelectedBtn.addEventListener('click', pushSelectedDrafts);
  safeAddListener(DOM.rejectSelectedBtn, 'click', rejectSelectedDrafts);

  // Trash Bin Actions
  if (DOM.headerSelectAllDeleted) {
    DOM.headerSelectAllDeleted.addEventListener('change', (e) => {
      selectAllDeleted(e.target.checked);
    });
  }
  if (DOM.selectAllDeletedBtn) {
    DOM.selectAllDeletedBtn.addEventListener('click', () => selectAllDeleted(true));
  }
  if (DOM.deselectAllDeletedBtn) {
    DOM.deselectAllDeletedBtn.addEventListener('click', () => selectAllDeleted(false));
  }
  if (DOM.restoreSelectedBtn) {
    DOM.restoreSelectedBtn.addEventListener('click', restoreSelectedDeleted);
  }
  if (DOM.deletePermanentlyBtn) {
    DOM.deletePermanentlyBtn.addEventListener('click', deletePermanentlySelected);
  }

  // DB Viewer filters
  DOM.filterMonth.addEventListener('change', renderDBTable);
  DOM.filterYear.addEventListener('change', renderDBTable);
  if (DOM.filterSort) DOM.filterSort.addEventListener('change', renderDBTable);
  DOM.refreshDbBtn.addEventListener('click', fetchDatabaseRecords);

  // Audit Actions
  if (DOM.auditDbBtn) DOM.auditDbBtn.addEventListener('click', openAuditModal);
  if (DOM.closeAuditModalBtn) DOM.closeAuditModalBtn.addEventListener('click', closeAuditModal);
  if (DOM.cancelAuditBtn) DOM.cancelAuditBtn.addEventListener('click', closeAuditModal);
  if (DOM.saveAuditChangesBtn) DOM.saveAuditChangesBtn.addEventListener('click', saveAuditedCorrections);
  if (DOM.auditPrevYearBtn) {
    DOM.auditPrevYearBtn.addEventListener('click', () => {
      const years = getAvailableYears();
      const idx = years.indexOf(activeAuditYear);
      if (idx > 0) {
        activeAuditYear = years[idx - 1];
        if (DOM.filterYear) {
          DOM.filterYear.value = activeAuditYear;
          renderDBTable();
        }
        updateAuditYearSelectorUI();
        runDatabaseAuditScan();
        renderAuditTable();
      }
    });
  }
  if (DOM.auditNextYearBtn) {
    DOM.auditNextYearBtn.addEventListener('click', () => {
      const years = getAvailableYears();
      const idx = years.indexOf(activeAuditYear);
      if (idx !== -1 && idx < years.length - 1) {
        activeAuditYear = years[idx + 1];
        if (DOM.filterYear) {
          DOM.filterYear.value = activeAuditYear;
          renderDBTable();
        }
        updateAuditYearSelectorUI();
        runDatabaseAuditScan();
        renderAuditTable();
      }
    });
  }

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

  // TOTP Actions
  safeAddListener(DOM.totpToggleBtn, 'click', () => {
    if (state.totpEnabled) {
      handleConfirmDisableTotp();
    } else {
      initTotpSetup();
    }
  });
  safeAddListener(DOM.closeTotpSetupBtn, 'click', cancelTotpSetup);
  safeAddListener(DOM.confirmTotpBtn, 'click', confirmTotpSetup);
  safeAddListener(DOM.cancelTotpSetupBtn, 'click', cancelTotpSetup);
  if (DOM.totpSetupModal) {
    DOM.totpSetupModal.addEventListener('click', (e) => {
      if (e.target === DOM.totpSetupModal) cancelTotpSetup();
    });
  }

  // Danger Zone Actions
  safeAddListener(DOM.clearDraftsBtn, 'click', handleClearDrafts);
  safeAddListener(DOM.clearDatabaseBtn, 'click', handleClearDatabase);
  safeAddListener(DOM.clearUsersBtn, 'click', handleClearUsers);
  safeAddListener(DOM.adminCreateUserBtn, 'click', openAdminRegisterModal);

  // Local Backup & Restore Actions
  safeAddListener(DOM.localBackupExportBtn, 'click', handleLocalBackupExport);
  safeAddListener(DOM.localBackupRestoreBtn, 'click', () => {
    DOM.localBackupRestoreFile.click();
  });
  safeAddListener(DOM.localBackupRestoreFile, 'change', handleLocalBackupRestore);
  safeAddListener(DOM.exportExcelBtn, 'click', handleExportExcel);

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

  // Form Creator Mobile Nav Actions
  const prevFieldBtn = document.getElementById('creator-prev-field-btn');
  const nextFieldBtn = document.getElementById('creator-next-field-btn');
  if (prevFieldBtn) {
    prevFieldBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.formCreatorActiveIndex > 0) {
        state.formCreatorActiveIndex--;
        renderFormCreator();
      }
    });
  }
  if (nextFieldBtn) {
    nextFieldBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.formCreatorActiveIndex < state.formCreatorSchema.length - 1) {
        state.formCreatorActiveIndex++;
        renderFormCreator();
      }
    });
  }

  // Edit Modal Event Listeners
  if (DOM.closeEditModalBtn) DOM.closeEditModalBtn.addEventListener('click', closeEditModal);
  if (DOM.cancelEditBtn) DOM.cancelEditBtn.addEventListener('click', closeEditModal);
  if (DOM.editModal) {
    DOM.editModal.addEventListener('click', (e) => {
      if (e.target === DOM.editModal) closeEditModal();
    });
  }
  if (DOM.editForm) DOM.editForm.addEventListener('submit', handleEditSubmit);

  // Quick Break Game Selectors and Actions
  const gameSelect = document.getElementById('game-select');
  const timerSelect = document.getElementById('game-timer-select');
  const startBtn = document.getElementById('start-game-btn');
  const gameHelpBtn = document.getElementById('game-help-btn');
  const rulesModal = document.getElementById('game-rules-modal');
  const closeRulesModalBtn = document.getElementById('close-rules-modal-btn');
  const closeRulesBtn = document.getElementById('close-rules-btn');
  const rulesTitle = document.getElementById('rules-modal-title');
  const rulesContent = document.getElementById('rules-modal-content');

  if (gameSelect) {
    gameSelect.addEventListener('change', (e) => {
      cleanupActiveGameEngineOnly();
      activeGame = e.target.value;
      updateGameOverlayUI();
      if (isBreakActive) {
        startActiveGameEngineOnly();
      }
    });
  }

  if (timerSelect) {
    timerSelect.addEventListener('change', (e) => {
      if (!isBreakActive) {
        gameSecondsRemaining = parseInt(e.target.value);
        updateTimerDisplay();
      }
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', startBreakGame);
  }

  const gameRules = {
    'bubble-popper': `
      <p>Pop colorful bubbles before they float away! Soft colors, relaxing movement, and no pressure.</p>
      <ul>
        <li>Click/tap bubbles to pop them.</li>
        <li><strong>+10 points</strong> per pop.</li>
        <li>No penalty for missed bubbles.</li>
      </ul>
    `,
    'memory-match': `
      <p>Classic emoji card pairing game to test your memory at your own pace.</p>
      <ul>
        <li>Click cards to flip them.</li>
        <li>Match matching emojis for <strong>+25 points</strong>.</li>
        <li>Pairs stay face-up, mismatched cards flip back.</li>
      </ul>
    `,
    'gem-clicker': `
      <p>Satisfying clicker with beautiful particle physics. Watch the gemstone grow and glow.</p>
      <ul>
        <li>Click/tap the diamond gemstone.</li>
        <li>Releases colorful sparkling glitter.</li>
        <li><strong>+1 point</strong> per click.</li>
      </ul>
    `,
    'whack-mole': `
      <p>Tapping stars popping in a night sky constellation. Casual target-tapping.</p>
      <ul>
        <li>Click/tap glowing stars before they disappear.</li>
        <li><strong>+15 points</strong> per star.</li>
        <li>Zero speed pressure.</li>
      </ul>
    `,
    'snake': `
      <p>Retro steered keyboard arcade game, optimized for relaxation.</p>
      <ul>
        <li>Steer with <strong>Arrow keys</strong> or <strong>W/A/S/D</strong>.</li>
        <li>Eat red apples to grow and score <strong>+10 points</strong>.</li>
        <li><strong>Calm Progression</strong>: Starts very slow and gains speed gently.</li>
        <li>Avoid hitting walls or your own tail!</li>
      </ul>
    `,
    'gomoku': `
      <p>Gomoku (Five in a Row) on a beautiful wooden board against a relaxing AI.</p>
      <ul>
        <li>You play <strong>Black stones</strong> (click intersections). AI plays <strong>White</strong>.</li>
        <li>Align <strong>5 stones</strong> horizontally, vertically, or diagonally to win.</li>
        <li>Win awards <strong>+100 bonus points</strong>!</li>
      </ul>
    `,
    'hilo': `
      <p>Relaxing probability guess card game. Ace is high (14), 2 is low (2).</p>
      <ul>
        <li>Guess if the next card will be Higher or Lower.</li>
        <li>Correct guess gives <strong>+10 points</strong>.</li>
        <li>Build streaks for multiplier bonus points!</li>
      </ul>
    `
  };

  if (gameHelpBtn && rulesModal && rulesContent && rulesTitle) {
    gameHelpBtn.addEventListener('click', () => {
      const meta = gameMetadata[activeGame] || { title: 'Rules' };
      rulesTitle.textContent = `${meta.title} - Rules 📜`;
      rulesContent.innerHTML = gameRules[activeGame] || '<p>No rules available.</p>';
      rulesModal.classList.add('active');
    });
  }

  const hideRules = () => {
    if (rulesModal) rulesModal.classList.remove('active');
  };

  if (closeRulesModalBtn) closeRulesModalBtn.addEventListener('click', hideRules);
  if (closeRulesBtn) closeRulesBtn.addEventListener('click', hideRules);
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
      
      if (!r1.data || !r2.data) continue;

      // 1. If encrypted, compare ciphertexts directly
      if (r1.data.ciphertext && r2.data.ciphertext) {
        if (r1.data.ciphertext === r2.data.ciphertext) {
          duplicates.add(r1.id);
          duplicates.add(r2.id);
        }
        continue;
      }

      // 2. If plaintext/decrypted, compare core schema fields (excluding serials)
      let isIdentical = true;
      let hasData = false;
      state.schema.forEach(field => {
        if (field.id !== 'annual_serial' && field.id !== 'monthly_sl_no') {
          const val1 = (r1.data[field.id] || '').toString().trim().toLowerCase();
          const val2 = (r2.data[field.id] || '').toString().trim().toLowerCase();
          if (val1 !== '') hasData = true;
          if (val1 !== val2) {
            isIdentical = false;
          }
        }
      });

      if (isIdentical && hasData && (r1.date === r2.date)) {
        duplicates.add(r1.id);
        duplicates.add(r2.id);
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

      // Handle E2EE encryption if active
      let payload = updatedData;
      if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
        try {
          const plainString = JSON.stringify(updatedData);
          const encrypted = await window.SecurityEngine.encryptPayload(plainString);
          payload = {
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv
          };
        } catch (encErr) {
          console.error('Failed to encrypt record during edit save:', encErr);
          alert('Failed to encrypt record data. Save aborted.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Changes';
          return;
        }
      }

      const response = await fetch(`/api/entries/update/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken}`
        },
        body: JSON.stringify({
          date: targetDate,
          data: payload
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
state.lastActiveVoiceInput = null;

function highlightActiveVoiceInput(inputEl) {
  document.querySelectorAll('.form-control, .form-select, .time-12h-wrapper select').forEach(el => el.classList.remove('voice-active'));
  if (inputEl) {
    if (inputEl.type === 'hidden' && inputEl.id.startsWith('input-')) {
      const formGroup = inputEl.closest('.form-group');
      if (formGroup) {
        formGroup.querySelectorAll('select').forEach(sel => sel.classList.add('voice-active'));
      }
    } else {
      inputEl.classList.add('voice-active');
    }
  }
}

function getFirstVoiceEnabledInput() {
  const voiceField = state.schema.find(field => field.voiceEnabled === true && field.type !== 'date');
  if (voiceField) {
    return document.getElementById(`input-${voiceField.id}`);
  }
  return null;
}

function matchOption(selectElement, spokenText) {
  const text = spokenText.toLowerCase().trim();
  
  // 1. First pass: exact match
  for (let i = 0; i < selectElement.options.length; i++) {
    const optionText = selectElement.options[i].text.toLowerCase().trim();
    const optionValue = selectElement.options[i].value.toLowerCase().trim();
    if (optionText === text || optionValue === text) {
      return selectElement.options[i].value;
    }
  }
  
  // 2. Second pass: boundary-safe word matching
  for (let i = 0; i < selectElement.options.length; i++) {
    const optionText = selectElement.options[i].text.toLowerCase().trim();
    const optionValue = selectElement.options[i].value.toLowerCase().trim();
    
    // Safety check: if option is "male" but user spoke "female", do not match!
    if (optionText === 'male' && text.includes('female')) {
      continue;
    }

    const escapedOpt = optionText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp('\\b' + escapedOpt + '\\b', 'i');
    if (regex.test(text) || optionText.startsWith(text) || text.startsWith(optionText)) {
      return selectElement.options[i].value;
    }
  }
  return null;
}

function parseSpokenTime(spokenText) {
  const text = spokenText.toLowerCase().trim();
  const match = text.match(/(\d{1,2})[\s-:]*(\d{2})?\s*(am|pm)?/);
  if (match) {
    let hour = parseInt(match[1]);
    let min = match[2] ? parseInt(match[2]) : 0;
    let ampm = match[3] ? match[3].toUpperCase() : null;
    
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
      return { hour, min, ampm };
    }
  }
  return null;
}

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
    if (DOM.voiceTypingBtns) {
      DOM.voiceTypingBtns.forEach(btn => {
        btn.classList.add('listening');
        const textSpan = btn.querySelector('span:not(.btn-icon)');
        if (textSpan) textSpan.textContent = 'Listening...';
        const iconSpan = btn.querySelector('.btn-icon');
        if (iconSpan) iconSpan.textContent = '🛑';
      });
    }
    if (activeSpeechInput) {
      highlightActiveVoiceInput(activeSpeechInput);
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (activeSpeechInput) {
      const fieldId = activeSpeechInput.id.replace('input-', '');
      const schemaField = state.schema.find(f => f.id === fieldId);
      const isTimeField = schemaField && schemaField.type === 'time';
      
      if (isTimeField) {
        const parsedTime = parseSpokenTime(transcript);
        if (parsedTime) {
          const selHour = document.getElementById(`select-h-${fieldId}`);
          const selMin = document.getElementById(`select-m-${fieldId}`);
          const selAmpm = document.getElementById(`select-a-${fieldId}`);
          
          if (selHour && selMin && selAmpm) {
            let h12 = parsedTime.hour;
            let ampm = parsedTime.ampm;
            if (!ampm) {
              ampm = h12 >= 12 ? 'PM' : 'AM';
            }
            if (h12 > 12) h12 -= 12;
            if (h12 === 0) h12 = 12;
            
            selHour.value = h12.toString().padStart(2, '0');
            selMin.value = parsedTime.min.toString().padStart(2, '0');
            selAmpm.value = ampm;
            selHour.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            let h24 = parsedTime.hour;
            if (parsedTime.ampm === 'PM' && h24 < 12) h24 += 12;
            if (parsedTime.ampm === 'AM' && h24 === 12) h24 = 0;
            activeSpeechInput.value = `${h24.toString().padStart(2, '0')}:${parsedTime.min.toString().padStart(2, '0')}`;
            activeSpeechInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      } else if (activeSpeechInput.tagName === 'SELECT') {
        const matchedVal = matchOption(activeSpeechInput, transcript);
        if (matchedVal !== null) {
          activeSpeechInput.value = matchedVal;
          activeSpeechInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        if (activeSpeechInput.type === 'number') {
          const parsedNum = parseFloat(transcript.replace(/[^0-9.]/g, ''));
          activeSpeechInput.value = isNaN(parsedNum) ? '' : parsedNum;
        } else {
          activeSpeechInput.value = transcript.replace(/\.+$/, '').trim();
        }
        activeSpeechInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const currentInput = activeSpeechInput;
      setTimeout(() => {
        advanceToNextVoiceInput(currentInput);
      }, 600);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error !== 'no-speech') {
      let errorMsg = `Microphone error: "${event.error}".`;
      if (event.error === 'network') {
        errorMsg += '\n\nPossible Reasons:\n1. Internet Connection Required.\n2. Insecure context.';
      }
      alert(errorMsg);
    }
    stopListening();
  };

  recognition.onend = () => {
    if (!activeSpeechInput) {
      stopListening();
    }
  };
}

function startListeningToInput(inputEl) {
  if (!recognition) return;
  activeSpeechInput = inputEl;
  try {
    recognition.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    stopListening();
  }
}

function toggleGlobalVoiceTyping(e) {
  if (e) e.preventDefault();
  
  if (!recognition) {
    alert('Voice recognition is not supported on this browser. Use Chrome/Safari.');
    return;
  }

  if (activeSpeechInput) {
    activeSpeechInput = null;
    recognition.stop();
    stopListening();
    return;
  }

  let targetInput = null;
  if (state.lastActiveVoiceInput) {
    targetInput = document.getElementById(state.lastActiveVoiceInput);
  }
  if (!targetInput) {
    targetInput = getFirstVoiceEnabledInput();
  }

  if (!targetInput) {
    alert('No voice-enabled input fields are available.');
    return;
  }

  // Handle focus for 12h time wrapper
  const fieldId = targetInput.id.replace('input-', '');
  const schemaField = state.schema.find(f => f.id === fieldId);
  if (schemaField && schemaField.type === 'time' && schemaField.timeFormat === '12h') {
    const selHour = document.getElementById(`select-h-${fieldId}`);
    if (selHour) selHour.focus();
  } else {
    targetInput.focus();
  }
  
  startListeningToInput(targetInput);
}

function advanceToNextVoiceInput(currentInput) {
  if (!currentInput) return;
  
  const currentId = currentInput.id.replace('input-', '');
  const voiceFields = state.schema.filter(field => field.voiceEnabled === true && field.type !== 'date');
  
  const currentIndex = voiceFields.findIndex(f => f.id === currentId);
  if (currentIndex !== -1 && currentIndex < voiceFields.length - 1) {
    const nextField = voiceFields[currentIndex + 1];
    const nextInput = document.getElementById(`input-${nextField.id}`);
    if (nextInput) {
      const nextFieldId = nextInput.id.replace('input-', '');
      const nextSchemaField = state.schema.find(f => f.id === nextFieldId);
      if (nextSchemaField && nextSchemaField.type === 'time' && nextSchemaField.timeFormat === '12h') {
        const selHour = document.getElementById(`select-h-${nextFieldId}`);
        if (selHour) selHour.focus();
      } else {
        nextInput.focus();
      }
      state.lastActiveVoiceInput = nextInput.id;
      startListeningToInput(nextInput);
      return;
    }
  }
  
  activeSpeechInput = null;
  stopListening();
}

function stopListening() {
  if (DOM.voiceTypingBtns) {
    DOM.voiceTypingBtns.forEach(btn => {
      btn.classList.remove('listening');
      const textSpan = btn.querySelector('span:not(.btn-icon)');
      if (textSpan) textSpan.textContent = 'Voice Typing';
      const iconSpan = btn.querySelector('.btn-icon');
      if (iconSpan) iconSpan.textContent = '🎤';
    });
  }
  document.querySelectorAll('.form-control, .form-select, .time-12h-wrapper select').forEach(el => el.classList.remove('voice-active'));
  activeSpeechInput = null;
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
      alert('Network error verifying entries. Check your connectivity.');
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

      if (val !== undefined && val !== null && val.toString().trim() !== '') {
        if (field.type === 'date') {
          if (typeof val === 'number') {
            val = convertExcelDate(val);
          } else {
            const isoDate = parseDateString(val);
            if (isoDate) {
              val = isoDate;
            } else {
              val = rowDate; // Fallback to current rowDate if parsing failed
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

  // 3. Check for duplicates in imports
  const duplicateAlerts = checkImportDuplicates(parsedDrafts);
  if (DOM.importDuplicateAlert && DOM.importDuplicateAlertText) {
    if (duplicateAlerts.length > 0) {
      DOM.importDuplicateAlertText.innerHTML = `⚠️ <strong>Warning: Duplicate data detected!</strong><br>` + 
        duplicateAlerts.slice(0, 5).join('<br>') + 
        (duplicateAlerts.length > 5 ? `<br>...and ${duplicateAlerts.length - 5} more duplicates.` : '');
      DOM.importDuplicateAlert.classList.remove('hidden');
    } else {
      DOM.importDuplicateAlert.classList.add('hidden');
    }
  }

  // 4. Render all preview rows with formatting
  parsedDrafts.forEach(draft => {
    const tr = document.createElement('tr');
    state.schema.forEach(field => {
      const td = document.createElement('td');
      td.textContent = formatDisplayValue(draft.data[field.id], field);
      tr.appendChild(td);
    });
    DOM.importPreviewBody.appendChild(tr);
  });

  // 5. Update count and display
  DOM.importRowCount.textContent = parsedDrafts.length;
  DOM.confirmImportBtn.removeAttribute('disabled');
  DOM.importMappingPreview.classList.remove('hidden');
}

function checkImportDuplicates(newRecords) {
  const duplicateAlerts = [];
  const allExistingRecords = [...(state.dbRecords || []), ...(state.drafts || [])];

  for (let i = 0; i < newRecords.length; i++) {
    const r1 = newRecords[i];
    const name1 = (r1.data.name || '').toString().trim().toLowerCase();
    const date1 = r1.date || '';
    if (!name1) continue;

    const time1 = (r1.data.timeob || '').toString().trim().toLowerCase();
    const wo1 = (r1.data.wo || '').toString().trim().toLowerCase();
    const addr1 = (r1.data.address || '').toString().trim().toLowerCase();

    // 1. Check against other new records in the import file (index > i)
    for (let j = i + 1; j < newRecords.length; j++) {
      const r2 = newRecords[j];
      const name2 = (r2.data.name || '').toString().trim().toLowerCase();
      const date2 = r2.date || '';
      if (date1 === date2 && name1 === name2) {
        const time2 = (r2.data.timeob || '').toString().trim().toLowerCase();
        const wo2 = (r2.data.wo || '').toString().trim().toLowerCase();
        const addr2 = (r2.data.address || '').toString().trim().toLowerCase();

        const matchTime = (time1 === time2 && time1 !== '');
        const matchWo = (wo1 === wo2 && wo1 !== '');
        const matchAddr = (addr1 === addr2 && addr1 !== '');

        if (matchTime || matchWo || matchAddr) {
          duplicateAlerts.push(`Row ${i + 1} and Row ${j + 1} inside import are duplicates ("${r1.data.name}" on ${formatDateDisplay(date1)})`);
        }
      }
    }

    // 2. Check against database records or existing local drafts
    for (const r2 of allExistingRecords) {
      const name2 = (r2.data.name || '').toString().trim().toLowerCase();
      const date2 = r2.date || '';
      if (date1 === date2 && name1 === name2) {
        const time2 = (r2.data.timeob || '').toString().trim().toLowerCase();
        const wo2 = (r2.data.wo || '').toString().trim().toLowerCase();
        const addr2 = (r2.data.address || '').toString().trim().toLowerCase();

        const matchTime = (time1 === time2 && time1 !== '');
        const matchWo = (wo1 === wo2 && wo1 !== '');
        const matchAddr = (addr1 === addr2 && addr1 !== '');

        if (matchTime || matchWo || matchAddr) {
          const typeStr = r2.id ? `Database Record #${r2.id}` : 'Existing Local Draft';
          duplicateAlerts.push(`Row ${i + 1} inside import is a duplicate of an ${typeStr} ("${r1.data.name}" on ${formatDateDisplay(date1)})`);
        }
      }
    }
  }

  return duplicateAlerts;
}

// Save pending parsed drafts to local drafts store
function handleConfirmImport() {
  if (!state.pendingImportDrafts || state.pendingImportDrafts.length === 0) return;

  // Final check for duplicates and popup warning if any are found
  const duplicateAlerts = checkImportDuplicates(state.pendingImportDrafts);
  if (duplicateAlerts.length > 0) {
    const message = `⚠️ Warning: Duplicate data detected!\n\n` + 
      duplicateAlerts.slice(0, 10).join('\n') + 
      (duplicateAlerts.length > 10 ? `\n...and ${duplicateAlerts.length - 10} more duplicates.` : '') + 
      `\n\nDo you still want to proceed with importing these records?`;
    if (!confirm(message)) {
      return;
    }
  }

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

  // Switch tab to Data Entry
  switchToTab('data-entry');
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
  if (!DOM.totpStatusBadge || !DOM.totpToggleBtn) return;

  state.totpEnabled = enabled;

  const credentialsTotpGroup = document.getElementById('change-admin-2fa-group');
  if (enabled) {
    DOM.totpStatusBadge.className = 'text-success';
    DOM.totpStatusBadge.textContent = 'Enabled';
    DOM.totpToggleBtn.className = 'btn btn-secondary';
    DOM.totpToggleBtn.style.borderColor = 'var(--danger)';
    DOM.totpToggleBtn.style.color = 'var(--danger)';
    DOM.totpToggleBtn.textContent = 'Disable TOTP';
    if (DOM.totpDisableInlineCode) {
      DOM.totpDisableInlineCode.classList.remove('hidden');
      DOM.totpDisableInlineCode.value = '';
    }
    if (credentialsTotpGroup) {
      credentialsTotpGroup.classList.remove('hidden');
    }
    if (DOM.changeAdmin2fa) {
      DOM.changeAdmin2fa.setAttribute('required', 'true');
    }
  } else {
    DOM.totpStatusBadge.className = 'text-warning';
    DOM.totpStatusBadge.textContent = 'Disabled';
    DOM.totpToggleBtn.className = 'btn btn-primary';
    DOM.totpToggleBtn.style.borderColor = '';
    DOM.totpToggleBtn.style.color = '';
    DOM.totpToggleBtn.textContent = 'Enable TOTP';
    if (DOM.totpDisableInlineCode) {
      DOM.totpDisableInlineCode.classList.add('hidden');
      DOM.totpDisableInlineCode.value = '';
    }
    if (credentialsTotpGroup) {
      credentialsTotpGroup.classList.add('hidden');
    }
    if (DOM.changeAdmin2fa) {
      DOM.changeAdmin2fa.removeAttribute('required');
      DOM.changeAdmin2fa.value = '';
    }
  }
}

function resetTotpUI() {
  if (DOM.totpStatusBadge) {
    DOM.totpStatusBadge.className = 'text-warning';
    DOM.totpStatusBadge.textContent = 'Disabled';
  }
  if (DOM.totpToggleBtn) {
    DOM.totpToggleBtn.className = 'btn btn-primary';
    DOM.totpToggleBtn.style.borderColor = '';
    DOM.totpToggleBtn.style.color = '';
    DOM.totpToggleBtn.textContent = 'Enable TOTP';
  }
  if (DOM.totpSetupCode) DOM.totpSetupCode.value = '';
  if (DOM.totpDisableInlineCode) {
    DOM.totpDisableInlineCode.classList.add('hidden');
    DOM.totpDisableInlineCode.value = '';
  }
  const credentialsTotpGroup = document.getElementById('change-admin-2fa-group');
  if (credentialsTotpGroup) {
    credentialsTotpGroup.classList.add('hidden');
  }
  if (DOM.changeAdmin2fa) {
    DOM.changeAdmin2fa.removeAttribute('required');
    DOM.changeAdmin2fa.value = '';
  }
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
      if (DOM.totpSetupModal) DOM.totpSetupModal.classList.add('active');
      if (DOM.totpSetupCode) {
        DOM.totpSetupCode.value = '';
        DOM.totpSetupCode.focus();
      }
    } else {
      alert('Failed to initiate TOTP setup.');
    }
  } catch (err) {
    alert('Network error initiating TOTP setup.');
  }
}

function cancelTotpSetup() {
  if (DOM.totpSetupModal) DOM.totpSetupModal.classList.remove('active');
  if (DOM.totpSetupCode) DOM.totpSetupCode.value = '';
  
  // If canceling during login setup, reopen the login modal so they cannot bypass
  if (state.loginTempToken && state.loginTempToken.startsWith('temp-setup-')) {
    state.loginTempToken = null;
    openLoginModal();
  }
}

async function confirmTotpSetup() {
  const code = DOM.totpSetupCode.value.trim();
  if (!code || code.length !== 6) {
    alert('Please enter a valid 6-digit code.');
    return;
  }

  // If we are in the mandatory setup login flow
  if (state.loginTempToken && state.loginTempToken.startsWith('temp-setup-')) {
    try {
      const response = await fetch('/api/login/totp-enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tempToken: state.loginTempToken, code })
      });
      if (response.ok) {
        const data = await response.json();
        alert('TOTP configured successfully! Logged in.');
        
        state.isAuthenticated = true;
        state.authToken = data.token;
        sessionStorage.setItem('authToken', data.token);
        state.loginTempToken = null;
        
        cancelTotpSetup();
        closeLoginModal();
        
        updateAuthUI();
        renderFormCreator();
        fetchDatabaseRecords();
        fetchTotpStatus();
      } else {
        const err = await response.json();
        alert('Verification failed: ' + (err.error || 'Invalid code'));
      }
    } catch (err) {
      alert('Network error verifying code.');
    }
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
      alert('TOTP Authentication enabled successfully!');
      cancelTotpSetup();
      fetchTotpStatus();
    } else {
      const err = await response.json();
      alert('Verification failed: ' + (err.error || 'Invalid code'));
    }
  } catch (err) {
    alert('Network error enabling TOTP.');
  }
}

async function handleConfirmDisableTotp() {
  const code = DOM.totpDisableInlineCode ? DOM.totpDisableInlineCode.value.trim() : '';
  if (!code || code.length !== 6) {
    alert('Please enter your 6-digit TOTP code in the input field next to the button to confirm disabling.');
    if (DOM.totpDisableInlineCode) DOM.totpDisableInlineCode.focus();
    return;
  }
  try {
    DOM.totpToggleBtn.disabled = true;
    DOM.totpToggleBtn.textContent = 'Disabling...';

    const response = await fetch('/api/settings/totp/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`
      },
      body: JSON.stringify({ code })
    });

    if (response.ok) {
      alert('TOTP Authentication has been disabled.');
      fetchTotpStatus();
    } else {
      const err = await response.json();
      alert('Failed to disable TOTP: ' + (err.error || 'Incorrect code'));
    }
  } catch (err) {
    alert('Network error disabling TOTP.');
  } finally {
    DOM.totpToggleBtn.disabled = false;
    DOM.totpToggleBtn.textContent = 'Disable TOTP';
  }
}

// -------------------------------------------------------------
// QUICK BREAK ROOM GAME MODULE
// -------------------------------------------------------------

let gameTimerInterval = null;
let gameSecondsRemaining = 180;
let isBreakActive = false;
let activeGame = 'bubble-popper';
let gameScore = 0;
let gameHighScores = {
  'bubble-popper': 0,
  'memory-match': 0,
  'snake': 0,
  'gomoku': 0,
  'hilo': 0,
  'weather': 0,
  'news': 0,
  'stocks': 0
};
let isGameRunning = false;
let animationFrameId = null;

// Game states
let bubblePopperState = {
  bubbles: [],
  maxBubbles: 6,
  particles: []
};

let memoryMatchState = {
  cards: [],
  flippedIndices: [],
  matchedPairs: 0,
  lockGrid: false
};

let snakeState = {
  x: 160,
  y: 160,
  dx: 16,
  dy: 0,
  cells: [],
  maxCells: 4,
  apple: { x: 96, y: 96 }
};

const gameMetadata = {
  'bubble-popper': {
    title: 'Zen Bubble Popper 🫧',
    desc: 'Relaxing popper. Pop colorful bubbles before they float away! Need low attention.',
    controls: 'Controls: Click/Tap bubbles to pop them.'
  },
  'memory-match': {
    title: 'Memory Match 🃏',
    desc: 'Classic card match. Flip cards to find matching emoji pairs. Zero stress, low attention.',
    controls: 'Controls: Click cards to flip them.'
  },
  'gem-clicker': {
    title: 'Zen Gem Clicker 💎',
    desc: 'Relaxing clicker. Click the giant gemstone to earn points, release colorful glitter, and watch your gem grow!',
    controls: 'Controls: Click/Tap the gem in the center.'
  },
  'whack-mole': {
    title: 'Zen Whack-A-Mole 🔨',
    desc: 'Satisfying whack. Tap the stars as they pop out of the sky. Needs low attention, very casual.',
    controls: 'Controls: Click/Tap the popping stars.'
  },
  'snake': {
    title: 'Retro Snake 🐍',
    desc: 'Classic keyboard arcade game. Collect apples and avoid walls or self-intersection.',
    controls: 'Controls: Use Arrow Keys or W/A/S/D to move the snake.'
  },
  'gomoku': {
    title: 'Zen Gomoku ⚪⚫',
    desc: 'Calming strategy. Place black stones on a beautiful wooden board. Align 5 stones in a row to win against a relaxing AI.',
    controls: 'Controls: Click board intersections to place stones.'
  },
  'hilo': {
    title: 'Zen Card Hi-Lo 🎴',
    desc: 'Relaxing card guess. Guess if the next card will be Higher or Lower than the current card. Get streaks!',
    controls: 'Controls: Click Higher or Lower buttons.'
  },
  'weather': {
    title: 'Weather Forecast 🌤️',
    desc: 'Real-time weather forecast powered by Open-Meteo. Totally open and public API.',
    controls: 'Displays current temperature and 3-day forecast.'
  },
  'news': {
    title: 'News Headlines 📰',
    desc: 'Public and copyright-free spaceflight news articles. Updated daily.',
    controls: 'Click on headlines to read full articles.'
  },
  'stocks': {
    title: 'Stock Market 📈',
    desc: 'Live financial charts for Nifty 50 and custom symbols powered by Yahoo Finance.',
    controls: 'Interactive real-time chart.'
  }
};

function cleanupActiveGameEngineOnly() {
  isGameRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
  }
}

function startActiveGameEngineOnly() {
  isGameRunning = true;
  const isDashboard = ['weather', 'news', 'stocks'].includes(activeGame);
  if (isDashboard) return;

  if (activeGame === 'bubble-popper') {
    startBubblePopper();
  } else if (activeGame === 'memory-match') {
    startMemoryMatch();
  } else if (activeGame === 'gem-clicker') {
    startGemClicker();
  } else if (activeGame === 'whack-mole') {
    startWhackMole();
  } else if (activeGame === 'snake') {
    startSnakeArcade();
  } else if (activeGame === 'gomoku') {
    startGomoku();
  } else if (activeGame === 'hilo') {
    startHiLo();
  }
}

let isBreakGameInitialized = false;

function initBreakGame() {
  const gameSelect = document.getElementById('game-select');
  const timerSelect = document.getElementById('game-timer-select');
  
  if (isBreakGameInitialized) {
    updateTimerDisplay();
    updateGameOverlayUI();
    return;
  }
  isBreakGameInitialized = true;
  
  if (gameSelect) {
    activeGame = gameSelect.value;
  }
  
  if (timerSelect) {
    if (!isBreakActive) {
      gameSecondsRemaining = parseInt(timerSelect.value);
    }
  }

  updateTimerDisplay();
  updateGameOverlayUI();

  // Draw initial screen on canvas
  drawInitialCanvasScreen();
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('game-timer');
  if (timerDisplay) {
    const mins = Math.floor(gameSecondsRemaining / 60).toString().padStart(2, '0');
    const secs = (gameSecondsRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `Break Time Remaining: ${mins}:${secs}`;
  }
}

function updateGameOverlayUI() {
  const meta = gameMetadata[activeGame] || gameMetadata['bubble-popper'];
  const title = document.getElementById('game-overlay-title');
  const desc = document.getElementById('game-overlay-desc');
  const help = document.getElementById('game-controls-help');
  const overlay = document.getElementById('game-overlay');
  
  if (title) {
    title.textContent = meta.title;
    title.style.color = '#ff7b00';
  }
  if (desc) desc.textContent = meta.desc;
  if (help) help.textContent = meta.controls;
  
  // Toggle visibility of canvas vs card grid vs extra container
  const canvas = document.getElementById('game-canvas');
  const mmGrid = document.getElementById('memory-match-grid');
  const extraContainer = document.getElementById('extra-info-container');
  
  if (isBreakActive) {
    if (overlay) overlay.style.display = 'none';
    
    const isDashboard = ['weather', 'news', 'stocks'].includes(activeGame);
    if (isDashboard) {
      if (canvas) canvas.style.display = 'none';
      if (mmGrid) mmGrid.style.display = 'none';
      if (extraContainer) {
        extraContainer.style.display = 'block';
        loadDashboardWidget(activeGame);
      }
    } else {
      if (extraContainer) extraContainer.style.display = 'none';
      if (activeGame === 'memory-match') {
        if (canvas) canvas.style.display = 'none';
        if (mmGrid) mmGrid.style.display = 'grid';
      } else {
        if (canvas) canvas.style.display = 'block';
        if (mmGrid) mmGrid.style.display = 'none';
      }
    }
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    if (mmGrid) mmGrid.style.display = 'none';
    if (extraContainer) {
      extraContainer.style.display = 'none';
    }
  }

  // Sync scores display
  const scoreDisplay = document.getElementById('game-score');
  const hsDisplay = document.getElementById('game-highscore');
  if (scoreDisplay) scoreDisplay.textContent = gameScore;
  if (hsDisplay) hsDisplay.textContent = gameHighScores[activeGame] || 0;

  // Toggle visibility of the game scoreboard
  const scoreboard = document.getElementById('game-scoreboard');
  if (scoreboard) {
    if (isBreakActive && !['weather', 'news', 'stocks'].includes(activeGame)) {
      scoreboard.style.display = 'flex';
    } else {
      scoreboard.style.display = 'none';
    }
  }
}

function drawInitialCanvasScreen() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas || activeGame === 'memory-match') return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ff7b00';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Click Start to Play', canvas.width / 2, canvas.height / 2);
}

function stopActiveGame() {
  isBreakActive = false;
  cleanupActiveGameEngineOnly();
  
  if (gameTimerInterval) {
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
  }
  
  const gameSelect = document.getElementById('game-select');
  const timerSelect = document.getElementById('game-timer-select');
  if (gameSelect) gameSelect.disabled = false;
  if (timerSelect) timerSelect.disabled = false;
}

function startBreakGame() {
  stopActiveGame();
  
  const overlay = document.getElementById('game-overlay');
  if (overlay) overlay.style.display = 'none';
  
  const scoreDisplay = document.getElementById('game-score');
  if (scoreDisplay) scoreDisplay.textContent = '0';
  gameScore = 0;
  
  isBreakActive = true;
  
  const gameSelect = document.getElementById('game-select');
  const timerSelect = document.getElementById('game-timer-select');
  if (timerSelect) timerSelect.disabled = true;

  const duration = timerSelect ? parseInt(timerSelect.value) : 180;
  gameSecondsRemaining = duration;
  updateTimerDisplay();

  gameTimerInterval = setInterval(() => {
    gameSecondsRemaining--;
    updateTimerDisplay();
    
    if (gameSecondsRemaining <= 0) {
      stopActiveGame();
      updateGameOverlayUI();
      const title = document.getElementById('game-overlay-title');
      if (title) {
        title.textContent = "Break Over!";
        title.style.color = 'var(--warning)';
      }
      alert("Time's up! Back to work! 🏃‍♂️");
      switchToTab('data-entry');
    }
  }, 1000);

  updateGameOverlayUI();
  startActiveGameEngineOnly();
}

// -------------------------------------------------------------
// GAME 1: ZEN BUBBLE POPPER (Visually Beautiful, Clicker)
// -------------------------------------------------------------

function startBubblePopper() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  bubblePopperState.bubbles = [];
  bubblePopperState.particles = [];
  
  // Spawns bubble
  function spawnBubble() {
    const radius = Math.random() * 20 + 15;
    const hue = Math.floor(Math.random() * 360);
    bubblePopperState.bubbles.push({
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: canvas.height + radius,
      radius: radius,
      speed: Math.random() * 1.2 + 0.6,
      color: `hsla(${hue}, 85%, 65%, 0.75)`,
      border: `hsla(${hue}, 85%, 50%, 0.9)`,
      pulse: 0,
      pulseDir: 0.05
    });
  }

  // Handle click to pop bubbles
  canvas.addEventListener('click', (e) => {
    if (!isGameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    for (let i = bubblePopperState.bubbles.length - 1; i >= 0; i--) {
      const b = bubblePopperState.bubbles[i];
      const dist = Math.hypot(clickX - b.x, clickY - b.y);
      if (dist <= b.radius) {
        // Pop bubble!
        createPopParticles(b.x, b.y, b.color);
        bubblePopperState.bubbles.splice(i, 1);
        gameScore += 10;
        updateGameScore();
        break; // Pop one bubble at a time
      }
    }
  });

  function createPopParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      bubblePopperState.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 1.5,
        color: color,
        alpha: 1
      });
    }
  }

  function loop() {
    if (!isGameRunning) return;
    animationFrameId = requestAnimationFrame(loop);
    
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid line pattern
    ctx.strokeStyle = 'rgba(48, 54, 61, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 20; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 20; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }
    
    // Spawn new bubble if below capacity
    if (bubblePopperState.bubbles.length < bubblePopperState.maxBubbles && Math.random() < 0.02) {
      spawnBubble();
    }
    
    // Update and draw bubbles
    for (let i = bubblePopperState.bubbles.length - 1; i >= 0; i--) {
      const b = bubblePopperState.bubbles[i];
      b.y -= b.speed;
      b.pulse += b.pulseDir;
      if (b.pulse > 1.2 || b.pulse < -1.2) b.pulseDir *= -1;
      
      // Floating off screen
      if (b.y < -b.radius) {
        bubblePopperState.bubbles.splice(i, 1);
        continue;
      }
      
      // Draw shiny bubble
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius + b.pulse * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Bubble highlight shine reflection
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fill();
    }
    
    // Update and draw particles
    for (let i = bubblePopperState.particles.length - 1; i >= 0; i--) {
      const p = bubblePopperState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      
      if (p.alpha <= 0) {
        bubblePopperState.particles.splice(i, 1);
        continue;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace('0.75', p.alpha.toString());
      ctx.fill();
    }
  }
  
  loop();
}

// -------------------------------------------------------------
// GAME 2: MEMORY MATCH (Relaxing Grid, Emoji pairs)
// -------------------------------------------------------------

function startMemoryMatch() {
  const gridContainer = document.getElementById('memory-match-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';
  
  const emojis = ['🫧', '🎮', '🦄', '🌟', '🍕', '🚀', '🔮', '🐱'];
  // Duplicate emojis to make pairs
  let cardValues = [...emojis, ...emojis];
  
  // Shuffle cards
  cardValues.sort(() => Math.random() - 0.5);
  
  memoryMatchState.cards = cardValues;
  memoryMatchState.flippedIndices = [];
  memoryMatchState.matchedPairs = 0;
  memoryMatchState.lockGrid = false;
  
  // Render cards
  cardValues.forEach((val, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = idx;
    
    // Styling cards directly
    card.style.background = '#21262d';
    card.style.border = '1px solid var(--panel-border)';
    card.style.borderRadius = '6px';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.fontSize = '1.8rem';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.2s, background-color 0.25s';
    card.style.userSelect = 'none';
    card.textContent = '❓';
    
    card.addEventListener('click', () => handleCardFlip(card, idx));
    gridContainer.appendChild(card);
  });
}

function handleCardFlip(cardEl, idx) {
  if (memoryMatchState.lockGrid) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
  
  cardEl.textContent = memoryMatchState.cards[idx];
  cardEl.style.background = '#30363d';
  cardEl.style.transform = 'scale(1.05)';
  cardEl.classList.add('flipped');
  
  memoryMatchState.flippedIndices.push(idx);
  
  if (memoryMatchState.flippedIndices.length === 2) {
    memoryMatchState.lockGrid = true;
    
    const [firstIdx, secondIdx] = memoryMatchState.flippedIndices;
    const cardsList = document.getElementById('memory-match-grid').children;
    const firstCard = cardsList[firstIdx];
    const secondCard = cardsList[secondIdx];
    
    if (memoryMatchState.cards[firstIdx] === memoryMatchState.cards[secondIdx]) {
      // Matched!
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        firstCard.style.background = 'rgba(46, 164, 79, 0.2)';
        secondCard.style.background = 'rgba(46, 164, 79, 0.2)';
        firstCard.style.borderColor = 'var(--success)';
        secondCard.style.borderColor = 'var(--success)';
        
        memoryMatchState.matchedPairs++;
        gameScore += 25;
        updateGameScore();
        
        memoryMatchState.flippedIndices = [];
        memoryMatchState.lockGrid = false;
        
        if (memoryMatchState.matchedPairs === 8) {
          setTimeout(() => {
            alert('Congratulations! You matched all pairs!');
            startMemoryMatch(); // Restart memory game
          }, 500);
        }
      }, 400);
    } else {
      // Not matched
      setTimeout(() => {
        firstCard.textContent = '❓';
        secondCard.textContent = '❓';
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.style.background = '#21262d';
        secondCard.style.background = '#21262d';
        firstCard.style.transform = 'scale(1)';
        secondCard.style.transform = 'scale(1)';
        
        memoryMatchState.flippedIndices = [];
        memoryMatchState.lockGrid = false;
      }, 900);
    }
  }
}

// -------------------------------------------------------------
// GAME 3: RETRO SNAKE ARCADE (Classic Keyboard steering)
// -------------------------------------------------------------

function startSnakeArcade() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const grid = 18;
  let count = 0;
  
  snakeState.x = 180;
  snakeState.y = 180;
  snakeState.dx = grid;
  snakeState.dy = 0;
  snakeState.cells = [];
  snakeState.maxCells = 4;
  snakeState.apple = { x: 90, y: 90 };
  snakeState.speedThreshold = 18;
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function resetApple() {
    snakeState.apple.x = getRandomInt(0, 25) * grid;
    snakeState.apple.y = getRandomInt(0, 25) * grid;
  }
  
  const handleKeys = (e) => {
    if (!isGameRunning || activeGame !== 'snake') return;
    
    if ([37, 38, 39, 40].indexOf(e.which) > -1) {
      e.preventDefault();
    }
    
    if ((e.which === 37 || e.which === 65) && snakeState.dx === 0) {
      snakeState.dx = -grid;
      snakeState.dy = 0;
    }
    else if ((e.which === 38 || e.which === 87) && snakeState.dy === 0) {
      snakeState.dy = -grid;
      snakeState.dx = 0;
    }
    else if ((e.which === 39 || e.which === 68) && snakeState.dx === 0) {
      snakeState.dx = grid;
      snakeState.dy = 0;
    }
    else if ((e.which === 40 || e.which === 83) && snakeState.dy === 0) {
      snakeState.dy = grid;
      snakeState.dx = 0;
    }
  };
  
  document.removeEventListener('keydown', handleKeys);
  document.addEventListener('keydown', handleKeys);
  
  function loop() {
    if (!isGameRunning || activeGame !== 'snake') return;
    animationFrameId = requestAnimationFrame(loop);
    
    if (++count < (snakeState.speedThreshold || 18)) {
      return;
    }
    count = 0;
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    snakeState.x += snakeState.dx;
    snakeState.y += snakeState.dy;
    
    if (snakeState.x < 0) {
      snakeState.x = canvas.width - grid;
    }
    else if (snakeState.x >= canvas.width) {
      snakeState.x = 0;
    }
    
    if (snakeState.y < 0) {
      snakeState.y = canvas.height - grid;
    }
    else if (snakeState.y >= canvas.height) {
      snakeState.y = 0;
    }
    
    snakeState.cells.unshift({x: snakeState.x, y: snakeState.y});
    
    if (snakeState.cells.length > snakeState.maxCells) {
      snakeState.cells.pop();
    }
    
    // Apple center x, y
    const ax = snakeState.apple.x + grid / 2;
    const ay = snakeState.apple.y + grid / 2;
    const applePulse = Math.sin(Date.now() * 0.01) * 1.5;
    
    // Draw glowing shadow for apple
    ctx.shadowColor = '#da3637';
    ctx.shadowBlur = 8;
    
    // Draw Apple Body
    ctx.beginPath();
    ctx.arc(ax, ay, (grid / 2 - 1.5) + applePulse, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3838';
    ctx.fill();
    
    ctx.shadowBlur = 0; // reset shadow
    
    // Draw Leaf
    ctx.beginPath();
    ctx.ellipse(ax + 2, ay - 6, 2, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3fb950';
    ctx.fill();
    
    // Draw Stem
    ctx.beginPath();
    ctx.moveTo(ax, ay - 4);
    ctx.quadraticCurveTo(ax + 2, ay - 7, ax + 3, ay - 9);
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    snakeState.cells.forEach(function(cell, index) {
      const cx = cell.x + grid / 2;
      const cy = cell.y + grid / 2;
      const r = grid / 2;
      
      if (index === 0) {
        // Draw Head with Eyes and Tongue
        ctx.beginPath();
        ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
        ctx.fillStyle = '#56d364'; // Head color
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#ffffff';
        let eye1X, eye1Y, eye2X, eye2Y, pupilX, pupilY;
        
        // eye offsets based on movement direction
        if (snakeState.dx > 0) { // Right
          eye1X = cx + 2; eye1Y = cy - 3;
          eye2X = cx + 2; eye2Y = cy + 3;
          pupilX = 1; pupilY = 0;
        } else if (snakeState.dx < 0) { // Left
          eye1X = cx - 2; eye1Y = cy - 3;
          eye2X = cx - 2; eye2Y = cy + 3;
          pupilX = -1; pupilY = 0;
        } else if (snakeState.dy > 0) { // Down
          eye1X = cx - 3; eye1Y = cy + 2;
          eye2X = cx + 3; eye2Y = cy + 2;
          pupilX = 0; pupilY = 1;
        } else { // Up
          eye1X = cx - 3; eye1Y = cy - 2;
          eye2X = cx + 3; eye2Y = cy - 2;
          pupilX = 0; pupilY = -1;
        }
        
        // Draw eye whites
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 3, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(eye1X + pupilX, eye1Y + pupilY, 1.3, 0, Math.PI * 2);
        ctx.arc(eye2X + pupilX, eye2Y + pupilY, 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Little darting tongue (micro-animation)
        if (Math.floor(Date.now() / 200) % 4 === 0) {
          ctx.strokeStyle = '#ff7b72';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (snakeState.dx > 0) {
            ctx.moveTo(cx + r, cy);
            ctx.lineTo(cx + r + 5, cy);
            ctx.lineTo(cx + r + 7, cy - 2);
            ctx.moveTo(cx + r + 5, cy);
            ctx.lineTo(cx + r + 7, cy + 2);
          } else if (snakeState.dx < 0) {
            ctx.moveTo(cx - r, cy);
            ctx.lineTo(cx - r - 5, cy);
            ctx.lineTo(cx - r - 7, cy - 2);
            ctx.moveTo(cx - r - 5, cy);
            ctx.lineTo(cx - r - 7, cy + 2);
          } else if (snakeState.dy > 0) {
            ctx.moveTo(cx, cy + r);
            ctx.lineTo(cx, cy + r + 5);
            ctx.lineTo(cx - 2, cy + r + 7);
            ctx.moveTo(cx, cy + r + 5);
            ctx.lineTo(cx + 2, cy + r + 7);
          } else {
            ctx.moveTo(cx, cy - r);
            ctx.lineTo(cx, cy - r - 5);
            ctx.lineTo(cx - 2, cy - r - 7);
            ctx.moveTo(cx, cy - r - 5);
            ctx.lineTo(cx + 2, cy - r - 7);
          }
          ctx.stroke();
        }
      } else {
        // Draw Body Segments with smooth colors
        ctx.beginPath();
        const progress = index / snakeState.cells.length;
        const segmentRadius = r * (1 - progress * 0.3);
        ctx.arc(cx, cy, segmentRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = index % 2 === 0 ? '#2ea44f' : '#238636';
        ctx.fill();
        
        // Highlight
        ctx.beginPath();
        ctx.arc(cx - segmentRadius*0.2, cy - segmentRadius*0.2, segmentRadius*0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
      }  
      
      if (cell.x === snakeState.apple.x && cell.y === snakeState.apple.y) {
        snakeState.maxCells++;
        gameScore += 10;
        updateGameScore();
        resetApple();
        if (snakeState.speedThreshold > 5) {
          snakeState.speedThreshold--;
        }
      }
      
      for (let i = index + 1; i < snakeState.cells.length; i++) {
        if (cell.x === snakeState.cells[i].x && cell.y === snakeState.cells[i].y) {
          isGameRunning = false;
          const overlay = document.getElementById('game-overlay');
          const title = document.getElementById('game-overlay-title');
          if (overlay && title) {
            title.textContent = `Game Over! Score: ${gameScore}`;
            title.style.color = 'var(--danger)';
            overlay.style.display = 'flex';
          }
        }
      }
    });
  }
  
  loop();
}

function updateGameScore() {
  const scoreDisplay = document.getElementById('game-score');
  if (scoreDisplay) scoreDisplay.textContent = gameScore;
  
  if (gameScore > (gameHighScores[activeGame] || 0)) {
    gameHighScores[activeGame] = gameScore;
    const hsDisplay = document.getElementById('game-highscore');
    if (hsDisplay) hsDisplay.textContent = gameScore;
  }
}

// -------------------------------------------------------------
// GAME 4: ZEN GEM CLICKER (Glitter, Grow, low attention clicker)
// -------------------------------------------------------------

function startGemClicker() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let gemRadius = 55;
  let targetRadius = 55;
  let particles = [];
  let floatTexts = [];
  
  canvas.addEventListener('click', (e) => {
    if (!isGameRunning || activeGame !== 'gem-clicker') return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dist = Math.hypot(clickX - centerX, clickY - centerY);
    
    if (dist <= gemRadius) {
      targetRadius = 70;
      gameScore += 1;
      updateGameScore();
      
      floatTexts.push({
        x: clickX,
        y: clickY - 10,
        text: '+1',
        alpha: 1,
        speed: 1.5
      });
      
      const colors = ['#00d2ff', '#00f6ff', '#ff00f0', '#ffea00', '#ffffff'];
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }
    }
  });
  
  function loop() {
    if (!isGameRunning || activeGame !== 'gem-clicker') return;
    animationFrameId = requestAnimationFrame(loop);
    
    gemRadius += (targetRadius - gemRadius) * 0.18;
    if (targetRadius > 55) targetRadius -= 1.5;
    if (targetRadius < 55) targetRadius = 55;
    
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, gemRadius * 1.8);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(13, 17, 23, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, gemRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#161b22';
    
    const drawOctagon = (r) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 - Math.PI / 8;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    
    drawOctagon(gemRadius);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#21262d';
    drawOctagon(gemRadius * 0.55);
    ctx.fill();
    ctx.stroke();
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 8;
      ctx.moveTo(cx + Math.cos(angle) * gemRadius, cy + Math.sin(angle) * gemRadius);
      ctx.lineTo(cx + Math.cos(angle) * gemRadius * 0.55, cy + Math.sin(angle) * gemRadius * 0.55);
    }
    ctx.stroke();
    
    const time = Date.now() * 0.003;
    const sweepAngle = Math.sin(time) * (gemRadius * 0.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - gemRadius + sweepAngle, cy - gemRadius);
    ctx.lineTo(cx + sweepAngle, cy + gemRadius);
    ctx.stroke();
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const t = floatTexts[i];
      t.y -= t.speed;
      t.alpha -= 0.02;
      if (t.alpha <= 0) {
        floatTexts.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 123, 0, ${t.alpha})`;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.text, t.x, t.y);
    }
  }
  
  loop();
}

// -------------------------------------------------------------
// GAME 5: ZEN WHACK-A-MOLE (Popping sky stars, low attention)
// -------------------------------------------------------------

function startWhackMole() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const spots = [
    { x: 90, y: 90, active: false, timer: 0 },
    { x: 270, y: 90, active: false, timer: 0 },
    { x: 90, y: 270, active: false, timer: 0 },
    { x: 270, y: 270, active: false, timer: 0 },
    { x: 180, y: 180, active: false, timer: 0 }
  ];
  
  let activeSpotIdx = -1;
  let spawnTimer = 0;
  let particles = [];
  
  canvas.addEventListener('click', (e) => {
    if (!isGameRunning || activeGame !== 'whack-mole') return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    spots.forEach((spot) => {
      if (spot.active) {
        const dist = Math.hypot(clickX - spot.x, clickY - spot.y);
        if (dist <= 30) {
          spot.active = false;
          activeSpotIdx = -1;
          gameScore += 15;
          updateGameScore();
          
          for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1.5;
            particles.push({
              x: spot.x,
              y: spot.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: Math.random() * 3 + 1,
              color: '#ffea00',
              alpha: 1
            });
          }
        }
      }
    });
  });
  
  function loop() {
    if (!isGameRunning || activeGame !== 'whack-mole') return;
    animationFrameId = requestAnimationFrame(loop);
    
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    spawnTimer++;
    if (spawnTimer > 45) {
      spawnTimer = 0;
      if (activeSpotIdx !== -1) {
        spots[activeSpotIdx].active = false;
      }
      activeSpotIdx = Math.floor(Math.random() * spots.length);
      spots[activeSpotIdx].active = true;
      spots[activeSpotIdx].timer = 40;
    }
    
    spots.forEach(spot => {
      if (spot.active) {
        spot.timer--;
        if (spot.timer <= 0) {
          spot.active = false;
          activeSpotIdx = -1;
        }
      }
    });
    
    spots.forEach(spot => {
      ctx.strokeStyle = 'rgba(48, 54, 61, 0.4)';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#161b22';
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      if (spot.active) {
        const pulse = Math.sin(Date.now() * 0.015) * 4;
        const grad = ctx.createRadialGradient(spot.x, spot.y, 5, spot.x, spot.y, 25 + pulse);
        grad.addColorStop(0, '#ffea00');
        grad.addColorStop(0.6, 'rgba(255, 234, 0, 0.4)');
        grad.addColorStop(1, 'rgba(255, 234, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, 25 + pulse, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', spot.x, spot.y);
      }
    });
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
  
  loop();
}

// -------------------------------------------------------------
// GAME 6: ZEN GOMOKU (Calming 9x9 Board Game, Black/White Stones)
// -------------------------------------------------------------

function startGomoku() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gridSize = 9;
  const boardMargin = 45;
  const cellSize = (canvas.width - boardMargin * 2) / (gridSize - 1); // (450-90)/8 = 45px
  
  // Board state: 0 = empty, 1 = Black (Player), 2 = White (AI)
  let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  let gameOver = false;
  let statusMessage = "Your Turn (Black)";
  
  function drawBoard() {
    // Draw wood-style background
    ctx.fillStyle = '#dfb07a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle border
    ctx.strokeStyle = '#85592e';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    // Draw grid lines
    ctx.strokeStyle = '#5c3e21';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < gridSize; i++) {
      // Horizontal
      ctx.beginPath();
      ctx.moveTo(boardMargin, boardMargin + i * cellSize);
      ctx.lineTo(canvas.width - boardMargin, boardMargin + i * cellSize);
      ctx.stroke();
      
      // Vertical
      ctx.beginPath();
      ctx.moveTo(boardMargin + i * cellSize, boardMargin);
      ctx.lineTo(boardMargin + i * cellSize, canvas.height - boardMargin);
      ctx.stroke();
    }
    
    // Draw star points (standard Go spots)
    const starSpots = [2, 4, 6];
    ctx.fillStyle = '#5c3e21';
    starSpots.forEach(r => {
      starSpots.forEach(c => {
        if ((r === 4 && c === 4) || (r !== 4 && c !== 4)) {
          ctx.beginPath();
          ctx.arc(boardMargin + r * cellSize, boardMargin + c * cellSize, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
    
    // Draw stones
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const val = board[r][c];
        if (val !== 0) {
          const sx = boardMargin + c * cellSize;
          const sy = boardMargin + r * cellSize;
          
          ctx.beginPath();
          ctx.arc(sx, sy, cellSize * 0.42, 0, Math.PI * 2);
          
          if (val === 1) {
            // Black stone gradient
            const grad = ctx.createRadialGradient(sx - 3, sy - 3, 1, sx, sy, cellSize * 0.42);
            grad.addColorStop(0, '#555555');
            grad.addColorStop(0.2, '#222222');
            grad.addColorStop(1, '#050505');
            ctx.fillStyle = grad;
          } else {
            // White stone gradient
            const grad = ctx.createRadialGradient(sx - 3, sy - 3, 1, sx, sy, cellSize * 0.42);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#f0f0f0');
            grad.addColorStop(1, '#d0d0d0');
            ctx.fillStyle = grad;
            ctx.strokeStyle = '#bbbbbb';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          ctx.fill();
        }
      }
    }
    
    // Status text
    ctx.fillStyle = '#2c1e10';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(statusMessage, canvas.width / 2, canvas.height - 15);
  }
  
  function checkWin(r, c, p) {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal Down-Right
      [1, -1]   // Diagonal Down-Left
    ];
    
    for (let [dr, dc] of directions) {
      let count = 1;
      
      // Check positive direction
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && board[nr][nc] === p) {
        count++;
        nr += dr;
        nc += dc;
      }
      
      // Check negative direction
      nr = r - dr; nc = c - dc;
      while (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && board[nr][nc] === p) {
        count++;
        nr -= dr;
        nc -= dc;
      }
      
      if (count >= 5) return true;
    }
    return false;
  }
  
  function makeAIMove() {
    if (gameOver || !isGameRunning) return;
    
    statusMessage = "AI thinking...";
    drawBoard();
    
    setTimeout(() => {
      if (gameOver || !isGameRunning) return;
      
      // Basic AI logic: Look for win, block player, or play near stones
      let bestMove = null;
      let highestScore = -1;
      
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board[r][c] === 0) {
            let score = 0;
            
            // Check if AI wins here
            board[r][c] = 2;
            if (checkWin(r, c, 2)) score += 10000;
            
            // Check if player wins here (block)
            board[r][c] = 1;
            if (checkWin(r, c, 1)) score += 5000;
            board[r][c] = 0;
            
            // Prefer moves next to existing stones
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && board[nr][nc] !== 0) {
                  score += board[nr][nc] === 2 ? 10 : 5; // AI stones weighted slightly higher
                }
              }
            }
            
            // Center is good at start
            const centerDist = Math.abs(r - 4) + Math.abs(c - 4);
            score += (10 - centerDist);
            
            if (score > highestScore) {
              highestScore = score;
              bestMove = { r, c };
            }
          }
        }
      }
      
      if (bestMove) {
        const { r, c } = bestMove;
        board[r][c] = 2;
        
        if (checkWin(r, c, 2)) {
          gameOver = true;
          statusMessage = "AI Wins! Try again.";
          drawBoard();
          setTimeout(() => {
            const overlay = document.getElementById('game-overlay');
            const title = document.getElementById('game-overlay-title');
            if (overlay && title) {
              title.textContent = "AI Wins!";
              title.style.color = 'var(--danger)';
              overlay.style.display = 'flex';
            }
          }, 600);
        } else {
          statusMessage = "Your Turn (Black)";
          drawBoard();
        }
      }
    }, 600);
  }
  
  canvas.addEventListener('click', (e) => {
    if (gameOver || !isGameRunning || activeGame !== 'gomoku' || statusMessage === "AI thinking...") return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Find closest intersection
    let closestGrid = null;
    let minDist = 20;
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const sx = boardMargin + c * cellSize;
        const sy = boardMargin + r * cellSize;
        const dist = Math.hypot(clickX - sx, clickY - sy);
        if (dist < minDist) {
          minDist = dist;
          closestGrid = { r, c };
        }
      }
    }
    
    if (closestGrid) {
      const { r, c } = closestGrid;
      if (board[r][c] === 0) {
        board[r][c] = 1;
        gameScore += 10;
        updateGameScore();
        
        if (checkWin(r, c, 1)) {
          gameOver = true;
          statusMessage = "You Won!";
          gameScore += 100;
          updateGameScore();
          drawBoard();
          setTimeout(() => {
            const overlay = document.getElementById('game-overlay');
            const title = document.getElementById('game-overlay-title');
            if (overlay && title) {
              title.textContent = "You Win! 🎉";
              title.style.color = 'var(--success)';
              overlay.style.display = 'flex';
            }
          }, 600);
        } else {
          makeAIMove();
        }
      }
    }
  });
  
  drawBoard();
}

// -------------------------------------------------------------
// GAME 7: ZEN CARD HI-LO (Calming guess card game with animations)
// -------------------------------------------------------------

function startHiLo() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const suits = ['♥', '♦', '♣', '♠'];
  const values = [
    { label: '2', val: 2 }, { label: '3', val: 3 }, { label: '4', val: 4 },
    { label: '5', val: 5 }, { label: '6', val: 6 }, { label: '7', val: 7 },
    { label: '8', val: 8 }, { label: '9', val: 9 }, { label: '10', val: 10 },
    { label: 'J', val: 11 }, { label: 'Q', val: 12 }, { label: 'K', val: 13 },
    { label: 'A', val: 14 }
  ];
  
  let currentCard = getRandomCard();
  let nextCard = getRandomCard();
  let feedbackText = "";
  let feedbackColor = "";
  let feedbackTimer = 0;
  let streak = 0;
  
  // Button definitions (drawn on canvas)
  const hiBtn = { x: 50, y: 280, w: 110, h: 44, label: "Higher ▲" };
  const loBtn = { x: 200, y: 280, w: 110, h: 44, label: "Lower ▼" };
  
  function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valObj = values[Math.floor(Math.random() * values.length)];
    return {
      suit,
      label: valObj.label,
      val: valObj.val,
      color: (suit === '♥' || suit === '♦') ? '#ff3b30' : '#ffffff'
    };
  }
  
  function drawCard(card, x, y, w, h) {
    // Card background
    ctx.fillStyle = '#21262d';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    
    // Card face style
    ctx.fillStyle = card.color;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(card.label, x + 10, y + 10);
    ctx.fillText(card.suit, x + 10, y + 36);
    
    // Large Center Emoji
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.suit, x + w/2, y + h/2 + 10);
  }
  
  function drawButton(btn, isPressed) {
    ctx.fillStyle = btn.label.includes('Higher') ? '#2ea44f' : '#238636';
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 6);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
  }
  
  function draw() {
    if (!isGameRunning || activeGame !== 'hilo') return;
    
    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw current card
    drawCard(currentCard, canvas.width/2 - 70, 45, 140, 200);
    
    // Draw action buttons
    drawButton(hiBtn);
    drawButton(loBtn);
    
    // Draw Streak text
    ctx.fillStyle = '#ff7b00';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Streak: ${streak}`, canvas.width / 2, 25);
    
    // Draw Feedback
    if (feedbackTimer > 0) {
      feedbackTimer--;
      ctx.fillStyle = feedbackColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(feedbackText, canvas.width / 2, 262);
    }
  }
  
  function makeGuess(guess) {
    // Generate next card that is different
    while (nextCard.val === currentCard.val) {
      nextCard = getRandomCard();
    }
    
    const correct = (guess === 'high' && nextCard.val > currentCard.val) ||
                    (guess === 'low' && nextCard.val < currentCard.val);
                    
    currentCard = nextCard;
    nextCard = getRandomCard();
    
    if (correct) {
      streak++;
      gameScore += 10 + streak * 2; // Streak bonus
      updateGameScore();
      feedbackText = `Correct! Next card: ${currentCard.label}${currentCard.suit}`;
      feedbackColor = '#3fb950';
    } else {
      streak = 0;
      feedbackText = `Wrong! Next card: ${currentCard.label}${currentCard.suit}`;
      feedbackColor = '#f85149';
    }
    feedbackTimer = 50;
  }
  
  canvas.addEventListener('click', (e) => {
    if (!isGameRunning || activeGame !== 'hilo') return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Check Higher Button click
    if (clickX >= hiBtn.x && clickX <= hiBtn.x + hiBtn.w &&
        clickY >= hiBtn.y && clickY <= hiBtn.y + hiBtn.h) {
      makeGuess('high');
    }
    
    // Check Lower Button click
    if (clickX >= loBtn.x && clickX <= loBtn.x + loBtn.w &&
        clickY >= loBtn.y && clickY <= loBtn.y + loBtn.h) {
      makeGuess('low');
    }
  });
  
  function loop() {
    if (!isGameRunning || activeGame !== 'hilo') return;
    animationFrameId = requestAnimationFrame(loop);
    draw();
  }
  
  loop();
}

// -------------------------------------------------------------
// DASHBOARD WIDGETS LOADER (News, Stocks, Weather)
// -------------------------------------------------------------

async function loadDashboardWidget(type) {
  const container = document.getElementById('extra-info-container');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-muted);">Loading dashboard data...</div>';
  
  if (type === 'stocks') {
    renderStockWidget("NSE:NIFTY");
  }
  else if (type === 'news') {
    try {
      // Indian News API (saurav.tech - keyless & public)
      const res = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/in.json');
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      let html = `
        <div style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px;">
          <h4 style="margin: 0 0 4px 0; color: #ff7b00; font-size: 0.95rem; border-bottom: 1px solid var(--panel-border); padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>India National News 📰</span>
            <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 2px 8px; font-weight: normal;" onclick="loadDashboardWidget('news')">🔄 Refresh</button>
          </h4>
      `;
      
      const articles = (data.articles || []).slice(0, 6);
      articles.forEach((item, index) => {
        const dateStr = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today';
        const uniqueId = `news-desc-${index}`;
        html += `
          <div style="background: #161b22; border: 1px solid var(--panel-border); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 6px; transition: border-color 0.2s; cursor: pointer;" 
               onclick="const d = document.getElementById('${uniqueId}'); d.style.display = d.style.display === 'none' ? 'block' : 'none';"
               onmouseover="this.style.borderColor='var(--accent-color)'"
               onmouseout="this.style.borderColor='var(--panel-border)'">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              ${item.urlToImage ? '<img src="' + item.urlToImage + '" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover; flex-shrink: 0;" />' : ''}
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 2px;">
                  <span>${(item.source && item.source.name) || 'News'}</span>
                  <span>${dateStr}</span>
                </div>
                <h5 style="margin: 0; font-size: 0.8rem; line-height: 1.3; color: #f0f6fc; font-weight: 600;">${item.title}</h5>
              </div>
            </div>
            <div id="${uniqueId}" style="display: none; font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; border-top: 1px solid rgba(48,54,61,0.3); padding-top: 6px; margin-top: 4px;">
              ${item.description || item.content || 'No description available for this headline.'}
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--danger); font-size:0.85rem; text-align:center; gap:8px;">
          <span>⚠️ Failed to load news feed.</span>
          <button class="btn btn-secondary py-1 px-3" onclick="loadDashboardWidget('news')">Retry</button>
        </div>
      `;
    }
  }
  else if (type === 'weather') {
    // Attempt exact location geolocating on first load of weather dashboard
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            let areaName = "Current Location";
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              areaName = geoData.city || geoData.locality || geoData.principalSubdivision || "Current Location";
            }
            renderWeatherByCoords(lat, lon, areaName);
          } catch (e) {
            renderWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "Current Location");
          }
        },
        () => {
          renderWeatherWidget("Bhubaneswar");
        }
      );
    } else {
      renderWeatherWidget("Bhubaneswar");
    }
  }
}

// Custom Stock Ticker search widget
// Helper to map TradingView tickers to Yahoo Finance tickers
function getYahooSymbol(tvSymbol) {
  const clean = tvSymbol.toUpperCase().trim();
  if (clean === 'NSE:NIFTY' || clean === 'NIFTY') {
    return '^NSEI';
  }
  if (clean.startsWith('NSE:')) {
    return clean.replace('NSE:', '') + '.NS';
  }
  if (clean.startsWith('BSE:')) {
    return clean.replace('BSE:', '') + '.BO';
  }
  // Fallback mappings
  if (!clean.includes('.') && !clean.includes('^')) {
    const isUS = ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN'].includes(clean);
    return isUS ? clean : clean + '.NS';
  }
  return clean;
}

let stockChartInstance = null;

async function renderNativeStockChart(symbol) {
  const widgetHolder = document.getElementById('tradingview-widget-holder');
  if (!widgetHolder) return;

  widgetHolder.innerHTML = `
    <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--text-muted); font-size:0.85rem; background: #0d1117;">
      <span class="pulse-dot" style="background:var(--accent-color); margin-bottom:8px;"></span>
      Loading chart data...
    </div>
  `;

  try {
    const yahooSymbol = getYahooSymbol(symbol);
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=1mo&interval=1d`
    )}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const jsonWrapper = await response.json();
    const data = JSON.parse(jsonWrapper.contents);

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error("No data returned for symbol " + yahooSymbol);
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quotes = result.indicators.quote[0];
    const closePrices = quotes.close || [];

    const chartData = [];
    const labels = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closePrices[i] !== null && closePrices[i] !== undefined) {
        chartData.push(closePrices[i]);
        const date = new Date(timestamps[i] * 1000);
        labels.push(date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
      }
    }

    if (chartData.length === 0) throw new Error("No pricing history found");

    const currentPrice = meta.regularMarketPrice || chartData[chartData.length - 1] || 0;
    const prevClose = meta.chartPreviousClose || chartData[0] || currentPrice;
    const change = currentPrice - prevClose;
    const pctChange = (change / prevClose) * 100;
    const isPositive = change >= 0;

    const priceColor = isPositive ? '#2ea44f' : '#f85149';
    const changeSign = isPositive ? '+' : '';

    widgetHolder.innerHTML = `
      <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:4px; padding: 4px; box-sizing: border-box;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; padding: 0 4px; height: 38px;">
          <div>
            <div style="font-size:1rem; font-weight:700; color:#f0f6fc; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${meta.symbol}</div>
            <span style="font-size:0.7rem; color:var(--text-muted);">${meta.exchangeName || 'NSE'} • ${meta.currency || 'INR'}</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1rem; font-weight:700; color:#f0f6fc;">${currentPrice.toFixed(2)}</div>
            <div style="font-size:0.75rem; font-weight:600; color:${priceColor};">
              ${changeSign}${change.toFixed(2)} (${changeSign}${pctChange.toFixed(2)}%)
            </div>
          </div>
        </div>
        <div style="flex:1; position:relative; width:100%; height: 190px;">
          <canvas id="stock-chart-canvas"></canvas>
        </div>
      </div>
    `;

    const canvas = document.getElementById('stock-chart-canvas');
    if (!canvas) return;

    if (stockChartInstance) {
      stockChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, isPositive ? 'rgba(46, 164, 79, 0.25)' : 'rgba(248, 81, 73, 0.25)');
    gradient.addColorStop(1, 'rgba(13, 17, 23, 0)');

    stockChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Close Price',
          data: chartData,
          borderColor: priceColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.15,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#161b22',
            titleColor: '#f0f6fc',
            bodyColor: '#f0f6fc',
            borderColor: 'rgba(48, 54, 61, 0.8)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#8b949e',
              font: { size: 9 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 5
            }
          },
          y: {
            grid: { color: 'rgba(48, 54, 61, 0.3)' },
            ticks: {
              color: '#8b949e',
              font: { size: 9 },
              count: 4
            }
          }
        }
      }
    });

  } catch (err) {
    console.error("Failed to render native stock chart:", err);
    widgetHolder.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--danger); font-size:0.82rem; padding:12px; text-align:center; box-sizing: border-box; background: #0d1117;">
        ⚠️ Failed to load Yahoo Finance data for "${symbol}". Check network or try another ticker.
        <button class="btn btn-secondary mt-2" style="font-size:0.75rem; padding: 4px 10px;" onclick="renderStockWidget('${symbol}')">Retry</button>
      </div>
    `;
  }
}

// Custom Stock Ticker search widget
function renderStockWidget(symbol) {
  const container = document.getElementById('extra-info-container');
  if (!container) return;
  
  const cleanSymbol = symbol.trim().toUpperCase();

  container.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" id="stock-ticker-input" class="form-control" style="font-size:0.85rem; padding: 6px 10px; flex: 1; min-width: 120px;" placeholder="Ticker: e.g. NIFTY, RELIANCE, AAPL" value="${cleanSymbol}">
        <button class="btn btn-primary" style="padding: 6px 10px; font-size: 0.8rem; white-space: nowrap;" onclick="renderStockWidget(document.getElementById('stock-ticker-input').value)">Show Chart</button>
        <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.8rem; white-space: nowrap;" onclick="renderStockWidget(document.getElementById('stock-ticker-input').value || '${cleanSymbol}')">🔄 Refresh</button>
      </div>
      <div style="flex: 1; border-radius: 6px; overflow: hidden; border: 1px solid var(--panel-border); background: #161b22; height: 260px;" id="tradingview-widget-holder">
        <!-- Dynamically loaded Native Chart -->
      </div>
    </div>
  `;

  // Render the native Yahoo Chart
  renderNativeStockChart(cleanSymbol);

  const input = document.getElementById('stock-ticker-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        renderStockWidget(input.value);
      }
    });
  }
}

// Helper for geolocation with reverse geocoding
async function handleGeolocateMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          let areaName = "Your Location";
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            areaName = geoData.city || geoData.locality || geoData.principalSubdivision || "Your Location";
          }
          renderWeatherByCoords(lat, lon, areaName);
        } catch (e) {
          renderWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "Your Location");
        }
      },
      (err) => {
        alert("Geolocation error: " + err.message);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Weather widget render utility helper
async function renderWeatherWidget(city) {
  const container = document.getElementById('extra-info-container');
  if (!container) return;
  
  try {
    // 1. Geocode City Name (using keyless Open-Meteo Geocoding)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!geoRes.ok) throw new Error("Geocode failed");
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      container.innerHTML = `
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 12px;">
          <h4 style="margin:0; color:#ff7b00; font-size:0.95rem;">Weather Forecast 🌤️</h4>
          <div style="display:flex; gap:6px; flex-wrap: wrap;">
            <input type="text" id="weather-search-input" class="form-control" style="font-size:0.85rem; padding: 6px 10px; flex: 1; min-width: 120px;" placeholder="City name..." value="${city}">
            <button class="btn btn-primary" onclick="renderWeatherWidget(document.getElementById('weather-search-input').value)">Search</button>
            <button class="btn btn-secondary" onclick="handleGeolocateMe()">📍 Me</button>
          </div>
          <p style="color:var(--danger); font-size:0.85rem; text-align:center; margin-top: 20px;">City "${city}" not found. Try another city name.</p>
        </div>
      `;
      return;
    }
    
    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;
    renderWeatherByCoords(latitude, longitude, `${name}, ${country}`);
  } catch (err) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--danger); font-size:0.85rem; text-align:center; gap:8px; padding: 20px;">
        <span>⚠️ Failed to load weather data.</span>
        <button class="btn btn-secondary py-1 px-3" onclick="renderWeatherWidget('${city}')">Retry</button>
      </div>
    `;
  }
}

// Weather widget helper using coordinates
async function renderWeatherByCoords(latitude, longitude, displayName) {
  const container = document.getElementById('extra-info-container');
  if (!container) return;
  
  try {
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
    if (!weatherRes.ok) throw new Error("Weather fetch failed");
    const weatherData = await weatherRes.json();
    
    const curr = weatherData.current_weather;
    const daily = weatherData.daily;
    
    const weatherCodes = {
      0: { desc: "Clear Sky", emoji: "☀️" },
      1: { desc: "Mainly Clear", emoji: "🌤️" },
      2: { desc: "Partly Cloudy", emoji: "⛅" },
      3: { desc: "Overcast", emoji: "☁️" },
      45: { desc: "Fog", emoji: "🌫️" },
      48: { desc: "Depositing Rime Fog", emoji: "🌫️" },
      51: { desc: "Light Drizzle", emoji: "🌧️" },
      53: { desc: "Moderate Drizzle", emoji: "🌧️" },
      55: { desc: "Dense Drizzle", emoji: "🌧️" },
      61: { desc: "Slight Rain", emoji: "🌦️" },
      63: { desc: "Moderate Rain", emoji: "🌧️" },
      65: { desc: "Heavy Rain", emoji: "🌧️" },
      71: { desc: "Slight Snow", emoji: "❄️" },
      73: { desc: "Moderate Snow", emoji: "❄️" },
      75: { desc: "Heavy Snow", emoji: "❄️" },
      77: { desc: "Snow Grains", emoji: "❄️" },
      80: { desc: "Slight Rain Showers", emoji: "🌦️" },
      81: { desc: "Moderate Rain Showers", emoji: "🌧️" },
      82: { desc: "Violent Rain Showers", emoji: "🌧️" },
      85: { desc: "Slight Snow Showers", emoji: "🌨️" },
      86: { desc: "Heavy Snow Showers", emoji: "🌨️" },
      95: { desc: "Thunderstorm", emoji: "⛈️" }
    };
    
    const weatherInfo = weatherCodes[curr.weathercode] || { desc: "Clear", emoji: "☀️" };
    
    let html = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding-bottom: 12px; height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--panel-border); padding-bottom: 4px;">
          <h4 style="margin: 0; color: #ff7b00; font-size: 0.95rem;">Weather Forecast 🌤️</h4>
          <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 2px 8px; font-weight: normal;" onclick="renderWeatherByCoords(${latitude}, ${longitude}, '${displayName}')">🔄 Refresh</button>
        </div>
        
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <input type="text" id="weather-search-input" class="form-control" style="font-size:0.85rem; padding: 6px 10px; flex: 1; min-width: 120px;" placeholder="City name..." value="${displayName === 'Current Location' || displayName === 'Your Location' ? '' : displayName.split(',')[0]}">
          <button class="btn btn-primary" style="padding: 6px 10px;" onclick="renderWeatherWidget(document.getElementById('weather-search-input').value)">Search</button>
          <button class="btn btn-secondary" style="padding: 6px 10px;" onclick="handleGeolocateMe()">📍 Me</button>
        </div>
        
        <!-- Current Weather Card -->
        <div style="background: linear-gradient(135deg, #1f293d 0%, #161b22 100%); border: 1px solid var(--panel-border); border-radius: 8px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow);">
          <div>
            <h5 style="margin:0; font-size: 1.1rem; color:#f0f6fc;">${displayName}</h5>
            <span style="font-size:0.75rem; color:var(--text-muted);">Exact Location</span>
            <div style="font-size: 2.1rem; font-weight: 700; color:#ff7b00; margin: 8px 0 2px 0;">${Math.round(curr.temperature)}°C</div>
            <span style="font-size:0.8rem; color:#f0f6fc;">${weatherInfo.emoji} ${weatherInfo.desc}</span>
          </div>
          <div style="font-size: 4.5rem; line-height: 1; user-select: none;">
            ${weatherInfo.emoji}
          </div>
        </div>
        
        <!-- Extra Stats -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #161b22; border: 1px solid var(--panel-border); padding: 8px 12px; border-radius: 6px; font-size: 0.8rem;">
            <div style="color:var(--text-muted); font-size: 0.7rem;">Windspeed</div>
            <strong style="color:#f0f6fc;">💨 ${curr.windspeed} km/h</strong>
          </div>
          <div style="background: #161b22; border: 1px solid var(--panel-border); padding: 8px 12px; border-radius: 6px; font-size: 0.8rem;">
            <div style="color:var(--text-muted); font-size: 0.7rem;">Coordinates</div>
            <strong style="color:#f0f6fc;">📍 ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°</strong>
          </div>
        </div>

        <!-- 3-Day Forecast -->
        <div style="margin-top: 4px;">
          <h5 style="margin: 0 0 8px 0; font-size: 0.8rem; color: var(--text-muted);">3-Day Daily Forecast</h5>
          <div style="display: flex; flex-direction: column; gap: 8px;">
    `;
    
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date(daily.time[i]).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      const forecastInfo = weatherCodes[daily.weathercode[i]] || { desc: "Clear", emoji: "☀️" };
      html += `
        <div style="background: #161b22; border: 1px solid var(--panel-border); border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
          <span style="color:#f0f6fc; font-weight: 500;">${forecastDate}</span>
          <span style="color:var(--text-muted);">${forecastInfo.emoji} ${forecastInfo.desc}</span>
          <strong style="color:#ff7b00;">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°C</strong>
        </div>
      `;
    }
    
    html += `
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Wire search enter key
    const input = document.getElementById('weather-search-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          renderWeatherWidget(input.value);
        }
      });
    }
  } catch (err) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--danger); font-size:0.85rem; text-align:center; gap:8px; padding: 20px;">
        <span>⚠️ Failed to load weather data.</span>
        <button class="btn btn-secondary py-1 px-3" onclick="renderWeatherByCoords(${latitude}, ${longitude}, '${displayName}')">Retry</button>
      </div>
    `;
  }
}

// Live Team status loader for settings
async function loadTeamAccounts() {
  const token = sessionStorage.getItem('authToken');
  const tbody = document.getElementById('team-table-body');
  const adminPanel = document.getElementById('admin-management-panel');
  const displayRole = document.getElementById('display-role');
  const displayKeyStatus = document.getElementById('display-key-status');

  if (!token) return;

  try {
    // 1. Fetch bootstrap to retrieve active role and vault status
    const bootRes = await fetch('/api/bootstrap', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (bootRes.ok) {
      const data = await bootRes.json();
      if (displayRole) displayRole.value = data.role.toUpperCase();
      if (displayKeyStatus) {
        displayKeyStatus.value = (window.SecurityEngine && window.SecurityEngine.isUnlocked()) ? 'RAM VOLATILE LOCKED-IN' : 'WIPED/LOCKED';
      }

      if (data.role === 'admin') {
        if (adminPanel) adminPanel.classList.remove('hidden');
      } else {
        if (adminPanel) adminPanel.classList.add('hidden');
        return; // standard user doesn't load team table
      }
    } else {
      if (displayRole) displayRole.value = 'UNKNOWN';
      if (adminPanel) adminPanel.classList.add('hidden');
      return;
    }

    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading accounts...</td></tr>';

    const res = await fetch('/api/admin/update-status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Failed to load team data.</td></tr>`;
      return;
    }

    const { users } = await res.json();
    window.teamUsersCache = users;
    tbody.innerHTML = '';
    
    const revokedTbody = document.getElementById('revoked-team-table-body');
    if (revokedTbody) revokedTbody.innerHTML = '';

    const activeUsers = users.filter(u => u.status !== 'revoked');
    const revokedUsers = users.filter(u => u.status === 'revoked');

    if (activeUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No active team members.</td></tr>';
    } else {
      activeUsers.forEach(user => {
        const tr = document.createElement('tr');
        const statusBadge = `<span style="color: var(--success); font-weight: bold; background: var(--success-glow); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(46,164,79,0.2)">ACTIVE</span>`;
        const isSelf = user.username === 'admin@vault.team' || user.id === 'usr-admin';
        
        let promoteButton = '';
        if (!isSelf) {
          if (user.role === 'admin') {
            promoteButton = `
              <button onclick="promoteUser('${user.id}', 'user')" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Demote to User</button>
              <button onclick="promoteUser('${user.id}', 'viewer')" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Make Viewer</button>
            `;
          } else if (user.role === 'user') {
            promoteButton = `
              <button onclick="promoteUser('${user.id}', 'admin')" class="btn btn-success" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Promote to Admin</button>
              <button onclick="promoteUser('${user.id}', 'viewer')" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Make Viewer</button>
            `;
          } else if (user.role === 'viewer') {
            promoteButton = `
              <button onclick="promoteUser('${user.id}', 'admin')" class="btn btn-success" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Promote to Admin</button>
              <button onclick="promoteUser('${user.id}', 'user')" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; margin-right: 8px;">Make User</button>
            `;
          }
        }

        const actionButton = isSelf 
          ? `<span class="text-muted">Master Root Account</span>`
          : `${promoteButton}<button onclick="toggleUserStatus('${user.id}', 'revoked')" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Revoke Access</button>`;

        tr.innerHTML = `
          <td style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
            <span class="status-dot" style="
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${user.online ? '#2ea44f' : '#8b949e'};
              box-shadow: ${user.online ? '0 0 8px #2ea44f' : 'none'};
              flex-shrink: 0;
            "></span>
            <span>${user.username}</span>
            ${user.online ? '<span style="font-size: 0.7rem; color: #2ea44f; background: rgba(46,164,79,0.1); padding: 1px 4px; border-radius: 3px; font-weight: normal; margin-left: 4px;">Online</span>' : ''}
          </td>
          <td><span class="position-badge">${user.role.toUpperCase()}</span></td>
          <td>${statusBadge}</td>
          <td class="actions-col">${actionButton}</td>
        `;
        tr.style.animation = 'fadeIn 0.3s ease-in-out';
        tbody.appendChild(tr);
      });
    }

    if (revokedTbody) {
      if (revokedUsers.length === 0) {
        revokedTbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No suspended accounts.</td></tr>';
      } else {
        revokedUsers.forEach(user => {
          const tr = document.createElement('tr');
          const statusBadge = `<span style="color: var(--danger); font-weight: bold; background: var(--danger-glow); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(218,54,55,0.2)">REVOKED</span>`;
          const actionButton = `<button onclick="toggleUserStatus('${user.id}', 'active')" class="btn btn-success" style="padding: 4px 10px; font-size: 0.75rem;">Reactivate</button>`;

          tr.innerHTML = `
            <td style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
              <span class="status-dot" style="
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: ${user.online ? '#2ea44f' : '#8b949e'};
                box-shadow: ${user.online ? '0 0 8px #2ea44f' : 'none'};
                flex-shrink: 0;
              "></span>
              <span>${user.username}</span>
              ${user.online ? '<span style="font-size: 0.7rem; color: #2ea44f; background: rgba(46,164,79,0.1); padding: 1px 4px; border-radius: 3px; font-weight: normal; margin-left: 4px;">Online</span>' : ''}
            </td>
            <td><span class="position-badge">${user.role.toUpperCase()}</span></td>
            <td>${statusBadge}</td>
            <td class="actions-col">${actionButton}</td>
          `;
          tr.style.animation = 'fadeIn 0.3s ease-in-out';
          revokedTbody.appendChild(tr);
        });
      }
    }

  } catch (err) {
    console.error('Failed to load team details:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Network error loading accounts.</td></tr>`;
  }
}

// Toggles user access status
async function toggleUserStatus(targetUserId, newStatus) {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;

  if (newStatus === 'revoked' && !confirm('WARNING: Revoking status will deploy a client-side SELF_DESTRUCT instruction. This purges their RAM key and local caches immediately upon their next server request. Continue?')) {
    return;
  }

  try {
    const res = await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: targetUserId, newStatus })
    });

    if (res.ok) {
      if (newStatus === 'active' && window.teamUsersCache) {
        const targetUser = window.teamUsersCache.find(u => u.id === targetUserId);
        if (targetUser && targetUser.public_key) {
          try {
            const wrappedKey = await window.SecurityEngine.wrapVaultKey(targetUser.public_key);
            await fetch('/api/admin/save-wrapped-key', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ userId: targetUserId, wrappedVaultKey: wrappedKey })
            });
          } catch (wrapErr) {
            console.error('Failed to wrap vault key for user:', wrapErr);
          }
        }
      }
      alert(`User status successfully changed to ${newStatus}! Consider Revoking the old ID`);
      await loadTeamAccounts();
    } else {
      const err = await res.json();
      alert('Action failed: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to transmit update instruction.');
  }
}

// Promotes/demotes user role
async function promoteUser(targetUserId, newRole) {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/promote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: targetUserId, role: newRole })
    });

    if (res.ok) {
      if (window.teamUsersCache) {
        const targetUser = window.teamUsersCache.find(u => u.id === targetUserId);
        if (targetUser && targetUser.public_key) {
          try {
            const wrappedKey = await window.SecurityEngine.wrapVaultKey(targetUser.public_key);
            await fetch('/api/admin/save-wrapped-key', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ userId: targetUserId, wrappedVaultKey: wrappedKey })
            });
          } catch (wrapErr) {
            console.error('Failed to wrap vault key for user:', wrapErr);
          }
        }
      }
      alert(`User role successfully changed to ${newRole}! Consider Revoking the old ID`);
      await loadTeamAccounts();
    } else {
      const err = await res.json();
      alert('Action failed: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to transmit promotion instruction.');
  }
}

// Make functions global for onclick elements
window.toggleUserStatus = toggleUserStatus;
window.promoteUser = promoteUser;

// -------------------------------------------------------------
// E2EE CRYPTOGRAPHIC VERIFIER (TRIAL PHASE ONLY)
// -------------------------------------------------------------
const cryptoBtn = document.getElementById('crypto-verifier-btn');
const cryptoModal = document.getElementById('crypto-verifier-modal');
const closeCryptoBtn = document.getElementById('close-crypto-verifier-btn');
const closeCryptoBottomBtn = document.getElementById('close-crypto-verifier-bottom-btn');
const refreshCryptoBtn = document.getElementById('refresh-crypto-verifier-btn');
const cryptoContainer = document.getElementById('crypto-verifier-container');

const cryptoFilterYear = document.getElementById('crypto-filter-year');
const cryptoFilterMonth = document.getElementById('crypto-filter-month');
const cryptoFilterRange = document.getElementById('crypto-filter-range');

if (cryptoBtn) {
  cryptoBtn.addEventListener('click', () => {
    cryptoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCryptoVerificationList();
  });
}

function closeCryptoModal() {
  if (cryptoModal) {
    cryptoModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (closeCryptoBtn) closeCryptoBtn.addEventListener('click', closeCryptoModal);
if (closeCryptoBottomBtn) closeCryptoBottomBtn.addEventListener('click', closeCryptoModal);
if (refreshCryptoBtn) refreshCryptoBtn.addEventListener('click', renderCryptoVerificationList);

if (cryptoFilterYear) cryptoFilterYear.addEventListener('change', renderCryptoVerificationList);
if (cryptoFilterMonth) cryptoFilterMonth.addEventListener('change', renderCryptoVerificationList);
if (cryptoFilterRange) cryptoFilterRange.addEventListener('change', renderCryptoVerificationList);

async function renderCryptoVerificationList() {
  if (!cryptoContainer) return;
  cryptoContainer.innerHTML = '<div class="text-center text-muted py-4">Fetching database entries...</div>';

  try {
    const res = await fetch('/api/entries');
    if (!res.ok) throw new Error('Failed to retrieve entries');
    const records = await res.json();

    const fYear = document.getElementById('crypto-filter-year') ? document.getElementById('crypto-filter-year').value : 'all';
    const fMonth = document.getElementById('crypto-filter-month') ? document.getElementById('crypto-filter-month').value : 'all';
    const fRange = document.getElementById('crypto-filter-range') ? document.getElementById('crypto-filter-range').value : 'till-date';

    let filtered = [...records];

    if (fYear !== 'all') {
      filtered = filtered.filter(rec => rec.date && rec.date.startsWith(fYear));
    }
    if (fMonth !== 'all') {
      filtered = filtered.filter(rec => {
        if (!rec.date) return false;
        const parts = rec.date.split('-');
        return parts.length > 1 && parts[1] === fMonth;
      });
    }
    if (fRange === 'till-date') {
      const todayStr = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(rec => rec.date && rec.date <= todayStr);
    }

    if (filtered.length === 0) {
      cryptoContainer.innerHTML = '<div class="text-center text-muted py-4">No records found matching the selected filters.</div>';
      return;
    }

    cryptoContainer.innerHTML = '';
    for (const rec of filtered) {
      const rowCard = document.createElement('div');
      rowCard.style.display = 'flex';
      rowCard.style.gap = '16px';
      rowCard.style.padding = '12px';
      rowCard.style.border = '1px solid var(--panel-border)';
      rowCard.style.borderRadius = '6px';
      rowCard.style.backgroundColor = '#161b22';
      rowCard.style.flexWrap = 'wrap';

      // Left half: Native Data
      const leftHalf = document.createElement('div');
      leftHalf.style.flex = '1';
      leftHalf.style.minWidth = '280px';
      leftHalf.style.display = 'flex';
      leftHalf.style.flexDirection = 'column';
      leftHalf.style.gap = '6px';

      const leftHeader = document.createElement('div');
      leftHeader.style.fontWeight = 'bold';
      leftHeader.style.fontSize = '0.85rem';
      leftHeader.style.color = 'var(--text-muted)';
      leftHeader.textContent = `Record ID: ${rec.id} | Date: ${rec.date} (Native DB)`;

      const leftPre = document.createElement('pre');
      leftPre.style.margin = '0';
      leftPre.style.padding = '8px';
      leftPre.style.backgroundColor = '#0d1117';
      leftPre.style.borderRadius = '4px';
      leftPre.style.fontSize = '0.75rem';
      leftPre.style.overflowX = 'auto';
      leftPre.style.border = '1px solid #30363d';
      leftPre.style.whiteSpace = 'pre-wrap';
      leftPre.style.wordBreak = 'break-all';
      leftPre.textContent = JSON.stringify(rec.encryptedData || rec.data);
      leftPre.style.color = '#8b949e';

      leftHalf.appendChild(leftHeader);
      leftHalf.appendChild(leftPre);

      // Right half: Decrypted Data
      const rightHalf = document.createElement('div');
      rightHalf.style.flex = '1';
      rightHalf.style.minWidth = '280px';
      rightHalf.style.display = 'flex';
      rightHalf.style.flexDirection = 'column';
      rightHalf.style.gap = '6px';

      const rightHeader = document.createElement('div');
      rightHeader.style.fontWeight = 'bold';
      rightHeader.style.fontSize = '0.85rem';
      rightHeader.style.color = 'var(--accent-color)';
      rightHeader.textContent = 'Decrypted Output (RAM Memory)';

      const rightPre = document.createElement('pre');
      rightPre.style.margin = '0';
      rightPre.style.padding = '8px';
      rightPre.style.backgroundColor = '#0d1117';
      rightPre.style.borderRadius = '4px';
      rightPre.style.fontSize = '0.75rem';
      rightPre.style.overflowX = 'auto';
      rightPre.style.border = '1px solid #30363d';

      // Perform client-side decryption check
      const rawEnc = rec.encryptedData;
      if (rawEnc && rawEnc.ciphertext && rawEnc.iv) {
        if (window.SecurityEngine && window.SecurityEngine.isUnlocked()) {
          try {
            const decryptedText = await window.SecurityEngine.decryptPayload(rawEnc.ciphertext, rawEnc.iv);
            let parsedDecrypted;
            try {
              parsedDecrypted = JSON.parse(decryptedText);
            } catch (e) {
              parsedDecrypted = decryptedText;
            }
            rightPre.textContent = typeof parsedDecrypted === 'object' ? JSON.stringify(parsedDecrypted, null, 2) : parsedDecrypted;
            rightPre.style.color = '#3fb950'; // green color for successful decryption
          } catch (decErr) {
            rightPre.textContent = `[Decryption Error: ${decErr.message}]`;
            rightPre.style.color = '#f85149'; // red color for error
          }
        } else {
          rightPre.textContent = '[Vault Locked - Cryptographic Key not loaded in RAM]';
          rightPre.style.color = '#db6d28'; // orange color for locked
        }
      } else {
        rightPre.textContent = '[Plain text - No encryption applied to this record]';
        rightPre.style.color = '#8b949e';
      }

      rightHalf.appendChild(rightHeader);
      rightHalf.appendChild(rightPre);

      rowCard.appendChild(leftHalf);
      rowCard.appendChild(rightHalf);
      cryptoContainer.appendChild(rowCard);
    }
  } catch (err) {
    cryptoContainer.innerHTML = `<div class="alert-box alert-danger">Error: ${err.message}</div>`;
  }
}

