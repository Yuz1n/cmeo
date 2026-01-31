'use server'

import { getDataSource } from "@/lib/db";
import { Invoice, InvoiceStatus } from "@/entities/Invoice";
import { uploadToR2 } from "@/lib/r2";
import { revalidatePath } from "next/cache";

export async function uploadReceipt(formData: FormData) {
  const file = formData.get("receipt_file") as File;
  const invoiceId = formData.get("invoice_id") as string;

  if (!file || file.size === 0 || !invoiceId) return;

  // Primeiro, busca a fatura para obter o userId
  const db = await getDataSource();
  const invoiceRepo = db.getRepository(Invoice);
  const invoice = await invoiceRepo.findOne({
    where: { id: invoiceId },
    relations: ['user']
  });

  if (!invoice) return;

  // Upload para R2
  const fileName = `comprovante pagamento-${Date.now()}-${file.name}`;
  const fileUrl = await uploadToR2(file, invoice.user.id, fileName);

  // Atualizar o banco de dados
  invoice.receipt_url = fileUrl;
  invoice.status = InvoiceStatus.PAID; // Considera pago quando usuário envia comprovante
  await invoiceRepo.save(invoice);

  // 3. Atualiza a tela do usuário
  revalidatePath("/portal");
}