'use client'
import { uploadNfe } from "@/app/actions/admin";
import { useState } from "react";
import toast from "react-hot-toast";

export function AdminNfeUpload({ invoice }: { invoice: any }) {
  const [loading, setLoading] = useState(false);

  if (invoice.nfe_url) {
    return (
      <div className="flex flex-col gap-1">
        <a href={invoice.nfe_url} target="_blank" className="text-xs font-bold text-green-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Visualizar NFE
        </a>
        {invoice.receipt_url && (
          <a href={invoice.receipt_url} target="_blank" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Ver Comprovante
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={async (formData) => {
      setLoading(true);
      try {
        await uploadNfe(formData);
        toast.success("NFE enviada com sucesso!");
      } catch (error) {
        toast.error("Erro ao enviar NFE. Tente novamente.");
      }
      setLoading(false);
    }}>
      <input type="hidden" name="invoice_id" value={invoice.id} />
      <div className="flex items-center gap-2">
        <label className="cursor-pointer text-slate-700 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 hover:bg-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5"></path>
            <path d="M5 12l7-7 7 7"></path>
          </svg>
          <input 
            type="file" 
            name="nfe_file" 
            accept=".pdf,image/*" 
            className="hidden" 
            onChange={(e) => e.target.form?.requestSubmit()} 
          />
        </label>
        {loading && <span className="text-xs text-slate-400">...</span>}
      </div>
    </form>
  )
}