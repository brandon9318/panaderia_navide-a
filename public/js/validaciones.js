// public/js/validacion.js

// Límite de fondos permitido
const MAX_FUNDS = 999999999999;

// Objeto con reglas de validación
const validator = {
    // Verifica si es un número válido y positivo
    isValidNumber: (num) => {
        return !isNaN(num) && num > 0 && isFinite(num);
    },
    // Verifica si excede el límite de dinero
    isStratospheric: (num) => {
        return num > MAX_FUNDS;
    },
    // Verifica si el usuario ya existe (Simulación de DB)
    usernameExists: (username, usersArray) => {
        return usersArray.some(u => u.username === username);
    },
    // Verifica si el email ya existe
    emailExists: (email, usersArray) => {
        return usersArray.some(u => u.email === email);
    }
};