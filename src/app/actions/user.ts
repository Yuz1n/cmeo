'use server'

import { getDataSource } from "@/lib/db"
import { User } from "@/entities/User"
import { revalidatePath } from "next/cache"

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string
  const name = formData.get("name") as string

  if (!email || !name) return

  // 1. Pega a conexão
  const db = await getDataSource()
  
  // 2. Pega o repositório do Usuário
  const userRepository = db.getRepository(User)

  // 3. Cria e Salva
  const newUser = userRepository.create({
    name,
    email
  })
  
  await userRepository.save(newUser)

  revalidatePath("/")
}