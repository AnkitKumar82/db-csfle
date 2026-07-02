import type { EncryptionProvider } from "../types/crypto"
import type { SchemaProvider } from "../types/schema"
import type { KeyProvider } from "../types/keys"
import type { EncryptedValue } from "../types/crypto"
import { isEncryptedValue } from "../utils/index"

export class EncryptionEngine {
  private encryptionProvider: EncryptionProvider
  private schemaProvider: SchemaProvider
  private keyProvider: KeyProvider

  constructor(
    encryptionProvider: EncryptionProvider,
    schemaProvider: SchemaProvider,
    keyProvider: KeyProvider
  ) {
    this.encryptionProvider = encryptionProvider
    this.schemaProvider = schemaProvider
    this.keyProvider = keyProvider
  }

  /**
   * Encrypts an object according to the schema
   */
  async encryptObject(data: any): Promise<any> {
    const encryptedData = await this.encryptObjectRecursive(data, "")
    return encryptedData
  }

  /**
   * Recursively encrypts object fields based on schema
   */
  private async encryptObjectRecursive(obj: any, path: string): Promise<any> {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj !== "object") {
      // Check if this field should be encrypted
      if (this.schemaProvider.shouldEncrypt(path)) {
        const encryptionKey = await this.keyProvider.getKey()
        const encryptedValue = await this.encryptionProvider.encrypt(obj.toString(), encryptionKey)
        return encryptedValue
      }
      return obj
    }

    if (Array.isArray(obj)) {
      const result: any[] = []
      for (let i = 0; i < obj.length; i++) {
        const currentPath = path ? `${path}[${i}]` : `[${i}]`
        result[i] = await this.encryptObjectRecursive(obj[i], currentPath)
      }
      return result
    }

    // Handle plain objects
    const result: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key
        const value = obj[key]
        
        // If this field should be encrypted
        if (this.schemaProvider.shouldEncrypt(currentPath)) {
          const encryptionKey = await this.keyProvider.getKey()
          const encryptedValue = await this.encryptionProvider.encrypt(value.toString(), encryptionKey)
          result[key] = encryptedValue
        } else {
          // Recursively process nested objects/arrays
          result[key] = await this.encryptObjectRecursive(value, currentPath)
        }
      }
    }

    return result
  }

  /**
   * Decrypts an object according to the schema
   */
  async decryptObject(data: any): Promise<any> {
    const decryptedData = await this.decryptObjectRecursive(data, "")
    return decryptedData
  }

  /**
   * Recursively decrypts object fields based on schema
   */
  private async decryptObjectRecursive(obj: any, path: string): Promise<any> {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj !== "object") {
      return obj
    }

    if (Array.isArray(obj)) {
      const result: any[] = []
      for (let i = 0; i < obj.length; i++) {
        const currentPath = path ? `${path}[${i}]` : `[${i}]`
        result[i] = await this.decryptObjectRecursive(obj[i], currentPath)
      }
      return result
    }

    // Handle plain objects
    const result: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key
        const value = obj[key]
        
        // Check if this is an encrypted value
        if (isEncryptedValue(value)) {
          const encryptionKey = await this.keyProvider.getKey()
          const decryptedValue = await this.encryptionProvider.decrypt(value, encryptionKey)
          result[key] = decryptedValue
        } else {
          // Recursively process nested objects/arrays
          result[key] = await this.decryptObjectRecursive(value, currentPath)
        }
      }
    }

    return result
  }

}