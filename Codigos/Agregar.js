document.getElementById("formProducto").addEventListener("submit", function (event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const caracteristicas = document.getElementById("caracteristicas").value;
    const descripcion = document.getElementById("descripcion").value;
    const alias = document.getElementById("alias").value;
    const nombreCompleto = document.getElementById("nombreCompleto").value;
    const telefono = document.getElementById("telefono").value;
    alert(`Producto "${titulo}" subido correctamente.\nAlias: ${alias}\nTeléfono: ${telefono}`);
    window.location.href = "Interfaz.html";
});