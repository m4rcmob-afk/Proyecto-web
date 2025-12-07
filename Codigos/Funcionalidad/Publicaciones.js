/*
  Publicaciones.js
  - Página "Mis Publicaciones" donde el vendedor puede ver y ocultar sus productos.
  - Marca `visible = false` para ocultar productos y notifica a otras pestañas.
*/
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".publicacionesItems");

  if (!GestorSesion.estaLogueado()) {
    alert("⚠️ Debes iniciar sesión para ver tus publicaciones.");
    window.location.href = "Inicio.html";
    return;
  }
  renderizarPublicaciones();
  function renderizarPublicaciones() {
    const usuario = GestorSesion.obtenerUsuarioLogueado();
    // Trae solo los productos del usuario y que estén visibles (no eliminados)
    const productos = GestorProductos.obtenerProductos().filter(
      (p) => p && p.vendedor && p.vendedor.correo === usuario.correo && p.visible !== false
    );
    contenedor.innerHTML = "";
    if (productos.length === 0) {
      contenedor.innerHTML = '<p style="color:#aaa; padding:20px; text-align:center;">No has publicado productos aún.</p>';
      return;
    }
    productos.forEach((producto) => {
      // Si el producto fue ocultado, lo mostramos como eliminado
      const estado = producto.visible === false ? "(Oculto)" : "";
      const card = document.createElement("div");
      card.className = "producto";
      card.style.marginBottom = "15px";
      card.style.padding = "12px";
      card.style.borderRadius = "8px";
      // Badge de categoria para mayor claridad
      const categoriaLabel = producto.categoria || "categoria";
      const badgeClass = `categoria-${categoriaLabel}`;
      card.innerHTML = `
        <div style="display:flex; gap:12px; align-items:center;">
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width:120px; height:120px; object-fit:cover; border-radius:4px;">
          <div style="flex:1;">
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
              <span class="categoria-badge ${badgeClass}">${(categoriaLabel||'').toUpperCase()}</span>
              <h3 style="margin:0 0 0 6px;">${producto.nombre} ${estado}</h3>
            </div>
            <p style="margin:6px 0 6px 0; font-weight:bold;">$${producto.precio}</p>
            <p style="margin:0; color:#ccc;">${producto.caracteristicas || producto.descripcion}</p>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn-ocultar" data-id="${producto.id}" style="background:#ff6666; border:none; color:white; padding:8px 10px; border-radius:6px; cursor:pointer;">Eliminar</button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });
    // asignar eventos de eliminar
    contenedor.querySelectorAll(".btn-ocultar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.getAttribute("data-id"));
        if (!confirm("¿Deseas eliminar esta publicación? Esto la ocultará de la tienda pública.")) return;
        // Marca el producto como no visible
        const todos = GestorProductos.obtenerProductos();
        const idx = todos.findIndex((p) => Number(p.id) === Number(id));
        if (idx !== -1) {
          todos[idx].visible = false;
          localStorage.setItem("deltastore_productos", JSON.stringify(todos));
          alert("✓ Publicación eliminada (oculta) correctamente.");
          // Refrescar la vista actual sin recargar la página
          renderizarPublicaciones();
          // Notificar otras pestañas que el catálogo cambió
          window.dispatchEvent(new Event('productosActualizados'));
        } else {
          alert("No se encontró la publicación.");
        }
      });
    });
  }
});
