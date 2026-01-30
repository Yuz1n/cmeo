'use client'

import { registerUser } from "@/app/actions/auth"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

export function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error))
    }
  }, [error])

  return (
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
  )
}