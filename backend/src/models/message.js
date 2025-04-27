const sql = require('msnodesqlv8');
require('dotenv').config();
const connectionString = process.env.SQL_SERVER_CONNECTION_STRING;

const query = (sqlQuery, params = []) => {
    return new Promise((resolve, reject) => {
        sql.query(connectionString, sqlQuery, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const Mess = {
    create: async (data) => {
        const { name, email, mess, role } = data;
        const sqlQuery = `INSERT INTO Mess (name, email, mess, role) VALUES (?, ?, ?, ?)`;
        return await query(sqlQuery, [name, email, mess, role]);
    },

    findAll: async () => {
        return await query(`SELECT id, name, email, mess, role FROM Mess`);
    },
};

module.exports = Mess;
