import type { EncryptedValue } from "../types/crypto"

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
    return metadata && 
           typeof metadata === "object" &&
           metadata.hasOwnProperty("algorithm") &&
           metadata.hasOwnProperty("version") &&
           metadata.hasOwnProperty("iv")
  }

  /**
   * Gets algorithm from metadata
   */
  static getAlgorithm(metadata: any): string {
    return metadata.algorithm
  }

  /**
   * Gets version from metadata
   */
  static getVersion(metadata: any): number {
    return metadata.version
  }

  /**
   * Gets IV from metadata
   */
  static getIv(metadata: any): string {
    return metadata.iv
  }
}