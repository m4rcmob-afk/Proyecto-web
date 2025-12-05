document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector(".Formulario");
    const nombreInput = document.querySelector("input[name='nombre']");
    const aliasInput = document.querySelector("input[name='alias']");
    const telefonoInput = document.querySelector("input[name='telefono']");
    const correoInput = document.querySelector("input[name='correo']");
    const contraseñaInput = document.querySelector("input[name='password']");
    const confirmarInput = document.querySelector("input[name='confirmar']");
    // Cuando el usuario envía el formulario de registro
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        // Obtiene todos los datos ingresados
        const nombre = nombreInput.value.trim();
        const alias = aliasInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const correo = correoInput.value.trim();
        const contraseña = contraseñaInput.value.trim();
        const confirmar = confirmarInput.value.trim();
        // Verifica que el nombre no esté vacío
        if (!nombre) {
            alert("❌ Por favor, ingresa tu nombre completo.");
            nombreInput.focus();
            return;
        }
        // Verifica que haya un correo
        if (!correo) {
            alert("❌ Por favor, ingresa tu correo electrónico.");
            correoInput.focus();
            return;
        }
        // Comprueba que el correo tenga formato válido
        if (!Validaciones.correo(correo)) {
            alert("❌ Por favor, ingresa un correo electrónico válido.");
            correoInput.focus();
            return;
        }
        // Verifica que este correo no esté ya registrado
        if (GestorUsuarios.buscarPorCorreo(correo)) {
            alert("❌ Este correo ya está registrado. Por favor, intenta con otro.");
            correoInput.focus();
            return;
        }
        // Verifica que haya una contraseña
        if (!contraseña) {
            alert("❌ Por favor, ingresa una contraseña.");
            contraseñaInput.focus();
            return;
        }
        // Comprueba que la contraseña sea lo suficientemente fuerte (6+ caracteres)
        if (contraseña.length < 6) {
            alert("❌ La contraseña debe tener al menos 6 caracteres.");
            contraseñaInput.focus();
            return;
        }
        // Verifica que las dos contraseñas coincidan
        if (contraseña !== confirmar) {
            alert("❌ Las contraseñas no coinciden.");
            confirmarInput.focus();
            return;
        }
        // Si todo es válido, crea el nuevo usuario con su información
        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            alias: alias || nombre, // Si no pone alias, usa el nombre
            telefono: telefono,
            correo: correo,
            contraseña: contraseña,
            fechaRegistro: new Date().toLocaleDateString("es-ES"),
        };
        // Guarda el usuario en la base de datos y lo conecta automáticamente
        GestorUsuarios.guardar(nuevoUsuario);
        GestorSesion.iniciarSesion(nuevoUsuario);
        alert(
            "¡Cuenta creada exitosamente! Bienvenido a DeltaStore, " + nombre
        );
        window.location.href = "index.html";
    });
});