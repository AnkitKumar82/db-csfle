import { 
  EncryptionEngine,
  SchemaProvider
} from '../src/index'
import { createAesGcmProvider } from '../src/crypto/CryptoProvider'
import { KeyProvider } from "../src/types/keys";
import { EncryptionKey } from "../src/types/crypto";

// Example of implementing a custom key provider that overrides StaticKeyProvider
class MyCustomKeyProvider implements KeyProvider {
  async getKey(): Promise<EncryptionKey> {
    // This could fetch from:
    // - Environment variables
    // - Remote API
    // - Key management service
    // - Local secure storage
    
    // For demonstration, we'll use a hardcoded key (in practice, this would be more secure)
    const keyString = "my-super-secret-32-byte-key-for-aes-256-gcm-1234567890";
    const encoder = new TextEncoder();
    const keyArrayBuffer = encoder.encode(keyString).slice(0, 32); // AES-256 requires 32 bytes
    return new Uint8Array(keyArrayBuffer);
  }
}

// Example showing how to override the StaticKeyProvider
async function example() {
  // Create an instance of our custom key provider (instead of StaticKeyProvider)
  const keyProvider = new MyCustomKeyProvider();
  
  // Create encryption components
  const schema = new SchemaProvider(['ssn', 'creditCard']);
  const cryptoProvider = createAesGcmProvider();
  
  // Create the engine with our custom key provider (this overrides StaticKeyProvider)
  const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider);
  
  // Sample data to encrypt
  const data = {
    name: "John Doe",
    ssn: "123-45-6789",
    creditCard: "4111-1111-1111-1111"
  };
  
  // Encrypt the data using our custom key provider
  const encryptedData = await engine.encryptObject(data);
  
  console.log("Encrypted:", encryptedData);
  
  // Decrypt the data
  const decryptedData = await engine.decryptObject(encryptedData);
  
  console.log("Decrypted:", decryptedData);
}

example().catch(console.error);