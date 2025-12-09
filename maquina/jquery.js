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

                var tdCodigo = document.createElement("td");
                tdCodigo.textContent = producto.codigo;

                var tdCantidad = document.createElement("td");
                tdCantidad.textContent = producto.cantidad;

                fila.appendChild(tdNombre);
            //    fila.appendChild(tdCodigo);
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
                tdCantidad.textContent = moneda.cantidad;

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
                tdCantidad.textContent = billete.cantidad;

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
