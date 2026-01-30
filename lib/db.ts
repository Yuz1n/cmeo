import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "@/src/entities/User"
import { Invoice } from "@/src/entities/Invoice"
import { Event } from "@/src/entities/Event"
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

  // Fallback: tenta usar arquivos (para desenvolvimento local)
  const caCertPath = process.env.DB_CA_CERT
  const clientCertPath = process.env.DB_CLIENT_CERT
  const clientKeyPath = process.env.DB_CLIENT_KEY

  if (caCertPath && clientCertPath && clientKeyPath &&
      fs.existsSync(path.resolve(caCertPath)) &&
      fs.existsSync(path.resolve(clientCertPath)) &&
      fs.existsSync(path.resolve(clientKeyPath))) {
    return {
      ca: fs.readFileSync(path.resolve(caCertPath)),
      cert: fs.readFileSync(path.resolve(clientCertPath)),
      key: fs.readFileSync(path.resolve(clientKeyPath)),
      rejectUnauthorized: true
    }
  } else {
    // Fallback para desenvolvimento ou quando certificados não estão disponíveis
    return { rejectUnauthorized: false }
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