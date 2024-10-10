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

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getClient(req, res, id as string);
    case "PUT":
      return updateClient(req, res, id as string);
    case "DELETE":
      return deleteClient(req, res, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getClient(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { projects: true },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching client" });
  }
}

async function updateClient(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const { name, logo } = req.body;

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        logo,
      },
    });

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating client" });
  }
}

async function deleteClient(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    await prisma.client.delete({ where: { id } });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting client" });
  }
}
