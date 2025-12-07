/*
    index.js
    - Interacciones generales del sitio: menú lateral, perfil en header, búsqueda y carga dinámica de productos.
    - Añadimos listeners con guardas para evitar duplicados y comprobaciones para UX móvil.
*/
document.addEventListener("DOMContentLoaded", () => {
    // Permite abrir y cerrar el menú en dispositivos móviles
    const abrirMenu = document.getElementById("abrirMenu");
    const menuLateral = document.getElementById("menuLateral");
    abrirMenu.addEventListener("click", () => {
        menuLateral.classList.toggle("activo");
    });
    // Cerrar el menú lateral si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        const abierto = menuLateral && menuLateral.classList.contains('activo');
        if (abierto) {
            // si el clic no ocurrió dentro del menú ni sobre el botón que lo abre, cerrarlo
            if (!menuLateral.contains(e.target) && !abrirMenu.contains(e.target)) {
                menuLateral.classList.remove('activo');
            }
        }
    });
    // Cerrar el menú lateral al navegar por cualquiera de sus enlaces (mejora UX en móvil)
    if (menuLateral) {
        const links = menuLateral.querySelectorAll('a');
        links.forEach((lnk) => {
            lnk.addEventListener('click', () => {
                if (menuLateral.classList.contains('activo')) menuLateral.classList.remove('activo');
            });
        });
    }
    // Muestra el perfil del usuario conectado o el botón de login
    actualizarEstadoUsuario();
    // Escucha cuando alguien inicia o cierra sesión (en cualquier pestaña)
    window.addEventListener("usuarioLogueado", actualizarEstadoUsuario);
    window.addEventListener("usuarioCerrado", actualizarEstadoUsuario);
    // Listener único para cerrar cualquier menú-perfil al hacer clic fuera (evita duplicados)
    document.addEventListener("click", (e) => {
        const abierto = document.querySelector(".menu-perfil.activo");
        if (abierto && !abierto.parentElement.contains(e.target)) {
            abierto.classList.remove("activo");
        }
    });
    function actualizarEstadoUsuario() {
        const usuario = GestorSesion.obtenerUsuarioLogueado();
        const acciones = document.querySelector(".acciones");
        const botonLogin = document.querySelector(".boton-login");
        if (usuario) {
            // El usuario está conectado: mostrar su perfil
            if (botonLogin) {
                botonLogin.style.display = "none";
            }
            // Crear o actualizar el menú del perfil
            let perfil = document.querySelector(".perfil-usuario");
            let creadoAhora = false;
            if (!perfil) {
                perfil = document.createElement("div");
                perfil.className = "perfil-usuario";
                acciones.insertBefore(perfil, botonLogin);
                creadoAhora = true;
            }
            perfil.innerHTML = `
        <div class="perfil-menu">
          <button class="btn-perfil">👤 ${usuario.alias || usuario.nombre}</button>
                    <div class="menu-perfil">
                        <a href="Carrito.html" class="menu-item">🛒 Carrito</a>
                        <a href="Historial.html" class="menu-item">📜 Historial</a>
                        <a href="Agregar.html" class="menu-item">➕ Agregar Producto</a>
                        <a href="Publicaciones.html" class="menu-item">🗂️ Mis Publicaciones</a>
                        <button class="menu-item logout-btn">🚪 Cerrar Sesión</button>
                    </div>
        </div>
      `;
            // Configurar eventos del menú perfil (solo si acabamos de crear el nodo)
            const btnPerfil = perfil.querySelector(".btn-perfil");
            const menuPerfil = perfil.querySelector(".menu-perfil");
            const logoutBtn = perfil.querySelector(".logout-btn");
            if (creadoAhora) {
                // Abre/cierra el menú al hacer clic en el botón del perfil
                btnPerfil.addEventListener("click", (e) => {
                    e.stopPropagation();
                    menuPerfil.classList.toggle("activo");
                });
                // Cierra sesión con confirmación
                logoutBtn.addEventListener("click", () => {
                    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                        GestorSesion.cerrarSesion();
                        alert("✓ Sesión cerrada correctamente");
                        actualizarEstadoUsuario();
                    }
                });
            }

            // --- Añadir versión del perfil dentro del menú lateral para dispositivos móviles
            const menuUl = document.querySelector('#menuLateral nav ul');
            if (menuUl) {
                let mobilePerfil = menuUl.querySelector('.perfil-mobile');
                if (!mobilePerfil) {
                    mobilePerfil = document.createElement('li');
                    mobilePerfil.className = 'perfil-mobile';
                    menuUl.insertBefore(mobilePerfil, menuUl.firstChild);
                }
                const correo = usuario.correo || '';
                mobilePerfil.innerHTML = `
                    <div style="padding:12px 8px;border-bottom:1px solid rgba(255,255,255,0.05)">
                        <strong>${usuario.nombre || usuario.alias || 'Usuario'}</strong><br>
                        <small>${correo}</small>
                    </div>
                    <a href="Publicaciones.html">📦 Mis Publicaciones</a>
                    <button id="mobileCerrarSesion" style="display:block;margin:10px 8px;padding:8px;border-radius:6px;">Cerrar Sesión</button>
                `;
                const logoutBtn = mobilePerfil.querySelector('#mobileCerrarSesion');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                            GestorSesion.cerrarSesion();
                            // cerrar menú lateral si está abierto
                            const menuLateral = document.getElementById('menuLateral');
                            if (menuLateral && menuLateral.classList.contains('activo')) menuLateral.classList.remove('activo');
                            actualizarEstadoUsuario();
                        }
                    });
                }
            }
        } else {
            // El usuario no está conectado: mostrar botón login
            const perfil = document.querySelector(".perfil-usuario");
            if (perfil) {
                perfil.remove();
            }
            if (botonLogin) {
                botonLogin.style.display = "inline-block";
            }
            // Eliminar la entrada móvil de perfil si existe
            const menuUl = document.querySelector('#menuLateral nav ul');
            if (menuUl) {
                const mobilePerfil = menuUl.querySelector('.perfil-mobile');
                if (mobilePerfil) mobilePerfil.remove();
            }
        }
    }
    // Permite comprar los productos ya existentes en la página
    document.querySelectorAll(".producto button").forEach((btn) => {
        if (btn.textContent.includes("Agregar al carrito")) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                // Verifica que el usuario esté conectado
                if (!GestorSesion.estaLogueado()) {
                    alert(
                        "⚠️ Debes iniciar sesión para agregar productos al carrito.\n\nHaz clic en 'Iniciar sesión' para comenzar a comprar."
                    );
                    window.location.href = "Inicio.html";
                    return;
                }
                // Extrae la información del producto de la tarjeta
                const producto = e.target.closest(".producto");
                const nombre = producto.querySelector("h3").textContent;
                const precio = producto.querySelector("p").textContent;
                const img = producto.querySelector("img").src;
                const descripcion = producto.querySelector(".descripcion").textContent;
                const productoCarrito = {
                    nombre: nombre,
                    precio: precio,
                    imagen: img,
                    descripcion: descripcion,
                };
                // Intenta agregar al carrito y muestra confirmación visual
                if (GestorCarrito.agregar(productoCarrito)) {
                    // Cambio visual: botón se pone verde con checkmark
                    const btnOriginal = btn.textContent;
                    btn.textContent = "✓ Agregado";
                    btn.style.backgroundColor = "#2ecc71";
                    // Restaura el botón después de 2 segundos
                    setTimeout(() => {
                        btn.textContent = btnOriginal;
                        btn.style.backgroundColor = "";
                    }, 2000);
                }
            });
        }
    });
    // Muestra los productos que otros usuarios han subido a la tienda
    cargarProductosDinamicos();
    function cargarProductosDinamicos() {
        const productos = GestorProductos.obtenerProductos();
        productos.forEach((producto) => {
            // Si el producto tiene la propiedad `visible` y es false, no mostrarlo
            if (producto && producto.visible === false) return;
            const seccion = document.getElementById(producto.categoria);
            if (seccion) {
                // Crea una tarjeta visual para el producto
                const productoDiv = document.createElement("div");
                productoDiv.className = "producto";
                productoDiv.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio || "0"}</p>
          <p class="descripcion">${producto.caracteristicas || producto.descripcion}</p>
          <button>Agregar al carrito</button>
        `;
                // Agrega la tarjeta a la sección correspondiente
                const contenedor = seccion.querySelector(".producto");
                if (contenedor && contenedor.parentNode) {
                    contenedor.parentNode.insertBefore(
                        productoDiv,
                        contenedor.nextSibling
                    );
                }
                // Configura el evento del botón "Agregar al carrito"
                productoDiv.querySelector("button").addEventListener("click", (e) => {
                    e.preventDefault();
                    if (!GestorSesion.estaLogueado()) {
                        alert(
                            "⚠️ Debes iniciar sesión para agregar productos al carrito.\n\nHaz clic en 'Iniciar sesión' para comenzar a comprar."
                        );
                        window.location.href = "Inicio.html";
                        return;
                    }
                    // Prepara los datos del producto para el carrito
                    const productoCarrito = {
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        descripcion: producto.descripcion,
                    };
                    // Agrega al carrito y muestra confirmación visual
                    if (GestorCarrito.agregar(productoCarrito)) {
                        const btn = e.target;
                        const btnOriginal = btn.textContent;
                        btn.textContent = "✓ Agregado";
                        btn.style.backgroundColor = "#2ecc71";
                        setTimeout(() => {
                            btn.textContent = btnOriginal;
                            btn.style.backgroundColor = "";
                        }, 2000);
                    }
                });
            }
        });
    }
    // Permite buscar por nombre o por categoría (escribe el nombre o la categoría)
    const barraBusqueda = document.getElementById("barraBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    function filtrarProductos(termino) {
        termino = termino.trim().toLowerCase();
        const tarjetas = document.querySelectorAll(".secciones .producto");
        // Si la búsqueda está vacía, mostramos todo
        if (!termino) {
            tarjetas.forEach((t) => (t.style.display = ""));
            return;
        }
        tarjetas.forEach((tarjeta) => {
            const nombre = (tarjeta.querySelector("h3")?.textContent || "").toLowerCase();
            const descripcion = (tarjeta.querySelector(".descripcion")?.textContent || "").toLowerCase();
            const seccion = tarjeta.closest("section");
            const categoria = seccion ? seccion.id.toLowerCase() : "";
            // Coincide si el término está en el nombre, descripción o categoría
            const coincide =
                nombre.includes(termino) || descripcion.includes(termino) || categoria.includes(termino);
            tarjeta.style.display = coincide ? "" : "none";
        });
    }
    // Buscar al hacer clic y al escribir (enter y limpieza)
    if (btnBuscar && barraBusqueda) {
        btnBuscar.addEventListener("click", () => filtrarProductos(barraBusqueda.value));
        barraBusqueda.addEventListener("keyup", (e) => {
            if (e.key === "Enter") filtrarProductos(barraBusqueda.value);
            if (e.key === "Escape") {
                barraBusqueda.value = "";
                filtrarProductos("");
            }
            // Filtrado en tiempo real (opcional):
            filtrarProductos(barraBusqueda.value);
        });
    }

    // Si desde otra pestaña se modificaron los productos, recargar la página para actualizar el catálogo
    window.addEventListener('productosActualizados', () => {
        // recarga para mantener la simplicidad de sincronización
        location.reload();
    });
});