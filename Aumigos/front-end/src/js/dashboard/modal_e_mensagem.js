// -----------------------------
// VARIÁVEIS GLOBAIS DOS MODAIS
// -----------------------------
const modalPet        = document.getElementById("modal-pet");
const fecharModal     = document.getElementById("fechar-modal");
const btnIrFormulario = document.getElementById("btn-ir-formulario");
const formContainer   = document.querySelector(".form-container");

// -----------------------------
// ABRIR MODAL DO PET
// -----------------------------
function abrirModalPet(pet, ong) {
    modalPet.style.display = "flex";

    document.getElementById("modal-img").src = pet.link_img || '/src/assets/img/patinha.webp';
    document.getElementById("modal-ong").textContent      = ong.nome || 'Não informada';
    document.getElementById("modal-nome").textContent     = pet.nome || '';
    document.getElementById("modal-local").textContent    = `${ong.cep || ''}, ${ong.bairro || ''}, ${ong.uf || ''}`;
    document.getElementById("modal-especie").textContent  = pet.especie || '';
    document.getElementById("modal-sexo").textContent     = pet.sexo || '';
    document.getElementById("modal-raca").textContent     = pet.raca || '';
    document.getElementById("modal-idade").textContent    = pet.idade || '';
    
    document.querySelectorAll("#modal-descricao").forEach(el => {
        el.textContent = pet.descricao || "Sem descrição disponível.";
    });

    document.getElementById("modal-status").textContent = pet.status || '';

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
// ENVIAR PARA O WHATSAPP (PERFEITO!)
// -----------------------------
document.getElementById("formAdocao").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!window.petSelecionado || !window.ongSelecionada) {
        alert("Erro: nenhum animal selecionado.");
        return;
    }

    const form = this;
    const dados = new FormData(form);

    let mensagem = `FORMULÁRIO DE ADOÇÃO - ${window.ongSelecionada.nome.toUpperCase()}\n\n`;
    mensagem += `DADOS DO ANIMAL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `Nome: ${window.petSelecionado.nome}\n`;
    mensagem += `Espécie: ${window.petSelecionado.especie}\n`;
    const sexoBonito = window.petSelecionado.sexo?.toUpperCase() === "M" ? "Macho" : "Fêmea";
    mensagem += `Sexo: ${sexoBonito}\n`;
    mensagem += `Raça: ${window.petSelecionado.raca || "Não informada"}\n`;
    mensagem += `Idade: ${window.petSelecionado.idade}\n\n`;

    mensagem += `DADOS DO ADOTANTE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    const labelBonita = (campo) => campo
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());

    const campos = [
        "nome", "idade", "telefone", "email",
        "moradia", "situacao_moradia", "permite_animais",
        "horas_fora", "responsavel_secundario", "local_sozinho",
        "renda", "faixa_renda", "ent共通_gastos",
        "teve_animais", "destino_animais", "tem_outros", "sociaveis"
    ];

    campos.forEach(campo => {
        const valor = dados.get(campo);
        if (valor) {
            let texto = labelBonita(campo) + ": " + valor;
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

    mensagem += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nComo podemos continuar a adoção?`;

    let numeroWhats = (window.ongSelecionada.whatsapp || "")
        .replace(/\D/g, "")
        .replace(/^0+/, "");

    if (!numeroWhats) {
        alert("Erro: a ONG não tem número de WhatsApp cadastrado.");
        return;
    }

    if (!numeroWhats.startsWith("55")) {
        numeroWhats = "55" + numeroWhats;
    }

    const linkWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhats, "_blank");

    alert("Formulário enviado com sucesso! O WhatsApp vai abrir agora");
    formContainer.style.display = "none";
    form.reset();
    stepIndex = 0;
    atualizarSteps();
});

// FECHAR FORMULÁRIO COM O BOTÃO X
const fecharFormularioBtn = document.getElementById("fechar-formulario");
if (fecharFormularioBtn) {
    fecharFormularioBtn.addEventListener("click", () => {
        formContainer.style.display = "none";
        stepIndex = 0;
        atualizarSteps();
    });
}

// Fechar clicando fora do formulário (profissional!)
formContainer.addEventListener("click", (e) => {
    if (e.target === formContainer) {
        formContainer.style.display = "none";
        stepIndex = 0;
        atualizarSteps();
    }
});