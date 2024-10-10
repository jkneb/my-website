import { JWTPayload, SignJWT, jwtVerify } from "jose";

export async function signToken(userId: string): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
