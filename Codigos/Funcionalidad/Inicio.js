/*
    Inicio.js
    - Maneja el formulario de inicio de sesión (login).
    - Valida formato de correo y credenciales contra GestorUsuarios.
*/
document.addEventListener("DOMContentLoaded", () => {
        const formulario = document.querySelector(".Formulario");
    const correoInput = document.querySelector("input[name='Correo']");
    const contraseñaInput = document.querySelector("input[name='Contraseña']");
    const confirmarInput = document.querySelector("input[name='Confirmación']");
    // Cuando el usuario envía el formulario, validamos sus datos
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        // Obtiene lo que escribió el usuario (sin espacios al inicio/final)
        const correo = correoInput.value.trim();
        const contraseña = contraseñaInput.value.trim();
        const confirmar = confirmarInput.value.trim();
        // Verifica que haya escrito un correo
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
        // Verifica que haya escrito una contraseña
        if (!contraseña) {
            alert("❌ Por favor, ingresa tu contraseña.");
            contraseñaInput.focus();
            return;
        }
        // Comprueba que ambas contraseñas coincidan
        if (contraseña !== confirmar) {
            alert("❌ Las contraseñas no coinciden.");
            confirmarInput.focus();
            return;
        }
        // Busca el usuario en la base de datos y verifica la contraseña
        const usuario = GestorUsuarios.verificarCredenciales(correo, contraseña);
        if (usuario) {
            // El usuario existe y la contraseña es correcta
            GestorSesion.iniciarSesion(usuario);
            alert("✓ ¡Sesión iniciada exitosamente!");
            window.location.href = "index.html";
        } else {
            // El usuario no existe o la contraseña es incorrecta
            alert("❌ Correo o contraseña incorrectos.");
            contraseñaInput.value = "";
            confirmarInput.value = "";
            correoInput.focus();
        }
    });
});
