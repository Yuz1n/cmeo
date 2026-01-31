import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET || "secret_padrao_troque_isso";
const key = new TextEncoder().encode(secret);

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}