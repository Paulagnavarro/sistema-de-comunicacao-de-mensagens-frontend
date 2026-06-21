# Sistema de Comunicação de Mensagens

Projeto Full Stack com backend e frontend em repositórios separados.

Um MVP funcional de troca de mensagens internas com controle de permissões por perfil, autenticação via token e filtros dinâmicos de busca.

---

## Stack Utilizada

### Back-end
- **Node.js** com **NestJS**
- **TypeORM**
- **Passport JWT**

### Front-end
- **React** com **Next.js**

### Banco de Dados e Infraestrutura
- **PostgreSQL**
- **Docker & Docker Compose**

---

## Instruções de Execução

### Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js (versão 18 ou superior) e npm ou yarn.

### Passos para rodar a aplicação

1. **Configurar o Back-end:**
- git clone -> https://github.com/Paulagnavarro/sistema-de-comunicacao-de-mensagens-backend
- cd sistema-de-comunicacao-de-mensagens-backend
- npm install

2. **Configurar as Variáveis de Ambiente (.env):**
- Crie um arquivo .env na raiz da pasta backend com as seguintes configurações:

DATABASE_HOST=localhost

DATABASE_PORT=5432

DATABASE_USER=postgres

DATABASE_PASSWORD=postgres

DATABASE_NAME=mensageria_db

JWT_SECRET=chave_secreta_super_segura_123

3. **Subir o Banco de Dados (Docker):**

Ainda na pasta backend, inicie o container do PostgreSQL:
- docker-compose up -d

4. **Criar a Estrutura do Banco e Dados de Teste (Migrations & Seeds):**

Execute o comando abaixo para gerar as tabelas e popular os usuários iniciais automaticamente:
- npm run migration:run

5. **Iniciar o Back-end:**
- npm run start:dev

O back-end estará rodando em: http://localhost:3000

6. **Configurar e Iniciar o Front-end:**

Abra um novo terminal e acesse a pasta do front-end:
- git clone -> https://github.com/Paulagnavarro/sistema-de-comunicacao-de-mensagens-frontend
- cd sistema-de-comunicacao-de-mensagens-frontend
- npm install
- npm run dev

A aplicação estará disponível no navegador em: http://localhost:3001 (ou na porta indicada no terminal pelo Next.js).

---

## Usuários de Teste (Criados via Seed)

Utilize as contas abaixo para testar o comportamento do sistema e as regras de perfil:
- **Administrador:** admin@teste.com - senha: admin123
- **Usuário Padrão:** usuario@teste.com - senha: usuario123

---

## Principais Rotas da API

As rotas de mensagens exigem o envio do token no header da requisição (Authorization: Bearer <JWT_TOKEN>).

- **Autenticação** (/auth)
- POST /auth/login - Valida o e-mail/senha e retorna o Token JWT com os dados do usuário.

- **Usuários** (/usuarios)
- POST /usuarios - Cadastro de novos usuários.
    {
      "nome": "Teste",
      "email": "teste@teste.com",
      "senha": "teste123",
      "perfil": "usuario_padrao"
    }

- GET /usuarios - Lista os usuários cadastrados (usado para selecionar o destinatário na hora do envio).

- **Mensagens** (/mensagens)
- POST /mensagens - Envia uma nova mensagem de texto para outro usuário.
- GET /mensagens - Lista as mensagens filtrando por query params (?busca=termo e ?statusLida=lidas|nao_lidas).
- GET /mensagens/:id - Detalha uma mensagem e altera o status para lida caso quem esteja abrindo seja o destinatário.
- GET /mensagens?remetenteId=ID_DO_REMETENTE - Lista as mensagens de um determinado remetente
- PATCH /mensagens/:id/ler - Rota para marcar a mensagem como lida diretamente.

---

## Decisões Técnicas

- **Validação de Entrada com DTOs:** Usei class-validator e DTOs no NestJS para garantir que qualquer dado enviado para a API (como rotas de login e criação de mensagens) seja validado antes de tocar o banco, evitando erros de campos vazios ou formatos incorretos.

- **Validação de Perfil no Banco (Back-end):** Para garantir a regra de acesso pedida no teste, a filtragem de mensagens é feita direto na query usando o createQueryBuilder. Se o usuário for padrão, o código injeta a condição onde o ID dele precisa ser o remetente ou o destinatário. Isso impede que alguém burle o sistema mudando o ID na URL.

- **Segurança de Senhas com Bcrypt:** Nenhuma senha fica em texto limpo no banco de dados. Tanto no cadastro quanto no script de carga inicial (seeds), as senhas passam pelo processo de hash.

- **Tratamento de Erros Nativo:** Utilizei as exceções padrão do NestJS (NotFoundException, ForbiddenException, etc.) para dar retornos claros à aplicação e evitar que erros crus de banco quebrem o fluxo ou fiquem expostos.

--- 

## Funcionalidades Entregues

- Autenticação Segura: Login com e-mail e senha utilizando criptografia e geração de Token JWT.

- Controle de Acesso: Administrador: Visualiza e gerencia todas as mensagens no sistema.

- Usuário Padrão: Visualiza apenas as mensagens enviadas ou recebidas por ele.

- Gestão de Mensagens: Envio de texto, caixa de entrada ordenada por data decrescente, indicador visual de mensagens não lidas e marcação de leitura.

- Busca e Filtros: Filtro por status (lidas e não lidas), busca por remetente e pesquisa por palavra-chave no conteúdo.

- Modais para envio de nova mensagem e visualização de detalhes.

- Feedbacks visuais de carregamento, erro e listas vazias.

- Geração automática de usuários de teste e estrutura de dados via Migrations/Seeds.

---

## Pendências ou Limitações Conhecidas
Por se tratar de um desenvolvimento focado nas regras principais do MVP, listei os pontos que ficariam para uma próxima etapa de evolução:

1. **Paginação na Listagem:** Atualmente a listagem traz todas as mensagens de uma vez. Em produção, seria necessário limitar o retorno por páginas para otimizar o carregamento.

2. **Testes Automatizados:** Criação de testes unitários no back-end focados principalmente nas regras de filtro do service de mensagens.
