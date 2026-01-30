'use client'

import { useState } from "react";
import { uploadReceipt } from "@/app/actions/finance"; // Vamos criar essa action no próximo passo
import toast from "react-hot-toast";

export function UploadReceiptForm({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(formData: FormData) {
    setLoading(true);
    // Adiciona o ID da fatura no FormData que vai pro servidor
    formData.append("invoice_id", invoiceId);
    
    try {
      await uploadReceipt(formData);
      toast.success("Comprovante enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar comprovante. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <form action={handleUpload} className="flex flex-col md:flex-row items-end md:items-center gap-2">
      <div className="relative group">
        <label className="block text-xs font-medium text-slate-500 mb-1 group-hover:text-blue-700">
          Anexar Comprovante
        </label>
        <input 
          required 
          name="receipt_file" 
          type="file" 
          accept="image/*,.pdf"
          className="block w-full text-xs text-slate-500
            file:mr-2 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-xs file:font-semibold
            file:bg-slate-100 file:text-slate-700
            hover:file:bg-slate-200 cursor-pointer"
        />
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="bg-blue-900 text-white text-xs font-bold py-2 px-4 rounded hover:bg-blue-800 disabled:opacity-50 transition-colors h-9 cursor-pointer"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  )
}