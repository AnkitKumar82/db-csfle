# DbCsfle API Documentation

This document provides comprehensive documentation for the DbCsfle library's public API.

## Overview

DbCsfle is a database-agnostic, client-side field-level encryption library written in TypeScript. It provides secure encryption and decryption of JavaScript objects while maintaining their structure.

## Installation

```bash
npm install @ankit/db-csfle
```

Or via yarn:

```bash
yarn add @ankit/db-csfle
```

## Public API

### Main Functions

#### `encryptObject(data, options)`
Encrypts the specified fields of a JavaScript object.

**Parameters:**
- `data` (object): The object to encrypt
- `options` (object, optional): Encryption options
  - `schema` (SchemaProvider): Schema defining which fields to encrypt
  - `keyProvider` (KeyProvider): Provider for encryption keys
  - `cryptoProvider` (EncryptionProvider): Provider for cryptographic operations

**Returns:**
- Promise<object>: The encrypted object

#### `decryptObject(data, options)`
Decrypts the specified fields of a JavaScript object.

**Parameters:**
- `data` (object): The object to decrypt
- `options` (object, optional): Decryption options
  - `schema` (SchemaProvider): Schema defining which fields were encrypted
  - `keyProvider` (KeyProvider): Provider for encryption keys
  - `cryptoProvider` (EncryptionProvider): Provider for cryptographic operations

**Returns:**
- Promise<object>: The decrypted object

### Classes

#### `EncryptionEngine`
Main engine for coordinating encryption and decryption operations.

**Constructor:**
```ts
new EncryptionEngine(cryptoProvider, schemaProvider, keyProvider)
```

**Methods:**
- `encryptObject(data)`: Encrypts an object
- `decryptObject(data)`: Decrypts an object

#### `SchemaProvider`
Handles definition and validation of encryption schemas.

**Constructor:**
```ts
new SchemaProvider(paths)
```

**Parameters:**
- `paths` (string[]): Array of field paths to encrypt

**Methods:**
- `getEncryptionPaths()`: Returns the list of paths to encrypt

#### `StaticKeyProvider`
Provides static keys for encryption.

**Constructor:**
```ts
new StaticKeyProvider(key)
```

**Parameters:**
- `key` (Buffer|string): The encryption key (32 bytes for AES-256)

### Providers

#### `createAesGcmProvider()`
Creates an AES-GCM encryption provider.

**Returns:**
- EncryptionProvider: A provider for AES-GCM encryption operations

## Usage Examples

### Basic Usage

```ts
import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider,
  createAesGcmProvider
} from 'db-csfle'

// Create encryption components
const schema = new SchemaProvider(['name', 'email'])
const keyProvider = new StaticKeyProvider(Buffer.from('your-32-byte-key-here'))
const cryptoProvider = createAesGcmProvider()
const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

// Encrypt data
const encryptedData = await engine.encryptObject({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
})

// Decrypt data
const decryptedData = await engine.decryptObject(encryptedData)
```

### Advanced Usage

```ts
import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider,
  createAesGcmProvider
} from 'db-csfle'

// Encrypt all fields
const schema = new SchemaProvider(['*'])
const keyProvider = new StaticKeyProvider(Buffer.from('your-32-byte-key-here'))
const cryptoProvider = createAesGcmProvider()
const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider)

// Custom schema with nested paths
const customSchema = new SchemaProvider(['user.name', 'user.email'])
const customEngine = new EncryptionEngine(cryptoProvider, customSchema, keyProvider)
```

## Types

### EncryptedValue
```ts
interface EncryptedValue {
  algorithm: string;
  version: number;
  iv: string;
  ciphertext: string;
}
```

### EncryptionProvider
```ts
interface EncryptionProvider {
  encrypt(plaintext: string, key: EncryptionKey): Promise<EncryptedValue>;
  decrypt(encrypted: EncryptedValue, key: EncryptionKey): Promise<string>;
}
```

### KeyProvider
```ts
interface KeyProvider {
  getKey(context?: any): Promise<EncryptionKey>;
}
```

### SchemaProvider
```ts
interface SchemaProvider {
  getEncryptionPaths(): string[];
}
```

## Error Handling

The library throws specific error types for different failure scenarios:

- `EncryptionError`: General encryption/decryption errors
- `SchemaValidationError`: Schema validation failures  
- `InvalidKeyError`: Key-related issues
- `UnsupportedAlgorithmError`: Unsupported encryption algorithms

## Security Considerations

1. **Key Management**: Never hardcode encryption keys in your source code
2. **IV Reuse**: The library automatically generates unique IVs for each encryption operation
3. **Authentication**: All operations use authenticated encryption (AES-GCM)
4. **Plaintext Exposure**: Plaintext is never retained longer than necessary

## Browser Compatibility

The library supports modern browsers and Node.js environments. For browser usage, ensure you're using a build tool that properly handles the Node.js crypto module.

## Performance

- Encryption operations are asynchronous
- The library is optimized for memory usage
- Metadata overhead is minimal (typically 100-200 bytes per encrypted field)

## Backward Compatibility

- Encrypted payloads include version metadata
- Older payloads can be decrypted by newer versions of the library
- Breaking changes are carefully managed through semantic versioning

## Extensibility

The library follows interface-driven design principles, making it easy to extend:

1. **Custom Encryption Providers**: Implement `EncryptionProvider` interface
2. **Custom Key Providers**: Implement `KeyProvider` interface  
3. **Custom Schema Providers**: Implement `SchemaProvider` interface
4. **Custom Serializers**: Implement custom serialization logic

## Contributing

Contributions are welcome! Please follow the project's coding standards and submit a pull request.