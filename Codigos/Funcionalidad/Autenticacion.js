const Validaciones = {
    // Verifica que el correo tenga el formato correcto (usuario@dominio.com)
    correo: (correo) => {
        const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return expresion.test(correo);
    },
    // Comprueba que la contraseña sea segura (mínimo 6 caracteres)
    contraseña: (contraseña) => {
        return contraseña && contraseña.length >= 6;
    },
    // Valida que el nombre no esté vacío
    nombre: (nombre) => {
        return nombre && nombre.trim().length > 0;
    },
};
const GestorUsuarios = {
    // Trae la lista completa de todos los usuarios registrados
    obtenerTodos: () => {
        const usuarios = localStorage.getItem("deltastore_usuarios");
        return usuarios ? JSON.parse(usuarios) : [];
    },
    // Agrega un nuevo usuario a la base de datos
    guardar: (usuario) => {
        const usuarios = GestorUsuarios.obtenerTodos();
        usuarios.push(usuario);
        localStorage.setItem("deltastore_usuarios", JSON.stringify(usuarios));
    },
    // Busca un usuario específico por su correo electrónico
    buscarPorCorreo: (correo) => {
        const usuarios = GestorUsuarios.obtenerTodos();
        return usuarios.find((u) => u.correo === correo);
    },
    // Verifica si el correo y contraseña coinciden (para login)
    verificarCredenciales: (correo, contraseña) => {
        const usuario = GestorUsuarios.buscarPorCorreo(correo);
        return usuario && usuario.contraseña === contraseña ? usuario : null;
    },
};
const GestorSesion = {
    // Devuelve los datos del usuario actualmente conectado
    obtenerUsuarioLogueado: () => {
        const sesion = localStorage.getItem("deltastore_sesion");
        return sesion ? JSON.parse(sesion) : null;
    },
    // Registra que un usuario ha iniciado sesión
    iniciarSesion: (usuario) => {
        localStorage.setItem("deltastore_sesion", JSON.stringify(usuario));
        window.dispatchEvent(new Event("usuarioLogueado"));
    },
    // Desconecta al usuario actual
    cerrarSesion: () => {
        localStorage.removeItem("deltastore_sesion");
        window.dispatchEvent(new Event("usuarioCerrado"));
    },
    // Verifica rápidamente si hay alguien conectado
    estaLogueado: () => {
        return GestorSesion.obtenerUsuarioLogueado() !== null;
    },
};
const GestorCarrito = {
    // Trae todos los productos que el usuario ha añadido al carrito
    obtenerCarrito: () => {
        const carrito = localStorage.getItem("deltastore_carrito");
        return carrito ? JSON.parse(carrito) : [];
    },
    // Añade un producto al carrito (solo si el usuario está conectado)
    agregar: (producto) => {
        if (!GestorSesion.estaLogueado()) {
            alert(
                "⚠️ Debes iniciar sesión para agregar productos al carrito.\n\nHaz clic en 'Iniciar sesión' para comenzar a comprar."
            );
            return false;
        }
        const carrito = GestorCarrito.obtenerCarrito();
        producto.id = Date.now();
        carrito.push(producto);
        localStorage.setItem("deltastore_carrito", JSON.stringify(carrito));
        alert("✓ Producto agregado al carrito");
        return true;
    },
    // Saca un producto del carrito usando su ID
    eliminar: (productoId) => {
        let carrito = GestorCarrito.obtenerCarrito();
        carrito = carrito.filter((p) => p.id !== productoId);
        localStorage.setItem("deltastore_carrito", JSON.stringify(carrito));
    },
    // Limpia completamente el carrito (se usa después de comprar)
    vaciar: () => {
        localStorage.setItem("deltastore_carrito", JSON.stringify([]));
    },
};
const GestorHistorial = {
    // Trae todas las compras que el usuario ha hecho
    obtenerHistorial: () => {
        const historial = localStorage.getItem("deltastore_historial");
        return historial ? JSON.parse(historial) : [];
    },
    // Guarda una compra nueva con fecha, hora, productos y total
    agregarCompra: (productos) => {
        const historial = GestorHistorial.obtenerHistorial();
        const compra = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString("es-ES"),
            hora: new Date().toLocaleTimeString("es-ES"),
            // Registrar quién compró (correo) para poder filtrar por usuario
            compradorCorreo: GestorSesion.obtenerUsuarioLogueado()
                ? GestorSesion.obtenerUsuarioLogueado().correo
                : null,
            productos: productos,
            // Calcula el total limpiando posibles símbolos de moneda (ej. "$499")
            total: productos.reduce((sum, p) => {
                const precioRaw = p.precio || 0;
                // Convierte a string, elimina todo lo que no sea dígito, punto o coma
                const limpio = String(precioRaw).replace(/[^0-9.,-]+/g, '').replace(',', '.');
                const valor = parseFloat(limpio) || 0;
                return sum + valor;
            }, 0),
        };
        historial.push(compra);
        localStorage.setItem("deltastore_historial", JSON.stringify(historial));
        return compra;
    },
};
const GestorProductos = {
    // Trae todos los productos que han sido agregados por usuarios
    obtenerProductos: () => {
        const productos = localStorage.getItem("deltastore_productos");
        return productos ? JSON.parse(productos) : [];
    },
    // Sube un producto nuevo a la tienda (solo usuarios conectados)
    guardar: (producto) => {
        if (!GestorSesion.estaLogueado()) {
            alert(
                "⚠️ Debes iniciar sesión para agregar productos.\n\nHaz clic en 'Iniciar sesión' para comenzar a vender."
            );
            return false;
        }
        if (!producto.imagen) {
            alert("❌ La imagen del producto es obligatoria.");
            return false;
        }
        const productos = GestorProductos.obtenerProductos();
        producto.id = Date.now();
        // Asegura que el producto tenga el vendedor y el flag `visible` por defecto
        producto.vendedor = GestorSesion.obtenerUsuarioLogueado();
        if (typeof producto.visible === "undefined") producto.visible = true;
        producto.fechaAgregado = new Date().toLocaleDateString("es-ES");
        productos.push(producto);
        localStorage.setItem("deltastore_productos", JSON.stringify(productos));
        return true;
    },
    // Filtra y devuelve solo los productos de una categoría específica
    obtenerPorCategoria: (categoria) => {
        return GestorProductos.obtenerProductos().filter(
            (p) => p.categoria === categoria
        );
    },
};