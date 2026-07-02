import assert from "assert"
import { describe, it } from "mocha"
import { SchemaProviderImpl } from "../../src/schema/SchemaProvider"

describe("SchemaProvider", () => {
  it("should encrypt fields matching exact paths", () => {
    const schema = new SchemaProviderImpl(["name", "email"])
    
    assert.ok(schema.shouldEncrypt("name"))
    assert.ok(schema.shouldEncrypt("email"))
    assert.ok(!schema.shouldEncrypt("age"))
    assert.ok(!schema.shouldEncrypt("address"))
  })

  it("should handle wildcard patterns", () => {
    const schema = new SchemaProviderImpl(["*"])
    
    assert.ok(schema.shouldEncrypt("name"))
    assert.ok(schema.shouldEncrypt("email"))
    assert.ok(schema.shouldEncrypt("age"))
  })

  it("should handle prefix-based patterns", () => {
    const schema = new SchemaProviderImpl(["user.*"])
    
    assert.ok(schema.shouldEncrypt("user.name"))
    assert.ok(schema.shouldEncrypt("user.email"))
    assert.ok(!schema.shouldEncrypt("name"))
    assert.ok(!schema.shouldEncrypt("user"))
  })

  it("should handle mixed patterns", () => {
    const schema = new SchemaProviderImpl(["name", "user.*", "email"])
    
    assert.ok(schema.shouldEncrypt("name"))
    assert.ok(schema.shouldEncrypt("user.name"))
    assert.ok(schema.shouldEncrypt("user.email"))
    assert.ok(schema.shouldEncrypt("email"))
    assert.ok(!schema.shouldEncrypt("age"))
  })

  it("should return correct encrypted paths", () => {
    const schema = new SchemaProviderImpl(["name", "user.*", "email"])
    
    const paths = schema.getEncryptedPaths()
    assert.equal(paths.length, 3)
    assert.ok(paths.includes("name"))
    assert.ok(paths.includes("user.*"))
    assert.ok(paths.includes("email"))
  })

  it("should handle nested path patterns correctly", () => {
    const schema = new SchemaProviderImpl(["user.profile.name", "user.contact.email"])
    
    assert.ok(schema.shouldEncrypt("user.profile.name"))
    assert.ok(schema.shouldEncrypt("user.contact.email"))
    assert.ok(!schema.shouldEncrypt("user.profile.age"))
    assert.ok(!schema.shouldEncrypt("user"))
  })
})