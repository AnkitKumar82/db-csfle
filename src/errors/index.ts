export class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncryptionError";
  }
}

export class UnsupportedAlgorithmError extends EncryptionError {
  constructor(algorithm: string) {
    super(`Unsupported algorithm: ${algorithm}`);
    this.name = "UnsupportedAlgorithmError";
  }
}

export class InvalidKeyError extends EncryptionError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidKeyError";
  }
}