import type { EncryptionKey } from "../types/crypto"
import type { KeyProvider } from "../types/keys"

export class StaticKeyProvider implements KeyProvider {
  private key: EncryptionKey

  constructor(key: EncryptionKey) {
    this.key = key
  }

  async getKey(): Promise<EncryptionKey> {
    return this.key
  }
}