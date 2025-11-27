 //todos animais da pagina
        let animaisGlobal = [];
        let ongsGlobal = [];

        async function carregarAnimais() {
            try {
                const animaisReq = await axios.get("/pets");
                const ongsReq = await axios.get("/ongs");

                animaisGlobal = animaisReq.data || [];
                ongsGlobal = ongsReq.data || [];

                const container = document.getElementById("cat-container");
                container.innerHTML = ""; // limpar

                if (animaisGlobal.length === 0) {
                    container.innerHTML = "<p>Nenhum animal encontrado.</p>";
                    return;
                }

                animaisGlobal
                    .filter(a => a.status === "disponivel")
                    .forEach(a => {
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

                // Adicionar event listeners aos botões "Quero Adotar" após criar os cards
                document.querySelectorAll('.btn-modal-pet').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = parseInt(btn.dataset.id);
                        const pet = animaisGlobal.find(a => a.animal_id === id);
                        const ong = ongsGlobal.find(o => o.ong_id === pet.ong_id);
                        if (pet && ong) {
                            abrirModalPet(pet, ong);
                        } else {
                            alert("Erro ao carregar detalhes do animal.");
                        }
                    });
                });

            } catch (error) {
                console.error("Erro ao carregar animais:", error);
                alert("Erro ao carregar animais.");
            }
        }

        carregarAnimais();