document.addEventListener("DOMContentLoaded", () => {
    // Verifica que el usuario esté conectado (si no, lo envía a login)
    if (!GestorSesion.estaLogueado()) {
        alert(
            "⚠️ Debes iniciar sesión para agregar productos.\n\nSerás redirigido a la página de login."
        );
        window.location.href = "Inicio.html";
        return;
    }
    const form = document.getElementById("formProducto");
    // Cuando el usuario envía el formulario de producto
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Obtiene todos los datos del formulario
        const titulo = document.getElementById("titulo").value.trim();
        const categoria = document.getElementById("categoria").value;
        const caracteristicas = document.getElementById("caracteristicas").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const precioInput = document.getElementById("precio").value.trim();
        const imagenInput = document.getElementById("imagen");
        // Verifica que haya un nombre para el producto
        if (!titulo) {
            alert("❌ El nombre del producto es obligatorio.");
            document.getElementById("titulo").focus();
            return;
        }
        // Verifica que haya seleccionado una categoría
        if (!categoria) {
            alert("❌ Debes seleccionar una categoría.");
            document.getElementById("categoria").focus();
            return;
        }
        // Verifica que tenga características
        if (!caracteristicas) {
            alert("❌ Las características son obligatorias.");
            document.getElementById("caracteristicas").focus();
            return;
        }
        // Verifica que tenga una descripción
        if (!descripcion) {
            alert("❌ La descripción es obligatoria.");
            document.getElementById("descripcion").focus();
            return;
        }
        // Verifica que haya subido una imagen
        if (!imagenInput.files || imagenInput.files.length === 0) {
            alert("❌ La imagen del producto es obligatoria.");
            imagenInput.focus();
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            // Crea el objeto del producto con todos los datos
            const producto = {
                nombre: titulo,
                categoria: categoria,
                caracteristicas: caracteristicas,
                descripcion: descripcion,
                imagen: e.target.result, // Imagen en formato base64
                // Usa el precio ingresado por el usuario; si no es válido, genera uno de demostración
                precio: (function () {
                    const v = parseFloat(precioInput);
                    return !isNaN(v) && v >= 0 ? v : Math.floor(Math.random() * 500) + 50;
                })(),
            };
            // Intenta guardar el producto
            if (GestorProductos.guardar(producto)) {
                alert(
                    `✓ Producto "${titulo}" agregado correctamente.\n\nAhora aparecerá en la página principal.`
                );
                // Redirecciona a la página principal después de 1 segundo
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                alert("❌ No se pudo guardar el producto. Intenta de nuevo.");
            }
        };
        // Lee el archivo de imagen seleccionado
        reader.readAsDataURL(imagenInput.files[0]);
    });
});