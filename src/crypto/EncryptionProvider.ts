import type { EncryptedValue, EncryptionKey } from "../types/crypto"

export interface EncryptionProvider {
  encrypt(plaintext: string, key: EncryptionKey): Promise<EncryptedValue>
  decrypt(encrypted: EncryptedValue, key: EncryptionKey): Promise<string>
}
