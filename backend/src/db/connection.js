const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'MSI\\SQLEXPRESS',
    database: 'company_tn_hk242S',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: 'msnodesqlv8',
};

(async () => {
    try {
        await sql.connect(config);
        const result = await sql.query`select TOP 10 * from EMPLOYEE`;
        console.dir(result);
    } catch (err) {
        console.error(err);
    }
})();
