// Settings UI controller
let cachedSalt = null;

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
        if (!cachedSalt) {
          throw new Error('User salt not loaded. Please reload page.');
        }
        await window.SecurityEngine.unlockVaultWithPassword(pwd, cachedSalt);
        
        // Derive KEK and cache it in sessionStorage
        const kek = await window.SecurityEngine.deriveKek(pwd, cachedSalt);
        sessionStorage.setItem('encryptionKek', kek);
        
        // Update display fields
        const displayKeyStatus = document.getElementById('display-key-status');
        if (displayKeyStatus) {
          displayKeyStatus.value = 'RAM VOLATILE LOCKED-IN';
        }
        
        // Refresh tutorials / sandbox if loaded
        if (typeof renderTutorials === 'function' && cachedShowTutorial) {
          renderTutorials();
        }

        // Fetch database records using the new key
        if (typeof fetchDatabaseRecords === 'function') {
          await fetchDatabaseRecords();
        }

        alert('Symmetric encryption key derived and vault unlocked successfully!');
        pwdInput.value = '';
      } catch (err) {
        alert('Failed to derive encryption key: ' + err.message);
      }
    });
  }

  // Key Rotation Form Submit
  const keyRotationForm = document.getElementById('key-rotation-form');
  if (keyRotationForm) {
    keyRotationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const oldPwdInput = document.getElementById('old-encryption-password-input');
      const newPwdInput = document.getElementById('new-encryption-password-input');
      if (!oldPwdInput || !newPwdInput) return;
      const oldPwd = oldPwdInput.value;
      const newPwd = newPwdInput.value;
      if (!oldPwd || !newPwd) return;

      if (oldPwd === newPwd) {
        alert('New password must be different from the old password.');
        return;
      }

      const rotateBtn = document.getElementById('rotate-key-btn');
      if (rotateBtn) rotateBtn.disabled = true;

      try {
        if (!cachedSalt) {
          throw new Error('User salt not loaded. Please reload page.');
        }
        const token = sessionStorage.getItem('authToken');
        const fetchRes = await fetch('/api/entries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!fetchRes.ok) throw new Error('Failed to retrieve database records for rotation.');
        const records = await fetchRes.json();

        // Cryptographic helpers
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        async function deriveTempKey(pwd, saltB64) {
          const salt = window.SecurityEngine.base64ToUint8Array(saltB64);
          const baseKey = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(pwd),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
          );
          return window.crypto.subtle.deriveKey(
            {
              name: 'PBKDF2',
              salt: salt,
              iterations: 600000,
              hash: 'SHA-256'
            },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
          );
        }

        async function decryptWithKey(key, ciphertextB64, ivB64) {
          const ciphertext = window.SecurityEngine.base64ToUint8Array(ciphertextB64);
          const iv = window.SecurityEngine.base64ToUint8Array(ivB64);
          const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            ciphertext
          );
          return decoder.decode(decryptedBuffer);
        }

        async function encryptWithKey(key, plainText) {
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const encodedData = encoder.encode(plainText);
          const ciphertextBuffer = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encodedData
          );
          return {
            ciphertext: window.SecurityEngine.uint8ArrayToBase64(new Uint8Array(ciphertextBuffer)),
            iv: window.SecurityEngine.uint8ArrayToBase64(iv)
          };
        }

        async function batchPromises(promisesCreators, limit) {
          const results = [];
          const executing = [];
          for (const creator of promisesCreators) {
            const p = creator().then(res => {
              executing.splice(executing.indexOf(p), 1);
              return res;
            });
            results.push(p);
            executing.push(p);
            if (executing.length >= limit) {
              await Promise.race(executing);
            }
          }
          return Promise.all(results);
        }

        // 2. Derive old and new keys using the same salt
        const oldKey = await deriveTempKey(oldPwd, cachedSalt);
        const newKey = await deriveTempKey(newPwd, cachedSalt);

        // 3. Decrypt and re-encrypt
        const rotatedRecords = [];
        for (const rec of records) {
          const encData = rec.data && rec.data.ciphertext ? rec.data : null;
          if (encData) {
            try {
              const plainText = await decryptWithKey(oldKey, encData.ciphertext, encData.iv);
              const reEncrypted = await encryptWithKey(newKey, plainText);
              rotatedRecords.push({
                id: rec.id,
                date: rec.date,
                data: reEncrypted
              });
            } catch (decErr) {
              console.error('Decryption failed for record ID:', rec.id, decErr);
              throw new Error(`Decryption failed for record ID ${rec.id}. Please verify your old password.`);
            }
          }
        }

        // 4. Update the server in batches of 5 parallel requests
        const updatePromises = rotatedRecords.map(item => async () => {
          const res = await fetch(`/api/entries/update/${item.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              date: item.date,
              data: item.data
            })
          });
          if (!res.ok) {
            throw new Error(`Failed to update record ID ${item.id} on the server.`);
          }
        });

        await batchPromises(updatePromises, 5);

        // 5. Unlock vault with new key & refresh UI
        await window.SecurityEngine.unlockVaultWithPassword(newPwd, cachedSalt);
        const newKek = await window.SecurityEngine.deriveKek(newPwd, cachedSalt);
        sessionStorage.setItem('encryptionKek', newKek);

        const displayKeyStatus = document.getElementById('display-key-status');
        if (displayKeyStatus) {
          displayKeyStatus.value = 'RAM VOLATILE LOCKED-IN';
        }

        if (typeof fetchDatabaseRecords === 'function') {
          await fetchDatabaseRecords();
        }

        alert(`Successfully rotated password and re-encrypted ${rotatedRecords.length} records!`);
        oldPwdInput.value = '';
        newPwdInput.value = '';
      } catch (err) {
        alert('Rotation failed: ' + err.message);
      } finally {
        if (rotateBtn) rotateBtn.disabled = false;
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
    cachedSalt = data.salt; // Capture user salt from bootstrap response

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
        const isSelf = user.id === 'usr-admin';

        const actionButton = isSelf 
          ? `<span class="text-muted">Master Root Account</span>`
          : `<button onclick="toggleUserStatus('${user.id}', 'revoked')" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Revoke Access</button>`;

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
          revokedTbody.appendChild(tr);
        });
      }
    }

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
