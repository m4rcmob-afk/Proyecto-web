document.addEventListener("DOMContentLoaded", () => {
    const abrirMenu = document.getElementById("abrirMenu");
    const menuLateral = document.getElementById("menuLateral");
    abrirMenu.addEventListener("click", () => {
        menuLateral.classList.toggle("activo");
    });
});