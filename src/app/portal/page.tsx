import { getSession } from "@/lib/session";
import { getDataSource } from "@/lib/db";
import { Invoice } from "@/entities/Invoice";
import { redirect } from "next/navigation";
import { UploadReceiptForm } from "./upload-form"; // Vamos criar esse componente abaixo
import { Event } from "@/entities/Event"; // Importar
import { DownloadButton } from "./download-button";

export default async function UserPortal() {
  const session = await getSession();
  if (!session || session.role !== "user") redirect("/login");

  const db = await getDataSource();
  const invoiceRepo = db.getRepository(Invoice);

  // Busca apenas as faturas DESSE usuário
  const invoices = await invoiceRepo.find({
    where: { user: { id: session.userId } },
    order: { due_date: "ASC" } // Vencimentos mais próximos primeiro
  });

  // NOVO: Buscar Eventos DESTE usuário
  const events = await db.getRepository(Event).find({
    where: { user: { id: session.userId } },
    order: { start_time: "ASC" }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cabeçalho Corporativo Simples */}
      <header className="bg-blue-900 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">CMEO <span className="text-sm font-normal opacity-80">| Área do Cliente</span></h1>
          <form action={async () => {
            'use server';
            const { deleteSession } = await import("@/lib/session");
            await deleteSession();
            redirect("/login");
          }}>
            <button className="text-sm hover:underline text-blue-200">Sair</button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        {/* SEÇÃO AGENDA (NOVO) */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Próximos Compromissos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.length === 0 ? (
               <p className="text-slate-500 text-sm">Nenhum agendamento encontrado.</p>
            ) : events.map(evt => (
              <div key={evt.id} className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-600">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {new Date(evt.start_time).getDate()}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                    {new Date(evt.start_time).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800">{evt.title}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  🕒 {new Date(evt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {evt.location && (
                  <p className="text-xs text-slate-400 mt-2">📍 {evt.location}</p>
                )}
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Suas Faturas</h2>
          <p className="text-slate-500 mb-6 text-sm">Visualize seus pagamentos pendentes e envie os comprovantes.</p>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
            {invoices.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                Você não possui faturas pendentes.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    
                    {/* Informações da Fatura */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-slate-800">
                          R$ {Number(inv.amount).toFixed(2)}
                        </span>
                        <StatusBadge status={inv.status} />
                      </div>
                      <p className="text-sm text-slate-500">
                        Vencimento: <span className="font-medium text-slate-700">{new Date(inv.due_date).toLocaleDateString()}</span>
                      </p>
                      
                      {/* Link para Baixar a NF-e se o admin já tiver subido */}
                      {inv.nfe_url && (
                        <DownloadButton invoiceId={inv.id} filename="nota-fiscal.pdf" />
                      )}

                      {/* Link para Baixar o Comprovante enviado pelo usuário */}
                      {inv.receipt_url && (
                        <a href={inv.receipt_url} target="_blank" className="text-xs text-green-600 hover:underline mt-2 inline-block font-medium ml-4">
                          📎 Ver Comprovante Enviado
                        </a>
                      )}
                    </div>

                    {/* Ação do Usuário (Upload) */}
                    <div className="w-full md:w-auto">
                      {inv.status === "PENDING" && (
                        <UploadReceiptForm invoiceId={inv.id} />
                      )}
                      
                      {inv.status === "PAID" && (
                        <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                          ✓ Quitado
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// Componente visual simples para o status
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-red-100 text-red-700 border-red-200",
    PAID: "bg-green-100 text-green-700 border-green-200",
  };
  
  const labels = {
    PENDING: "Pendente",
    PAID: "Pago",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof styles]}
    </span>
  );
}