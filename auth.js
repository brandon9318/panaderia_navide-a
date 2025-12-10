// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Conexión a la BD
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas (Seguridad)

// --- REGISTRO DE USUARIO ---
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    // 1. Validaciones del Servidor (Requerimiento) -bynd
    if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos chintrolas' });
    }

    try {
        // 2. Verificar si ya existe el correo
        const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ success: false, message: 'Ese correo ya está registrado, niggi' });
        }

        // 3. Encriptar contraseña (Seguridad) -bynd
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Guardar en Base de Datos (Rol cliente por defecto y 0 fondos)
        await pool.query('INSERT INTO usuarios (nombre, email, password, rol, fondos) VALUES (?, ?, ?, ?, ?)', 
            [nombre, email, hashedPassword, 'cliente', 0]
        );

        res.json({ success: true, message: '¡Registro exitoso! Ahora inicia sesión 😺' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en el servidor al registrar' });
    }
});

// --- INICIO DE SESIÓN (LOGIN) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario
        const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Correo no encontrado 😿' });
        }

        const usuario = users[0];

        // 2. Comparar contraseña encriptada (Seguridad) -bynd
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // 3. Crear la SESIÓN (Requerimiento) -bynd
        req.session.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            fondos: usuario.fondos
        };

        res.json({ 
            success: true, 
            message: '¡Bienvenido tvhin!', 
            user: req.session.user 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    }
});

// --- CERRAR SESIÓN (LOGOUT) ---
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: 'Sesión cerrada. Bye bye! 😺' });
    });
});

// --- OBTENER USUARIO ACTUAL (Para el Frontend) ---
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false, user: null });
    }
});

module.exports = router;
// Te quiero -bynd