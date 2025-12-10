// js/admin.js

let salesHistory = []; // Historial global de ventas

function renderAdminDashboard() {
    const container = document.getElementById('gestion').querySelector('.container');
    
    // Limpiar dashboard previo
    const existing = document.getElementById('adminDashboard');
    if(existing) existing.remove();

    const dashboardHTML = `
        <div id="adminDashboard" class="mt-4">
            <hr>
            <h3 class="text-center mb-4">📊 Panel de Administración</h3>
            <div class="row mb-5">
                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">Ventas por Categoría</div>
                        <div class="card-body">${generateBarChart()}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-dark text-white">Historial Global</div>
                        <div class="card-body" style="max-height: 300px; overflow-y: auto;">
                            <ul class="list-group list-group-flush">${generateHistoryList()}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar
    const title = container.querySelector('h2');
    title.insertAdjacentHTML('afterend', dashboardHTML);
    renderInventoryTable();
}

function generateBarChart() {
    const stats = { muertos: 0, halloween: 0, navidad: 0 };
    salesHistory.forEach(sale => {
        sale.products.forEach(p => {
            if(p.category === 'dia_muertos') stats.muertos += p.quantity;
            if(p.category === 'halloween') stats.halloween += p.quantity;
            if(p.category === 'navidad') stats.navidad += p.quantity;
        });
    });

    const total = stats.muertos + stats.halloween + stats.navidad || 1;
    return `
        <div class="mb-3">
            <div class="d-flex justify-content-between"><span>Día Muertos</span><span>${stats.muertos}</span></div>
            <div class="progress"><div class="progress-bar bg-warning" style="width: ${(stats.muertos/total)*100}%"></div></div>
        </div>
        <div class="mb-3">
            <div class="d-flex justify-content-between"><span>Halloween</span><span>${stats.halloween}</span></div>
            <div class="progress"><div class="progress-bar bg-dark" style="width: ${(stats.halloween/total)*100}%"></div></div>
        </div>
        <div class="mb-3">
            <div class="d-flex justify-content-between"><span>Navidad</span><span>${stats.navidad}</span></div>
            <div class="progress"><div class="progress-bar bg-danger" style="width: ${(stats.navidad/total)*100}%"></div></div>
        </div>
    `;
}

function generateHistoryList() {
    if(salesHistory.length === 0) return '<li class="list-group-item">Sin ventas.</li>';
    return salesHistory.map(s => `
        <li class="list-group-item">
            <strong>${s.date}</strong> - ${s.user}<br>
            Total: <span class="text-success">$${s.total.toFixed(2)}</span>
            <small class="d-block text-muted">ID: ${s.id}</small>
        </li>
    `).join('');
}

function renderInventoryTable() {
    const tbody = document.getElementById('tablaProductosBody');
    tbody.innerHTML = '';
    inventoryData.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-edit-stock me-1" data-id="${p.id}" data-stock="${p.stock}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-prod" data-id="${p.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Eventos de Admin
document.addEventListener('DOMContentLoaded', () => {
    // Delegación para eliminar productos
    document.querySelector('table').addEventListener('click', (e) => {
        if(e.target.closest('.btn-delete-prod')) {
            if(!confirm("¿Eliminar producto?")) return;
            const id = parseInt(e.target.closest('.btn-delete-prod').dataset.id);
            // inventoryData es global desde productos.js
            const index = inventoryData.findIndex(p => p.id === id);
            if(index > -1) {
                inventoryData.splice(index, 1);
                renderInventoryTable();
            }
        }
    });

    // Agregar Producto
    const prodForm = document.getElementById('productoForm');
    if(prodForm) {
        prodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProd = {
                id: inventoryData.length > 0 ? Math.max(...inventoryData.map(p => p.id)) + 1 : 1,
                name: document.getElementById('productoNombre').value,
                category: document.getElementById('productoCategoria').value,
                desc: document.getElementById('productoDescripcion').value,
                price: parseFloat(document.getElementById('productoPrecio').value),
                stock: parseInt(document.getElementById('productoStock').value),
                img: document.getElementById('productoImagen').value || 'img/default.jpg'
            };
            inventoryData.push(newProd);
            renderInventoryTable();
            const modal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
            modal.hide();
            e.target.reset();
            alert('Producto agregado');
        });
    }

    // Editar Stock
    document.querySelector('table').addEventListener('click', (e) => {
        if(e.target.closest('.btn-edit-stock')) {
            const btn = e.target.closest('.btn-edit-stock');
            const id = parseInt(btn.dataset.id);
            const currentStock = parseInt(btn.dataset.stock);
            
            const newStock = prompt(`Stock actual: ${currentStock}\nIngresa el nuevo stock:`, currentStock);
            
            if(newStock !== null && !isNaN(newStock) && newStock >= 0) {
                const product = inventoryData.find(p => p.id === id);
                if(product) {
                    product.stock = parseInt(newStock);
                    renderInventoryTable();
                    alert('Stock actualizado exitosamente');
                }
            } else if(newStock !== null) {
                alert('Por favor ingresa un número válido');
            }
        }
    });
});