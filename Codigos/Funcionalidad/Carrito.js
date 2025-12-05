document.addEventListener("DOMContentLoaded", () => {
    // Verifica que el usuario esté conectado (si no, lo envía a login)
    if (!GestorSesion.estaLogueado()) {
        alert("⚠️ Debes iniciar sesión para ver tu carrito.\n\nSerás redirigido a la página de login.");
        window.location.href = "Inicio.html";
        return;
    }
    // Dibuja todos los productos del carrito en la pantalla
    renderizarCarrito();
    function renderizarCarrito() {
        const carrito = GestorCarrito.obtenerCarrito();
        const carritoItems = document.querySelector(".carritoItems");
        const totalP = document.querySelector(".total");
        const botonComprar = document.querySelector(".botonComprar");
        // Si el carrito está vacío, muestra mensaje
        if (carrito.length === 0) {
            carritoItems.innerHTML =
                '<p style="text-align: center; padding: 20px; color: #aaa;">Tu carrito está vacío</p>';
            totalP.textContent = "Total: $0.00";
            botonComprar.disabled = true;
            botonComprar.style.opacity = "0.5";
            botonComprar.style.cursor = "not-allowed";
            return;
        }
        // Limpia el carrito anterior y lo dibuja de nuevo
        carritoItems.innerHTML = "";
        let total = 0;
        // Recorre cada producto y lo muestra
        carrito.forEach((producto) => {
            // Extrae el precio y lo convierte a número
            const precioNumerico = parseFloat(producto.precio.replace("$", ""));
            total += precioNumerico;
            // Crea una tarjeta visual para el producto
            const itemDiv = document.createElement("div");
            itemDiv.className = "carritoItem";
            itemDiv.style.marginBottom = "20px";
            itemDiv.style.padding = "15px";
            itemDiv.style.border = "1px solid #00f0ff";
            itemDiv.style.borderRadius = "8px";
            itemDiv.style.backgroundColor = "rgba(0, 240, 255, 0.05)";
            itemDiv.style.display = "flex";
            itemDiv.style.gap = "15px";
            itemDiv.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 5px;">
        <div class="info" style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; color: #00f0ff;">${producto.nombre}</h3>
          <p class="precio" style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">${producto.precio}</p>
          <p class="descripcion" style="margin: 0; font-size: 14px; color: #ccc;">${producto.descripcion}</p>
          <button class="botonEliminar" style="margin-top: 10px; padding: 8px 15px; background-color: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Eliminar</button>
        </div>
      `;
            // Botón para eliminar este producto del carrito
            const btnEliminar = itemDiv.querySelector(".botonEliminar");
            btnEliminar.addEventListener("click", () => {
                GestorCarrito.eliminar(producto.id);
                alert("✓ Producto eliminado del carrito");
                renderizarCarrito(); // Redibujar el carrito sin este producto
            });

            carritoItems.appendChild(itemDiv);
        });
        // Actualiza el total a mostrar
        totalP.textContent = `Total: $${total.toFixed(2)}`;
        // Activa el botón de comprar
        botonComprar.disabled = false;
        botonComprar.style.opacity = "1";
        botonComprar.style.cursor = "pointer";
        // Evento para procesar la compra
        botonComprar.addEventListener("click", () => {
            // Pide confirmación del usuario
            if (confirm(`¿Deseas confirmar tu compra por $${total.toFixed(2)}?`)) {
                // Guarda la compra en el historial
                GestorHistorial.agregarCompra(carrito);
                // Vacía el carrito después de comprar
                GestorCarrito.vaciar();
                alert("✓ ¡Compra realizada exitosamente!\n\nPuedes ver tu compra en el historial.");
                renderizarCarrito(); // Redibuja para mostrar carrito vacío
            }
        });
    }
});