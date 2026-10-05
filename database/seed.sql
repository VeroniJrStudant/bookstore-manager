BEGIN;

TRUNCATE TABLE emprestimos, livros, clientes, autores  RESTART IDENTITY CASCADE;

INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
    ('Jorge Amado', 'Brasileira', '1912-08-10'),
    ('Machado de Assis', 'Brasileira', '1839-06-21'),
    ('João Guimarães Rosa', 'Brasileira', '1908-06-27'),
    ('Clarice Lispector', 'Brasileira', '1920-12-10');

INSERT INTO clientes (nome, email, telefone, cpf)  VALUES
    ('Ana Souza', 'ana.souza@email.com', '48991234567', '52998224725'),
    ('Bruno Lima', 'bruno.lima@email.com', '48998765432', '39053344705'),
    ('Carla Mendes', 'carla.mendes@email.com', '48996543210', '15350946056');

INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
    ('Capitães da Areia', '9788535914061', 1937, 1, 0, 1),
    ('Dom Casmurro', '9788594318602', 1899, 3, 2, 2),
    ('A Hora da Estrela', '9788532508126', 1977, 2, 2, 4),
    ('Grande Sertão: Veredas', '9788501114775', 1956, 4, 4, 3),
    ('Memórias Póstumas de Brás Cubas', '9788594318619', 1881, 2, 2, 2);

INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao) VALUES
    (1, 1, '2026-09-28 10:00:00-03', '2026-10-12', NULL),
    (2, 2, '2026-09-30 14:30:00-03', '2026-10-14', NULL),
    (3, 3, '2026-09-15 09:00:00-03', '2026-09-29', '2026-09-25 16:00:00-03');

COMMIT;