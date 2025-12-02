document.addEventListener("DOMContentLoaded",()=>{
    const form = document.querySelector(".Formulario");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const correo = form.Correo.value;
        const contraseña = form.Contraseña.value;
        const confirmacion = form.Confirmación.value;
        if (contraseña !== confirmacion){
            alert("Las contraseñas no coinciden");
            return;
        }
        if (correo === "marco070107@gmail.com" && contraseña === "070107"){
            window.location.href = "index.html";
        } else {
            alert("Correo o contraseña incorrectos");
        }
    });
});
