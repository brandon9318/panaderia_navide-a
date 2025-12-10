// js/sessions.js

// Usuario actual (simulación sin backend)
let currentUser = null;

// Base de datos simulada de usuarios
let usersDB = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@panaderia.com',
        password: 'admin123',
        fullName: 'Administrador',
        role: 'Admin',
        funds: 10000,
        history: []
    },
    {
        id: 2,
        username: 'cliente1',
        email: 'cliente@ejemplo.com',
        password: '123456',
        fullName: 'Juan Pérez',
        role: 'Cliente',
        funds: 500,
        history: []
    }
];

// Actualizar UI según el estado de sesión
function updateUI() {
    const navLogin = document.getElementById('nav-login-item');
    const navUser = document.getElementById('nav-user-info');
    const navGestion = document.getElementById('nav-gestion');
    const secGestion = document.getElementById('gestion');
    
    if (currentUser) {
        // Usuario logueado
        if (navLogin) navLogin.style.display = 'none';
        if (navUser) navUser.style.display = 'block';
        
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        
        if (userName) userName.textContent = currentUser.username;
        if (userRole) {
            userRole.textContent = currentUser.role;
            userRole.className = currentUser.role === 'Admin' ? 'badge bg-warning ms-1' : 'badge bg-success ms-1';
        }
        
        // Mostrar gestión solo para admin
        if (currentUser.role === 'Admin') {
            if (navGestion) navGestion.style.display = 'block';
            if (secGestion) secGestion.style.display = 'block';
            // Renderizar dashboard admin si existe la función
            if (typeof renderAdminDashboard === 'function') {
                renderAdminDashboard();
            }
        } else {
            if (navGestion) navGestion.style.display = 'none';
            if (secGestion) secGestion.style.display = 'none';
        }
        
        // Actualizar fondos en billetera si el modal existe
        const currentFundsDisplay = document.getElementById('currentFundsDisplay');
        if (currentFundsDisplay) {
            currentFundsDisplay.textContent = currentUser.funds.toFixed(2);
        }
    } else {
        // Usuario no logueado
        if (navLogin) navLogin.style.display = 'block';
        if (navUser) navUser.style.display = 'none';
        if (navGestion) navGestion.style.display = 'none';
        if (secGestion) secGestion.style.display = 'none';
    }
}

// Función de Login
function loginUser(username, password) {
    const user = usersDB.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUI();
        return { success: true, message: `¡Bienvenido ${user.fullName}!` };
    }
    return { success: false, message: 'Usuario o contraseña incorrectos' };
}

// Función de Login Admin (por email)
function loginAdmin(email, password) {
    const admin = usersDB.find(u => u.email === email && u.password === password && u.role === 'Admin');
    
    if (admin) {
        currentUser = admin;
        updateUI();
        return { success: true, message: `¡Bienvenido Admin ${admin.fullName}!` };
    }
    return { success: false, message: 'Credenciales de admin incorrectas' };
}

// Función de Registro
function registerUser(fullName, username, email, password) {
    // Validar que no exista el usuario o email
    if (validator.usernameExists(username, usersDB)) {
        return { success: false, message: 'El usuario ya existe' };
    }
    if (validator.emailExists(email, usersDB)) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    const newUser = {
        id: usersDB.length + 1,
        username,
        email,
        password,
        fullName,
        role: 'Cliente',
        funds: 0,
        history: []
    };
    
    usersDB.push(newUser);
    return { success: true, message: '¡Registro exitoso! Ya puedes iniciar sesión' };
}

// Logout
function logoutUser() {
    currentUser = null;
    updateUI();
}

// Agregar fondos
function addFunds(amount) {
    if (!currentUser) return { success: false, message: 'Debes iniciar sesión' };
    
    if (!validator.isValidNumber(amount)) {
        return { success: false, message: 'Cantidad inválida' };
    }
    
    const newFunds = currentUser.funds + amount;
    
    if (validator.isStratospheric(newFunds)) {
        return { success: false, message: '¡Eso es demasiado dinero! Límite excedido' };
    }
    
    currentUser.funds = newFunds;
    updateUI();
    return { success: true, message: `¡$${amount.toFixed(2)} agregados exitosamente!` };
}

// Eventos del DOM
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    
    // Modal de selección de tipo de usuario
    const btnLoginCliente = document.getElementById('btn-login-cliente');
    const btnLoginAdmin = document.getElementById('btn-login-admin');
    
    if (btnLoginCliente) {
        btnLoginCliente.addEventListener('click', () => {
            const modalType = bootstrap.Modal.getInstance(document.getElementById('loginTypeModal'));
            modalType.hide();
            
            const modalCliente = new bootstrap.Modal(document.getElementById('loginClienteModal'));
            modalCliente.show();
        });
    }
    
    if (btnLoginAdmin) {
        btnLoginAdmin.addEventListener('click', () => {
            const modalType = bootstrap.Modal.getInstance(document.getElementById('loginTypeModal'));
            modalType.hide();
            
            const modalAdmin = new bootstrap.Modal(document.getElementById('loginAdminModal'));
            modalAdmin.show();
        });
    }
    
    // Login Cliente
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = loginUser(username, password);
            
            if (result.success) {
                alert(result.message);
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginClienteModal'));
                modal.hide();
                loginForm.reset();
            } else {
                alert(result.message);
            }
        });
    }
    
    // Login Admin
    const formLoginAdmin = document.getElementById('formLoginAdmin');
    if (formLoginAdmin) {
        formLoginAdmin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginAdminEmail').value;
            const password = document.getElementById('loginAdminPassword').value;
            
            const result = loginAdmin(email, password);
            
            if (result.success) {
                alert(result.message);
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginAdminModal'));
                modal.hide();
                formLoginAdmin.reset();
            } else {
                alert(result.message);
            }
        });
    }
    
    // Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('regNombre').value;
            const username = document.getElementById('regUsuario').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            
            const result = registerUser(fullName, username, email, password);
            alert(result.message);
            
            if (result.success) {
                registerForm.reset();
                // Cambiar a la pestaña de login
                const loginTab = document.querySelector('[data-bs-target="#pills-login"]');
                if (loginTab) loginTab.click();
            }
        });
    }
    
    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            logoutUser();
            alert('Sesión cerrada');
        });
    }
    
    // Agregar fondos
    const formAgregarFondos = document.getElementById('formAgregarFondos');
    if (formAgregarFondos) {
        formAgregarFondos.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('montoAgregar').value);
            const alertDiv = document.getElementById('alert-fondos');
            
            const result = addFunds(amount);
            
            if (result.success) {
                alert(result.message);
                formAgregarFondos.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('fundsModal'));
                if (modal) modal.hide();
            } else {
                if (alertDiv) {
                    alertDiv.textContent = result.message;
                    alertDiv.classList.remove('d-none');
                    setTimeout(() => alertDiv.classList.add('d-none'), 3000);
                } else {
                    alert(result.message);
                }
            }
        });
    }
    
    // Abrir modal de fondos al hacer click en el saldo (si existe)
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.style.cursor = 'pointer';
        userNameElement.addEventListener('click', () => {
            if (currentUser) {
                const modal = new bootstrap.Modal(document.getElementById('fundsModal'));
                modal.show();
            }
        });
    }
});