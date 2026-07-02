import assert from "assert"
import { describe, it } from "mocha"
import { randomBytes } from "node:crypto"
import { createAesGcmProvider } from "../../src/crypto/CryptoProvider"
import type { EncryptedValue } from "../../src/types/crypto"

const randomKey = async (): Promise<Buffer> => randomBytes(32)

describe("AES-GCM CryptoProvider", () => {
  it("encrypts and decrypts plaintext correctly", async () => {
    const key = await randomKey()
    const provider = createAesGcmProvider()
    const plaintext = "hello world"

    const encrypted = await provider.encrypt(plaintext, key)
    assert.equal(encrypted.algorithm, "AES-GCM")
    assert.equal(encrypted.version, 1)
    assert.ok(encrypted.iv.length > 0)
    assert.ok(encrypted.ciphertext.length > 0)

    const decrypted = await provider.decrypt(encrypted, key)
    assert.equal(decrypted, plaintext)
  })

  it("fails decryption with wrong key", async () => {
    const key = await randomKey()
    const wrongKey = await randomKey()
    const provider = createAesGcmProvider()
    const encrypted = await provider.encrypt("secret", key)

    await assert.rejects(async () => {
      await provider.decrypt(encrypted, wrongKey)
    })
  })

  it("throws for unsupported algorithm metadata", async () => {
    const provider = createAesGcmProvider()
    const fake: EncryptedValue = {
      algorithm: "AES-CBC",
      version: 1,
      iv: "AA==",
      ciphertext: "AA==",
    }

    await assert.rejects(async () => {
      await provider.decrypt(fake, await randomKey())
    }, /Unsupported algorithm/)
  })
})
