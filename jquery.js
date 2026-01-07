var totalmaquina = 0;
var API_URL = "http://localhost:3000";
var precios = {
    "00": 1,
    "01": 2,
    "02": 5,
    "03": 15,
    "04": 70
};


function actualizarTotalModal() {
    var texto = totalmaquina.toFixed(2) + "€";

    var $total = $("#total-maquina-modal");
    if ($total.length) {
        $total.text(texto);
    }

    var $dineroIngresado = $(".dinero-ingresado");
    if ($dineroIngresado.length) {
        $dineroIngresado.text(texto);
    }
}

function mostrarMensaje(texto) {
    var $alerta = $(".alerta");
    if ($alerta.length) {
        $alerta.text(texto);
    } else {
        console.log(texto);
    }
}

function actualizarFotosStock() {
    $.get(API_URL + "/maquina/productos", function (productos) {
        $(".producto").each(function () {
            var $card = $(this);
            var codigo = $.trim($card.find(".codigo").text());
            var img = $card.find("img")[0];

            if (!codigo || !img) {
                return;
            }

            var datos = null;
            for (var i = 0; i < productos.length; i++) {
                if (productos[i].codigo === codigo) {
                    datos = productos[i];
                    break;
                }
            }

            var hayStock = datos && datos.cantidad > 0;
            img.style.visibility = hayStock ? "visible" : "hidden";
        });
    }).fail(function () {
        console.error("Error mostrando stock");
    });
}

function guardarDineroMaquina(tipo, valor) {
    var endpoint;
    if (tipo === "billete") {
        endpoint = "/maquina/billetes/actualizar";
    } else {
        endpoint = "/maquina/monedas/actualizar";
    }

    $.ajax({
        url: API_URL + endpoint,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ valor: valor, cantidad: 1 }),
        success: function () {
            totalmaquina += valor;
            actualizarTotalModal();
        },
        error: function () {
            console.error("Error guardando " + tipo);
        }
    });
}

function calcularCambio(totalDevolver, monedasDisponibles) {
    var cambio = [];
    var restante = totalDevolver;
    
    // Ordenar monedas de mayor a menor valor
    var monedasOrdenadas = monedasDisponibles.slice();
    monedasOrdenadas.sort(function(a, b) {
        return b.valor - a.valor;
    });
    
    // Calcular qué monedas devolver
    for (var i = 0; i < monedasOrdenadas.length; i++) {
        var moneda = monedasOrdenadas[i];
        if (moneda.cantidad > 0 && restante >= moneda.valor) {
            var cantidadUsar = Math.floor(restante / moneda.valor);
            if (cantidadUsar > moneda.cantidad) {
                cantidadUsar = moneda.cantidad;
            }
            
            if (cantidadUsar > 0) {
                cambio.push({
                    valor: moneda.valor,
                    cantidad: cantidadUsar
                });
                restante = restante - (cantidadUsar * moneda.valor);
                restante = Math.round(restante * 100) / 100;  //redondear por el bug
            }
        }
    }
    
    return cambio;
}

function mensajeCambio(cambio) {
    if (cambio.length === 0) {
        return "Vuelta: 0€";
    }
    
    var mensaje = "Vuelta: ";
    var partes = [];
    
    for (var i = 0; i < cambio.length; i++) {
        var valorTexto = cambio[i].valor.toString();
        if (valorTexto.indexOf(".") !== -1) {
            valorTexto = valorTexto.replace(".", ",");
        }
        var texto = valorTexto + " euro";
        if (cambio[i].valor !== 1) {
            texto = texto + "s";
        }
        texto = texto + ": " + cambio[i].cantidad;
        partes.push(texto);
    }
    
    mensaje = mensaje + partes.join(", ");
    return mensaje;
}

function devolverMonedas(cambio) {
    if (cambio.length === 0) {
        return;
    }
    
    for (var i = 0; i < cambio.length; i++) {
        (function(moneda) {
            $.ajax({
                url: API_URL + "/maquina/monedas/actualizar",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ 
                    valor: moneda.valor, 
                    cantidad: -moneda.cantidad 
                }),
                success: function() {
                    },
                error: function() {
                    console.error("Error actualizando moneda " + moneda.valor);
                }
            });
        })(cambio[i]);
    }
}

function comprarProducto() {
    var codigo = $.trim($("#num").text());
    var precio = precios[codigo];

    if (!codigo || codigo === "PIDE" || typeof precio !== "number") {
        mostrarMensaje("Introduce un código válido.");
        return;
    }

    $.get(API_URL + "/maquina/productos", function (productos) {
        var producto = null;
        for (var i = 0; i < productos.length; i++) {
            if (productos[i].codigo === codigo) {
                producto = productos[i];
                break;
            }
        }

        if (!producto || producto.cantidad <= 0) {
            mostrarMensaje("Producto agotado.");
            return;
        }

        if (totalmaquina < precio) {
            var falta = (precio - totalmaquina).toFixed(2);
            mostrarMensaje("Faltan " + falta + "€ para comprar.");
            return;
        }

        $.ajax({
            url: API_URL + "/maquina/productos/actualizar",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ codigo: codigo, cantidad: -1 }),
            success: function () {
                totalmaquina -= precio;
                if (totalmaquina < 0) {
                    totalmaquina = 0;
                }
                actualizarTotalModal();
                
                $.get(API_URL + "/maquina/monedas", function (monedas) {
                    var cambio = calcularCambio(totalmaquina, monedas);
                    var mensaje = mensajeCambio(cambio);
                    mostrarMensaje(mensaje);
                    
                    devolverMonedas(cambio);
                    
                    totalmaquina = 0;
                    actualizarTotalModal();
                }).fail(function() {
                    mostrarMensaje("Total a devolver: " + totalmaquina.toFixed(2) + "€");
                    totalmaquina = 0;
                    actualizarTotalModal();
                });
                
                actualizarFotosStock();
            },
            error: function () {
                mostrarMensaje("Error al comprar, inténtalo de nuevo.");
            }
        });
    }).fail(function () {
        mostrarMensaje("Error al comprar, inténtalo de nuevo.");
    });
}


function actualizarInventario() {
    $.get(API_URL + "/usuario/productos", function (inventario) {
        for (var i = 0; i < inventario.length; i++) {
            var producto = inventario[i];
            if (producto.codigo === "00") {
                $("#num-cajas1").text(producto.cantidad);
            } else if (producto.codigo === "01") {
                $("#num-cajas2").text(producto.cantidad);
            } else if (producto.codigo === "02") {
                $("#num-cajas3").text(producto.cantidad);
            } else if (producto.codigo === "03") {
                $("#num-cajas4").text(producto.cantidad);
            }
        }
    }).fail(function () {
        console.error("Error al cargar el inventario");
    });
}

function actualizarDinero() {
    $.get(API_URL + "/usuario", function (usuario) {
        $("#dinero-usuario").text(usuario.dinero + "€");
    }).fail(function () {
        console.error("Error al cargar el dinero del usuario");
    });
}


$(document).ready(function () {
    var $display = $("#num");

    function agregar(valor) {
        var texto = $display.text();

        if (texto === "PIDE") {
            texto = "";
        }
        if (texto.length >= 2) {
            return;
        }
        texto = texto + valor;
        $display.text(texto);
    }

    $(".btn-num").each(function () {
        var id = this.id;
        if (id === "num-limpiar" || id === "num-borrar") {
            return;
        }
        $(this).on("click", function () {
            var valor = $.trim($(this).text());
            agregar(valor);
        });
    });

    $("#num-limpiar").on("click", function () {
        $display.text("");
    });

    $("#num-borrar").on("click", function () {
        var texto = $display.text();
        texto = texto.slice(0, -1);
        if (texto === "") {
            texto = "PIDE";
        }
        $display.text(texto);
    });

    $(".btn-candado").on("click", function () {
        window.location.href = "./maquina/maquina.html";
    });

    $(".btn-billete-modal").on("click", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        guardarDineroMaquina("billete", valor);
    });

    $(".btn-moneda-modal").on("click", function () {
        var valor = parseFloat($(this).attr("data-valor"));
        guardarDineroMaquina("moneda", valor);
    });

    $("#modalIngresar").on("show.bs.modal", function () {
        actualizarTotalModal();
    });

    $(".btn-comprar").on("click", function () {
        comprarProducto();
    });

    actualizarFotosStock();
    actualizarInventario();
    actualizarDinero();
});
