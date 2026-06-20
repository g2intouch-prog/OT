/**
 * PWA Global Security Interceptor & App Orchestrator
 */

// Self-destruct function to wipe all session and local storage
function executeSelfDestruct() {
  console.warn('SELF_DESTRUCT sequence initiated. Purging vault assets...');
  if (window.SecurityEngine) {
    window.SecurityEngine.lockVault();
  }
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/access-denied.html';
}

// 1. Global Network Response Interceptor (Monkey-patching window.fetch)
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  try {
    const response = await originalFetch.apply(this, args);
    
    // Check for HTTP 403 Forbidden
    if (response.status === 403) {
      executeSelfDestruct();
      return response;
    }

    // Intercept JSON payloads for SELF_DESTRUCT instruction
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      // Clone the response to read it without consuming the stream
      const clonedResponse = response.clone();
      try {
        const body = await clonedResponse.json();
        if (body && body.action === 'SELF_DESTRUCT') {
          executeSelfDestruct();
        }
      } catch (e) {
        // Not a JSON payload or parsing failed, ignore
      }
    }

    return response;
  } catch (err) {
    console.error('Fetch interceptor error:', err);
    throw err;
  }
};

// 2. Initialize and Bootstrap session when PWA mounts
async function bootstrapSession() {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;

  try {
    const response = await fetch('/api/bootstrap', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.action === 'PROCEED') {
        const savedPwd = sessionStorage.getItem('encryptionPassword');
        if (savedPwd) {
          await window.SecurityEngine.unlockVaultWithPassword(savedPwd);
          console.log('Cryptographic boundary restored from sessionStorage.');
        } else if (data.vaultKey) {
          // Unlock client-side cryptographic RAM vault
          await window.SecurityEngine.unlockVault(data.vaultKey);
          console.log('Cryptographic boundary established.');
        }
      }
    }
  } catch (err) {
    console.error('Session bootstrap failed:', err);
  }
}

// 3. Initialize session when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  bootstrapSession();
});
