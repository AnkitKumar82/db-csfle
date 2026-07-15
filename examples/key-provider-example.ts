/**
 * Example showing how to implement a custom KeyProvider to override StaticKeyProvider
 * 
 * This file demonstrates the complete implementation pattern for creating
 * your own key provider that works with the DbCsfle library.
 */

import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider
} from '../src/index'

// Import the KeyProvider interface to implement it properly
import { KeyProvider } from "../src/types/keys";
import { EncryptionKey, EncryptionProvider } from "../src/types/crypto";

/**
 * Custom key provider implementation that overrides StaticKeyProvider
 * This example shows how to fetch keys from environment variables
 */
class EnvironmentKeyProvider implements KeyProvider {
  async getKey(): Promise<EncryptionKey> {
    // In a real implementation, this could:
    // - Read from environment variables
    // - Fetch from a secure key management service
    // - Retrieve from a remote API
    // - Load from a local encrypted file
    
    // Example: Reading from environment variable (with validation)
    const keyString = process.env.ENCRYPTION_KEY;
    
    if (!keyString) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    
    // Convert string to proper key format (32 bytes for AES-256)
    const encoder = new TextEncoder();
    const keyArrayBuffer = encoder.encode(keyString).slice(0, 32); // AES-256 requires 32 bytes
    return new Uint8Array(keyArrayBuffer);
  }
}

/**
 * Alternative implementation that demonstrates different approaches
 */
class SecureKeyProvider implements KeyProvider {
  private cachedKey: EncryptionKey | null = null;
  
  async getKey(): Promise<EncryptionKey> {
    // Cache the key to avoid repeated expensive operations
    if (this.cachedKey) {
      return this.cachedKey;
    }
    
    // Simulate fetching from secure source (like KMS, HSM, etc.)
    const keyString = "my-super-secret-32-byte-key-for-aes-256-gcm-1234567890";
    const encoder = new TextEncoder();
    const keyArrayBuffer = encoder.encode(keyString).slice(0, 32);
    this.cachedKey = new Uint8Array(keyArrayBuffer);
    
    return this.cachedKey;
  }
}

/**
 * Example usage function showing how to use the custom provider
 */
async function demonstrateCustomKeyProvider() {
  console.log('=== Custom Key Provider Example ===');
  
  // Create an instance of our custom key provider
  const keyProvider = new EnvironmentKeyProvider();
  
  // Create encryption components (same as before)
  const schema = new SchemaProvider(['ssn', 'creditCard']);

  const createAesGcmProvider = (): any => {
    // Your own custom implementation of AES GCM provider
  }
  const cryptoProvider = createAesGcmProvider();
  
  // Create the engine with our custom key provider (this overrides StaticKeyProvider)
  const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider);
  
  // Sample data to encrypt
  const data = {
    name: "John Doe",
    ssn: "123-45-6789",
    creditCard: "4111-1111-1111-1111",
    email: "john@example.com"
  };
  
  console.log('Original data:', data);
  
  // Encrypt the data
  const encryptedData = await engine.encryptObject(data);
  console.log('Encrypted data:', JSON.stringify(encryptedData, null, 2));
  
  // Decrypt the data
  const decryptedData = await engine.decryptObject(encryptedData);
  console.log('Decrypted data:', decryptedData);
  
  console.log('=== Example completed successfully ===');
}

// Run the example
demonstrateCustomKeyProvider().catch(console.error);