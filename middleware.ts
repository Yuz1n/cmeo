import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// --- ÁREA SEGURA (EDGE RUNTIME) ---
// Definimos a chave e a função aqui dentro para não importar nada externo
const secret = process.env.JWT_SECRET || "secret_padrao_troque_isso";
const key = new TextEncoder().encode(secret);

async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
// ----------------------------------

export default async function middleware(request: NextRequest) {
  // 1. Tenta pegar o cookie
  const cookie = request.cookies.get("session")?.value;
  
  // 2. Verifica a sessão (sem acessar banco de dados)
  const session = cookie ? await verifySession(cookie) : null;
  
  const { pathname } = request.nextUrl;

  // 3. Regras de Redirecionamento
  
  // Se tentar acessar dashboard sem estar logado -> Login
  if (!session && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Se for usuário comum tentando acessar área admin -> Dashboard User
  // (O TypeScript pode reclamar do 'role', usamos 'any' ou verificação simples)
  if (session && (session as any).role === "user" && pathname.startsWith("/dashboard/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Otimização: Não roda o middleware em arquivos estáticos (imagens, css, js)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};