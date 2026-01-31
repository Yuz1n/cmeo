'use server'
import { compare } from "bcryptjs";
import { createSession, getSession } from "@/lib/session";
import { getDataSource } from "@/lib/db"
import { User } from "@/entities/User"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';
import { sendPasswordResetEmail } from "@/lib/email";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const consultorio = formData.get("consultorio") as string
  const endereco = formData.get("endereco") as string
  
  // Validação básica
  if (!email || !password || !name) {
    throw new Error("Campos obrigatórios faltando")
  }

  const db = await getDataSource()
  const userRepo = db.getRepository(User)

  // Verifica se já existe
  const userExists = await userRepo.findOneBy({ email })
  if (userExists) {
    // Idealmente retornar erro para o front, aqui vamos apenas logar
    console.error("Usuário já existe")
    redirect(`/register?error=${encodeURIComponent("Este email já está cadastrado.")}`)
  }

  // Criptografa a senha
  const password_hash = await hash(password, 10)

  const newUser = userRepo.create({
    name,
    email,
    password_hash,
    consultorio,
    endereco,
    role: "user" as any // Default user
  })

  await userRepo.save(newUser)

  // Redireciona para login após sucesso
  redirect(`/login?message=${encodeURIComponent("Conta criada com sucesso! Faça login para continuar.")}`)
}


export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const db = await getDataSource();
  const user = await db.getRepository(User).findOneBy({ email });

  if (!user || !(await compare(password, user.password_hash))) {
    console.error("Login inválido");
    redirect(`/login?error=${encodeURIComponent("Email ou senha incorretos.")}`)
  }

  await createSession(user.id, user.role);
    if (user.role === "admin") {
        redirect("/dashboard");
    } else {
        redirect("/portal");
    }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email é obrigatório");
  }

  const db = await getDataSource();
  const userRepo = db.getRepository(User);
  const user = await userRepo.findOneBy({ email });

  if (!user) {
    // Não revelar se o email existe ou não por segurança - redirecionar como se enviado
    redirect(`/login?message=${encodeURIComponent("Se o email existir, você receberá instruções para redefinir sua senha.")}`);
  }

  // Gerar token único
  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  // Salvar no banco
  user.reset_token = resetToken;
  user.reset_token_expiry = resetTokenExpiry;
  await userRepo.save(user);

  // Enviar email
  try {
    await sendPasswordResetEmail(email, resetToken);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new Error("Erro ao enviar email de recuperação.");
  }

  redirect(`/login?message=${encodeURIComponent("Email de recuperação enviado com sucesso.")}`);
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;

  if (!password || !confirmPassword) {
    throw new Error("Todos os campos são obrigatórios");
  }

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }

  const db = await getDataSource();
  const userRepo = db.getRepository(User);
  const user = await userRepo.findOneBy({ reset_token: token });

  if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
    redirect(`/login?message=${encodeURIComponent("Token inválido ou expirado.")}`);
  }

  // Atualizar senha
  const password_hash = await hash(password, 10);
  user.password_hash = password_hash;
  user.reset_token = null;
  user.reset_token_expiry = null;
  await userRepo.save(user);

  redirect(`/login?message=${encodeURIComponent("Senha redefinida com sucesso. Você pode fazer login agora.")}`);
}