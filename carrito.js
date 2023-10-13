
document.addEventListener('DOMContentLoaded',function(){
    mostrarCarrito();
})

function mostrarCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    let articulosJSON = localStorage.getItem('carrito');
    let articulos = JSON.parse(articulosJSON);

    //  objeto para realizar el conteo
    const conteoArticulos = {};
    let subTotalCosto = 0;
    articulos.forEach(articulo => {
        if (conteoArticulos[articulo.identificador]) {
            conteoArticulos[articulo.identificador].cantidad++;
        } else {
            conteoArticulos[articulo.identificador] = {
                articulo: articulo,
                cantidad: 1
            };
        }
        subTotalCosto += parseFloat(articulo.costo);
    });
    
    const fragment = document.createDocumentFragment();

    for (const id in conteoArticulos) {
        const item = conteoArticulos[id];

        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm', 'articulo');

        const div = document.createElement('div');
        const h6 = document.createElement('h6');
        h6.classList.add('my-0');
        h6.textContent = item.articulo.nombre;
        
        const buttonCantidad = document.createElement('button');
        buttonCantidad.type = 'button';
        buttonCantidad.classList.add('btn');
        buttonCantidad.setAttribute('data-bs-toggle', 'modal');
        buttonCantidad.setAttribute('data-bs-target', '#exampleModal');
        buttonCantidad.setAttribute('data-bs-whatever', '@mdo');
        buttonCantidad.textContent = `x${item.cantidad}`;
        h6.appendChild(buttonCantidad);

        const small = document.createElement('small');
        small.innerHTML = `$${item.articulo.costo} c/u. `;
        
        const buttonEliminar = document.createElement('button');
        buttonEliminar.classList.add('btn','btn-danger', 'p-0');
        buttonEliminar.textContent = 'Eliminar';
        buttonEliminar.onclick = () => eliminar(item.articulo.identificador);
        small.appendChild(buttonEliminar);

        div.appendChild(h6);
        div.appendChild(small);

        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = 'exampleModal';
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', 'exampleModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Crea el contenido del modal aquí

        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        li.appendChild(div);

        const span = document.createElement('span');
        span.classList.add('text-body-secondary');
        span.textContent = `$${item.articulo.costo * item.cantidad}`;
        li.appendChild(span);

        fragment.appendChild(li);
    }

    // Descuento en efectivo
    let totalEfectivo = subTotalCosto;
    totalEfectivo -= subTotalCosto * 0.1;

    //Descuento crédito
    let totalCredito = subTotalCosto;
    totalCredito -= subTotalCosto * 0.07;

    const totalLi = document.createElement('li');
    totalLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm', 'bg-light');

    const totalDiv = document.createElement('div');
    const totalH6 = document.createElement('h6');
    totalH6.classList.add('my-0');
    totalH6.textContent = 'Subtotal';
    totalDiv.appendChild(totalH6);

    const totalDivFinal = document.createElement('div');
    const totalH6Final = document.createElement('h6');
    totalH6Final.classList.add('my-0');
    totalH6Final.textContent = 'Total';
    totalDivFinal.appendChild(totalH6Final);
    const totalSpanFinal = document.createElement('span');
    totalSpanFinal.classList.add('totalFinal');
    totalSpanFinal.textContent = `$${subTotalCosto}`;
    totalDivFinal.appendChild(totalSpanFinal);
    

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('text-body-secondary');
    totalSpan.textContent = `$${subTotalCosto}`;
    totalDiv.appendChild(totalSpan);

    totalLi.appendChild(totalDiv);

    fragment.appendChild(totalLi);
    fragment.appendChild(totalDivFinal);



    // Limpia el contenido existente
    while (listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }

    // Agrega el fragmento con los nuevos elementos
    
    listaCarrito.appendChild(fragment);
    
    let labelMetodo = document.createElement('label');
    labelMetodo.textContent= 'Método de pago';
    let selectMetodo = document.createElement('select');
    selectMetodo.classList.add('btn','btn-primary','selectMetodo');
    labelMetodo.appendChild(selectMetodo);

    let optionDebito = document.createElement('option');
    optionDebito.textContent='Débito (sin descuento)';
    selectMetodo.appendChild(optionDebito);

    let optionCredito = document.createElement('option');
    optionCredito.textContent='Crédito (7% de recargo)';
    selectMetodo.appendChild(optionCredito);

    let optionEfectivo = document.createElement('option');
    optionEfectivo.textContent='Efectivo (10% de descuento)';
    selectMetodo.appendChild(optionEfectivo);
    

    listaCarrito.appendChild(labelMetodo);
    listaCarrito.appendChild(selectMetodo);

    const selectElement = document.querySelector(".selectMetodo");
    const result = document.querySelector(".totalFinal");

    selectElement.addEventListener("change", (event) => {
        let costoTotalConDescuento = subTotalCosto;
        const metodoDePago = selectMetodo.value;
        if (metodoDePago === 'Crédito (7% de recargo)') {
            costoTotalConDescuento += subTotalCosto * 0.07;
        } else if (metodoDePago === 'Efectivo (10% de descuento)') {
            costoTotalConDescuento -= subTotalCosto * 0.1;
        }

        result.textContent = `$${costoTotalConDescuento}`;
    
    });

}


function eliminar(id) {
    // Obtén los datos del carrito actual del almacenamiento local
    let carritoJSON = localStorage.getItem('carrito');
    let carrito = JSON.parse(carritoJSON);

    // Obtén los datos de los artículos del almacenamiento local
    let articulosJSON = localStorage.getItem('articulos');
    let articulos = JSON.parse(articulosJSON);

    // Filtra los elementos del carrito con el mismo id
    const eliminados = carrito.filter(articulo => articulo.identificador === id);

    // Actualiza la cantidad en stock para los artículos eliminados
    eliminados.forEach(eliminado => {
        const articuloExistente = articulos.find(articulo => articulo.identificador === eliminado.identificador);
        if (articuloExistente) {
            articuloExistente.cantidad_en_stock += 1;
        }
    });

    // Guarda los datos actualizados en la clave "articulos" del almacenamiento local
    localStorage.setItem('articulos', JSON.stringify(articulos));

    // Filtra los elementos del carrito que no tienen el mismo id
    carrito = carrito.filter(articulo => articulo.identificador !== id);

    // Guarda los datos actualizados del carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Vuelve a mostrar el carrito para reflejar los cambios
    mostrarCarrito();
}