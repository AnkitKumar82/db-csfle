import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider
} from '../src/index'
import { createAesGcmProvider } from '../src/crypto/CryptoProvider'

// Create encryption components
const schema = new SchemaProvider(['name', 'email'])
const keyProvider = new StaticKeyProvider(Buffer.from('your-32-byte-key-here'))
const cryptoProvider = createAesGcmProvider()
const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

// Example 1: Basic object encryption
async function basicEncryption() {
  const data = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    ssn: '123-45-6789'
  }

  // Encrypt the data
  const encryptedData = await engine.encryptObject(data)
  console.log('Encrypted:', encryptedData)

  // Decrypt the data
  const decryptedData = await engine.decryptObject(encryptedData)
  console.log('Decrypted:', decryptedData)
}

// Example 2: Nested object encryption
async function nestedEncryption() {
  const nestedData = {
    user: {
      name: 'Jane Smith',
      contact: {
        email: 'jane@example.com',
        phone: '555-1234'
      }
    },
    metadata: {
      createdAt: new Date(),
      version: '1.0'
    }
  }

  const encryptedData = await engine.encryptObject(nestedData)
  console.log('Nested Encrypted:', encryptedData)

  const decryptedData = await engine.decryptObject(encryptedData)
  console.log('Nested Decrypted:', decryptedData)
}

// Example 3: Array encryption
async function arrayEncryption() {
  const arrayData = {
    users: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' }
    ],
    tags: ['developer', 'typescript', 'encryption']
  }

  const encryptedData = await engine.encryptObject(arrayData)
  console.log('Array Encrypted:', encryptedData)

  const decryptedData = await engine.decryptObject(encryptedData)
  console.log('Array Decrypted:', decryptedData)
}

// Run examples
basicEncryption().then(() => {
  console.log('\n---\n')
  return nestedEncryption()
}).then(() => {
  console.log('\n---\n')
  return arrayEncryption()
}).catch(console.error)