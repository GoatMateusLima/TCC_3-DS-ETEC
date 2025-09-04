-- Banco de dados
CREATE DATABASE Aumigos;
USE Aumigos;

-- Tabela ONG
CREATE TABLE ong 
( 
    ong_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    status_registro ENUM('ativo','pendente','inativo') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Membros da ONG
CREATE TABLE membros_ong 
( 
    membro_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    rg VARCHAR(20),
    email VARCHAR(100),
    whatsapp VARCHAR(20),
    funcao ENUM('administrador','voluntario','outro') DEFAULT 'outro',
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_validacao VARCHAR(255),
    FOREIGN KEY (ong_id) REFERENCES ong(ong_id) ON DELETE CASCADE
); 

-- Tabela Animal/Pet
CREATE TABLE animal 
( 
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('cachorro','gato','outro') DEFAULT 'outro',
    raca VARCHAR(50),
    idade INT,
    descricao VARCHAR(255),
    sexo ENUM('macho','femea'),
    porte ENUM('pequeno','medio','grande'),
    cor VARCHAR(50),
    vacinado BOOLEAN DEFAULT FALSE,
    castrado BOOLEAN DEFAULT FALSE,
    status_adocao ENUM('disponivel','reservado','adotado') DEFAULT 'disponivel',
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_saida TIMESTAMP,
    FOREIGN KEY (ong_id) REFERENCES ong(ong_id) ON DELETE CASCADE
);

-- Tabela Adotante
CREATE TABLE adotante 
( 
    adotante_id INT PRIMARY KEY AUTO_INCREMENT,
    link_validacao VARCHAR(255),
    whatsapp VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    data_nascimento DATE,
    cpf CHAR(11) NOT NULL UNIQUE
);

-- Tabela Adoção
CREATE TABLE adocao 
( 
    adocao_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    adotante_id INT NOT NULL,
    data_adocao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('analise','concluida','cancelada') DEFAULT 'analise',
    FOREIGN KEY (pet_id) REFERENCES animal(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (adotante_id) REFERENCES adotante(adotante_id) ON DELETE CASCADE
);
