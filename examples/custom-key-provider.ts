import { 
  EncryptionEngine,
  SchemaProvider,
  StaticKeyProvider
} from '../src/index'
import { createAesGcmProvider } from '../src/crypto/CryptoProvider'
import { KeyProvider } from "../src/types/keys";
import { EncryptionKey } from "../src/types/crypto";

// Example of a custom key provider implementation
class MyCustomKeyProvider implements KeyProvider {
  async getKey(): Promise<EncryptionKey> {
    // In a real implementation, this could fetch the key from:
    // - Environment variables
    // - A remote API
    // - A key management service
    // - A local file
    
    // For demonstration purposes, we'll return a hardcoded key
    // In practice, you'd want to make this more secure
    const keyString = "my-super-secret-32-byte-key-for-aes-256-gcm-1234567890";
    const encoder = new TextEncoder();
    const keyArrayBuffer = encoder.encode(keyString).slice(0, 32); // AES-256 requires 32 bytes
    return new Uint8Array(keyArrayBuffer);
  }
}

// Example usage with custom key provider
async function example() {
  // Create an instance of our custom key provider
  const keyProvider = new MyCustomKeyProvider();
  
  // Create encryption components
  const schema = new SchemaProvider(['ssn', 'creditCard']);
  const cryptoProvider = createAesGcmProvider();
  const engine = new EncryptionEngine(cryptoProvider, schema, keyProvider);
  
  // Sample data to encrypt
  const data = {
    name: "John Doe",
    ssn: "123-45-6789",
    creditCard: "4111-1111-1111-1111"
  };
  
  // Encrypt the data using the custom key provider
  const encryptedData = await engine.encryptObject(data);
  
  console.log("Encrypted:", encryptedData);
  
  // Decrypt the data
  const decryptedData = await engine.decryptObject(encryptedData);
  
  console.log("Decrypted:", decryptedData);
}

example().catch(console.error);
