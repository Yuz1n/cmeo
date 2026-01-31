import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// --- LÓGICA INTERNA (Sem importações externas) ---
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
// ------------------------------------------------

export default async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await verifySession(cookie) : null;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  // 1. Proteger Dashboard (Se não logado -> Login)
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Redirecionar Login (Se já logado -> Dashboard)
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Proteger Admin (Se user comum -> Dashboard)
  if (session && (session as any).role === "user" && pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};