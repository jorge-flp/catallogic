# 🛒 Catallogic - Sistema de Catálogo Digital

O **Catallogic** é um ecossistema completo de gerenciamento de catálogo digital. O projeto é composto por uma API REST robusta desenvolvida em camadas com **Spring Boot** e uma interface administrativa ágil de página única (**SPA**) construída com HTML5 moderno, JavaScript Assíncrono e estilização baseada na identidade visual corporativa do sistema.

---

## 🛠️ Tecnologias Utilizadas

### Back-End (API)
* **Java 21** & **Spring Boot 3**
* **Spring Data JPA** (Persistência e mapeamento objeto-relacional)
* **Spring Security** (Controle de acesso e filtros de segurança)
* **Bean Validation** (Validação de dados de entrada via DTOs)
* **MySQL Driver** (Conexão com o banco de dados relacional)
* **Maven** (Gerenciador de dependências e build)

### Front-End (Interface)
* **HTML5** & **CSS3** (Variáveis nativas de cores)
* **Tailwind CSS** (Framework utilitário via CDN para design responsivo)
* **JavaScript (ES6+)** (Manipulação assíncrona do DOM e Fetch API)
* **LocalStorage** (Mecanismo de persistência híbrida para simulação em modo offline)

---

## 📂 Estrutura de Pastas Unificada

O repositório está organizado para manter o código do servidor isolado da camada visual da aplicação:

```text
/
├── api/                             # DIRETÓRIO DO BACK-END (Java)
│   ├── .mvn/wrapper/                # Inicializadores do Maven Wrapper
│   ├── mvnw.cmd                     # Executável do Maven para Windows
│   ├── pom.xml                      # POM com todas as dependências do projeto
│   └── src/main/java/com/catallogic/
│       ├── api/
│       │   └── ApiApplication.java  # Classe principal de inicialização
│       ├── controller/              # Endpoints HTTP da API
│       ├── domain/                  # Entidades de Banco de Dados (Produto)
│       ├── dto/                     # Objetos de transferência e validação
│       ├── infra/security/          # Configurações de CORS e proteção
│       ├── repository/              # Interfaces de comunicação com o JPA
│       └── service/                 # Camada contendo as Regras de Negócio
│
└── cattalogic-front/                # DIRETÓRIO DO FRONT-END (Web SPA)
    ├── index.html                   # Painel Geral Administrativo (Single Page Application)
    ├── login.html                   # Tela de Controle de Acesso
    ├── cadastro.html                # Tela de Criação de Contas de Operadores
    ├── style.css                    # Variáveis de Cores da Identidade Visual
    └── app.js                       # Lógica de rotas internas, requisições e busca

🎨 Identidade Visual & Regras de NegócioPaleta de Cores do PainelA interface do usuário implementa rigorosamente a paleta de cores homologada para o projeto:
Cor Primária (Sidebar e Menus): Slate 800 (#1E293B)
Cor Secundária (Destaques e Ações): Sky 500 (#0EA5E9
)Fundo do Painel: Slate 50 (#F8FAFC)
Ciclo de Vida do Produto (Máquina de Estados)
O estoque e a ação do administrador alteram dinamicamente as cores e marcações (badges) dos produtos na tabela:
RASCUNHO: Produto em fase de edição (Amarelo)ATIVO: Visível para o mercado no catálogo
(Verde)INATIVO: Ocultado temporariamente pelo administrador (Cinza)
ESGOTADO: Disparado automaticamente pelo sistema se o estoque atingir 0
(Vermelho)
🗺️ Endpoints Principais da APIMétodoEndpointDescriçãoPOST/produtosCadastra um novo produto validado no catálogoGET/produtosLista todos os produtos cadastrados no sistemaGET/produtos/{id}Busca os detalhes específicos de um produto por IDDELETE/produtos/{id}Remove em definitivo um produto do catálogo🚀 Como Executar o Projeto Localmente1. Inicializando o Back-End (API)Navegue até a pasta api através do terminal do seu computador e
execute os comandos para baixar as dependências do Maven e subir o Spring Boot:PowerShellcd api

.\mvnw.cmd clean install -DskipTests
.\mvnw.cmd spring-boot:run

A API estará de prontidão escutando a porta local: http://localhost:8080/produtos2. Inicializando o Front-EndA interface adota a arquitetura de Página Única (SPA), chaveando os blocos de conteúdo via JavaScript.Abra a pasta cattalogic-front utilizando o seu VS Code.Certifique-se de ter a extensão Live Server instalada.Abra o arquivo login.html, clique com o botão direito e selecione "Open with Live Server".
O navegador abrirá automaticamente o fluxo em: http://127.0.0.1:5500/login.html💡 Nota de Desenvolvimento: O arquivo app.js possui a flag MODO_TESTE_LOCAL = true. Isso permite que você cadastre produtos, utilize a barra de pesquisa em tempo real e altere as abas do menu utilizando o localStorage do navegador mesmo se a sua API Spring Boot ou o banco MySQL estiverem desligados. Para conectar à API real, mude a flag para false.👤 AutorJorge Felipe - Desenvolvedor e Arquiteto do Sistema - jorge-flp
