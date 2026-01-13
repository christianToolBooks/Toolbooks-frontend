import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_SECRET = process.env.COOKIE_SECRET;

export function signValue(value: string): string {
  if (!COOKIE_SECRET) {
    throw new Error("COOKIE_SECRET environment variable is not defined");
  }
  const signature = createHmac("sha256", COOKIE_SECRET)
    .update(value)
    .digest("hex");
  return `${value}.${signature}`;
}

export function verifySignedValue(signedValue: string | undefined): boolean {
  if (!signedValue || !COOKIE_SECRET) return false;
  
  const parts = signedValue.split(".");
  if (parts.length !== 2) return false;
  
  const [value, signature] = parts;
  
  const expectedSignature = createHmac("sha256", COOKIE_SECRET)
    .update(value)
    .digest("hex");
  
  return signature === expectedSignature && value === "true";
}

export async function setSignedCookie(name: string, value: string = "true") {
  const cookieStore = await cookies();
  const signedValue = signValue(value);
  
  cookieStore.set({
    name,
    value: signedValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 año
  });
}

export async function verifySignedCookie(name: string): Promise<boolean> {
  try {
    if (!COOKIE_SECRET) {
      console.error("COOKIE_SECRET is not defined");
      return false;
    }

    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    
    if (!cookie) return false;
    
    return verifySignedValue(cookie.value);
  } catch (error) {
    console.error(`Error verificando cookie ${name}:`, error);
    return false;
  }
}