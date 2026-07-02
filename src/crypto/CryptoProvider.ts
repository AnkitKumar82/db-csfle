import crypto from "node:crypto"
import type { EncryptedValue, EncryptionProvider, EncryptionKey } from "../types/crypto"
import { base64Encode, base64Decode, normalizeKey } from "../utils/index"

const METADATA_ALGORITHM = "AES-GCM"
const NODE_ALGORITHM = "aes-256-gcm"
const VERSION = 1
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

export const createAesGcmProvider = (): EncryptionProvider => ({
  async encrypt(plaintext, key) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(
      NODE_ALGORITHM,
      normalizeKey(key),
      iv,
    )

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    return {
      algorithm: METADATA_ALGORITHM,
      version: VERSION,
      iv: base64Encode(iv),
      ciphertext: base64Encode(Buffer.concat([ciphertext, authTag])),
    }
  },

  async decrypt(encrypted, key) {
    if (encrypted.algorithm !== METADATA_ALGORITHM) {
      throw new Error(`Unsupported algorithm: ${encrypted.algorithm}`)
    }

    const iv = base64Decode(encrypted.iv)
    const cipherData = base64Decode(encrypted.ciphertext)
    const authTag = cipherData.subarray(
      cipherData.length - AUTH_TAG_LENGTH,
    )
    const ciphertext = cipherData.subarray(0, cipherData.length - AUTH_TAG_LENGTH)

    const decipher = crypto.createDecipheriv(
      NODE_ALGORITHM,
      normalizeKey(key),
      iv,
    )
    decipher.setAuthTag(authTag)

    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])

    return plaintext.toString("utf8")
  },
})