const MODO_TESTE_LOCAL = true; 
const API_URL = "http://localhost:8080/produtos";

document.addEventListener("DOMContentLoaded", () => {
    // 🛠️ INICIALIZAÇÃO DO CONTROLE DE TELAS (CLIQUES DO MENU)
    configurarNavegacaoMenu();

    // Carrega dados iniciais na tabela
    carregarProdutos();
    
    // Vincula a adição de produtos
    const form = document.getElementById("produtoForm");
    if(form) form.addEventListener("submit", cadastrarProduto);

    // Vincula a caixa de pesquisa do topo
    const barraPesquisa = document.getElementById("barraPesquisa");
    if(barraPesquisa) {
        barraPesquisa.addEventListener("input", (e) => {
            // Força a exibição da tela de produtos ao pesquisar algo
            mostrarTela("produtos"); 
            filtrarProdutos(e.target.value);
        });
    }
});

// FUNÇÃO: Gerencia as trocas de tela ao clicar nos botões do menu lateral
function configurarNavegacaoMenu() {
    const botoes = {
        dashboard: document.getElementById("btn-dashboard"),
        clientes: document.getElementById("btn-clientes"),
        produtos: document.getElementById("btn-produtos"),
        configuracoes: document.getElementById("btn-configuracoes")
    };

    Object.keys(botoes).forEach(chave => {
        if (botoes[chave]) {
            botoes[chave].addEventListener("click", () => mostrarTela(chave));
        }
    });
}

function mostrarTela(nomeDaTela) {
    // 1. Esconde todos os blocos de conteúdo
    document.querySelectorAll(".secao-conteudo").forEach(bloco => {
        bloco.classList.add("secao-oculta");
    });

    // 2. Remove o destaque visual de todos os botões do menu
    const itensMenu = document.querySelectorAll("#menuLateral button");
    itensMenu.forEach(btn => {
        btn.classList.remove("text-white", "bg-slate-700/50", "font-semibold", "border-[#0EA5E9]");
        btn.classList.add("text-gray-400", "border-transparent");
    });

    // 3. Mostra o bloco da tela clicada
    const telaAlvo = document.getElementById(`conteudo-${nomeDaTela}`);
    if (telaAlvo) telaAlvo.classList.remove("secao-oculta");

    // 4. Aplica o destaque visual no botão ativo
    const botaoAtivo = document.getElementById(`btn-${nomeDaTela}`);
    if (botaoAtivo) {
        botaoAtivo.classList.remove("text-gray-400", "border-transparent");
        botaoAtivo.classList.add("text-white", "bg-slate-700/50", "font-semibold", "border-[#0EA5E9]");
    }
}

// ================= GERENCIAMENTO DE PRODUTOS =================

const statusEstilos = {
    RASCUNHO: "bg-amber-100 text-amber-800 border-amber-200",
    ATIVO: "bg-green-100 text-green-800 border-green-200",
    INATIVO: "bg-gray-100 text-gray-700 border-gray-300",
    ESGOTADO: "bg-red-100 text-red-800 border-red-200",
    ARQUIVADO: "bg-purple-100 text-purple-800 border-purple-200"
};

async function obterProdutos() {
    if (MODO_TESTE_LOCAL) {
        return JSON.parse(localStorage.getItem("catallogic_produtos")) || [];
    }
    const response = await fetch(API_URL);
    return await response.json();
}

async function carregarProdutos(produtosFiltrados = null) {
    try {
        const produtos = produtosFiltrados ? produtosFiltrados : await obterProdutos();
        const tabela = document.getElementById("tabelaProdutos");
        if(!tabela) return;
        
        tabela.innerHTML = ""; 

        if (produtos.length === 0) {
            tabela.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">Nenhum produto correspondente cadastrado.</td></tr>`;
            return;
        }

        produtos.forEach(produto => {
            let statusAtual = parseInt(produto.estoque) === 0 ? "ESGOTADO" : (produto.status || "ATIVO");
            let classeBadge = statusEstilos[statusAtual] || "bg-gray-100 text-gray-800";

            tabela.innerHTML += `
                <tr class="hover:bg-slate-50 transition duration-150">
                    <td class="py-4 px-4 text-gray-400 font-mono text-xs">#00${produto.id}</td>
                    <td class="py-4 px-4 font-semibold text-slate-700">${produto.nome}</td>
                    <td class="py-4 px-4 font-medium">R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                    <td class="py-4 px-4 text-gray-500">${produto.estoque} un</td>
                    <td class="py-4 px-4">
                        <span class="px-2.5 py-1 rounded-md text-xs font-medium border ${classeBadge}">
                            ${statusAtual}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-center">
                        <button onclick="deletarProduto(${produto.id})" class="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

async function cadastrarProduto(event) {
    event.preventDefault();

    const novoProduto = {
        id: Math.floor(Math.random() * 900) + 100, // Gera ID de 3 dígitos igual ao protótipo
        nome: document.getElementById("nome").value,
        preco: parseFloat(document.getElementById("preco").value),
        estoque: parseInt(document.getElementById("estoque").value),
        status: document.getElementById("status").value
    };

    if (MODO_TESTE_LOCAL) {
        const produtos = await obterProdutos();
        produtos.push(novoProduto);
        localStorage.setItem("catallogic_produtos", JSON.stringify(produtos));
        document.getElementById("produtoForm").reset();
        carregarProdutos();
    } else {
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoProduto)
            });
            document.getElementById("produtoForm").reset();
            carregarProdutos();
        } catch (e) { console.error(e); }
    }
}

async function filtrarProdutos(termo) {
    const todos = await obterProdutos();
    const filtrados = todos.filter(p => 
        p.nome.toLowerCase().includes(termo.toLowerCase())
    );
    carregarProdutos(filtrados);
}

async function deletarProduto(id) {
    if (!confirm("Deseja remover este item definitivamente?")) return;

    if (MODO_TESTE_LOCAL) {
        let produtos = await obterProdutos();
        produtos = produtos.filter(p => p.id !== id);
        localStorage.setItem("catallogic_produtos", JSON.stringify(produtos));
        carregarProdutos();
    } else {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregarProdutos();
    }
// Cole este bloco no final do seu arquivo app.js

// Dados simulados do Usuário com base no seu Diagrama de Classes
const dadosUsuarioLogado = {
    id: 1,
    nome: "Jorge Felipe",
    email: "jorgefeliperodrigues841@gmail.com",
    perfil: "ADMINISTRADOR"
};

// Configura os cliques do Perfil assim que a página carregar
document.addEventListener("DOMContentLoaded", () => {
    const btnPerfil = document.getElementById("btn-perfil-topo");
    const btnFechar = document.getElementById("btn-fechar-perfil");
    const modalPerfil = document.getElementById("modal-perfil");
    const btnModalSair = document.getElementById("btn-modal-sair");

    // Abrir o Modal de Perfil ao clicar no topo
    if (btnPerfil && modalPerfil) {
        btnPerfil.addEventListener("click", () => {
            // Preenche os campos com os dados do Objeto antes de mostrar
            document.getElementById("perfil-nome").innerText = dadosUsuarioLogado.nome;
            document.getElementById("perfil-email").innerText = dadosUsuarioLogado.email;
            document.getElementById("perfil-id").innerText = `#00${dadosUsuarioLogado.id}`;
            
            // Remove a classe que esconde a janela
            modalPerfil.classList.remove("secao-oculta");
        });
    }

    // Fechar o Modal no botão "X"
    if (btnFechar && modalPerfil) {
        btnFechar.addEventListener("click", () => {
            modalPerfil.classList.add("secao-oculta");
        });
    }

    // Fechar se clicar na parte escura de fora da janela
    if (modalPerfil) {
        modalPerfil.addEventListener("click", (e) => {
            if (e.target === modalPerfil) {
                modalPerfil.classList.add("secao-oculta");
            }
        });
    }

    // Botão Sair de dentro do Perfil
    if (btnModalSair) {
        btnModalSair.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});
}