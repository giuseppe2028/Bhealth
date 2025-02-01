import { Pool } from 'pg';

require('dotenv').config();

const db = new Pool({
    user: process.env.DB_USER, // Database username
    host: process.env.DB_HOST, // Database host
    database: process.env.DB_NAME, // Database name
    password: process.env.DB_PASSWORD, // Database password
    port: Number(process.env.DB_PORT), // Converte la porta in numero , // Database port (default for PostgreSQL)
});
// Test connection
if (process.env.NODE_ENV !== 'test') {
    db.connect()
        .then(() => {
            console.log('Connected to the database');
            return db.query('SELECT NOW()');
        })
        .then(result => {
            console.log('Date and hour:', result.rows[0].now.toLocaleString());
        })
        .catch(err => {
            console.error('Error during connection to db:', err);
        });
}

export default db;
