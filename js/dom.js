function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) ?? []
}
const carro = recuperarCarrito() || []
const selectorOrden = document.getElementById("selectorOrden")
const botonCarrito = document.querySelector("li.carrito")
const contenedor = document.querySelector("section#card")
const inputBuscar = document.querySelector("input[type=search]")
const url = "../js/inventario.json"
const inventario = []

async function obtenerProductos(){
    try{
        const response = await fetch(url)
        if(response.ok){
            const data = await response.json()
            inventario.push(...data)      
        } else{
            throw new Error ("No se puede cargar los producto intente mas tarde")
        }
        cargarProductos(inventario)
    }
    catch (error){
        contenedor.innerHTML = retornarCardError()
    }
}
obtenerProductos()


function retornarCardHTML(producto) {
    return `<article class="card">
                <div class="justify-content-center">
                    <img class="img-fluid" src="${producto.imagen}" alt="Foto de madeja">
                </div>
                <div class="textoHover">
                    <h3>${producto.nombre}</h3>
                    <h4>$${producto.precio}</h4>
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
            let articuloElegido = buscarArticulo(idProducto)
            if (articuloElegido) {
                carro.push(articuloElegido)
                localStorage.setItem("miCarrito", JSON.stringify(carro))
                notificar(`${articuloElegido.nombre} se agrego al carrito`)
            } else {
                notificar("no hay Stock disponible")
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
function notificar(mensaje){
    Toastify({
        text:mensaje,
        duration:4000,
        close:true,
        gravity:"top",
        style: { background:"rgba(249, 113, 165)",}
    }).showToast()
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
        notificar("Debe agregar productos al carrito")
    }
})
inputBuscar.addEventListener("input", (e) => {
    const resultado = inventario.filter((inventario) => inventario.nombre.toUpperCase().includes(inputBuscar.value.trim().toUpperCase()))
    const productoSearch = inputBuscar.value.trim() !== "" ? resultado : inventario;
    cargarProductos(productoSearch);
})
selectorOrden.addEventListener("change", () => {
    const valorSeleccionado = parseInt(selectorOrden.value)
    let productosOrdenados = []
        if (valorSeleccionado === 1) {
        productosOrdenados = inventario.slice().sort((a, b) => a.precio - b.precio)
    } else if (valorSeleccionado === 2) {
        productosOrdenados = inventario.slice().sort((a, b) => b.precio - a.precio)
    } else {
        productosOrdenados = inventario.slice()
    }
    cargarProductos(productosOrdenados)
})
