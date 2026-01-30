import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        
        <div className="bg-blue-900 p-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">CMEO</h1>
          <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Portal do Associado</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Bem-vindo de volta</h2>
          
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm">
              Não tem acesso?{" "}
              <Link href="/register" className="text-blue-900 font-bold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}