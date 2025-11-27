// -----------------------------
    // VARIÁVEIS GLOBAIS DOS MODAIS
    // -----------------------------
    const modalPet      = document.getElementById("modal-pet");
    const fecharModal   = document.getElementById("fechar-modal");
    const btnIrFormulario = document.getElementById("btn-ir-formulario");
    const formContainer = document.querySelector(".form-container");

    // -----------------------------
    // ABRIR MODAL DO PET
    // -----------------------------
    function abrirModalPet(pet, ong) {
        modalPet.style.display = "flex";

        document.getElementById("modal-img").src = pet.link_img || '/src/assets/img/patinha.webp';
        document.getElementById("modal-ong").textContent      = ong.nome || 'Não informada';
        document.getElementById("modal-nome").textContent     = pet.nome || '';
        document.getElementById("modal-local").textContent    = `${ong.cep || ''}, ${ong.bairro || ''}, ${ong.uf || ''}`;
        document.getElementById("modal-especie").textContent   = pet.especie || '';
        document.getElementById("modal-sexo").textContent     = pet.sexo || '';
        document.getElementById("modal-raca").textContent     = pet.raca || '';
        document.getElementById("modal-idade").textContent    = pet.idade || '';
        
        // Preenche TODOS os elementos com id="modal-descricao" (você tem dois no HTML)
        document.querySelectorAll("#modal-descricao").forEach(el => {
            el.textContent = pet.descricao || "Sem descrição disponível.";
        });

        document.getElementById("modal-status").textContent   = pet.status || '';

        // Salva para usar no formulário
        window.petSelecionado = pet;
        window.ongSelecionada = ong;
    }

    // Fechar modal do pet
    fecharModal.addEventListener("click", () => {
        modalPet.style.display = "none";
    });

    // Ir para o formulário
    btnIrFormulario.addEventListener("click", () => {
        modalPet.style.display = "none";
        formContainer.style.display = "flex";
    });

    // -----------------------------
    // FORMULÁRIO MULTI-ETAPAS
    // -----------------------------
    const steps = document.querySelectorAll(".form-step");
    let stepIndex = 0;

    function atualizarSteps() {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === stepIndex);
        });
    }

    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            if (stepIndex < steps.length - 1) {
                stepIndex++;
                atualizarSteps();
            }
        });
    });

    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            if (stepIndex > 0) {
                stepIndex--;
                atualizarSteps();
            }
        });
    });

    // -----------------------------
    // ENVIAR PARA O WHATSAPP (VERSÃO FINAL E PERFEITA)
    // -----------------------------
    document.getElementById("formAdocao").addEventListener("submit", function (e) {
        e.preventDefault();

        if (!window.petSelecionado || !window.ongSelecionada) {
            alert("Erro: nenhum animal selecionado.");
            return;
        }

        const form = this;
        const dados = new FormData(form);

        // MONTANDO A MENSAGEM BONITINHA
        let mensagem = `FORMULÁRIO DE ADOÇÃO - ${window.ongSelecionada.nome.toUpperCase()}\n\n`;

        // DADOS DO ANIMAL
        mensagem += `DADOS DO ANIMAL\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `Nome: ${window.petSelecionado.nome}\n`;
        mensagem += `Espécie: ${window.petSelecionado.especie}\n`;
        const sexoBonito = window.petSelecionado.sexo?.toUpperCase() === "M" ? "Macho" : "Fêmea";
        mensagem += `Sexo: ${sexoBonito}\n`;
        mensagem += `Raça: ${window.petSelecionado.raca || "Não informada"}\n`;
        mensagem += `Idade: ${window.petSelecionado.idade}\n\n`;

        // DADOS DO ADOTANTE
        mensagem += `DADOS DO ADOTANTE\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        const labelBonita = (campo) => campo
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());

        const campos = [
            "nome", "idade", "telefone", "email",
            "moradia", "situacao_moradia", "permite_animais",
            "horas_fora", "responsavel_secundario", "local_sozinho",
            "renda", "faixa_renda", "entende_gastos",
            "teve_animais", "destino_animais", "tem_outros", "sociaveis"
        ];

        campos.forEach(campo => {
            const valor = dados.get(campo);
            if (valor) {
                let texto = labelBonita(campo) + ": " + valor;

                // Ajustes de legibilidade
                texto = texto
                    .replace("Propria", "Imóvel próprio")
                    .replace("Alugado", "Alugado")
                    .replace("Sim", "Sim")
                    .replace("Nao", "Não")
                    .replace("Naosei", "Não sei")
                    .replace("0-4", "0 a 4 horas")
                    .replace("4-8", "4 a 8 horas")
                    .replace("8-12", "8 a 12 horas")
                    .replace("12+", "Mais de 12 horas");

                mensagem += texto + "\n";
            }
        });

        if (dados.getAll("fotos_casa").length > 0) {
            mensagem += `\nFotos da casa: enviarei logo em seguida!\n`;
        }

        mensagem += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `Como podemos continuar a adoção?`;

        // VALIDAÇÃO E LIMPEZA DO NÚMERO DO WHATSAPP
        let numeroWhats = (window.ongSelecionada.whatsapp || "")
            .replace(/\D/g, "")      // só números
            .replace(/^0+/, "");      // remove zeros à esquerda

        if (!numeroWhats) {
            alert("Erro: a ONG não tem número de WhatsApp cadastrado.");
            return;
        }

        // Garante código do Brasil
        if (!numeroWhats.startsWith("55")) {
            numeroWhats = "55" + numeroWhats;
        }

        const linkWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

        // Abre o WhatsApp
        window.open(linkWhats, "_blank");

        // Feedback e reset
        alert("Formulário enviado com sucesso! O WhatsApp vai abrir agora");
        formContainer.style.display = "none";
        form.reset();
        stepIndex = 0;               // CORRIGIDO!
        atualizarSteps();
    });