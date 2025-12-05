document.addEventListener("DOMContentLoaded", () => {
  // Verifica que el usuario esté conectado (si no, lo envía a login)
  if (!GestorSesion.estaLogueado()) {
    alert("⚠️ Debes iniciar sesión para ver tu historial.\n\nSerás redirigido a la página de login.");
    window.location.href = "Inicio.html";
    return;
  }

  // Dibuja todas las compras del usuario
  renderizarHistorial();

  function renderizarHistorial() {
    // Obtener historial global y filtrar solo las compras del usuario actual
    const usuario = GestorSesion.obtenerUsuarioLogueado();
    let historial = GestorHistorial.obtenerHistorial();
    if (usuario) {
      historial = historial.filter((h) => h.compradorCorreo === usuario.correo);
    }
    const historialItems = document.querySelector(".historialItems");

    // Si no hay compras, muestra un mensaje
    if (historialItems && historial.length === 0) {
      historialItems.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #aaa;">No tienes compras registradas aún</p>';
      return;
    }

    // Si hay compras, las dibuja
    if (historialItems && historial.length > 0) {
      historialItems.innerHTML = "";

      // Invierte el orden para mostrar las más recientes primero
      historial.reverse().forEach((compra) => {
        // Crea una tarjeta para cada compra
        const compraDiv = document.createElement("div");
        compraDiv.style.marginBottom = "20px";
        compraDiv.style.padding = "15px";
        compraDiv.style.border = "1px solid #00f0ff";
        compraDiv.style.borderRadius = "8px";
        compraDiv.style.backgroundColor = "rgba(0, 240, 255, 0.05)";

        // Construye la lista de productos de esta compra
        let productosHTML = "";
        compra.productos.forEach((p) => {
          productosHTML += `
            <div style="margin-bottom: 10px;">
              <strong>${p.nombre}</strong> - ${p.precio}
            </div>
          `;
        });

        // Llena la tarjeta con la información de la compra
        compraDiv.innerHTML = `
          <p><strong>Fecha:</strong> ${compra.fecha} ${compra.hora}</p>
          <p><strong>Productos:</strong></p>
          <div style="margin-left: 15px;">
            ${productosHTML}
          </div>
          <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
        `;

        historialItems.appendChild(compraDiv);
      });
    }
  }
});
