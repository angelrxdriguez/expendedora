var API_BASE = "http://localhost:3000";

$(document).ready(function () {
    cargarProductos();
    cargarMonedas();
    cargarBilletes();

    $(document).on("click", ".btn-sumar-producto", function () {
        var codigo = $(this).attr("data-codigo");
        sumarProducto(codigo);
    });

    $(document).on("click", ".btn-restar-producto", function () {
        var codigo = $(this).attr("data-codigo");
        restarProducto(codigo);
    });

    $(document).on("click", ".btn-sumar-moneda", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        sumarMoneda(valor);
    });

    $(document).on("click", ".btn-restar-moneda", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        restarMoneda(valor);
    });

    $(document).on("click", ".btn-sumar-billete", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        sumarBillete(valor);
    });

    $(document).on("click", ".btn-restar-billete", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        restarBillete(valor);
    });
});


function cargarProductos() {
    $.get(API_BASE + "/maquina/productos", function (datos) {
        var tbody = document.getElementById("tabla-productos");
        tbody.innerHTML = "";

        if (!datos || datos.length === 0) {
            var filaVacia = document.createElement("tr");
            var celda = document.createElement("td");
            celda.colSpan = 3;
            celda.textContent = "no hay productos";
            filaVacia.appendChild(celda);
            tbody.appendChild(filaVacia);
            return;
        }

        for (var i = 0; i < datos.length; i++) {
            var producto = datos[i];

            var fila = document.createElement("tr");

            var tdNombre = document.createElement("td");
            tdNombre.textContent = producto.nombre;

            var tdCantidad = document.createElement("td");

            var contenedorCantidad = document.createElement("div");
            contenedorCantidad.style.display = "flex";
            contenedorCantidad.style.alignItems = "center";
            contenedorCantidad.style.justifyContent = "center";
            contenedorCantidad.style.gap = "10px";

            var botonRestar = document.createElement("button");
            botonRestar.type = "button";
            botonRestar.className = "btn btn-sm btn-outline-light btn-restar-producto";
            botonRestar.setAttribute("data-codigo", producto.codigo);
            botonRestar.innerHTML = '<i class="bi bi-dash"></i>';

            var spanCantidad = document.createElement("span");
            spanCantidad.id = "cantidad-" + producto.codigo;
            spanCantidad.textContent = producto.cantidad;
            spanCantidad.style.minWidth = "30px";
            spanCantidad.style.textAlign = "center";

            var botonSumar = document.createElement("button");
            botonSumar.type = "button";
            botonSumar.className = "btn btn-sm btn-outline-light btn-sumar-producto";
            botonSumar.setAttribute("data-codigo", producto.codigo);
            botonSumar.innerHTML = '<i class="bi bi-plus"></i>';

            contenedorCantidad.appendChild(botonRestar);
            contenedorCantidad.appendChild(spanCantidad);
            contenedorCantidad.appendChild(botonSumar);

            tdCantidad.appendChild(contenedorCantidad);

            fila.appendChild(tdNombre);
            fila.appendChild(tdCantidad);

            tbody.appendChild(fila);
        }
    }).fail(function () {
        console.error("error");
        var tbody = document.getElementById("tabla-productos");
        tbody.innerHTML = "";
        var filaErr = document.createElement("tr");
        var celdaErr = document.createElement("td");
        celdaErr.colSpan = 3;
        celdaErr.textContent = "error en carga de productos";
        filaErr.appendChild(celdaErr);
        tbody.appendChild(filaErr);
    });
}

function cargarMonedas() {
    $.get(API_BASE + "/maquina/monedas", function (datos) {
        var tbody = document.getElementById("tabla-monedas");
        tbody.innerHTML = "";

        if (!datos || datos.length === 0) {
            var filaVacia = document.createElement("tr");
            var celda = document.createElement("td");
            celda.colSpan = 2;
            celda.textContent = "no hay monedas";
            filaVacia.appendChild(celda);
            tbody.appendChild(filaVacia);
            return;
        }

        for (var i = 0; i < datos.length; i++) {
            var moneda = datos[i];

            var fila = document.createElement("tr");

            var tdValor = document.createElement("td");
            tdValor.textContent = moneda.valor + " €";

            var tdCantidad = document.createElement("td");

            var contenedorCantidad = document.createElement("div");
            contenedorCantidad.style.display = "flex";
            contenedorCantidad.style.alignItems = "center";
            contenedorCantidad.style.justifyContent = "center";
            contenedorCantidad.style.gap = "10px";

            var botonRestar = document.createElement("button");
            botonRestar.type = "button";
            botonRestar.className = "btn btn-sm btn-outline-light btn-restar-moneda";
            botonRestar.setAttribute("data-valor", moneda.valor);
            botonRestar.innerHTML = '<i class="bi bi-dash"></i>';

            var spanCantidad = document.createElement("span");
            spanCantidad.id = "cantidad-moneda-" + moneda.valor;
            spanCantidad.textContent = moneda.cantidad;
            spanCantidad.style.minWidth = "30px";
            spanCantidad.style.textAlign = "center";

            var botonSumar = document.createElement("button");
            botonSumar.type = "button";
            botonSumar.className = "btn btn-sm btn-outline-light btn-sumar-moneda";
            botonSumar.setAttribute("data-valor", moneda.valor);
            botonSumar.innerHTML = '<i class="bi bi-plus"></i>';

            contenedorCantidad.appendChild(botonRestar);
            contenedorCantidad.appendChild(spanCantidad);
            contenedorCantidad.appendChild(botonSumar);

            tdCantidad.appendChild(contenedorCantidad);

            fila.appendChild(tdValor);
            fila.appendChild(tdCantidad);

            tbody.appendChild(fila);
        }
    }).fail(function () {
        console.error("Error cargando monedas");
        var tbody = document.getElementById("tabla-monedas");
        tbody.innerHTML = "";
        var filaErr = document.createElement("tr");
        var celdaErr = document.createElement("td");
        celdaErr.colSpan = 2;
        celdaErr.textContent = "error cargando mnedas";
        filaErr.appendChild(celdaErr);
        tbody.appendChild(filaErr);
    });
}

function cargarBilletes() {
    $.get(API_BASE + "/maquina/billetes", function (datos) {
        var tbody = document.getElementById("tabla-billetes");
        tbody.innerHTML = "";

        if (!datos || datos.length === 0) {
            var filaVacia = document.createElement("tr");
            var celda = document.createElement("td");
            celda.colSpan = 2;
            celda.textContent = "sin billetes";
            filaVacia.appendChild(celda);
            tbody.appendChild(filaVacia);
            return;
        }

        for (var i = 0; i < datos.length; i++) {
            var billete = datos[i];

            var fila = document.createElement("tr");

            var tdValor = document.createElement("td");
            tdValor.textContent = billete.valor + " €";

            var tdCantidad = document.createElement("td");

            var contenedorCantidad = document.createElement("div");
            contenedorCantidad.style.display = "flex";
            contenedorCantidad.style.alignItems = "center";
            contenedorCantidad.style.justifyContent = "center";
            contenedorCantidad.style.gap = "10px";

            var botonRestar = document.createElement("button");
            botonRestar.type = "button";
            botonRestar.className = "btn btn-sm btn-outline-light btn-restar-billete";
            botonRestar.setAttribute("data-valor", billete.valor);
            botonRestar.innerHTML = '<i class="bi bi-dash"></i>';

            var spanCantidad = document.createElement("span");
            spanCantidad.id = "cantidad-billete-" + billete.valor;
            spanCantidad.textContent = billete.cantidad;
            spanCantidad.style.minWidth = "30px";
            spanCantidad.style.textAlign = "center";

            var botonSumar = document.createElement("button");
            botonSumar.type = "button";
            botonSumar.className = "btn btn-sm btn-outline-light btn-sumar-billete";
            botonSumar.setAttribute("data-valor", billete.valor);
            botonSumar.innerHTML = '<i class="bi bi-plus"></i>';
            botonSumar.disabled = true; 

            contenedorCantidad.appendChild(botonRestar);
            contenedorCantidad.appendChild(spanCantidad);
            contenedorCantidad.appendChild(botonSumar);

            tdCantidad.appendChild(contenedorCantidad);

            fila.appendChild(tdValor);
            fila.appendChild(tdCantidad);

            tbody.appendChild(fila);
        }
    }).fail(function () {
        console.error("Error cargando billetes");
        var tbody = document.getElementById("tabla-billetes");
        tbody.innerHTML = "";
        var filaErr = document.createElement("tr");
        var celdaErr = document.createElement("td");
        celdaErr.colSpan = 2;
        celdaErr.textContent = "error cargando billetes";
        filaErr.appendChild(celdaErr);
        tbody.appendChild(filaErr);
    });
}


function sumarProducto(codigo) {
    $.ajax({
        url: API_BASE + "/maquina/productos/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ codigo: codigo, cantidad: 1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-" + codigo);
                if (span) {
                    span.textContent = datos.producto.cantidad;
                }
            } else {
                console.error("error al sumar", datos.error);
                alert("error: " + datos.error);
            }
        },
        error: function () {
            console.error("error de peticion");
            alert("error conectar con el servidor");
        }
    });
}

function restarProducto(codigo) {
    $.ajax({
        url: API_BASE + "/maquina/productos/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ codigo: codigo, cantidad: -1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-" + codigo);
                if (span) {
                    span.textContent = datos.producto.cantidad;
                }
            } else {
                console.error("error al restar", datos.error);
                alert("Error:" + datos.error);
            }
        },
        error: function () {
            console.error("Error en la petición");
            alert("Error al conectar con el servidor");
        }
    });
}

//monedas
function sumarMoneda(valor) {
    $.ajax({
        url: API_BASE + "/maquina/monedas/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ valor: valor, cantidad: 1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-moneda-" + valor);
                if (span) {
                    span.textContent = datos.moneda.cantidad;
                }
            } else {
                console.error("Error al sumar moneda:", datos.error);
                alert("Error al sumar moneda: " + datos.error);
            }
        },
        error: function () {
            console.error("Error en la petición");
            alert("Error al conectar con el servidor");
        }
    });
}

function restarMoneda(valor) {
    $.ajax({
        url: API_BASE + "/maquina/monedas/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ valor: valor, cantidad: -1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-moneda-" + valor);
                if (span) {
                    span.textContent = datos.moneda.cantidad;
                }
            } else {
                console.error("Error al restar moneda:", datos.error);
                alert("Error al restar moneda: " + datos.error);
            }
        },
        error: function () {
            console.error("Error en la petición");
            alert("Error al conectar con el servidor");
        }
    });
}

//billetes
function sumarBillete(valor) {
    $.ajax({
        url: API_BASE + "/maquina/billetes/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ valor: valor, cantidad: 1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-billete-" + valor);
                if (span) {
                    span.textContent = datos.billete.cantidad;
                }
            } else {
                console.error("Error al sumar billete:", datos.error);
                alert("Error al sumar billete: " + datos.error);
            }
        },
        error: function () {
            console.error("Error en la petición");
            alert("Error al conectar con el servidor");
        }
    });
}

function restarBillete(valor) {
    $.ajax({
        url: API_BASE + "/maquina/billetes/actualizar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ valor: valor, cantidad: -1 }),
        success: function (datos) {
            if (datos.ok) {
                var span = document.getElementById("cantidad-billete-" + valor);
                if (span) {
                    span.textContent = datos.billete.cantidad;
                }
            } else {
                console.error("Error al restar billete:", datos.error);
                alert("Error al restar billete: " + datos.error);
            }
        },
        error: function () {
            console.error("Error en la petición");
            alert("Error al conectar con el servidor");
        }
    });
}
