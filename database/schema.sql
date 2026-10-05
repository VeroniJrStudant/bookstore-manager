CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    nacionalidade VARCHAR(80) NOT NULL,
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    ano_publicacao INT NOT NULL,
    quantidade_total INT NOT NULL,
    quantidade_disponivel INT NOT NULL,
    autor_id INTEGER NOT NULL,
    CONSTRAINT fk_livros_autor 
        FOREIGN KEY (autor_id) REFERENCES autores(id),
    CONSTRAINT ck_livros_quantidade_total
        CHECK (quantidade_total > 0),
    CONSTRAINT ck_livros_quantidade_disponivel
        CHECK (quantidade_disponivel >= 0),
    CONSTRAINT ck_livros_disponivel_nao_excede_total
        CHECK (quantidade_disponivel <= quantidade_total)
);

CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    data_emprestimo TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_prevista_devolucao DATE NOT NULL,
    data_devolucao TIMESTAMPTZ,
    CONSTRAINT fk_emprestimos_livros
        FOREIGN KEY (livro_id) REFERENCES livros (id),
    CONSTRAINT fk_emprestimos_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT ck_emprestimos_devolucao
        CHECK (data_devolucao IS NULL OR data_devolucao >= data_emprestimo)
);

CREATE INDEX IF NOT EXISTS idx_livros_autor_id ON livros (autor_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_livro_id ON emprestimos (livro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_cliente_id ON emprestimos (cliente_id);