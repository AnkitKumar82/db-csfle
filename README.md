# DbCsfle - Database Client-Side Field-Level Encryption Library

Database client-side field-level encryption library written in TypeScript.

## Installation

Install the package via npm:

```bash
npm install @ankit/db-csfle
```

Or via yarn:

```bash
yarn add @ankit/db-csfle
```

## Usage

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

## Custom Key Providers

The library supports implementing custom key providers to override the default `StaticKeyProvider`. This allows you to fetch keys from secure sources like environment variables, KMS, or remote APIs.

```ts
import { KeyProvider } from 'db-csfle';

class MyCustomKeyProvider implements KeyProvider {
  async getKey(): Promise<EncryptionKey> {
    // Implement your key fetching logic here
    // Could fetch from environment variables, KMS, API, etc.
    
    // Example: Fetching from environment variable
    const keyString = process.env.ENCRYPTION_KEY;
    if (!keyString) {
      throw new Error('ENCRYPTION_KEY environment variable not set');
    }
    
    const encoder = new TextEncoder();
    const keyArrayBuffer = encoder.encode(keyString).slice(0, 32); // AES-256 requires 32 bytes
    return new Uint8Array(keyArrayBuffer);
  }
}

// Use the custom key provider
const customKeyProvider = new MyCustomKeyProvider();
const engine = new EncryptionEngine(cryptoProvider, schema, customKeyProvider);
```

## Environment Variables

The library doesn't require any specific environment variables by default. However, when using external key providers (like KMS), you might need to set:

- `AWS_ACCESS_KEY_ID` - AWS access key for KMS integration
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for KMS integration
- `AWS_REGION` - AWS region for KMS integration

## Features

- Client-side field-level encryption
- Database agnostic
- Support for Node.js and modern browsers
- TypeScript support with comprehensive type definitions
- Deterministic and randomized encryption modes
- Support for nested objects and arrays
- Extensible architecture through interfaces
- Zero runtime dependencies (when using built-in crypto)

## Keywords

- encryption
- decryption
- field-level encryption
- database encryption
- client-side encryption
- aes-gcm
- typescript
- security
- data protection

## Contributing

Contributions are welcome! Please follow the project's coding standards and submit a pull request.

## License

MIT License
