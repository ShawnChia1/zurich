import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { getAllUsers } from "../../lib/db"; // Import your database function

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'GET') {
//     try {
//       // res.status(200).json({ message: 'API route is working!' });
//       const users = await getAllUsers();
//       res.status(200).json(users);
//     } catch (error: any) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_DATABASE:", process.env.DB_DATABASE);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log("Database connection successful!");
    await connection.end();
    res.status(200).json({ message: "Database connection successful!" });
  } catch (error: any) {
    console.error("Error connecting to database in API route:", error);
    res.status(500).json({ error: "Failed to connect to database" });
  }
}
