import { StringToBoolean } from 'class-variance-authority/types';
import mysql, { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';

interface DatabaseConfig {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

let pool: Pool | null = null;

async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

interface QueryResult extends Array<RowDataPacket[]> {}

export async function executeQuery<T = RowDataPacket>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const connection: PoolConnection = await (await getPool()).getConnection();
    const [rows] = await connection.execute<T[] & RowDataPacket[]>(query, params);
    connection.release();
    return rows;
  } catch (error: any) {
    console.error('Database query error:', error);
    throw error;
  }
}

export interface Row {
  taskName: number;
  startDate: string;
  startTime: string;
  endTime: string;
  indicator: string;
  rowCountUpdated: string;
  rowCountInserted: string;
}

export async function getAllUsers(): Promise<Row[]> {
  return executeQuery<Row>('SELECT TOP 3 * FROM [dbo].[CATEGORY_NAMES];');
}

export async function getUserById(id: number): Promise<Row | undefined> {
  const results = await executeQuery<Row>('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return results[0];
}

// Add more functions for other entities and database operations