import "@/lib/polyfill";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "@/entities/User"
import { Invoice } from "@/entities/Invoice"
import { Event } from "@/entities/Event"
import * as fs from "fs"
import * as path from "path"

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

  // Fallback para desenvolvimento local
  const caCertPath = process.env.DB_CA_CERT
  const clientCertPath = process.env.DB_CLIENT_CERT
  const clientKeyPath = process.env.DB_CLIENT_KEY

  if (caCertPath && clientCertPath && clientKeyPath) {
    // Verificação de segurança simples para evitar erro de leitura
    try {
        const resolvedCa = path.resolve(process.cwd(), caCertPath);
        if (fs.existsSync(resolvedCa)) {
            return {
                ca: fs.readFileSync(resolvedCa),
                cert: fs.readFileSync(path.resolve(process.cwd(), clientCertPath)),
                key: fs.readFileSync(path.resolve(process.cwd(), clientKeyPath)),
                rejectUnauthorized: true
            }
        }
    } catch (e) {
        console.warn("Certificados locais não encontrados, ignorando SSL estrito.");
    }
  }
  
  return { rejectUnauthorized: false }
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