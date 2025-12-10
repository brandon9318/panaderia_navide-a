const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    // Aquí está el truco: Si existe una variable de entorno, úsala. Si no, usa localhost.
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'n0m3l0',
    database: process.env.DB_NAME || 'panaderia_navidena',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Base de Datos conectada exitosamente');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a la BD:', error.message);
    });

module.exports = pool;