// src/lib/enums.ts
// Este arquivo NÃO deve importar nada do TypeORM

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}