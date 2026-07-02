export class UnsupportedAlgorithmError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnsupportedAlgorithmError"
  }
}