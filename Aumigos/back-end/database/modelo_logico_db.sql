CREATE TABLE adoção (
    cod_adocao SERIAL PRIMARY KEY,
    data_adocao DATE,
    id_animal INTEGER NOT NULL,
    status VARCHAR(30),
    FOREIGN KEY (id_animal) REFERENCES animal (pet_id)
);

CREATE TABLE membros_ong (
    membro_id SERIAL PRIMARY KEY,
    nome VARCHAR(250),
    cpf VARCHAR(18),
    email VARCHAR(250),
    whatsapp VARCHAR(250),
    data_entrada DATE,
    link_validacao VARCHAR(250),
    funcao VARCHAR(250)
);

CREATE TABLE animal (
    pet_id SERIAL PRIMARY KEY,
    nome VARCHAR(250),
    tipo VARCHAR(250),
    raca VARCHAR(250),
    sexo VARCHAR(250),
    descricao VARCHAR(250),
    data_entrada DATE,
    data_saida DATE
);

CREATE TABLE adotante (
    adotante_id SERIAL PRIMARY KEY,
    link_validacao VARCHAR(250),
    whatsapp VARCHAR(250),
    data_cadastro DATE,
    nome VARCHAR(250),
    email VARCHAR(250),
    data_nascimento DATE,
    cpf VARCHAR(250),
    id_adocao INTEGER,
    FOREIGN KEY (id_adocao) REFERENCES adoção (cod_adocao)
);

CREATE TABLE ong (
    ong_id SERIAL PRIMARY KEY,
    nome VARCHAR(250),
    email VARCHAR(250),
    cnpj VARCHAR(250),
    rua VARCHAR(250),
    status_registro INT,
    whatsapp VARCHAR(250),
    data_criacao DATE,
    cep INT,
    bairro VARCHAR(250),
    numero VARCHAR(250),
    id_membros_ong INTEGER,
    id_animal INTEGER,
    FOREIGN KEY (id_membros_ong) REFERENCES membros_ong (membro_id),
    FOREIGN KEY (id_animal) REFERENCES animal (pet_id)
);