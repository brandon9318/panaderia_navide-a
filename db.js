const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión
// Render nos dará una variable llamada INTERNAL_DATABASE_URL o DATABASE_URL
const connectionString = process.env.INTERNAL_DATABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    // SSL es necesario para Render, pero no para localhost (usualmente)
    ssl: connectionString ? { rejectUnauthorized: false } : false
});

pool.connect()
    .then(client => {
        console.log('✅ Conectado exitosamente a PostgreSQL');
        client.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a la BD:', err.message);
        // Nota: Si estás en local y no tienes Postgres instalado, esto fallará, 
        // pero funcionará en la nube.
    });

module.exports = pool;