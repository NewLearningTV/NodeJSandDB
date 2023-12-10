const { Pool } = require('pg');
const config = require('./config').db;

const pool = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database
});

const dropTableIfExists = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS movie;');
        console.log('Table "movie" dropped successfully.');
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
};

async function main() {
    try {
        await dropTableIfExists();
    } catch (err) {
        console.error('An error occurred:', err.message);
    } finally {
        pool.end();
    }
}

main();