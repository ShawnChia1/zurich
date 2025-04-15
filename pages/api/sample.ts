import type { NextApiRequest, NextApiResponse } from "next";
import { getSampleData } from "@/lib/db";
import { Task } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const tasks = await getSampleData();
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(tasks);
    } catch (error: any) {
      console.error("Error fetching extensions:", error);
      res.status(500).json({
        error: "Failed to fetch extensions",
        detail: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}