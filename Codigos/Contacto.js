document.getElementById("formContacto").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Gracias por tu mensaje. DeltaStore procesará tu comentario y pronto se pondrá en contacto contigo.");
});
document.getElementById("correoUsuario").value = "usuario@ejemplo.com";