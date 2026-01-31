import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// IMPORTAÇÃO SEGURA: Só usamos o arquivo isolado
import { verifySession } from "@/lib/auth-edge";

export default async function middleware(request: NextRequest) {
  // 1. Tenta pegar o cookie de sessão
  const cookie = request.cookies.get("session")?.value;
  
  // 2. Verifica a sessão usando a função isolada
  const session = cookie ? await verifySession(cookie) : null;
  
  const { pathname } = request.nextUrl;

  // 3. Regras de Proteção
  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  // Se tentar acessar dashboard sem logar -> Manda pro Login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se já estiver logado e tentar ir pro Login -> Manda pro Dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se for user comum tentando acessar admin -> Manda pro Dashboard
  if (session && (session as any).role === "user" && pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Otimização: Ignora arquivos estáticos para não rodar middleware à toa
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};