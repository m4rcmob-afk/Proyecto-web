/*
  Contacto.js
  - Manejo simple del formulario de contacto. Está protegido para no lanzar errores
    si el archivo se carga en páginas que no tienen el formulario.
*/
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContacto");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            // Muestra un mensaje de agradecimiento
            alert(
                "Gracias por tu mensaje. DeltaStore procesará tu comentario y pronto se pondrá en contacto contigo."
            );
        });
    }
    // Pre-llena el campo de correo si existe el input y hay usuario logueado
    const correoInput = document.getElementById("correoUsuario");
    if (correoInput) {
        const usuario = GestorSesion.obtenerUsuarioLogueado();
        correoInput.value = usuario ? usuario.correo : "usuario@ejemplo.com";
    }
});