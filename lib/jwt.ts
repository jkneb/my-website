import { SignJWT, jwtVerify } from "jose";

export async function signToken(userId: string): any {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export async function verifyToken(token: string): any {
  try {
    const payload = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
