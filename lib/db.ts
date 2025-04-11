import sql, { ConnectionPool, config as SqlConfig, IResult } from 'mssql';

const dbConfig: SqlConfig = {
  server: 'sg-np-wbsq-sql-z01.database.windows.net',
  user: 'WBSQLADMIN',
  password: 'Workbench@2024',
  database: 'ZSGWBUAT',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

let pool: ConnectionPool | null = null;

async function getPool(): Promise<ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
  return pool;
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters if provided
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });

    const result: IResult<T> = await request.query(
      params.length > 0
        ? query.replace(/\?/g, (_, i = 0) => `@param${i++}`)
        : query
    );

    return result.recordset;
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
  id: number;
}

export async function getAllUsers(): Promise<Row[]> {
  return executeQuery<Row>('SELECT TOP 3 * FROM [dbo].[AUDIT_PACKAGE]');
}

export async function getUserById(id: number): Promise<Row | undefined> {
  const results = await executeQuery<Row>(
    'SELECT id, name, email FROM users WHERE id = ?',
    [id]
  );
  return results[0];
}