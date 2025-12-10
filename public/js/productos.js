// js/productos.js

// INVENTARIO GLOBAL (Accesible por carrito y admin)
let inventoryData = [
    // DÍA DE MUERTOS
    { id: 1, name: "Pan de Muerto Tradicional", price: 25.00, stock: 50, category: "dia_muertos", img: "img/pan_muerto.jpg", desc: "Sabor naranja y azahar." },
    { id: 2, name: "Pan de Muerto Relleno", price: 35.00, stock: 30, category: "dia_muertos", img: "img/pan_muerto_relleno.jpg", desc: "Relleno de nata o crema." },
    { id: 3, name: "Concha Calavera", price: 15.00, stock: 80, category: "dia_muertos", img: "img/concha_calavera.jpg", desc: "Decorada como calavera." },
    { id: 4, name: "Bollos Florales", price: 20.00, stock: 45, category: "dia_muertos", img: "img/bollos_florales.jpg", desc: "Con flores de cempasúchil." },
    { id: 5, name: "Cuerno", price: 12.00, stock: 70, category: "dia_muertos", img: "img/cuerno.jpg", desc: "Masa hojaldrada." },
    { id: 6, name: "Oreja", price: 14.00, stock: 65, category: "dia_muertos", img: "img/oreja.jpg", desc: "Crujiente y dulce." },
    { id: 7, name: "Bigote", price: 13.00, stock: 55, category: "dia_muertos", img: "img/bigote.jpg", desc: "Azucarado clásico." },
    { id: 8, name: "Campechana", price: 16.00, stock: 60, category: "dia_muertos", img: "img/campechana.jpg", desc: "Hojaldre rectangular." },
    { id: 9, name: "Chilindrina", price: 10.00, stock: 75, category: "dia_muertos", img: "img/chilindrina.jpg", desc: "Con azúcar morena." },
    { id: 10, name: "Rebanada", price: 8.00, stock: 90, category: "dia_muertos", img: "img/rebanada.jpg", desc: "Con mantequilla." },

    // HALLOWEEN
    { id: 11, name: "Muffin Monstruoso", price: 30.00, stock: 40, category: "halloween", img: "img/muffin_calabaza.jpg", desc: "Decoración terrorífica." },
    { id: 12, name: "Galleta Telaraña", price: 18.00, stock: 60, category: "halloween", img: "img/galleta_telarana.jpg", desc: "Mantequilla y chocolate." },
    { id: 13, name: "Panqué Calabaza", price: 120.00, stock: 25, category: "halloween", img: "img/pumpkin_bread.jpg", desc: "Especiado de temporada." },
    { id: 14, name: "Panqué Jengibre", price: 130.00, stock: 20, category: "halloween", img: "img/gingerbread_loaf.jpg", desc: "Con melaza." },
    { id: 15, name: "Panqué Especias", price: 115.00, stock: 28, category: "halloween", img: "img/spice_bread.jpg", desc: "Otoñal suave." },
    { id: 16, name: "Panqué Chispas", price: 140.00, stock: 18, category: "halloween", img: "img/pumpkin_chocolate_chip.jpg", desc: "Calabaza y chocolate." },
    { id: 17, name: "Panqué Manzana", price: 135.00, stock: 22, category: "halloween", img: "img/apple_cinnamon_bread.jpg", desc: "Manzana canela." },
    { id: 18, name: "Panqué Queso", price: 150.00, stock: 15, category: "halloween", img: "img/pumpkin_cream_cheese.jpg", desc: "Con queso crema." },
    { id: 19, name: "Pan Plátano", price: 70.00, stock: 30, category: "halloween", img: "img/banana_nut_bread.jpg", desc: "Con nueces." },
    { id: 20, name: "Panecillos Halloween", price: 50.00, stock: 45, category: "halloween", img: "img/decorated_buns.jpg", desc: "Formas de fantasmas." },

    // NAVIDAD
    { id: 21, name: "Panettone Clásico Italiano", price: 250.00, stock: 15, category: "navidad", img: "img/panettone.jpg", desc: "Pan dulce esponjoso con frutas confitadas y pasas." },
    { id: 22, name: "Stollen Navideño Alemán", price: 180.00, stock: 20, category: "navidad", img: "img/stollen.jpg", desc: "Pan denso de frutas, mazapán y azúcar glas." },
    { id: 23, name: "Tronco de Navidad", price: 450.00, stock: 10, category: "navidad", img: "img/tronco-navidad.jpg", desc: "Biscocho enrollado relleno de crema y decorado como un tronco." },
    { id: 24, name: "Pan de Pascua Chileno", price: 220.00, stock: 25, category: "navidad", img: "img/pan-pascua.jpg", desc: "Pan dulce oscuro con nueces, frutas confitadas y licor." },
    { id: 25, name: "Mantecados Navideños", price: 80.00, stock: 40, category: "navidad", img: "img/mantecados.jpg", desc: "Galletas tradicionales de manteca y especias." },
    { id: 26, name: "Polvorones de Almendra", price: 90.00, stock: 35, category: "navidad", img: "img/polvorones.jpg", desc: "Dulces navideños de almendra molida." },
    { id: 27, name: "Galletas de Jengibre Decoradas", price: 60.00, stock: 50, category: "navidad", img: "img/galletas-jengibre.jpg", desc: "Clásicas galletas con forma de hombrecitos." },
    { id: 28, name: "Rosca de Reyes (Edición Navideña)", price: 300.00, stock: 12, category: "navidad", img: "img/rosca-reyes.jpg", desc: "Pan festivo con frutas cristalizadas." },
    { id: 29, name: "Brazo de Gitano Navideño", price: 380.00, stock: 8, category: "navidad", img: "img/brazo-gitano-navidad.jpg", desc: "Rollo de bizcocho relleno de trufa o nata." },
    { id: 30, name: "Mince Pies Británicos", price: 110.00, stock: 30, category: "navidad", img: "img/mince-pies.jpg", desc: "Pequeñas tartas rellenas de frutas secas y especias." }
];

document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const refs = {
        btnDiaMuertos: document.getElementById('btnDiaMuertos'),
        btnHalloween: document.getElementById('btnHalloween'),
        btnNavidad: document.getElementById('btnNavidad'),
        secDiaMuertos: document.getElementById('productosDiaMuertos'),
        secHalloween: document.getElementById('productosHalloween'),
        secNavidad: document.getElementById('productosNavidad'),
        modalDetails: new bootstrap.Modal(document.getElementById('detailsModal'))
    };

    // Lógica de cambio de categoría
    function switchCat(cat) {
        // Resetear clases
        [refs.btnDiaMuertos, refs.btnHalloween, refs.btnNavidad].forEach(b => b.classList.remove('active'));
        [refs.secDiaMuertos, refs.secHalloween, refs.secNavidad].forEach(s => s.classList.add('d-none'));
        
        // Activar la seleccionada
        if(cat === 'dia_muertos') {
            refs.secDiaMuertos.classList.remove('d-none');
            refs.btnDiaMuertos.classList.add('active');
        } else if(cat === 'halloween') {
            refs.secHalloween.classList.remove('d-none');
            refs.btnHalloween.classList.add('active');
        } else if(cat === 'navidad') {
            refs.secNavidad.classList.remove('d-none');
            refs.btnNavidad.classList.add('active');
        }
    }

    // Listeners de Categorías
    if(refs.btnDiaMuertos) refs.btnDiaMuertos.addEventListener('click', () => switchCat('dia_muertos'));
    if(refs.btnHalloween) refs.btnHalloween.addEventListener('click', () => switchCat('halloween'));
    if(refs.btnNavidad) refs.btnNavidad.addEventListener('click', () => switchCat('navidad'));

    // Listener Global para "Ver Detalles" (Delegación de eventos)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-details')) {
            const id = parseInt(e.target.getAttribute('data-product-id'));
            const p = inventoryData.find(x => x.id === id);
            
            if(p) {
                document.getElementById('detailsModalTitle').textContent = p.name;
                document.getElementById('detailsModalDescription').textContent = p.desc;
                document.getElementById('detailsModalPrice').textContent = `$${p.price.toFixed(2)}`;
                document.getElementById('detailsModalImage').src = p.img;
                document.getElementById('detailsModalStock').textContent = p.stock;
                
                // Configurar botón del modal para añadir al carrito
                const addBtn = document.getElementById('detailsModalAddToCartBtn');
                addBtn.setAttribute('data-product-id', p.id);
                
                refs.modalDetails.show();
            }
        }
    });
});