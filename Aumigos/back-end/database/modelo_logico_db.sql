CREATE DATABASE AUMIGOS;
USE AUMIGOS;

CREATE TABLE ONG (
    ong_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    status_registro ENUM('ativo', 'pendente', 'inativo'),
    data_criacao DATE
);

CREATE TABLE membros_ong (
    membro_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    rg VARCHAR(20),
    email VARCHAR(100),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    funcao VARCHAR(20) CHECK (funcao IN ('administrador', 'voluntario', 'outro')),
    data_entrada DATE,
    FOREIGN KEY (ong_id) REFERENCES ONG(ong_id)
);


CREATE TABLE adotantes (
    adotante_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    rg VARCHAR(20),
    email VARCHAR(100),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    endereco VARCHAR(255),
    data_cadastro DATE
);

CREATE TABLE pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) CHECK (especie IN ('cachorro', 'gato', 'outro')),
    raca VARCHAR(50),
    idade INT,
    descricao VARCHAR(255), 
    sexo ENUM('macho', 'femea'),
    porte ENUM('pequeno', 'medio', 'grande'),
    cor VARCHAR(50),
    vacinado BOOLEAN,
    castrado BOOLEAN,
    status_adocao ENUM('disponivel', 'reservado', 'adotado'),
    data_entrada DATE,
    FOREIGN KEY (ong_id) REFERENCES ONG(ong_id)
);  

CREATE TABLE adocao (
    adocao_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT,
    adotante_id INT,
    data_adocao DATE,
    status ENUM('analise', 'concluida', 'cancelada'),
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    FOREIGN KEY (adotante_id) REFERENCES adotantes(adotante_id)
);

