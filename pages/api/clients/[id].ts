import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (token) {
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
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
      include: {
        projects: {
          select: {
            id: true,
            role: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
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

  if (!name || !logo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

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
    await prisma.client.delete({
      where: { id },
    });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting client" });
  }
}
