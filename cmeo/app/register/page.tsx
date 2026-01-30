'use client'

import { registerUser } from "@/app/actions/auth"
import Link from "next/link"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error))
    }
  }, [error])

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

          <form action={registerUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Nome Completo</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Consultório (Nome)</label>
                <input name="consultorio" type="text" className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Endereço Completo</label>
              <input name="endereco" type="text" className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Email Corporativo</label>
              <input required name="email" type="email" className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Senha</label>
              <input required name="password" type="password" className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" />
            </div>

            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded mt-6 transition-colors shadow-lg">
              Registrar Profissional
            </button>
          </form>

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