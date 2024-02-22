const tableBody = document.querySelector("table tbody")
const botonEliminar = document.querySelector(".boton-eliminar")
const formularioCheckout = document.getElementById("formularioCheckout")

function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) || []
}

const carro = recuperarCarrito()

cargarCarrito()
activarClickEnBotonesEliminar()

function armarFilaHTML(producto) {
    return `<tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$ ${producto.precio}</td>
                <td id="${producto.id}" data-eliminar class="boton-eliminar" title="Eliminar"><img src="../assets/icons/basura.png" alt="Quitar producto"></td>
            </tr>`
}
function activarClickEnBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll("td[data-eliminar]")
    for (let botonEliminar of botonesEliminar) {
        botonEliminar.addEventListener("click", () => {
            let idEliminar = botonEliminar.id
            eliminarProducto(idEliminar);
        })
    }
}
function eliminarProducto(id){
    const indice = carro.findIndex(producto => producto.id === parseInt(id))
        if (indice !== -1) {
            carro.splice(indice, 1);
            localStorage.setItem("miCarrito", JSON.stringify(carro))
            actualizarTablaCarrito();
        }
}
function actualizarTablaCarrito() {
    tableBody.innerHTML = "";
    carro.forEach((producto) => {
        tableBody.innerHTML += armarFilaHTML(producto);
    });
    const totalCarrito = calcularTotalCarrito();
    if (totalCarrito) {
        tableBody.innerHTML += totalCarrito;
    } else {
        tableBody.innerHTML = armarTablaVacia();
    }
    activarClickEnBotonesEliminar();
}
function calcularTotalCarrito() {
    const shopping = new Compra(carro)
    const total = shopping.obtenerSubtotal()
    if(total){
        return `<tr><td class="presupuestoTotal" colspan="2">TOTAL DE LA COMPRA</td>
                    <td>$ ${total}</td>
                </tr>`
        }
        else{
            return ""
        }
}
function armarTablaVacia(){
    tableBody.innerHTML = ""
    return `<tr>
        <td>Carrito vacío</td>
        <td>Agrega artículos para poder verlos</td>
        <td>$00</td>
        <td class="boton-eliminar" title="Eliminar" disabled><img src="../assets/icons/basura.png" alt="Quitar producto"></td>
    </tr>`
}
function cargarCarrito(){
    actualizarTablaCarrito()
}

function mensajeFinal(){
    Swal.fire({
        title: "Pedido Realizado con éxito",
        text: "Tejido con amor, enviado con cuidado. Disfruta de tu creación mientras nos ocupamos del resto. ¡Gracias por elegirnos para tus proyectos de lana!.",
        imageUrl: "../assets/images/mensajefinal.jpg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Corazones en lana",
        showConfirmButton: true,
        confirmButtonText:"Inicio",
        showCancelButton: true,
        cancelButtonText:"ver catalogo",
    })
    .then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../index.html'
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = 'catalogo.html'
        }
    })
}

formularioCheckout.addEventListener("submit", function (event) {
    event.preventDefault();
    const botonComprar = document.querySelector("#formularioCheckout button")
    botonComprar.disabled = true
    botonComprar.classList.add("btnDisabled")
    localStorage.removeItem("miCarrito")
    carro.length = 0
    tableBody.innerHTML = ""
    tableBody.innerHTML += armarTablaVacia()
    setTimeout(() => {
        mensajeFinal()
    }, 1000);
    
})
