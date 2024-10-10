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
      return getProject(req, res, id as string);
    case "PUT":
      return updateProject(req, res, id as string);
    case "DELETE":
      return deleteProject(req, res, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getProject(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  }
}

async function updateProject(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const {
    role,
    company,
    images,
    text,
    startDate,
    endDate,
    location,
    links,
    status,
  } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        role,
        company,
        images,
        text,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        links,
        status,
      },
    });

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  }
}

async function deleteProject(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    await prisma.project.delete({ where: { id } });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
}
