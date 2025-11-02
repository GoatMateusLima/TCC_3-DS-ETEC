  const overlay = document.getElementById('overlay');
        const e1Pet = document.querySelector('.e1-pet-ong');
        const e2Pet = document.querySelector('.e2-pet-adotante');
        const adotanteBtn = document.getElementById('btn-adotante'); // Botão Adotante
        const ongBtn = document.getElementById('btn-ong'); // Botão ONG

        // Função para alternar as imagens
        function moveOverlay(tipo) {
            if (tipo === 'adotante') {
                overlay.style.transform = 'translateX(100%)';
                e1Pet.style.display = 'none';
                e2Pet.style.display = 'block';
                adotanteBtn.style.display = 'none'; // Esconde o botão de Adotante
                ongBtn.style.display = 'inline-block'; // Mostra o botão de ONG
            } else {
                overlay.style.transform = 'translateX(0%)';
                e1Pet.style.display = 'block';
                e2Pet.style.display = 'none';
                adotanteBtn.style.display = 'inline-block'; // Mostra o botão de Adotante
                ongBtn.style.display = 'none'; // Esconde o botão de ONG
            }
        }

        // Quando a página carrega, define o estado inicial (pode ser 'adotante' ou 'ong')
        document.addEventListener('DOMContentLoaded', () => {
            moveOverlay('adotante'); // Definindo 'adotante' como o estado inicial
        });

        // Exemplo: Alterna o tipo de cadastro com base no botão
        adotanteBtn.addEventListener('click', () => {
            moveOverlay('adotante');
        });

        ongBtn.addEventListener('click', () => {
            moveOverlay('ong');
        });