import "@/lib/polyfill";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "@/entities/User"
import { Invoice } from "@/entities/Invoice"
import { Event } from "@/entities/Event"

const getSSLConfig = () => {
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
  synchronize: true, // Cuidado: Em produção idealmente deve ser false
  logging: false,
  entities: [User, Invoice, Event],
  // Ajuste fino para evitar erro de SSL em localhost vs prod
  ssl: process.env.NODE_ENV === 'production' ? getSSLConfig() : false
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