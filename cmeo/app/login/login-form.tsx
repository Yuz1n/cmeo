'use client'

import { login } from "@/app/actions/auth";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function LoginForm() {
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
    <form action={login} className="space-y-5">
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
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
  )
}