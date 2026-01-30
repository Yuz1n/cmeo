import { getSession } from "@/lib/session";
import { getDataSource } from "@/lib/db";
import { Invoice } from "@/src/entities/Invoice";
import { User } from "@/src/entities/User";
import { Event } from "@/src/entities/Event";
import { redirect } from "next/navigation";
import { CreateInvoiceForm } from "./create-invoice-form";
import { AdminNfeUpload } from "./admin-nfe-upload";
import { AdminCalendar } from "./admin-calendar";
import { DeleteInvoiceButton } from "./admin-delete-invoice-button";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/portal");

  const db = await getDataSource();

  // 1. DADOS FINANCEIROS
  const rawInvoices = await db.getRepository(Invoice).find({
    relations: ["user"],
    order: { created_at: "DESC" }
  });

  // 2. DADOS DE AGENDA (BUSCAR TUDO)
  const rawEvents = await db.getRepository(Event).find({
    relations: ["user"],
    order: { start_time: "ASC" }
  });
  
  // 3. USUÁRIOS
  const rawUsers = await db.getRepository(User).find({ where: { role: "user" } as any });

  // HIGIENIZAÇÃO (TypeORM -> JSON Puro)
  const invoices = JSON.parse(JSON.stringify(rawInvoices));
  const events = JSON.parse(JSON.stringify(rawEvents));
  const users = JSON.parse(JSON.stringify(rawUsers));

  // ... (MANTENHA OS CÁLCULOS FINANCEIROS AQUI IGUAIS AO ANTERIOR) ...
  const totalRecebido = invoices.filter((i: any) => i.status === "PAID").reduce((acc: any, curr: any) => acc + Number(curr.amount), 0);
  const totalPendente = invoices.filter((i: any) => i.status === "PENDING").reduce((acc: any, curr: any) => acc + Number(curr.amount), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header (Mantido) */}
      <header className="bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CMEO <span className="text-blue-400 text-sm">| Admin</span></h1>
          <form action={async () => { 'use server'; const { deleteSession } = await import("@/lib/session"); await deleteSession(); redirect("/login"); }}>
            <button className="text-sm hover:text-red-300">Sair</button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        
        {/* SEÇÃO 1: CALENDÁRIO & AGENDA (NOVO) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Calendário</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Gestão de Consultas</span>
          </div>
          <AdminCalendar events={events} users={users} />
        </section>

        <hr className="border-slate-200" />

        {/* SEÇÃO 2: FINANCEIRO (O QUE JÁ EXISTIA) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
          </div>
          
          {/* CARDS DE RESUMO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
              <p className="text-xs text-slate-500 font-bold uppercase">Recebido</p>
              <p className="text-2xl font-bold text-slate-800">R$ {totalRecebido.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
              <p className="text-xs text-slate-500 font-bold uppercase">Pendente</p>
              <p className="text-2xl font-bold text-slate-800">R$ {totalPendente.toFixed(2)}</p>
            </div>
          </div>

          {/* FORMULÁRIO E TABELA */}
          <div className="bg-white p-6 rounded shadow mb-8">
            <h3 className="font-bold mb-4">Nova Cobrança</h3>
            <CreateInvoiceForm users={users} />
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{inv.user.name}</td>
                    <td className="p-4">R$ {Number(inv.amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`font-bold text-xs px-2 py-1 rounded ${
                        inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <AdminNfeUpload invoice={inv} />
                      <DeleteInvoiceButton id={inv.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  )
}