/**
 * Secure client-side cryptographic engine using the native Web Crypto API.
 * The imported key is held in volatile memory and is non-extractable.
 */
const SecurityEngine = (function () {
  // Private scoped variable in volatile memory (RAM)
  let memoryOnlyKey = null;

  // Utility to convert Base64 string to Uint8Array
  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Utility to convert Uint8Array to Base64 string
  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  return {
    /**
     * Imports a base64 key into a Web Crypto API Key object.
     * The imported key is set to non-extractable.
     * @param {string} base64Key - The raw Base64 encoded encryption key.
     */
    async unlockVault(base64Key) {
      try {
        const rawKey = base64ToUint8Array(base64Key);
        memoryOnlyKey = await window.crypto.subtle.importKey(
          'raw',
          rawKey,
          { name: 'AES-GCM', length: 256 },
          false, // extractable: false (security enforcement: key cannot be exported or read from JavaScript memory once loaded)
          ['encrypt', 'decrypt']
        );
        console.log('Vault loaded successfully in RAM.');
        return true;
      } catch (err) {
        console.error('Failed to unlock vault:', err);
        throw new Error('Cryptographic vault initialization failed.');
      }
    },

    /**
     * Encrypts plain text using 256-bit AES-GCM.
     * @param {string} plainText - Plaintext payload.
     * @returns {Promise<{ ciphertext: string, iv: string }>} Base64 encoded ciphertext and IV.
     */
    async encryptPayload(plainText) {
      if (!memoryOnlyKey) {
        throw new Error('Vault is locked. No active key in memory.');
      }

      // Generate a cryptographically secure random 12-byte IV (96 bits) for AES-GCM
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(plainText);

      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        memoryOnlyKey,
        encodedData
      );

      return {
        ciphertext: uint8ArrayToBase64(new Uint8Array(ciphertextBuffer)),
        iv: uint8ArrayToBase64(iv)
      };
    },

    /**
     * Decrypts ciphertext using 256-bit AES-GCM and the stored key.
     * @param {string} ciphertextB64 - Base64 encoded ciphertext.
     * @param {string} ivB64 - Base64 encoded IV.
     * @returns {Promise<string>} Decrypted plaintext string.
     */
    async decryptPayload(ciphertextB64, ivB64) {
      if (!memoryOnlyKey) {
        throw new Error('Vault is locked. No active key in memory.');
      }

      const ciphertext = base64ToUint8Array(ciphertextB64);
      const iv = base64ToUint8Array(ivB64);
      const decoder = new TextDecoder();

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        memoryOnlyKey,
        ciphertext
      );

      return decoder.decode(decryptedBuffer);
    },

    /**
     * Purges the encryption key from RAM.
     */
    lockVault() {
      memoryOnlyKey = null;
      console.log('Vault key successfully wiped from volatile memory.');
    },

    /**
     * Checks if key is currently loaded.
     */
    isUnlocked() {
      return memoryOnlyKey !== null;
    }
  };
})();

// Export if running in a module context, otherwise assign to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityEngine;
} else {
  window.SecurityEngine = SecurityEngine;
}
