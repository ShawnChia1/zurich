import { StringToBoolean } from 'class-variance-authority/types';
import mysql, { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';

interface DatabaseConfig {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
}

const dbConfig: DatabaseConfig = {
  host: "sg-np-wbsq-sql-z01.database.windows.net",
  user: "WBSQLADMIN",
  password: "Workbench@2024",
  database: "ZSGWBUAT"
};

let pool: Pool | null = null;

async function getPool(): Promise<Pool> {
  if (!pool) {
    console.log("DB Config being used:", dbConfig);
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
  taskName: string;
  startDate: Date;
  startTime: string;
  endTime: string;
  indicator: number;
  rowCountUpdated: number;
  rowCountInserted: number;
  id: number
}

export async function getAllUsers(): Promise<Row[]> {
  //console.log(dbConfig["host"]);
  return executeQuery<Row>('SELECT TOP 3 * FROM [dbo].[AUDIT_PACKAGE];');
}

export async function getUserById(id: number): Promise<Row | undefined> {
  const results = await executeQuery<Row>('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return results[0];
}

// Add more functions for other entities and database operations