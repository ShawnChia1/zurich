import sql, { ConnectionPool, config as SqlConfig, IResult } from 'mssql';
import { Extension, Task } from '@/lib/types'
import { types } from 'util';

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

export async function getSampleData(): Promise<Task[]> {
  return executeQuery<Task>('SELECT * FROM [dbo].[Sample_Table]');
}

export async function getAllExtensions(): Promise<Extension[]> {
  return executeQuery<Extension>('SELECT * FROM [dbo].[Extension_Test]');
}

export async function insertExtensions(extensions: Extension[]): Promise<number[]> {
  const columns: string[] = [
    'Item', 'EventName', 'Venue', 'EventDate', 'SumInsuredPerPerson', 'NoOfParticipants', 'PremiumRatePerParticipant', 'TotalPremium'
  ];
  const presentColumns: string[] = columns.filter(column => column in extensions[0]).concat('ColumnOrder');
  const valuesPlaceholders = extensions.map(
    (_, index) => `(${presentColumns.map(column => `@${column}${index}`).join(', ').trim()})`
  ).join(', ').trim();
  const query = `DROP TABLE IF EXISTS [dbo].[Extension_Test]; CREATE TABLE [dbo].[Extension_Test] (
    ${presentColumns.map(column => column + ' VARCHAR(255)').join(", ").trim()});
    INSERT INTO [dbo].[Extension_Test] (${presentColumns.join(', ').trim()})
    VALUES ${valuesPlaceholders};
  `;

  // console.log("hello\n" + query);

  try {
    const params: Record<string, any> = {};
    extensions.forEach((extension, index) => {
      // console.log("noOfParticipants: " + extension.NoOfParticipants);
      if (extension.Item !== undefined) {
        params[`Item${index}`] = extension.Item;
      }
      if (extension.EventName !== undefined) {
        params[`EventName${index}`] = extension.EventName;
      }
      if (extension.Venue !== undefined) {
        params[`Venue${index}`] = extension.Venue;
      }
      if (extension.EventDate !== undefined) {
        params[`EventDate${index}`] = extension.EventDate;
      }
      if (extension.SumInsuredPerPerson !== undefined) {
        params[`SumInsuredPerPerson${index}`] = extension.SumInsuredPerPerson;
      }
      if (extension.NoOfParticipants !== undefined) {
        params[`NoOfParticipants${index}`] = extension.NoOfParticipants;
      }
      if (extension.PremiumRatePerParticipant !== undefined) {
        params[`PremiumRatePerParticipant${index}`] = extension.PremiumRatePerParticipant;
      }
      if (extension.TotalPremium !== undefined) {
        console.log("totalPremium: ", extension.TotalPremium);
        params[`TotalPremium${index}`] = extension.TotalPremium;
      }
      params[`ColumnOrder${index}`] = extension.ColumnOrder;
    });

    console.log("params:\n", params);

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