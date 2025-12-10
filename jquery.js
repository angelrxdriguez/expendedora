var totalmaquina = 0;
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("num");
    const limpiar = document.getElementById("num-limpiar");
    const borrar = document.getElementById("num-borrar");
    const numeros = document.querySelectorAll(".btn-num");

    const agregar = (valor) => {
        if (display.textContent === "PIDE") display.textContent = "";
        if (display.textContent.length >= 2) return; 
        display.textContent += valor;
    };

    numeros.forEach((btn) => {
        const id = btn.id;
        if (id === "num-limpiar" || id === "num-borrar") return; 
        btn.addEventListener("click", () => agregar(btn.textContent.trim()));
    });

    limpiar.addEventListener("click", () => { 
        display.textContent = "";
    });

    borrar.addEventListener("click", () => {
        display.textContent = display.textContent.slice(0, -1);
        if (!display.textContent) display.textContent = "PIDE";
    });
    const candadoBtn = document.querySelector(".btn-candado");
    candadoBtn.addEventListener("click", () => {
        window.location.href = "./maquina/maquina.html";
    });

    // Función para actualizar el display del total en el modal y en el contador
    function actualizarTotalModal() {
        const totalDisplay = document.getElementById("total-maquina-modal");
        if (totalDisplay) {
            totalDisplay.textContent = totalmaquina.toFixed(2) + "€";
        }
        const dineroIngresado = document.querySelector(".dinero-ingresado");
        if (dineroIngresado) {
            dineroIngresado.textContent = totalmaquina.toFixed(2) + "€";
        }
    }

    function guardarDineroEnMaquina(tipo, valor) {
        const endpoint = tipo === "billete"
            ? "/maquina/billetes/actualizar"
            : "/maquina/monedas/actualizar";

        fetch(API_URL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: valor, cantidad: 1 })
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error("No se pudo guardar el " + tipo);
            }
            return resp.json();
        })
        .then(() => {
            totalmaquina += valor;
            actualizarTotalModal();
        })
        .catch((err) => {
            console.error("Error guardando " + tipo + ":", err);
        });
    }

    // Event listeners para los botones de billetes y monedas del modal
    document.querySelectorAll(".btn-billete-modal").forEach((btn) => {
        btn.addEventListener("click", () => {
            const valor = parseFloat(btn.getAttribute("data-valor"));
            guardarDineroEnMaquina("billete", valor);
        });
    });

    document.querySelectorAll(".btn-moneda-modal").forEach((btn) => {
        btn.addEventListener("click", () => {
            const valor = parseFloat(btn.getAttribute("data-valor"));
            guardarDineroEnMaquina("moneda", valor);
        });
    });

    // Actualizar el total cuando se abre el modal
    const modalIngresar = document.getElementById("modalIngresar");
    if (modalIngresar) {
        modalIngresar.addEventListener("show.bs.modal", () => {
            actualizarTotalModal();
        });
    }
});

// Función para actualizar el inventario del usuario
function actualizarInventario() {
    // Hacemos una petición GET a la API para obtener los productos del usuario
    $.get(API_URL + "/usuario/productos", function(inventario) {
        // Recorremos cada producto del inventario
        inventario.forEach(function(producto) {
            if (producto.codigo === "00") {
                $("#num-cajas1").text(producto.cantidad);
            } else if (producto.codigo === "01") {
                $("#num-cajas2").text(producto.cantidad);
            } else if (producto.codigo === "02") {
                $("#num-cajas3").text(producto.cantidad);
            } else if (producto.codigo === "03") {
                $("#num-cajas4").text(producto.cantidad);
            }
        });
    }).fail(function() {
        console.error("Error al cargar el inventario");
    });
}

function actualizarDinero() {
    $.get(API_URL + "/usuario", function(usuario) {
        $("#dinero-usuario").text(usuario.dinero + "€");
    }).fail(function() {
        console.error("Error al cargar el dinero del usuario");
    });
}

$(document).ready(function() {
    actualizarInventario();
    actualizarDinero();
});
