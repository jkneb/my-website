import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { jwtVerify } from "jose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  switch (req.method) {
    case "GET":
      return getClients(req, res);
    case "POST":
      return createClient(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getClients(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching clients" });
  }
}

async function createClient(req: NextApiRequest, res: NextApiResponse) {
  const { name, logo } = req.body;

  try {
    const client = await prisma.client.create({
      data: {
        name,
        logo,
      },
    });

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating client" });
  }
}
