// Settings UI controller
document.addEventListener('DOMContentLoaded', () => {
  initSettings();

  const keyDerivationForm = document.getElementById('key-derivation-form');
  if (keyDerivationForm) {
    keyDerivationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwdInput = document.getElementById('encryption-password-input');
      if (!pwdInput) return;
      const pwd = pwdInput.value;
      if (!pwd) return;

      try {
        await window.SecurityEngine.unlockVaultWithPassword(pwd);
        
        // Update display fields
        const displayKeyStatus = document.getElementById('display-key-status');
        if (displayKeyStatus) {
          displayKeyStatus.value = 'RAM VOLATILE LOCKED-IN';
        }
        
        // Refresh tutorials / sandbox if loaded
        if (typeof renderTutorials === 'function' && cachedShowTutorial) {
          renderTutorials();
        }

        alert('Symmetric encryption key derived and vault unlocked successfully!');
        pwdInput.value = '';
      } catch (err) {
        alert('Failed to derive encryption key: ' + err.message);
      }
    });
  }
});

let cachedShowTutorial = true;
let cachedRole = 'user';

async function initSettings() {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    // Redirect to main page where auth modal will open, or straight to unauthorized
    window.location.href = '/';
    return;
  }

  try {
    // 1. Fetch bootstrap state to get roles and feature flags
    const res = await fetch('/api/bootstrap', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.status === 403 || (data && data.action === 'SELF_DESTRUCT')) {
      executeSelfDestruct();
      return;
    }

    if (!res.ok || !data || !data.role) {
      console.error('Failed to bootstrap settings session:', data ? data.error : 'Invalid response');
      const sessionBadgeText = document.getElementById('session-badge-text');
      if (sessionBadgeText) {
        sessionBadgeText.textContent = 'Auth Failed';
        sessionBadgeText.style.background = 'var(--danger)';
      }
      return;
    }

    cachedShowTutorial = data.showTutorial;
    cachedRole = data.role;

    // Load key into client cryptographic engine in volatile memory
    if (data.vaultKey) {
      await window.SecurityEngine.unlockVault(data.vaultKey);
    }

    // Update UI fields
    document.getElementById('display-role').value = cachedRole.toUpperCase();
    document.getElementById('display-key-status').value = window.SecurityEngine.isUnlocked() ? 'RAM VOLATILE LOCKED-IN' : 'WIPED/LOCKED';
    
    const sessionBadgeText = document.getElementById('session-badge-text');
    if (sessionBadgeText) {
      sessionBadgeText.textContent = `${cachedRole.toUpperCase()} Vault Session`;
    }

    // 2. Render UI components based on authorization role
    if (cachedRole === 'admin') {
      const adminPanel = document.getElementById('admin-management-panel');
      if (adminPanel) adminPanel.classList.remove('hidden');
      await loadTeamAccounts();
    }

    // 3. Render targeted tutorial sections if global feature flag is enabled
    if (cachedShowTutorial) {
      renderTutorials();
    }

  } catch (err) {
    console.error('Settings initialization failed:', err);
  }
}

// Loads team members for Admin view
async function loadTeamAccounts() {
  const token = sessionStorage.getItem('authToken');
  const tbody = document.getElementById('team-table-body');
  if (!tbody) return;

  try {
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
    tbody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      
      const isRevoked = user.status === 'revoked';
      const statusBadge = isRevoked 
        ? `<span style="color: var(--danger); font-weight: bold; background: var(--danger-glow); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(218,54,55,0.2)">REVOKED</span>`
        : `<span style="color: var(--success); font-weight: bold; background: var(--success-glow); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(46,164,79,0.2)">ACTIVE</span>`;

      // Admin cannot toggle their own account
      const selfToken = sessionStorage.getItem('authToken');
      const isSelf = user.id === 'usr-admin'; // In mock structure or check username match

      const actionButton = isSelf 
        ? `<span class="text-muted">Master Root Account</span>`
        : isRevoked
          ? `<button onclick="toggleUserStatus('${user.id}', 'active')" class="btn btn-success" style="padding: 4px 10px; font-size: 0.75rem;">Reactivate</button>`
          : `<button onclick="toggleUserStatus('${user.id}', 'revoked')" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Revoke Access</button>`;

      tr.innerHTML = `
        <td style="font-weight: 500;">${user.username}</td>
        <td><span class="position-badge">${user.role.toUpperCase()}</span></td>
        <td>${statusBadge}</td>
        <td class="actions-col">${actionButton}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('Failed to load team details:', err);
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Network error loading accounts.</td></tr>`;
  }
}

// Changes status of team user
async function toggleUserStatus(targetUserId, newStatus) {
  const token = sessionStorage.getItem('authToken');
  
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
      await loadTeamAccounts();
    } else {
      const err = await res.json();
      alert('Action failed: ' + (err.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to transmit update instruction.');
  }
}

// Injects the tutorials dynamically so it remains isolated and removable later
function renderTutorials() {
  const mountPoint = document.getElementById('tutorial-mount-point');
  if (!mountPoint) return;

  let content = '';

  // 1. Regular User Guide
  content += `
    <div class="tutorial-container">
      <div class="tutorial-header">
        <h2>Tutorial & Onboarding Guide</h2>
        <span class="tutorial-badge">Onboarding Session</span>
      </div>
      <div class="tutorial-steps">
        <div class="step-item">
          <div class="step-number">1</div>
          <div>
            <strong>Client-Side Volatile Encrypted Store:</strong>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">Data payloads are encrypted locally in browser RAM using 256-bit AES-GCM before transmission. Vercel and the database receive only unreadable ciphertext and the IV.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <div>
            <strong>Volatile Key Lifespan:</strong>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">The master encryption key exists purely inside RAM variables. Clearing or closing the browser tab permanently flushes the RAM, locking the local session vault.</p>
          </div>
        </div>
      </div>

      <div class="practice-box">
        <label style="font-size: 0.8rem; font-weight: 600; color: var(--accent-color);">Practice Live Encryption Sandbox</label>
        <p class="card-subtitle" style="margin-bottom: 12px; font-size: 0.75rem;">Input plain text below to see the Security Engine generate real-time ciphertext before it hits Vercel:</p>
        <input type="text" id="sandbox-input" class="form-control" placeholder="Type plain text to encrypt...">
        <div class="ciphertext-output" id="sandbox-output">dGhpcyBpcyBlbmNyeXB0ZWQ...</div>
      </div>
  `;

  // 2. Administrators: Render Admin Operations Guide & Warning Protocol
  if (cachedRole === 'admin') {
    content += `
      <div class="protocol-card">
        <label style="font-weight: 700; color: #ff8080; font-size: 0.85rem;">🛡️ Master Key Rotation & DB Protocol (Admins Only)</label>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
          <strong>Vulnerability Warning:</strong> Directly altering the Vercel env variable <code>TEAM_VAULT_KEY</code> without running a migration script will permanently lock/corrupt existing database records since old ciphertext rows will be undecryptable.
        </p>
        <div class="protocol-workflow">
          <strong>Recommended 3-Step Rotation Workflow:</strong>
          <div><strong>Step A:</strong> Export and backup all encrypted database records.</div>
          <div><strong>Step B:</strong> Run the migration process (pull data -> decrypt via current key -> re-encrypt with new key -> update records).</div>
          <div><strong>Step C:</strong> Perform a manual Vercel redeployment so the serverless worker ingests the new key value.</div>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; line-height: 1.4;">
          <strong>User Isolation Rule:</strong> Custom profile actions (e.g. changing usernames or account passwords) are processed entirely by the standard identity layer and will not alter or interrupt vault encryption.
        </p>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; line-height: 1.4;">
          <strong>Revocation & Self-Destruct Warning:</strong> Toggling a member to "Revoke" puts a remote trigger payload on the client runtime. Upon their next bootstrap checks, the app will instantly wipe session memory and force a redirect.
        </p>
      </div>
    `;
  }

  content += `</div>`;
  mountPoint.innerHTML = content;

  // Add event listener to Sandbox sandbox-input
  const sandboxInput = document.getElementById('sandbox-input');
  const sandboxOutput = document.getElementById('sandbox-output');
  if (sandboxInput && sandboxOutput) {
    sandboxInput.addEventListener('input', async () => {
      const text = sandboxInput.value;
      if (!text) {
        sandboxOutput.textContent = 'dGhpcyBpcyBlbmNyeXB0ZWQ...';
        return;
      }
      try {
        if (window.SecurityEngine.isUnlocked()) {
          const res = await window.SecurityEngine.encryptPayload(text);
          sandboxOutput.innerHTML = `<strong>Ciphertext:</strong> ${res.ciphertext}<br><br><strong>Initialization Vector (IV):</strong> ${res.iv}`;
        } else {
          sandboxOutput.textContent = 'Vault key not loaded in RAM.';
        }
      } catch (err) {
        sandboxOutput.textContent = 'Encryption Error: ' + err.message;
      }
    });
  }
}

// Purges session memory, locks client, and redirects to access-denied
function executeSelfDestruct() {
  window.SecurityEngine.lockVault();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/access-denied.html';
}

// Attach globally for dynamic onclick elements
window.toggleUserStatus = toggleUserStatus;
