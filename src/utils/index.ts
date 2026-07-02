import crypto from "node:crypto"
import type { EncryptedValue } from "../types/crypto"

/**
 * Base64 encode a buffer
 */
export const base64Encode = (data: Buffer): string => data.toString("base64")

/**
 * Base64 decode a string
 */
export const base64Decode = (value: string): Buffer => Buffer.from(value, "base64")

/**
 * Normalize encryption key to Buffer format
 */
export const normalizeKey = (key: any): Buffer =>
  Buffer.isBuffer(key) ? key : Buffer.from(key)

/**
 * Checks if an object is an encrypted value
 */
export const isEncryptedValue = (obj: any): boolean => {
  return obj && 
         typeof obj === "object" && 
         obj.hasOwnProperty("algorithm") &&
         obj.hasOwnProperty("version") &&
         obj.hasOwnProperty("iv") &&
         obj.hasOwnProperty("ciphertext")
}

/**
 * Validates if metadata is valid
 */
export const isValidMetadata = (metadata: any): boolean => {
  return metadata && 
         typeof metadata === "object" &&
         metadata.hasOwnProperty("algorithm") &&
         metadata.hasOwnProperty("version") &&
         metadata.hasOwnProperty("iv")
}

/**
 * Gets algorithm from metadata
 */
export const getAlgorithm = (metadata: any): string => {
  return metadata.algorithm
}

/**
 * Gets version from metadata
 */
export const getVersion = (metadata: any): number => {
  return metadata.version
}

/**
 * Gets IV from metadata
 */
export const getIv = (metadata: any): string => {
  return metadata.iv
}