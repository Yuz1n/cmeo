import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "@/src/entities/User"
import { Invoice } from "@/src/entities/Invoice"
import { Event } from "@/src/entities/Event"

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Invoice, Event],
  extra: process.env.DATABASE_URL?.includes('localhost') ? {} : {
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false }
  }
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