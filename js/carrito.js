let post = document.getElementById("post");
let carritoCompras = document.getElementById("carritoCompras");
let canasta = JSON.parse(localStorage.getItem("data")) || [];

let producto = fetch("../js/stock.json")
  .then( (response) => response.json())
  .then( (datos) => {
    renderizarCarrito(datos);
})

let productoDos = fetch("../js/stock.json")
  .then( (response) => response.json())
  .then( (datos) => {
    cantidadTotal(datos);
})

let aumentar = (id) => {
  let productoElegido = id;
  let busqueda = canasta.find((x) => x.id === productoElegido.id);

  if (busqueda === undefined) {
    canasta.push({
      id: productoElegido.id,
      item: 1,
    });
  } else {
    busqueda.item += 1;
  }

  renderizarCarrito();
  actualizar(productoElegido.id);
  localStorage.setItem("data", JSON.stringify(canasta));
};

let renderizarCarrito = (producto) => {
  if (canasta.length !== 0) {
    return (carritoCompras.innerHTML = canasta
      .map((x) => {
        let { id, item } = x;
        let busqueda = producto.find((y) => y.id === id) || [];
        return `
      <div class="carrito-producto">
        <img width="240" src=${busqueda.img} alt="">
        <div class="detalles">
          <div class="nombre-precio-x">
              <h4 class="nombre-precio">
                <p>${busqueda.nombre}</p>
                <p class="carrito-producto-precio">$${busqueda.precio}</p>
              </h4>
          </div>
          <div class="buttons">
              <div id=${id} class="cantidad">Cantidad: ${item} unidades</div>
          </div>
          <h4>Total: $ ${item * busqueda.precio}</h4>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    carritoCompras.innerHTML = ``;
    post.innerHTML = `
    <h4>El carrito está vacío.</h4>
    <a href="tienda.html">
      <button class="HomeBtn">Volver a la tienda</button>
    </a>
    `;
  }
};

let vaciarCarrito = () => {
  canasta = [];
  renderizarCarrito();
  localStorage.setItem("data", JSON.stringify(canasta));
};

let enviarPedido = () => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Su pedido ha sido realizado con éxito.',
    showConfirmButton: false,
    timer: 2500
  })
};

let cantidadTotal = (datos) => {
  if (canasta.length !== 0) {
    let cantidad = canasta
      .map((x) => {
        let { item, id } = x;
        let busqueda = datos.find((y) => y.id === id) || [];

        return item * busqueda.precio;
      })
      .reduce((x, y) => x + y, 0);
    post.innerHTML = `
    <h3 class="fontFinal">Total: $${cantidad}</h3>
    <button onclick="enviarPedido()" class="enviarPedido">Enviar pedido</button>
    <button onclick="vaciarCarrito()" class="vaciarCarrito">Vaciar Carrito</button>
    <a href="tienda.html">
      <button class="HomeBtn">Modificar Pedido</button>
    </a>
    `;
  } else return;
};

renderizarCarrito();