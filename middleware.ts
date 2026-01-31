import { NextResponse } from "next/server.js";
import type { NextRequest } from "next/server.js";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET || "secret_padrao_troque_isso");

async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export default async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;
  const { pathname } = request.nextUrl;

  // 1. Regra de Redirecionamento da Home
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Proteção de rotas do Dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Proteção de rotas de Admin
  if (
    session?.role === "user" && 
    pathname.startsWith("/dashboard/admin")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ADICIONEI '/' AQUI PARA O MIDDLEWARE RODAR NA HOME
  matcher: ["/", "/dashboard/:path*", "/portal/:path*"],
};