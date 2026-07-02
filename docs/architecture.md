# DbCsfle Architecture

DbCsfle is a database-agnostic, client-side field-level encryption library written in TypeScript. This document outlines the architecture and design principles of the library.

## Overview

The library provides secure, client-side encryption of selected fields in JavaScript objects before they are persisted to a database and after they are retrieved. It operates entirely on JavaScript objects, leaving persistence to the consuming application.

## Goals

### Primary Goals
- Provide secure client-side field level encryption
- Remain completely database agnostic
- Support both Node.js and modern browsers
- Provide a clean, intuitive TypeScript API
- Preserve object structure after encryption/decryption
- Make encryption deterministic or randomized depending on configuration
- Support deeply nested objects and arrays
- Be highly extensible through interfaces
- Minimize bundle size
- Have zero runtime dependencies whenever possible
- Make key rotation possible
- Make future algorithm upgrades non-breaking

### Secondary Goals
- Excellent TypeScript support
- Comprehensive test coverage
- Well documented public APIs
- Predictable behavior
- Stable semantic versioning

## Non-Goals
The library intentionally does **not** provide:
- Database drivers (MongoDB, PostgreSQL, MySQL, DynamoDB)
- Authentication services
- Key storage solutions
- Secrets management
- Encrypted search capabilities
- Data compression before encryption

## High Level Architecture

```
Application
        │
        ▼
 Public API
        │
        ▼
 Encryption Engine
        │
 ┌──────┼───────────┐
 │      │           │
 ▼      ▼           ▼
Schema Crypto    Metadata
 │      │           │
 └──────┼───────────┘
        ▼
 Serialized Object
```

## Folder Structure and Responsibilities

### src/
Contains all library source code. Never place tests here.

### src/crypto
Responsible only for cryptographic operations:
- AES-GCM implementation
- Algorithm abstractions
- IV generation
- Encryption
- Decryption

Must not understand schemas.
Must not traverse objects.
Must not know databases.

### src/schema
Responsible for understanding which fields should be encrypted:
- Path parsing
- Wildcard support
- Schema validation

Must not perform encryption.

### src/engine
Coordinates the entire encryption process:
- Object traversal
- Invoking crypto
- Metadata generation
- Serialization

Should not contain cryptographic primitives.

### src/keys
Responsible for obtaining encryption keys:
- Static key provider
- KMS provider
- User supplied provider

### src/metadata
Responsible for encryption metadata:
- Version
- Algorithm
- IV
- Key id

### src/types
Shared public TypeScript types.
No implementation logic.

### src/errors
Custom error classes.
No business logic.

### src/utils
Pure utility functions.
Utilities should never depend on business logic.

## Design Principles

### Single Responsibility
Every module should have one responsibility. If a file performs encryption, traversal, serialization, validation, it should probably be split.

### Composition over Inheritance
Prefer small composable objects instead of inheritance hierarchies.

### Interface Driven Design
Depend on interfaces rather than implementations:
- EncryptionProvider
- KeyProvider

instead of concrete classes.

### Pure Functions
Prefer pure functions whenever practical.
Avoid hidden state.

### Immutable Inputs
Never mutate user objects.
Encryption should return a new object.

### Small Public API
Public surface area should remain intentionally small.
Internal complexity must remain internal.

### Explicit Configuration
Avoid hidden magic.
Behavior should always be configurable.

### Backward Compatibility
Encrypted payloads should include version metadata.
Older payloads should continue to decrypt.

## Security Requirements

Security always takes precedence over convenience.

### Algorithms
Only authenticated encryption algorithms are allowed:
- AES-256-GCM (preferred)
- Future support: XChaCha20-Poly1305

### Randomness
Always use cryptographically secure random number generation.
Never use Math.random().

### IV Requirements
IVs must never be reused with the same key.
Generate a fresh IV for every encryption unless deterministic encryption explicitly requires a different construction.

### Plaintext
Never retain plaintext longer than necessary.
Avoid unnecessary copies.

### Authentication
Every ciphertext must be authenticated.
Unauthenticated encryption is prohibited.

### Metadata
Metadata should include:
- version
- algorithm
- key id
- IV

## Dependency Rules

### Allowed Dependencies
Dependencies should only be added when they provide substantial value.
Prefer zero runtime dependencies.

### Runtime Dependencies
Runtime dependencies require architectural approval.

### Development Dependencies
Allowed:
- Vitest
- ESLint
- TypeScript
- Prettier
- Typedoc

### Crypto
Prefer built-in Crypto.
Avoid custom cryptographic implementations.

### Circular Dependencies
Circular dependencies are prohibited.

### Module Boundaries
Allowed:
```
engine
    ↓

schema
    ↓

crypto
```

Not allowed:
```
crypto
    ↓

engine
```

Low-level modules must never depend on higher-level modules.

## Testing Philosophy

Every exported function must have tests.
Test categories:
- Unit tests
- Integration tests
- Edge cases
- Invalid input
- Security regressions

Encryption tests should verify:
- ciphertext changes
- successful decryption
- authentication failures
- incorrect keys
- corrupted metadata

## Future Extensions

The architecture should allow future support for:
- Multiple encryption algorithms
- Multiple key providers
- Streaming encryption
- Deterministic encryption
- Blind indexes
- Key rotation
- Custom serializers
- Additional metadata formats

These features should not require breaking changes to the public API.

## Guiding Principle

**This library exists to provide secure, predictable, and extensible field-level encryption while remaining completely independent of any specific database, framework, or deployment environment. Security, correctness, and maintainability always take precedence over convenience or feature count.**