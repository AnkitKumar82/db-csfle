import type { EncryptedValue } from "../types/crypto"
import { isValidMetadata, getAlgorithm, getVersion, getIv } from "../utils/index"

export class MetadataHandler {
  /**
   * Creates metadata for an encrypted value
   */
  static createMetadata(algorithm: string, version: number, iv: string): any {
    return {
      algorithm,
      version,
      iv
    }
  }

  /**
   * Validates if the metadata is valid
   */
  static isValidMetadata(metadata: any): boolean {
    return isValidMetadata(metadata)
  }

  /**
   * Gets algorithm from metadata
   */
  static getAlgorithm(metadata: any): string {
    return getAlgorithm(metadata)
  }

  /**
   * Gets version from metadata
   */
  static getVersion(metadata: any): number {
    return getVersion(metadata)
  }

  /**
   * Gets IV from metadata
   */
  static getIv(metadata: any): string {
    return getIv(metadata)
  }
}
