// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// SEGREDO: Usamos uma string fixa como fallback se a env falhar no Edge
const secret = process.env.JWT_SECRET || "secret_padrao_troque_isso";
const key = new TextEncoder().encode(secret);

export default async function middleware(request: NextRequest) {
  try {
    const cookie = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // Se não tiver cookie, null. Se tiver, tenta verificar.
    let session = null;
    if (cookie) {
      try {
        const { payload } = await jwtVerify(cookie, key, { algorithms: ["HS256"] });
        session = payload;
      } catch (err) {
        // Se o token for inválido, apenas ignoramos (usuário não logado)
        session = null;
      }
    }

    // Proteção de rotas do Dashboard
    if (!session && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Proteção de rotas de Admin
    if (session?.role === "user" && pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
    
  } catch (error) {
    // Se o middleware falhar, não derrube o site. Deixe passar e a página trata o erro.
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  // Matcher otimizado para não rodar em arquivos estáticos, imagens, etc.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};