'use client'

import { useTransition } from "react";
import { deleteInvoiceAction } from "@/app/actions/admin";

export function DeleteInvoiceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm("Tem certeza que deseja excluir esta cobrança? Essa ação é irreversível.");
    
    if (confirmed) {
      startTransition(async () => {
        await deleteInvoiceAction(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
      title="Excluir cobrança"
    >
      {isPending ? (
        <span className="text-xs animate-pulse">...</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      )}
    </button>
  );
}