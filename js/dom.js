function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) ?? []
}
const carro = recuperarCarrito() || []
const botonCarrito = document.querySelector("li.carrito")
const contenedor = document.querySelector("section#card")
const inputBuscar = document.querySelector("input[type=search]")
const url = "../js/inventario.json"
const inventario = []

function obtenerProductos(){
    fetch(url)
    .then((response)=>response.json())
    .then((data)=>inventario.push(...data))
    .then(()=>cargarProductos(inventario))
    .catch((error)=> contenedor.innerHTML = retornarCardError())
}
obtenerProductos()


function retornarCardHTML(producto) {
    return `<article class="card">
                <div class="justify-content-center">
                    <img class="img-fluid" src="${producto.imagen}" alt="Foto de madeja">
                </div>
                <div class="textoHover">
                    <h3>${producto.nombre}</h3>
                </div>
                    <button id="${producto.id}" class="button button-outline button-add" title="Pulsa para comprar">COMPRAR</button>
            </article>`
}

function retornarCardError() {
    return `<div class="card-error">
                <h2>🔌</h2>
                <h3>No se han podido listar los productos</h3>
                <h4>Intenta nuevamente en unos instantes...</h4>
            </div>`
}
function buscarArticulo(artId) {
    let articuloSeleccionado = inventario.find((producto) => producto.id === parseInt(artId));
    return articuloSeleccionado
}

function activarClickEnBotones() { 
    const botonesComprar = document.querySelectorAll("button.button-add") 
    for (let boton of botonesComprar) {
        boton.addEventListener("click", () => {
            let idProducto = boton.id;
            let articuloElegido = buscarArticulo(idProducto);
            if (articuloElegido) {
                carro.push(articuloElegido);
                localStorage.setItem("miCarrito", JSON.stringify(carro));
            } else {
                console.error("No se encontró el artículo con el ID:", idProducto);
            }
        })
    }
}
function cargarProductos(array) {
    if (array.length > 0) {
        contenedor.innerHTML = ""
        array.forEach((producto)=> {
            contenedor.innerHTML += retornarCardHTML(producto)
        })
        activarClickEnBotones()
    } else {
        contenedor.innerHTML = retornarCardError()
    }
}
function notificacion(){
    Swal.fire({
        icon:'warning',
        title:'ver carrito',
        text:'debe agregar productos al carrito',
    })
}


botonCarrito.addEventListener("mousemove", ()=> {
    if (carro.length > 0) {
        botonCarrito.title = carro.length + " producto(s) en carrito"
    } else {
        botonCarrito.title = "Ir al carrito"
    }
})

botonCarrito.addEventListener("click", ()=> {
    if (carro.length > 0) {
        location.href = "compra.html"
    } else {
        notificacion()
    }
})
