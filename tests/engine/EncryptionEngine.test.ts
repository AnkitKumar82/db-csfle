import assert from "assert"
import { describe, it } from "mocha"
import { EncryptionEngine } from "../../src/engine/EncryptionEngine"
import { SchemaProviderImpl } from "../../src/schema/SchemaProvider"
import { StaticKeyProvider } from "../../src/keys/StaticKeyProvider"
import { createAesGcmProvider } from "../../src/crypto/CryptoProvider"
import { randomBytes } from "node:crypto"

// Mock key for testing
const mockKey = Buffer.from("a".repeat(32), "utf-8")

describe("EncryptionEngine", () => {
  it("encrypts and decrypts objects correctly", async () => {
    const schema = new SchemaProviderImpl(["name", "email"])
    const keyProvider = new StaticKeyProvider(mockKey)
    const cryptoProvider = createAesGcmProvider()
    const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

    const data = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York"
      }
    }

    // Encrypt the object
    const encrypted = await engine.encryptObject(data)
    
    // Verify encrypted fields are encrypted (not plain text)
    assert.ok(encrypted.name !== "John Doe")
    assert.ok(encrypted.email !== "john@example.com")
    assert.equal(encrypted.age, 30) // Non-encrypted field should remain unchanged
    assert.equal(encrypted.address.street, "123 Main St") // Nested non-encrypted field should remain unchanged
    
    // Decrypt the object
    const decrypted = await engine.decryptObject(encrypted)
    
    // Verify decryption is correct
    assert.equal(decrypted.name, "John Doe")
    assert.equal(decrypted.email, "john@example.com")
    assert.equal(decrypted.age, 30)
    assert.equal(decrypted.address.street, "123 Main St")
    assert.equal(decrypted.address.city, "New York")
  })

  it("handles null and undefined values correctly", async () => {
    const schema = new SchemaProviderImpl(["data"])
    const keyProvider = new StaticKeyProvider(mockKey)
    const cryptoProvider = createAesGcmProvider()
    const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

    const data = {
      nullValue: null,
      undefinedValue: undefined,
      normalValue: "test"
    }

    const encrypted = await engine.encryptObject(data)
    const decrypted = await engine.decryptObject(encrypted)
    
    assert.equal(decrypted.nullValue, null)
    assert.equal(decrypted.undefinedValue, undefined)
    assert.equal(decrypted.normalValue, "test")
  })

  it("handles arrays correctly", async () => {
    const schema = new SchemaProviderImpl(["items.*"])
    const keyProvider = new StaticKeyProvider(mockKey)
    const cryptoProvider = createAesGcmProvider()
    const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

    const data = {
      items: [
        { name: "Item 1", value: 100 },
        { name: "Item 2", value: 200 }
      ],
      normalField: "test"
    }

    const encrypted = await engine.encryptObject(data)
    const decrypted = await engine.decryptObject(encrypted)
    
    assert.equal(decrypted.normalField, "test")
    assert.ok(decrypted.items[0].name !== "Item 1")
    assert.ok(decrypted.items[1].name !== "Item 2")
    assert.equal(decrypted.items[0].value, 100)
    assert.equal(decrypted.items[1].value, 200)
  })

  it("handles deeply nested objects correctly", async () => {
    const schema = new SchemaProviderImpl(["user.profile.name", "user.contact.email"])
    const keyProvider = new StaticKeyProvider(mockKey)
    const cryptoProvider = createAesGcmProvider()
    const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

    const data = {
      user: {
        profile: {
          name: "Jane Smith",
          age: 25
        },
        contact: {
          email: "jane@example.com",
          phone: "123-456-7890"
        }
      },
      normalField: "test"
    }

    const encrypted = await engine.encryptObject(data)
    const decrypted = await engine.decryptObject(encrypted)
    
    assert.equal(decrypted.normalField, "test")
    assert.equal(decrypted.user.profile.age, 25)
    assert.equal(decrypted.user.contact.phone, "123-456-7890")
    assert.ok(decrypted.user.profile.name !== "Jane Smith")
    assert.ok(decrypted.user.contact.email !== "jane@example.com")
  })

  it("handles empty objects and arrays", async () => {
    const schema = new SchemaProviderImpl(["data"])
    const keyProvider = new StaticKeyProvider(mockKey)
    const cryptoProvider = createAesGcmProvider()
    const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

    const data = {
      emptyObject: {},
      emptyArray: [],
      nullValue: null
    }

    const encrypted = await engine.encryptObject(data)
    const decrypted = await engine.decryptObject(encrypted)
    
    assert.equal(decrypted.emptyObject, {})
    assert.equal(decrypted.emptyArray.length, 0)
    assert.equal(decrypted.nullValue, null)
  })
})