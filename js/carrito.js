
let productos = fetch("../js/stock.json")
.then( response => response.json())
.then( productos => {
  renderizarCarrito(productos);
})

let post = document.getElementById("post");
let carritoCompras = document.getElementById("carritoCompras");
let canasta = JSON.parse(localStorage.getItem("data")) || [];

let calcular = () => {
  let iconoCarrito = document.getElementById("carritoCantidad");
  iconoCarrito.innerHTML = canasta.map(x => x.item).reduce((x, y) => x + y, 0);
};

let confirmame = () => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Su pedido ha sido realizado con éxito.',
    showConfirmButton: false,
    timer: 2500
  })
}

let vaciarCarrito = (productos) => {
  canasta = [];
  renderizarCarrito(productos);
  localStorage.setItem("data", JSON.stringify(canasta));
};

let actualizar = (id) => {
  let busqueda = canasta.find(x => x.id === id);
  document.getElementById(id).innerHTML = busqueda.item;
  calcular();
  cantidadTotal();
};

let reducir = (id) => {
  let productoElegido = id;
  let busqueda = canasta.find(x => x.id === productoElegido.id);

  if (busqueda === undefined) return;
  else if (busqueda.item === 0) return;
  else {
    busqueda.item -= 1;
  }
  actualizar(productoElegido.id);
  canasta = canasta.filter((x) => x.item !== 0);
  renderizarCarrito(productos);
  localStorage.setItem("data", JSON.stringify(canasta));
};

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

  actualizar(productoElegido.id);
  renderizarCarrito(productos);
  canasta = canasta.filter(x => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(canasta));
};

let eliminarProducto = (id) => {
  let productoElegido = id;
  canasta = canasta.filter((x) => x.id !== productoElegido.id);
  renderizarCarrito(productos);
  cantidadTotal();
  localStorage.setItem("data", JSON.stringify(canasta));
};

let cantidadTotal = (productos) => {
  if (canasta.length !== 0) {
    let cantidad = canasta
      .map(x => {
        let { item, id } = x;
        let busqueda = productos.find(y => y.id === id) || [];

        return item * busqueda.precio;
      })
      .reduce((x, y) => x + y, 0);
    post.innerHTML = `
    <h3 class="fontFinal">Total: $${cantidad}</h3>
    <button onclick="confirmame()">Enviar pedido</button>
    <button onclick="vaciarCarrito()" class="removeAll">Vaciar Carrito</button>
    `;
  } else return;
};

let renderizarCarrito = (productos) => {
  if (canasta.length !== 0) {
    return (carritoCompras.innerHTML = canasta
      .map((x) => {
        let { id, item } = x;
        let busqueda = productos.find(y => y.id === id) || [];
        return `
      <div class="carrito-producto">
        <img width="240" src=${busqueda.img} alt="" />
        <div class="detalles">
          <div class="nombre-precio-x">
              <h4 class="nombre-precio">
                <p>${busqueda.nombre}</p>
                <p class="carrito-producto-precio">$${busqueda.precio}</p>
              </h4>
              <i onclick="eliminarProducto(${id})" class="bi bi-trash3"></i>
          </div>
          <div class="buttons">
              <i onclick="reducir(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="cantidad">${item}</div>
              <i onclick="aumentar(${id})" class="bi bi-plus-lg"></i>
          </div>
          <h4>$${item * busqueda.precio}</h4>
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

cantidadTotal();

calcular();

renderizarCarrito();