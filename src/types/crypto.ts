export type EncryptionKey = Buffer | Uint8Array

export interface EncryptedValue {
  algorithm: string
  version: number
  iv: string
  ciphertext: string
}

export interface EncryptionProvider {
  encrypt(plaintext: string, key: EncryptionKey): Promise<EncryptedValue>
  decrypt(encrypted: EncryptedValue, key: EncryptionKey): Promise<string>
}
