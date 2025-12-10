// js/carrito.js

let cart = []; // Carrito global

// Función global para añadir (usada por productos.js y admin.js)
function addToCart(id) {
    const product = inventoryData.find(p => p.id === id);
    
    if (product.stock <= 0) return alert('Producto agotado');

    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
        } else {
            return alert('No hay más stock disponible');
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    
    // Feedback visual
    const badge = document.getElementById('cart-count');
    badge.classList.add('bg-warning');
    setTimeout(() => badge.classList.remove('bg-warning'), 200);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    
    countEl.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    let total = 0;
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Vacío</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            container.innerHTML += `
                <div class="d-flex justify-content-between border-bottom py-2">
                    <div>${item.name} <small>x${item.quantity}</small></div>
                    <div>$${(item.price * item.quantity).toFixed(2)} 
                    <button class="btn btn-sm btn-danger py-0 btn-remove-cart" data-id="${item.id}">x</button></div>
                </div>`;
        });
    }
    totalEl.textContent = total.toFixed(2);
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function generateTicketHTML(sale) {
    const ticketContent = document.getElementById('ticketContent');
    let itemsHtml = sale.products.map(p => 
        `<tr><td>${p.name}</td><td>x${p.quantity}</td><td>$${(p.price * p.quantity).toFixed(2)}</td></tr>`
    ).join('');

    ticketContent.innerHTML = `
        <div class="text-center mb-3">
            <h4>🥖 Panadería La Desesperanza 🥖</h4>
            <p>Av. Insurgentes Sur 1234, CDMX</p>
            <p><strong>Ticket de Venta</strong></p>
        </div>
        <p><strong>Folio:</strong> ${sale.id}</p>
        <p><strong>Fecha:</strong> ${sale.date}</p>
        <p><strong>Cliente:</strong> ${sale.user}</p>
        <hr>
        <table class="table table-sm table-borderless">
            <thead><tr><th>Prod</th><th>Cant</th><th>$$</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
        </table>
        <hr>
        <h4 class="text-end">TOTAL: $${sale.total.toFixed(2)}</h4>
        <p class="text-center mt-3 text-muted">¡Gracias por su compra!</p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    // Evento Global para Botones "Añadir al Carrito"
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const id = parseInt(btn.getAttribute('data-product-id'));
            addToCart(id);
            // Si viene del modal de detalles, cerrarlo
            const modalEl = document.getElementById('detailsModal');
            if(modalEl.classList.contains('show')) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
            }
        }
        
        // Remover del carrito
        if (e.target.classList.contains('btn-remove-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }
    });

    document.getElementById('clearCartBtn').addEventListener('click', clearCart);

    // CHECKOUT
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!currentUser) return alert("Inicia sesión para comprar.");
        if (cart.length === 0) return alert("Carrito vacío.");

        const total = parseFloat(document.getElementById('cartTotal').textContent);

        if (currentUser.funds < total) {
            return alert(`Fondos insuficientes. Tienes $${currentUser.funds.toFixed(2)} y necesitas $${total.toFixed(2)}`);
        }

        // Procesar pago
        currentUser.funds -= total;

        // Actualizar Stock
        cart.forEach(item => {
            const product = inventoryData.find(p => p.id === item.id);
            if(product) product.stock -= item.quantity;
        });

        // Crear registro venta
        const saleRecord = {
            id: 'VEN-' + Date.now(),
            date: new Date().toLocaleString(),
            user: currentUser.username,
            products: [...cart],
            total: total
        };

        // Guardar historial
        currentUser.history.push(saleRecord);
        if(typeof salesHistory !== 'undefined') salesHistory.push(saleRecord);

        generateTicketHTML(saleRecord);
        
        // Limpiar y Actualizar UI
        cart = [];
        updateCartUI();
        updateUI(); // Actualizar billetera en navbar
        if(currentUser.role === 'Admin' && typeof renderAdminDashboard === 'function') renderAdminDashboard();
        
        const modalCart = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        modalCart.hide();
        
        const modalTicket = new bootstrap.Modal(document.getElementById('ticketModal'));
        modalTicket.show();
    });
});