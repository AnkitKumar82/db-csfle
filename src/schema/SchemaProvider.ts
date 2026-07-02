export interface SchemaProvider {
  shouldEncrypt(path: string): boolean
  getEncryptedPaths(): string[]
}

export class SchemaProviderImpl {
  private schema: string[]

  constructor(schema: string[]) {
    this.schema = schema
  }

  /**
   * Determines if a field should be encrypted based on the schema
   */
  shouldEncrypt(path: string): boolean {
    // Simple implementation - check if path matches any schema pattern
    return this.schema.some(pattern => {
      if (pattern === "*") return true
      if (pattern.endsWith(".*")) {
        const prefix = pattern.slice(0, -1)
        return path.startsWith(prefix)
      }
      return pattern === path
    })
  }

  /**
   * Get all paths that should be encrypted
   */
  getEncryptedPaths(): string[] {
    return this.schema
  }
}