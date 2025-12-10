const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// IMPORTANTE: Middleware para parsear JSON (para futuras APIs)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde 'public'
// ESTO DEBE IR ANTES de cualquier ruta app.get()
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (OPCIONAL, porque express.static ya sirve index.html)
// Solo si quieres forzar el index.html para rutas no encontradas:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'public')}`);
});