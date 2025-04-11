const sql = require('mssql');

const config = {
  user: 'WBSQLADMIN',
  password: 'Workbench@2024',
  server: 'sg-np-wbsq-sql-z01.database.windows.net',
  database: 'ZSGWBUAT',
  port: 1433,
  options: {
    encrypt: true, // required by Azure
    trustServerCertificate: false,
  },
};

(async () => {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL!');

    // Optional: simple query test
    const result = await pool.request().query('SELECT TOP 1 name FROM sys.tables');
    console.log('Result:', result.recordset);

    await sql.close();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
})();
