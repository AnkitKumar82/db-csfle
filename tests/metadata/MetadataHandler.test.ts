import assert from "assert"
import { describe, it } from "mocha"
import { MetadataHandler } from "../../src/metadata/MetadataHandler"

describe("MetadataHandler", () => {
  it("should create valid metadata", () => {
    // Create some mock encrypted data
    const metadata = MetadataHandler.createMetadata("AES-GCM", 1, "iv-data")
    
    assert.equal(metadata.algorithm, "AES-GCM")
    assert.equal(metadata.version, 1)
    assert.ok(metadata.iv.length > 0)
  })

  it("should validate valid metadata", () => {
    // Create valid metadata
    const metadata = MetadataHandler.createMetadata("AES-GCM", 1, "iv-data")
    
    assert.ok(MetadataHandler.isValidMetadata(metadata))
  })

  it("should reject invalid metadata", () => {
    // Test with missing fields
    const invalidMetadata1 = {
      algorithm: "AES-GCM",
      version: 1
      // Missing iv field
    } as any
    
    assert.ok(!MetadataHandler.isValidMetadata(invalidMetadata1))
    
    // Test with wrong algorithm
    const invalidMetadata2 = {
      algorithm: "AES-CBC",
      version: 1,
      iv: "iv-data"
    }
    
    assert.ok(!MetadataHandler.isValidMetadata(invalidMetadata2))
  })

  it("should extract metadata components correctly", () => {
    // Create metadata
    const metadata = MetadataHandler.createMetadata("AES-GCM", 1, "test-iv-data")
    
    assert.equal(MetadataHandler.getAlgorithm(metadata), "AES-GCM")
    assert.equal(MetadataHandler.getVersion(metadata), 1)
    assert.equal(MetadataHandler.getIv(metadata), "test-iv-data")
  })

  it("should handle different algorithm versions", () => {
    // Test with version 1
    const metadata1 = MetadataHandler.createMetadata("AES-GCM", 1, "iv1")
    assert.equal(MetadataHandler.getVersion(metadata1), 1)
    
    // Test with version 2
    const metadata2 = MetadataHandler.createMetadata("AES-GCM", 2, "iv2")
    assert.equal(MetadataHandler.getVersion(metadata2), 2)
  })
})
