# ☁️ CloudQuiz

**CloudQuiz** é uma plataforma de quizzes online desenvolvida como projeto acadêmico, com o objetivo de proporcionar uma experiência interativa de aprendizagem por meio de perguntas e respostas de diferentes categorias.

O sistema permite que os usuários criem suas contas, escolham temas, respondam perguntas, acumulem pontos e acompanhem suas posições em um ranking global.

## 🚀 Funcionalidades

- **Cadastro de usuários:** criação de contas para acessar a plataforma.
- **Login:** autenticação de usuários.
- **Escolha de categorias:** seleção do tema desejado antes de iniciar uma partida.
- **Sistema de perguntas:** questões de múltipla escolha com quatro alternativas.
- **Pontuação automática:** cada resposta correta vale 10 pontos.
- **Resultado da partida:** apresentação da pontuação ao finalizar o quiz.
- **Melhor pontuação:** armazenamento do recorde individual de cada jogador.
- **Ranking global:** classificação dos jogadores de acordo com suas melhores pontuações.
- **Jogar novamente:** possibilidade de iniciar uma nova partida.
- **Interface interativa:** navegação entre as telas do sistema.
- https://quizgame-black-beta.vercel.app/

## 📚 Categorias disponíveis

O CloudQuiz possui 100 questões distribuídas em cinco categorias:

| Categoria | Quantidade |
|---|---:|
| Computação em Nuvem | 20 |
| Programação | 20 |
| Geografia | 20 |
| História | 20 |
| Ciências | 20 |
| **Total** | **100** |

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura das páginas.
- **CSS3:** estilização e interface visual.
- **JavaScript:** lógica e funcionalidades da aplicação.
- **Node.js:** ambiente de desenvolvimento.
- **Back4App (Parse):** banco de dados e autenticação.
- **Git e GitHub:** versionamento e armazenamento do código-fonte.

## 🗄️ Banco de dados

O projeto utiliza o Back4App como Backend as a Service (BaaS).

Principais classes utilizadas:

| Classe | Descrição |
|---|---|
| `_User` | Cadastro e informações dos usuários. |
| `Question` | Armazenamento das perguntas e alternativas. |
| `Match` | Registro das partidas realizadas. |
| `Score` | Armazenamento das pontuações. |

## 📁 Estrutura do projeto

```text
QuizGame/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── style.css
│   ├── app.js
│   └── config.js
│
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

- Node.js instalado.
- Git instalado.
- Conta no Back4App.

### 2. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 3. Entrar na pasta

```bash
cd QuizGame
```

### 4. Instalar as dependências

```bash
npm install
```

### 5. Configurar o Back4App

Configure o arquivo `public/config.js` com as credenciais necessárias do aplicativo Back4App:

- Application ID.
- JavaScript Key.

**Importante:** nunca disponibilize a Master Key no navegador ou no repositório público.

### 6. Executar o projeto

Inicie a aplicação utilizando o comando de execução configurado no `package.json` ou um servidor local compatível com os arquivos do projeto.

## 🏆 Sistema de pontuação

Cada partida possui 10 perguntas, sendo:

- 10 pontos por resposta correta.
- 0 pontos por resposta incorreta.
- 100 pontos como pontuação máxima por partida.

O sistema armazena a melhor pontuação individual de cada jogador e utiliza esse valor para organizar o ranking global.

## 🎯 Objetivo acadêmico

O CloudQuiz foi desenvolvido como projeto acadêmico com o propósito de aplicar conhecimentos de desenvolvimento web, programação JavaScript, integração com serviços em nuvem, autenticação de usuários e gerenciamento de banco de dados utilizando uma plataforma BaaS.

## 👨‍💻 Desenvolvedores

Projeto desenvolvido para fins acadêmicos.

**CloudQuiz — Aprender também pode ser um jogo!** ☁️
