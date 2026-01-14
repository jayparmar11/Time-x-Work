const SALT_LENGTH = 16
const IV_LENGTH = 12 // Standard for AES-GCM
const ITERATIONS = 100000
const HASH_ALGO = 'SHA-256'
const KEY_LENGTH = 256
const ALGO = 'AES-GCM'

// Generate a random salt
function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
}

// Derive a key from a password and salt
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    keyMaterial,
    { name: ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  )
}

// Encrypt string data
export async function encryptData(data: string, password: string): Promise<string> {
  const salt = generateSalt()
  const key = await deriveKey(password, salt)
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const enc = new TextEncoder()

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: ALGO,
      iv,
    },
    key,
    enc.encode(data),
  )

  // Combine Salt + IV + Encrypted Data for storage
  // Format: Base64(Salt) : Base64(IV) : Base64(Ciphertext)
  const saltB64 = arrayBufferToBase64(salt)
  const ivB64 = arrayBufferToBase64(iv)
  const encryptedB64 = arrayBufferToBase64(new Uint8Array(encryptedContent))

  return `${saltB64}:${ivB64}:${encryptedB64}`
}

// Decrypt string data
export async function decryptData(encryptedString: string, password: string): Promise<string> {
  const parts = encryptedString.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }

  const [saltB64, ivB64, encryptedB64] = parts

  const salt = base64ToArrayBuffer(saltB64)
  const iv = base64ToArrayBuffer(ivB64)
  const ciphertext = base64ToArrayBuffer(encryptedB64)

  const key = await deriveKey(password, new Uint8Array(salt))

  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: ALGO,
        iv: new Uint8Array(iv),
      },
      key,
      ciphertext,
    )

    const dec = new TextDecoder()
    return dec.decode(decryptedContent)
  }
  catch (e) {
    throw new Error('Decryption failed. Wrong password?')
  }
}

// Helpers
function arrayBufferToBase64(buffer: Uint8Array | ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}
