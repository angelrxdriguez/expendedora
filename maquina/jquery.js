var API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
    cargarMonedas();
    cargarBilletes();
});

function cargarProductos() {
    fetch(API_BASE + "/maquina/productos")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            var tbody = document.getElementById("tabla-productos");
            tbody.innerHTML = "";

            if (!datos || datos.length === 0) {
                var filaVacia = document.createElement("tr");
                var celda = document.createElement("td");
                celda.colSpan = 3;
                celda.textContent = "No hay productos en la máquina.";
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
                
                // Crear contenedor para cantidad y botones
                var contenedorCantidad = document.createElement("div");
                contenedorCantidad.style.display = "flex";
                contenedorCantidad.style.alignItems = "center";
                contenedorCantidad.style.justifyContent = "center";
                contenedorCantidad.style.gap = "10px";

                // Botón de restar
                var botonRestar = document.createElement("button");
                botonRestar.className = "btn btn-sm btn-outline-light";
                botonRestar.innerHTML = '<i class="bi bi-dash"></i>';
                botonRestar.onclick = function(codigo) {
                    return function() {
                        restarProducto(codigo);
                    };
                }(producto.codigo);

                // Mostrar cantidad
                var spanCantidad = document.createElement("span");
                spanCantidad.id = "cantidad-" + producto.codigo;
                spanCantidad.textContent = producto.cantidad;
                spanCantidad.style.minWidth = "30px";
                spanCantidad.style.textAlign = "center";

                // Botón de sumar
                var botonSumar = document.createElement("button");
                botonSumar.className = "btn btn-sm btn-outline-light";
                botonSumar.innerHTML = '<i class="bi bi-plus"></i>';
                botonSumar.onclick = function(codigo) {
                    return function() {
                        sumarProducto(codigo);
                    };
                }(producto.codigo);

                // Añadir elementos al contenedor
                contenedorCantidad.appendChild(botonRestar);
                contenedorCantidad.appendChild(spanCantidad);
                contenedorCantidad.appendChild(botonSumar);

                tdCantidad.appendChild(contenedorCantidad);

                fila.appendChild(tdNombre);
                fila.appendChild(tdCantidad);

                tbody.appendChild(fila);
            }
        })
        .catch(function (error) {
            console.error("Error cargando productos:", error);
            var tbody = document.getElementById("tabla-productos");
            tbody.innerHTML = "";
            var filaErr = document.createElement("tr");
            var celdaErr = document.createElement("td");
            celdaErr.colSpan = 3;
            celdaErr.textContent = "Error al cargar productos.";
            filaErr.appendChild(celdaErr);
            tbody.appendChild(filaErr);
        });
}

function cargarMonedas() {
    fetch(API_BASE + "/maquina/monedas")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            var tbody = document.getElementById("tabla-monedas");
            tbody.innerHTML = "";

            if (!datos || datos.length === 0) {
                var filaVacia = document.createElement("tr");
                var celda = document.createElement("td");
                celda.colSpan = 2;
                celda.textContent = "No hay monedas en la máquina.";
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
                
                // Crear contenedor para cantidad y botones
                var contenedorCantidad = document.createElement("div");
                contenedorCantidad.style.display = "flex";
                contenedorCantidad.style.alignItems = "center";
                contenedorCantidad.style.justifyContent = "center";
                contenedorCantidad.style.gap = "10px";

                // Botón de restar
                var botonRestar = document.createElement("button");
                botonRestar.className = "btn btn-sm btn-outline-light";
                botonRestar.innerHTML = '<i class="bi bi-dash"></i>';
                botonRestar.onclick = function(valor) {
                    return function() {
                        restarMoneda(valor);
                    };
                }(moneda.valor);

                // Mostrar cantidad
                var spanCantidad = document.createElement("span");
                spanCantidad.id = "cantidad-moneda-" + moneda.valor;
                spanCantidad.textContent = moneda.cantidad;
                spanCantidad.style.minWidth = "30px";
                spanCantidad.style.textAlign = "center";

                // Botón de sumar
                var botonSumar = document.createElement("button");
                botonSumar.className = "btn btn-sm btn-outline-light";
                botonSumar.innerHTML = '<i class="bi bi-plus"></i>';
                botonSumar.onclick = function(valor) {
                    return function() {
                        sumarMoneda(valor);
                    };
                }(moneda.valor);

                // Añadir elementos al contenedor
                contenedorCantidad.appendChild(botonRestar);
                contenedorCantidad.appendChild(spanCantidad);
                contenedorCantidad.appendChild(botonSumar);

                tdCantidad.appendChild(contenedorCantidad);

                fila.appendChild(tdValor);
                fila.appendChild(tdCantidad);

                tbody.appendChild(fila);
            }
        })
        .catch(function (error) {
            console.error("Error cargando monedas:", error);
            var tbody = document.getElementById("tabla-monedas");
            tbody.innerHTML = "";
            var filaErr = document.createElement("tr");
            var celdaErr = document.createElement("td");
            celdaErr.colSpan = 2;
            celdaErr.textContent = "Error al cargar monedas.";
            filaErr.appendChild(celdaErr);
            tbody.appendChild(filaErr);
        });
}

function cargarBilletes() {
    fetch(API_BASE + "/maquina/billetes")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            var tbody = document.getElementById("tabla-billetes");
            tbody.innerHTML = "";

            if (!datos || datos.length === 0) {
                var filaVacia = document.createElement("tr");
                var celda = document.createElement("td");
                celda.colSpan = 2;
                celda.textContent = "No hay billetes en la máquina.";
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
                
                // Crear contenedor para cantidad y botones
                var contenedorCantidad = document.createElement("div");
                contenedorCantidad.style.display = "flex";
                contenedorCantidad.style.alignItems = "center";
                contenedorCantidad.style.justifyContent = "center";
                contenedorCantidad.style.gap = "10px";

                // Botón de restar
                var botonRestar = document.createElement("button");
                botonRestar.className = "btn btn-sm btn-outline-light";
                botonRestar.innerHTML = '<i class="bi bi-dash"></i>';
                botonRestar.onclick = function(valor) {
                    return function() {
                        restarBillete(valor);
                    };
                }(billete.valor);

                // Mostrar cantidad
                var spanCantidad = document.createElement("span");
                spanCantidad.id = "cantidad-billete-" + billete.valor;
                spanCantidad.textContent = billete.cantidad;
                spanCantidad.style.minWidth = "30px";
                spanCantidad.style.textAlign = "center";

                // Botón de sumar (deshabilitado para billetes)
                var botonSumar = document.createElement("button");
                botonSumar.className = "btn btn-sm btn-outline-light";
                botonSumar.innerHTML = '<i class="bi bi-plus"></i>';
                botonSumar.disabled = true;

                // Añadir elementos al contenedor
                contenedorCantidad.appendChild(botonRestar);
                contenedorCantidad.appendChild(spanCantidad);
                contenedorCantidad.appendChild(botonSumar);

                tdCantidad.appendChild(contenedorCantidad);

                fila.appendChild(tdValor);
                fila.appendChild(tdCantidad);

                tbody.appendChild(fila);
            }
        })
        .catch(function (error) {
            console.error("Error cargando billetes:", error);
            var tbody = document.getElementById("tabla-billetes");
            tbody.innerHTML = "";
            var filaErr = document.createElement("tr");
            var celdaErr = document.createElement("td");
            celdaErr.colSpan = 2;
            celdaErr.textContent = "Error al cargar billetes.";
            filaErr.appendChild(celdaErr);
            tbody.appendChild(filaErr);
        });
}

// Función para sumar 1 a la cantidad de un producto
function sumarProducto(codigo) {
    fetch(API_BASE + "/maquina/productos/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            codigo: codigo,
            cantidad: 1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-" + codigo);
            if (spanCantidad) {
                spanCantidad.textContent = datos.producto.cantidad;
            }
        } else {
            console.error("Error al sumar producto:", datos.error);
            alert("Error al sumar producto: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}

// Función para restar 1 a la cantidad de un producto
function restarProducto(codigo) {
    fetch(API_BASE + "/maquina/productos/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            codigo: codigo,
            cantidad: -1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-" + codigo);
            if (spanCantidad) {
                spanCantidad.textContent = datos.producto.cantidad;
            }
        } else {
            console.error("Error al restar producto:", datos.error);
            alert("Error al restar producto: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}

// Función para sumar 1 a la cantidad de una moneda
function sumarMoneda(valor) {
    fetch(API_BASE + "/maquina/monedas/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valor: valor,
            cantidad: 1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-moneda-" + valor);
            if (spanCantidad) {
                spanCantidad.textContent = datos.moneda.cantidad;
            }
        } else {
            console.error("Error al sumar moneda:", datos.error);
            alert("Error al sumar moneda: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}

// Función para restar 1 a la cantidad de una moneda
function restarMoneda(valor) {
    fetch(API_BASE + "/maquina/monedas/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valor: valor,
            cantidad: -1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-moneda-" + valor);
            if (spanCantidad) {
                spanCantidad.textContent = datos.moneda.cantidad;
            }
        } else {
            console.error("Error al restar moneda:", datos.error);
            alert("Error al restar moneda: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}

// Función para sumar 1 a la cantidad de un billete
function sumarBillete(valor) {
    fetch(API_BASE + "/maquina/billetes/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valor: valor,
            cantidad: 1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-billete-" + valor);
            if (spanCantidad) {
                spanCantidad.textContent = datos.billete.cantidad;
            }
        } else {
            console.error("Error al sumar billete:", datos.error);
            alert("Error al sumar billete: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}

// Función para restar 1 a la cantidad de un billete
function restarBillete(valor) {
    fetch(API_BASE + "/maquina/billetes/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valor: valor,
            cantidad: -1
        })
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        if (datos.ok) {
            // Actualizar la cantidad mostrada en la tabla
            var spanCantidad = document.getElementById("cantidad-billete-" + valor);
            if (spanCantidad) {
                spanCantidad.textContent = datos.billete.cantidad;
            }
        } else {
            console.error("Error al restar billete:", datos.error);
            alert("Error al restar billete: " + datos.error);
        }
    })
    .catch(function(error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    });
}
