import assert from "assert"
import { describe, it } from "mocha"
import { StaticKeyProvider } from "../../src/keys/StaticKeyProvider"

describe("StaticKeyProvider", () => {
  it("should return the correct key", async () => {
    const mockKey = Buffer.from("a".repeat(32), "utf-8")
    const keyProvider = new StaticKeyProvider(mockKey)
    
    const key = await keyProvider.getKey()
    
    assert.equal(key, mockKey)
  })

  it("should handle different key sizes correctly", async () => {
    // Test with a 32-byte key (AES-256)
    const key32 = Buffer.from("a".repeat(32), "utf-8")
    const keyProvider32 = new StaticKeyProvider(key32)
    
    const returnedKey32 = await keyProvider32.getKey()
    assert.equal(returnedKey32, key32)
    
    // Test with a 16-byte key (AES-128)
    const key16 = Buffer.from("b".repeat(16), "utf-8")
    const keyProvider16 = new StaticKeyProvider(key16)
    
    const returnedKey16 = await keyProvider16.getKey()
    assert.equal(returnedKey16, key16)
  })

  it("should maintain key immutability", async () => {
    const originalKey = Buffer.from("c".repeat(32), "utf-8")
    const keyProvider = new StaticKeyProvider(originalKey)
    
    const returnedKey1 = await keyProvider.getKey()
    const returnedKey2 = await keyProvider.getKey()
    
    // Should return the same reference
    assert.equal(returnedKey1, originalKey)
    assert.equal(returnedKey2, originalKey)
  })
})