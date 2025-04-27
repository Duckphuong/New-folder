require('dotenv').config();
const sql = require('msnodesqlv8');

const connectionString = process.env.SQL_SERVER_CONNECTION_STRING;

const connection = async () => {
    return new Promise((resolve, reject) => {
        console.log(
            'Attempting to connect with connection string:',
            connectionString
        );
        sql.open(connectionString, (err, conn) => {
            if (err) {
                console.error('Disconnected from database. Error:', err);
                return reject(err);
            }

            console.log('Connected to database');
            resolve(conn);
        });
    });
};

module.exports = connection;
