
function guardarCambios() {
    const filas = document.querySelectorAll("#tablaModulos tbody tr");
    let resultado = [];
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td, select, input[type='color']");
        resultado.push({
            modulo: celdas[0].innerText.trim(),
            version: celdas[1].innerText.trim(),
            desplegar: celdas[2].value,
            color: celdas[3].value
        });
    });
    console.log("Datos guardados:", resultado);
    alert("✅ Cambios guardados en consola (simulado)");
}
