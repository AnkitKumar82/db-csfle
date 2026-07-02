import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider
} from '../src/index'
import { createAesGcmProvider as createCryptoProvider } from '../src/crypto/CryptoProvider'

// Create encryption components
const schema = new SchemaProvider(['*']) // Encrypt all fields
const keyProvider = new StaticKeyProvider(Buffer.from('your-32-byte-key-here'))
const cryptoProvider = createCryptoProvider()
const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

// Example 1: Deterministic encryption (same input always produces same output)
async function deterministicEncryption() {
  const data = {
    userId: 'user123',
    email: 'john@example.com',
    name: 'John Doe'
  }

  // Encrypt the same data multiple times - should produce identical results
  const encrypted1 = await engine.encryptObject(data)
  const encrypted2 = await engine.encryptObject(data)
  
  console.log('Same input produces same output:', 
    JSON.stringify(encrypted1) === JSON.stringify(encrypted2))
}

// Example 2: Custom schema with nested paths
async function customSchema() {
  // Encrypt only specific nested fields
  const customSchema = new SchemaProvider(['user.name', 'user.email', 'metadata.createdAt'])
  
  const engineWithCustomSchema = new EncryptionEngine(
    cryptoProvider, 
    customSchema, 
    keyProvider
  )
  
  const data = {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'secret123'
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    },
    sensitiveData: 'should not be encrypted'
  }

  const encrypted = await engineWithCustomSchema.encryptObject(data)
  console.log('Custom Schema Encrypted:', encrypted)
  
  const decrypted = await engineWithCustomSchema.decryptObject(encrypted)
  console.log('Custom Schema Decrypted:', decrypted)
}

// Example 3: Multiple key providers
async function multipleKeyProviders() {
  // Create a key provider that returns different keys based on context
  class DynamicKeyProvider {
    async getKey(context: any) {
      if (context.type === 'user') {
        return Buffer.from('user-key-12345678901234567890123456789012') // 32 bytes
      }
      return Buffer.from('default-key-12345678901234567890123456789012') // 32 bytes
    }
  }
  
  const dynamicKeyProvider = new DynamicKeyProvider()
  
  // This would require modifying the engine to support context-based key selection
  console.log('Dynamic key provider example - implementation would depend on library design')
}

// Example 4: Error handling and validation
async function errorHandling() {
  try {
    // Try to decrypt invalid data
    const invalidData = {
      _encrypted: true,
      fields: {
        name: 'encrypted_value'
      },
      metadata: {
        version: 1,
        algorithm: 'AES-GCM',
        iv: 'invalid_iv'
      }
    }
    
    await engine.decryptObject(invalidData)
  } catch (error: any) {
    console.log('Error handling works:', error.message)
  }
}

// Run examples
deterministicEncryption()
  .then(() => customSchema())
  .then(() => multipleKeyProviders())
  .then(() => errorHandling())
  .catch(console.error)