import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { setCookie } from "nookies";
import { signToken, verifyToken } from "../../../lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (token) {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user with the given email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = await signToken(user.id);

    // Set the JWT as an HTTP-only cookie
    setCookie({ res }, "token", token, {
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
}
