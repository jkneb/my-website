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

  switch (req.method) {
    case "GET":
      return getProjects(req, res);
    case "POST":
      return createProject(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getProjects(req: NextApiRequest, res: NextApiResponse) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: { name: true },
        },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const { role, startDate, endDate, location, status, description, clientId } =
    req.body;

  if (!role || !startDate || !location || !status || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const project = await prisma.project.create({
      data: {
        role,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        status,
        description,
        ...(clientId && {
          client: {
            connect: { id: clientId },
          },
        }),
      },
      include: {
        client: true,
      },
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
}
