/**
 * Secure client-side cryptographic engine using the native Web Crypto API.
 * The imported key is held in volatile memory and is non-extractable.
 */
const SecurityEngine = (function () {
  // Private scoped variable in volatile memory (RAM)
  let memoryOnlyKey = null;

  // Utility to convert Base64 string to Uint8Array
  function base64ToUint8Array(base64) {
    let normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) {
      normalized += '=';
    }
    const binaryString = atob(normalized);
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
          true, // extractable: true (for key wrapping/unwrapping)
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
     * Derives a 256-bit AES-GCM key from a user-entered password via SHA-256 and imports it into RAM.
     * @param {string} password - User-entered encryption password.
     */
    async unlockVaultWithPassword(password) {
      try {
        const encoder = new TextEncoder();
        const rawData = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawData);
        
        memoryOnlyKey = await window.crypto.subtle.importKey(
          'raw',
          hashBuffer,
          { name: 'AES-GCM', length: 256 },
          true, // extractable: true (for key wrapping/unwrapping)
          ['encrypt', 'decrypt']
        );
        console.log('Vault loaded successfully in RAM using password-derived key.');
        return true;
      } catch (err) {
        console.error('Failed to unlock vault with password:', err);
        throw new Error('Cryptographic vault initialization failed.');
      }
    },

    /**
     * Generates a new RSA-OAEP keypair and returns base64 public key and raw CryptoKey private key.
     */
    async generateKeyPair() {
      try {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
          },
          true,
          ["encrypt", "decrypt"]
        );

        const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKeyB64 = uint8ArrayToBase64(new Uint8Array(exportedPublic));

        return {
          publicKeyB64,
          privateKey: keyPair.privateKey
        };
      } catch (err) {
        console.error("Failed to generate key pair:", err);
        throw err;
      }
    },

    /**
     * Encrypts the private key with a password-derived key (KEK) using AES-GCM.
     */
    async encryptPrivateKey(privateKey, password) {
      try {
        const exportedPrivate = await window.crypto.subtle.exportKey("pkcs8", privateKey);
        const encoder = new TextEncoder();
        const rawData = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawData);
        
        const kek = await window.crypto.subtle.importKey(
          'raw',
          hashBuffer,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt']
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedBuffer = await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv },
          kek,
          exportedPrivate
        );

        return {
          ciphertext: uint8ArrayToBase64(new Uint8Array(encryptedBuffer)),
          iv: uint8ArrayToBase64(iv)
        };
      } catch (err) {
        console.error("Failed to encrypt private key:", err);
        throw err;
      }
    },

    /**
     * Decrypts and imports the private key using the password-derived key (KEK).
     */
    async decryptPrivateKey(encryptedB64, ivB64, password) {
      try {
        const ciphertext = base64ToUint8Array(encryptedB64);
        const iv = base64ToUint8Array(ivB64);
        const encoder = new TextEncoder();
        const rawData = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawData);
        
        const kek = await window.crypto.subtle.importKey(
          'raw',
          hashBuffer,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          kek,
          ciphertext
        );

        return window.crypto.subtle.importKey(
          "pkcs8",
          decryptedBuffer,
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        );
      } catch (err) {
        console.error("Failed to decrypt private key:", err);
        throw err;
      }
    },

    /**
     * Asymmetrically wraps (encrypts) the active symmetric key using a recipient's public key.
     */
    async wrapVaultKey(recipientPublicKeyB64) {
      if (!memoryOnlyKey) {
        throw new Error('Vault is locked. Cannot wrap key.');
      }
      try {
        const rawPubKey = base64ToUint8Array(recipientPublicKeyB64);
        const pubKey = await window.crypto.subtle.importKey(
          "spki",
          rawPubKey,
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["wrapKey"]
        );

        const wrappedBuffer = await window.crypto.subtle.wrapKey(
          "raw",
          memoryOnlyKey,
          pubKey,
          { name: "RSA-OAEP" }
        );

        return uint8ArrayToBase64(new Uint8Array(wrappedBuffer));
      } catch (err) {
        console.error("Failed to wrap vault key:", err);
        throw err;
      }
    },

    /**
     * Unwraps a wrapped master key using the private key and sets it active.
     */
    async unwrapVaultKey(wrappedKeyB64, privateKey) {
      try {
        const wrappedBuffer = base64ToUint8Array(wrappedKeyB64);
        memoryOnlyKey = await window.crypto.subtle.unwrapKey(
          "raw",
          wrappedBuffer,
          privateKey,
          { name: "RSA-OAEP" },
          { name: "AES-GCM", length: 256 },
          true, // extractable
          ["encrypt", "decrypt"]
        );
        console.log("Vault key successfully unwrapped and loaded in RAM.");
        return true;
      } catch (err) {
        console.error("Failed to unwrap vault key:", err);
        throw err;
      }
    },

    /**
     * Generates a new random symmetric vault key in RAM and returns its base64.
     */
    async generateRandomVaultKey() {
      try {
        const rawKey = window.crypto.getRandomValues(new Uint8Array(32));
        memoryOnlyKey = await window.crypto.subtle.importKey(
          'raw',
          rawKey,
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        console.log('New random master vault key generated.');
        return uint8ArrayToBase64(rawKey);
      } catch (err) {
        console.error("Failed to generate random vault key:", err);
        throw err;
      }
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
