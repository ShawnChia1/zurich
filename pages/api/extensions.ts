import type { NextApiRequest, NextApiResponse } from "next";
import { getAllExtensions, insertExtensions, Extension } from "../../lib/db"; // Import insertExtensions and Extension

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const extensions = await getAllExtensions();
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(extensions);
    } catch (error: any) {
      console.error('Error fetching extensions:', error);
      res.status(500).json({
        error: 'Failed to fetch extensions',
        detail: error.message,
      });
    }
  } else if (req.method === 'POST') {
    try {
      const extensions: Extension[] = req.body; // Assuming the request body contains an array of Extension objects.

      if (!Array.isArray(extensions) || extensions.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty extensions array in request body' });
      }

      const insertedIds = await insertExtensions(extensions);
      res.status(201).json({ insertedIds }); // Respond with the inserted IDs.
    } catch (error: any) {
      console.error('Error inserting extensions:', error);
      res.status(500).json({
        error: 'Failed to insert extensions',
        detail: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}