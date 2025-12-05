// Captura el evento cuando el usuario envía el formulario de contacto
document.getElementById("formContacto").addEventListener("submit", function (event) {
    event.preventDefault();
    // Muestra un mensaje de agradecimiento
    alert(
        "Gracias por tu mensaje. DeltaStore procesará tu comentario y pronto se pondrá en contacto contigo."
    );
});
// Pre-llena el campo de correo (puede cambiar según el usuario logueado)
const usuario = GestorSesion.obtenerUsuarioLogueado();
if (usuario) {
    document.getElementById("correoUsuario").value = usuario.correo;
} else {
    document.getElementById("correoUsuario").value = "usuario@ejemplo.com";
}