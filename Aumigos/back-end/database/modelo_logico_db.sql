CREATE DATABASE AUMIGOS;
USE AUMIGOS;

CREATE TABLE ONG (
    ong_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    status_registro ENUM('ativo', 'pendente', 'inativo') DEFAULT 'pendente',
    data_criacao DATE
);

CREATE TABLE membros_ong (
    membro_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    rg VARCHAR(20),
    email VARCHAR(100),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    funcao ENUM('administrador', 'voluntario', 'outro') DEFAULT 'outro',
    data_entrada DATE,
    FOREIGN KEY (ong_id) REFERENCES ONG(ong_id) ON DELETE CASCADE
);


CREATE TABLE adotantes (
    adotante_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    rg VARCHAR(20),
    email VARCHAR(100),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    endereco VARCHAR(255),
    data_cadastro DATE
);


CREATE TABLE pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    ong_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especie ENUM('cachorro', 'gato', 'outro') DEFAULT 'outro',
    raca VARCHAR(50),
    idade INT,
    descricao VARCHAR(255), 
    sexo ENUM('macho', 'femea'),
    porte ENUM('pequeno', 'medio', 'grande'),
    cor VARCHAR(50),
    vacinado BOOLEAN DEFAULT FALSE,
    castrado BOOLEAN DEFAULT FALSE,
    status_adocao ENUM('disponivel', 'reservado', 'adotado') DEFAULT 'disponivel',
    data_entrada DATE,
    FOREIGN KEY (ong_id) REFERENCES ONG(ong_id) ON DELETE CASCADE
);  


CREATE TABLE adocao (
    adocao_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    adotante_id INT NOT NULL,
    data_adocao DATE,
    status ENUM('analise', 'concluida', 'cancelada') DEFAULT 'analise',
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (adotante_id) REFERENCES adotantes(adotante_id) ON DELETE CASCADE
);


INSERT INTO ONG (nome, email, cnpj, endereco, telefone, whatsapp, status_registro, data_criacao)
VALUES
('Amigos de 4 Patas', 'contato@amigos4patas.org', '12345678000199', 'Rua A, 123', '1122334455', '11987654321', 'ativo', '2025-01-10'),
('Coração Animal', 'contato@coracaoanimal.org', '98765432000188', 'Avenida B, 456', '2233445566', '11976543210', 'ativo', '2025-03-05');


INSERT INTO membros_ong (ong_id, nome, cpf, rg, email, telefone, whatsapp, funcao, data_entrada)
VALUES
(1, 'Maria Silva', '11122233344', 'MG1234567', 'maria@amigos4patas.org', '1122334455', '11987654321', 'administrador', '2025-01-15'),
(1, 'João Santos', '55566677788', 'SP9876543', 'joao@amigos4patas.org', '1122445566', '11987650000', 'voluntario', '2025-02-01'),
(2, 'Ana Oliveira', '99988877766', 'RJ1122334', 'ana@coracaoanimal.org', '2233445566', '11976543210', 'administrador', '2025-03-10');


INSERT INTO adotantes (nome, cpf, rg, email, telefone, whatsapp, endereco, data_cadastro)
VALUES
('Carlos Pereira', '12312312312', 'MG998877', 'carlos@gmail.com', '11999998888', '11999998888', 'Rua X, 100', '2025-04-01'),
('Fernanda Lima', '32132132132', 'SP112233', 'fernanda@gmail.com', '11988887777', '11988887777', 'Avenida Y, 200', '2025-04-05');


INSERT INTO pets (ong_id, nome, especie, raca, idade, descricao, sexo, porte, cor, vacinado, castrado, status_adocao, data_entrada)
VALUES
(1, 'Rex', 'cachorro', 'Labrador', 3, 'Muito amigável e brincalhão', 'macho', 'grande', 'Amarelo', TRUE, TRUE, 'disponivel', '2025-02-20'),
(1, 'Mimi', 'gato', 'Siamês', 2, 'Gosta de colo e ronrona bastante', 'femea', 'pequeno', 'Branco', TRUE, FALSE, 'disponivel', '2025-03-15'),
(2, 'Bolt', 'cachorro', 'Pastor Alemão', 4, 'Muito inteligente e ativo', 'macho', 'grande', 'Preto e Marrom', TRUE, TRUE, 'disponivel', '2025-03-20');


INSERT INTO adocao (pet_id, adotante_id, data_adocao, status)
VALUES
(1, 1, '2025-04-10', 'concluida'),
(2, 2, '2025-04-12', 'analise');

