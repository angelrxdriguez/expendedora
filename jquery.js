document.addEventListener("DOMContentLoaded", () => {
var totalmaquina = 0;
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

});

// URL de la API
const API_URL = "http://localhost:3000";

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
