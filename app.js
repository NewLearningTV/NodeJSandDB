const { Pool } = require('pg');
const config = require('./config').db;

const pool = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database
});

// 데이터베이스를 연결할 수 있는지 확인하는 테스트
pool.query('SELECT NOW();', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Connection successful! 연결이 성공적이었습니다!');
        // If you want to send a status 200, you would typically do this in a web server context.
        // In a script, you can just indicate success as shown.
    }
    pool.end();
});

