document.addEventListener("DOMContentLoaded", function () {
            const menu = document.getElementById("menu");
            const toggle = document.querySelector(".toggle");

            // Ao clicar no botão de hamburguer, alternamos a exibição do menu
            toggle.addEventListener("click", function () {
                // Alternar a visibilidade do menu
                if (menu.style.display === "block") {
                    menu.style.display = "none";  // Fecha o menu
                } else {
                    menu.style.display = "block";  // Abre o menu
                }
            });

            document.addEventListener("click", function (event) {
                // Verifica se o clique foi fora do menu ou do botão de hambúrguer
                if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                    menu.style.display = "none";  // Fecha o menu
                }
            });
        });