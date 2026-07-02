export interface SchemaProvider {
  shouldEncrypt(path: string): boolean
  getEncryptedPaths(): string[]
}