document.addEventListener('DOMContentLoaded',function(){
    mostrarArticulosEnConsola();
})

async function obtenerProductosJSON(){
    try {
        const response = await fetch('productos.json');
        if(!response.ok){
            throw new Error('Error al obtener productos')
        }
        
        const datos = await response.json();
        let articulos = JSON.parse(localStorage.getItem('articulos')) || [];

        // Filtra los productos del JSON que no están en la lista actual y luego concaténalos
        const nuevosProductos = datos.articulos_de_barracas.filter((producto) => {
            return !articulos.some((item) => item.identificador === producto.identificador);
        });

        articulos = articulos.concat(nuevosProductos);
        localStorage.setItem('articulos', JSON.stringify(articulos));
        mostrarArticulosEnConsola();
    } catch (error) {
        console.error('Error: ' + error);        
    }
}

obtenerProductosJSON();

function addJSONLocalStorage(art){
    localStorage.setItem('articulos', JSON.stringify(art));
}



const formVenta = document.querySelector('#formVenta');

function addProductoLocalStorage() {
    let nombreProducto = document.querySelector('#nombreProducto').value;
    let descripcionProducto = document.querySelector('#descripcionProducto').value;
    let cantidadProducto = document.querySelector('#cantidadProducto').value;
    let precioProducto = document.querySelector('#precioProducto').value;

    if (!nombreProducto || !cantidadProducto || !precioProducto) {
        console.log('Faltan valores');
    } else {
        let articulos = JSON.parse(localStorage.getItem('articulos')) || [];

        let id = new Date();

        let newArticulo = {
            "identificador": id.toISOString().replace(/[-T:.Z]/g, ""),
            "nombre": nombreProducto,
            "descripcion": descripcionProducto,
            "cantidad_en_stock": cantidadProducto,
            "costo":precioProducto,
        }

        articulos.push(newArticulo); 
        localStorage.setItem('articulos', JSON.stringify(articulos)); 
        
        // Limpiar los campos del formulario
        document.querySelector('#nombreProducto').value = '';
        document.querySelector('#descripcionProducto').value = '';
        document.querySelector('#cantidadProducto').value = '';
        document.querySelector('#precioProducto').value = '';
    }
}

const locals = localStorage.getItem('articulos');

function agregarAlCarrito(articuloIdentificador, artNombre,descProducto,cantProductoStock, artCosto) {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verifica si existe una clave "articulos" en el localStorage
    const articulos = JSON.parse(localStorage.getItem('articulos')) || [];

    // Busca el artículo correspondiente por identificador
    const articuloEnStock = articulos.find((articulo) => articulo.identificador === articuloIdentificador);

    if (!articuloEnStock) {
        alert('El artículo no está en stock.');
        return;
    }

    if (articuloEnStock.cantidad_en_stock < 1) {
        alert('No hay stock en este momento.');
        return;
    }

    let newArticulo = {
        "identificador": articuloIdentificador,
        "nombre": artNombre,
        "descripcion": descProducto,
        "cantidad_en_stock": cantProductoStock,
        "costo":artCosto,
    }

    carritoActual.push(newArticulo);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));

    // Reduce la cantidad_en_stock en 1 y actualiza el localStorage
    articuloEnStock.cantidad_en_stock -= 1;
    localStorage.setItem('articulos', JSON.stringify(articulos));

    window.location.reload();
}

function mostrarArticulosEnConsola() {
    let articulos = JSON.parse(localStorage.getItem('articulos')) || [];
    let content = '';
    const lista = document.getElementById('listaDeProductos');

    articulos.forEach((articulo) => {
        content += `

        <div class="col d-flex align-items-start bg-body-secondary">
          <div class="m-4" id="prodContainer">
            <h3 class="fs-2 text-body-emphasis">${articulo.nombre}</h3>
            <p>${articulo.descripcion}</p>
            <p>${articulo.cantidad_en_stock} en stock</p>
            <p>$ ${articulo.costo}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${articulo.identificador}','${articulo.nombre}','${articulo.descripcion}','${articulo.cantidad_en_stock}','${articulo.costo}')">Vender</button>
            </div>
        </div>
        `
    });
    lista.innerHTML=content;
}



