import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">

        <div className="bg-blue-900 p-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">CMEO</h1>
          <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Portal do Associado</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Redefinir Senha</h2>
          <p className="text-slate-600 text-sm text-center mb-6">
            Digite sua nova senha abaixo.
          </p>

          <form action={resetPassword} className="space-y-5">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Nova Senha</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Confirmar Nova Senha</label>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded transition-colors shadow-lg"
            >
              Redefinir Senha
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-blue-900 font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}