import type { EncryptionKey } from "./crypto"

export interface KeyProvider {
  getKey(): Promise<EncryptionKey>
}

export class StaticKeyProvider implements KeyProvider {
  private key: EncryptionKey

  constructor(key: EncryptionKey) {
    this.key = key
  }

  async getKey(): Promise<EncryptionKey> {
    return this.key
  }
}