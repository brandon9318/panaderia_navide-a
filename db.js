const mysql = require('mysql2/promise'); // <--- ¡ESTA LÍNEA FALTABA! -bynd
require('dotenv').config(); 

// aaa ahora sí, creamos el pool de conexiones -bynd
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'n0m3l0', // Tu contraseña
    database: 'panaderia_navidena', // La base de datos nueva
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ey probamos que la conexión jale al inicio -bynd
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de Datos conectada chidoteee');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Chincheros, error conectando a la BD:', error.message);
    });

module.exports = pool;