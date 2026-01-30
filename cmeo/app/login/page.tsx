'use client'

import Link from "next/link";
import { login } from "@/app/actions/auth";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  useEffect(() => {
    if (message) {
      toast.success(decodeURIComponent(message));
    }
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [message, error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        
        <div className="bg-blue-900 p-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">CMEO</h1>
          <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Portal do Associado</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Bem-vindo de volta</h2>
          
          {/* 2. IMPORTANTE: Adicione action={login} aqui */}
          <form action={login} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
              {/* 3. IMPORTANTE: O name="email" deve bater com o formData.get("email") */}
              <input 
                name="email" 
                type="email" 
                required
                className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase">Senha</label>
                <a href="/forgot-password" className="text-xs text-blue-900 hover:underline">Esqueceu?</a>
              </div>
              {/* 3. IMPORTANTE: O name="password" deve bater com o formData.get("password") */}
              <input 
                name="password" 
                type="password" 
                required
                className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded transition-colors shadow-lg"
            >
              Entrar
            </button>
          </form>

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