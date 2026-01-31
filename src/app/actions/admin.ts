'use server'

import { getDataSource } from "@/lib/db";
import { Invoice } from "@/entities/Invoice";
import { InvoiceStatus } from "@/lib/enums";
import { createSession, getSession } from "@/lib/session";
import { User } from "@/entities/User";
import { revalidatePath } from "next/cache";
import { uploadToR2 } from "@/lib/r2";

// 1. CRIAR NOVA COBRANÇA
export async function createNewInvoice(formData: FormData) {
  const userId = formData.get("user_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const dueDate = formData.get("due_date") as string;

  const db = await getDataSource();
  const user = await db.getRepository(User).findOneBy({ id: userId });

  if (!user) return;

  const invoice = db.getRepository(Invoice).create({
    user,
    amount,
    due_date: dueDate,
    status: InvoiceStatus.PENDING
  });

  await db.getRepository(Invoice).save(invoice);
  revalidatePath("/dashboard");
}

// 2. UPLOAD DE NF-E (E CONFIRMAR PAGAMENTO)
export async function uploadNfe(formData: FormData) {
  const file = formData.get("nfe_file") as File;
  const invoiceId = formData.get("invoice_id") as string;

  if (!file || file.size === 0) return;

  // Primeiro, busca a fatura para obter o userId
  const db = await getDataSource();
  const invoiceRepo = db.getRepository(Invoice);
  const invoice = await invoiceRepo.findOne({
    where: { id: invoiceId },
    relations: ['user']
  });

  if (!invoice) return;

  // Upload para R2
  const fileName = `NFE-${Date.now()}-${file.name}`;
  const fileUrl = await uploadToR2(file, invoice.user.id, fileName);

  // Atualiza Banco
  invoice.nfe_url = fileUrl;
  // Não muda status aqui, pois o pago é quando o usuário envia o comprovante
  await invoiceRepo.save(invoice);

  revalidatePath("/dashboard");
}


export async function deleteInvoiceAction(invoiceId: string) {
  const session = await getSession();
  
  // 1. Segurança: Apenas admins podem deletar
  if (!session || session.role !== "admin") {
    return { error: "Não autorizado" };
  }

  try {
    const db = await getDataSource();
    const repo = db.getRepository(Invoice);

    // 2. Executa a exclusão no Banco
    await repo.delete(invoiceId);

    // 3. Atualiza a tela automaticamente (MUITO IMPORTANTE)
    // Isso faz o Next.js recarregar os dados da página /admin sem refresh total
    revalidatePath("/admin"); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return { error: "Erro ao excluir cobrança." };
  }
}