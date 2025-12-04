
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

});
