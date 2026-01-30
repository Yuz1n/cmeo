import { RegisterForm } from "./register-form";
import { Suspense } from "react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Lado Esquerdo - Branding (Visual Corporativo) */}
        <div className="hidden md:flex md:w-1/3 bg-blue-900 p-8 flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">CMEO</h1>
            <p className="text-blue-200 text-sm mt-2">Gestão Médica Inteligente</p>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-blue-100 opacity-80">
              "Organize seu consultório com segurança e eficiência."
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Crie sua conta</h2>
            <p className="text-sm text-slate-500 mt-1">Preencha seus dados profissionais</p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-500">
              Já possui cadastro?{" "}
              <Link href="/login" className="text-blue-900 font-bold hover:underline">
                Acessar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}