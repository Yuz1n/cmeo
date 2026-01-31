import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// --- CONFIGURAÇÃO MANUAL (Para não depender de arquivos externos) ---
const JWT_SECRET = process.env.JWT_SECRET || "secret_padrao_troque_isso";
const key = new TextEncoder().encode(JWT_SECRET);

// Recriamos a verificação aqui para não importar nada do 'lib/session' ou 'db'
async function verifySessionPure(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
// -------------------------------------------------------------------

export default async function middleware(request: NextRequest) {
  // 1. Pega o cookie manualmente
  const cookie = request.cookies.get("session")?.value;
  
  // 2. Verifica a sessão sem acessar banco de dados
  const session = cookie ? await verifySessionPure(cookie) : null;
  
  const { pathname } = request.nextUrl;

  // Rotas que precisamos verificar
  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/portal");
  const isLoginPage = pathname === "/login";

  // CASO 1: Usuário não logado tentando acessar área restrita
  if ((isDashboard || isPortal) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASO 2: Usuário já logado tentando acessar página de login
  if (isLoginPage && session) {
    // Redireciona baseada na role que está salva no TOKEN (não no banco)
    const role = (session as any).role;
    
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // CASO 3: Usuário comum tentando acessar área de admin
  if (pathname.startsWith("/dashboard") && session) {
    const role = (session as any).role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // O matcher diz onde o middleware deve rodar (ignora arquivos estáticos e api)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};