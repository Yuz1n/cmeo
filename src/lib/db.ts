import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "@/entities/User"
import { Invoice } from "@/entities/Invoice"
import { Event } from "@/entities/Event"
import * as fs from "fs"
import * as path from "path"

const getSSLConfig = () => {
  // Primeiro, tenta usar o conteúdo dos certificados (para Vercel)
  const caCertContent = process.env.DB_CA_CERT_CONTENT
  const clientCertContent = process.env.DB_CLIENT_CERT_CONTENT
  const clientKeyContent = process.env.DB_CLIENT_KEY_CONTENT

  if (caCertContent && clientCertContent && clientKeyContent) {
    return {
      ca: caCertContent,
      cert: clientCertContent,
      key: clientKeyContent,
      rejectUnauthorized: true
    }
  }
}

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Invoice, Event],
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : getSSLConfig()
})

export const getDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err)
        throw err
      })
  }
  return AppDataSource
}