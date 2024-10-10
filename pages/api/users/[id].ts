import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (token) {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getUser(req, res, id as string);
    case "PUT":
      return updateUser(req, res, id as string);
    case "DELETE":
      return deleteUser(req, res, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user" });
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { email, username } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, username },
      select: { id: true, email: true, username: true },
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
}
