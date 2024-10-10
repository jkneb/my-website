import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Destroy the token cookie
  destroyCookie({ res }, "token", {
    path: "/",
  });

  return res.status(200).json({ message: "Logout successful" });
}
