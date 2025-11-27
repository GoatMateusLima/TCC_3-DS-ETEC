// pesquisa.js — Totalmente compatível com seu carregarAnimais()

document.addEventListener("DOMContentLoaded", () => {
    // Espera as variáveis globais existirem (carregadas pelo carregarAnimais.js)
    if (typeof animaisGlobal === "undefined" || typeof ongsGlobal === "undefined") {
        console.warn("Aguardando animais serem carregados...");
        // Tenta de novo a cada 100ms até carregar (caso o script rode antes)
        const intervalo = setInterval(() => {
            if (typeof animaisGlobal !== "undefined" && typeof ongsGlobal !== "undefined") {
                clearInterval(intervalo);
                iniciarPesquisaEFiltros();
            }
        }, 100);
        return;
    }

    iniciarPesquisaEFiltros();
});

function iniciarPesquisaEFiltros() {
    const inputPesquisa = document.getElementById("input-pesquisa");
    const botaoPesquisar = document.querySelector(".button-pesquisar");
    const selectEspecie = document.getElementById("especie-select");
    const selectSexo = document.getElementById("sexo-select");
    const botaoLimpar = document.getElementById("limpar-filtro");
    const container = document.getElementById("cat-container");

    if (!container || !inputPesquisa) {
        console.error("Elementos da pesquisa não encontrados!");
        return;
    }

    function atualizarLista() {
        const termo = inputPesquisa.value.trim().toLowerCase();
        const especie = selectEspecie.value;
        const sexo = selectSexo.value;

        let lista = animaisGlobal.filter(a => a.status === "disponivel");

        // FILTRO POR ESPÉCIE (agora funciona com qualquer formatação)
        if (especie && especie !== "") {
            lista = lista.filter(a => {
                const especieBanco = (a.especie || "").trim().toLowerCase();
                return especieBanco === especie.toLowerCase();
            });
        }

        // FILTRO POR SEXO (M/m/F/f → tudo vira M ou F)
        if (sexo && sexo !== "") {
            lista = lista.filter(a => {
                const sexoBanco = (a.sexo || "").trim().toUpperCase();
                return sexoBanco === sexo.toUpperCase();
            });
        }

        // PESQUISA POR TEXTO (continua funcionando)
        if (termo !== "") {
            lista = lista.filter(a => {
                const texto = `
                ${a.nome || ""}
                ${a.especie || ""}
                ${a.raca || ""}
                ${String(a.idade || "")}
                ${(a.sexo || "").toLowerCase().includes("m") ? "macho" : ""}
                ${(a.sexo || "").toLowerCase().includes("f") ? "fêmea" : ""}
            `.toLowerCase();

                return texto.includes(termo);
            });
        }

        renderizarAnimais(lista);
    }

    // Função que cria os cards (EXATAMENTE igual ao seu carregarAnimais)
    function renderizarAnimais(animais) {
        container.innerHTML = "";

        if (animais.length === 0) {
            container.innerHTML = `
                <p style="grid-column:1/-1; text-align:center; padding:60px; color:#888; font-size:1.2rem;">
                    Nenhum animal encontrado com esses critérios
                </p>`;
            return;
        }

        animais.forEach(a => {
            const ong = ongsGlobal.find(o => o.ong_id === a.ong_id);

            const card = document.createElement("article");
            card.classList.add("card-animais");

            card.innerHTML = `
                <figure class="img-pet">
                    <img src="${a.link_img || '/src/assets/img/patinha.webp'}" alt="${a.nome}">
                </figure>

                <section class="informacoes">
                    <h3>${a.nome}</h3>
                    <section>
                        <p><strong>Espécie:</strong> ${a.especie}</p>
                        <p><strong>Idade:</strong> ${a.idade}</p>
                        <p><strong>ONG:</strong> ${ong ? ong.nome : "Não informada"}</p>
                        <p><strong>Localização:</strong> 
                            ${ong ? `${ong.cep}, ${ong.bairro}, ${ong.uf}` : "—"}
                        </p>
                    </section>
                </section>

                <button class="btn-modal-pet" data-id="${a.animal_id}">Quero Adotar</button>
            `;

            container.appendChild(card);
        });

        // Reativa os botões "Quero Adotar" (exatamente como você já faz)
        document.querySelectorAll('.btn-modal-pet').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const pet = animaisGlobal.find(a => a.animal_id === id);
                const ong = ongsGlobal.find(o => o.ong_id === pet?.ong_id);
                if (pet && ong && typeof abrirModalPet === "function") {
                    abrirModalPet(pet, ong);
                } else {
                    alert("Erro ao carregar detalhes do animal.");
                }
            });
        });
    }

    // Eventos que disparam a atualização
    inputPesquisa.addEventListener("input", atualizarLista);
    inputPesquisa.addEventListener("keyup", atualizarLista); // garante volta ao normal ao apagar
    if (botaoPesquisar) botaoPesquisar.addEventListener("click", atualizarLista);
    selectEspecie.addEventListener("change", atualizarLista);
    selectSexo.addEventListener("change", atualizarLista);

    // Botão Limpar Filtros
    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", () => {
            inputPesquisa.value = "";
            selectEspecie.value = "";
            selectSexo.value = "";
            atualizarLista();
        });
    }

    // Mostra todos na primeira carga
    atualizarLista();

    console.log("Pesquisa + Filtros ativados com sucesso! (compatível com seu carregarAnimais)");
}