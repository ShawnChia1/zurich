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
  params: Record<string, any> = {}
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters if provided
    for (const paramName in params) {
      request.input(paramName, params[paramName]);
    }

    const result: IResult<T> = await request.query(query);

    return result.recordset;
  } catch (error: any) {
    console.error('Database query error:', error);
    throw error;
  }
}

export interface Extension {
  item: number;
  eventName: string;
  venue: string;
  eventDate: Date;
  sumInsuredPerPerson: number;
}

export async function getAllExtensions(): Promise<Extension[]> {
  return executeQuery<Extension>('SELECT * FROM [dbo].[Extension_Test]');
}

export async function insertExtensions(extensions: Extension[]): Promise<number[]> {
  const query = `
    INSERT INTO [dbo].[Extension_Test] (item, eventName, venue, eventDate, sumInsuredPerPerson)
    VALUES ${extensions.map(
      (_, index) => `(@item${index}, @eventName${index}, @venue${index}, @eventDate${index}, @sumInsuredPerPerson${index})`
    ).join(', ')};
    SELECT SCOPE_IDENTITY() AS id;
  `;

  try {
    const params: Record<string, any> = {};
    extensions.forEach((extension, index) => {
      params[`item${index}`] = extension.item;
      params[`eventName${index}`] = extension.eventName;
      params[`venue${index}`] = extension.venue;
      params[`eventDate${index}`] = extension.eventDate;
      params[`sumInsuredPerPerson${index}`] = extension.sumInsuredPerPerson;
    });

    const result = await executeQuery<{ id: number }>(query, params);
    if(result && result.length > 0){
        // return the id of the first inserted row.
        return [result[0].id];
    } else {
        return [];
    }

  } catch (error) {
    console.error('Error inserting extensions:', error);
    throw error;
  }
}