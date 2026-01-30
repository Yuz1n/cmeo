'use client'
import { createNewInvoice } from "@/app/actions/admin"; // Vamos criar isso no passo 4

export function CreateInvoiceForm({ users }: { users: any[] }) {
  return (
    <form action={createNewInvoice} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">Cliente</label>
        <select name="user_id" required className="w-full border rounded p-2 text-sm bg-slate-50">
          <option value="">Selecione...</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">Valor (R$)</label>
        <input name="amount" type="number" step="0.01" required className="w-full border rounded p-2 text-sm" placeholder="0.00" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">Vencimento</label>
        <input name="due_date" type="date" required className="w-full border rounded p-2 text-sm" />
      </div>
      <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-4 rounded text-sm hover:bg-slate-700 transition-colors h-[38px]">
        + Criar Cobrança
      </button>
    </form>
  )
}