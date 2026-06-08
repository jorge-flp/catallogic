const API_URL = "http://localhost:8080/produtos";

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    document.getElementById("produtoForm").addEventListener("submit", cadastrarProduto);
});

// Cores dos Badges com base no seu diagrama de Status
const statusEstilos = {
    RASCUNHO: "bg-amber-100 text-amber-800 border-amber-200",
    ATIVO: "bg-green-100 text-green-800 border-green-200",
    INATIVO: "bg-gray-100 text-gray-700 border-gray-300",
    ESGOTADO: "bg-red-100 text-red-800 border-red-200",
    ARQUIVADO: "bg-purple-100 text-purple-800 border-purple-200"
};

async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro de conexão");
        
        const produtos = await response.json();
        const tabela = document.getElementById("tabelaProdutos");
        tabela.innerHTML = ""; 

        if (produtos.length === 0) {
            tabela.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">Nenhum produto listado no momento.</td></tr>`;
            return;
        }

        produtos.forEach(produto => {
            // Se o estoque for 0, força o status para ESGOTADO conforme sua máquina de estados
            let statusAtual = produto.estoque === 0 ? "ESGOTADO" : (produto.status || "ATIVO");
            let classeBadge = statusEstilos[statusAtual] || "bg-gray-100 text-gray-800";

            tabela.innerHTML += `
                <tr class="hover:bg-slate-50 transition duration-150">
                    <td class="py-4 px-4 text-gray-400 font-mono text-xs">#00${produto.id}</td>
                    <td class="py-4 px-4 font-semibold text-slate-700">${produto.nome}</td>
                    <td class="py-4 px-4 font-medium">R$ ${produto.preco.toFixed(2)}</td>
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
        console.error("Erro:", error);
    }
}

async function cadastrarProduto(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        preco: parseFloat(document.getElementById("preco").value),
        estoque: parseInt(document.getElementById("estoque").value),
        status: document.getElementById("status").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            document.getElementById("produtoForm").reset();
            carregarProdutos();
        } else {
            alert("Erro ao salvar produto na API.");
        }
    } catch (error) {
        console.error("Erro na conexão com o Back-end:", error);
    }
}

async function deletarProduto(id) {
    if (confirm("Deseja remover este item definitivamente?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (response.ok) carregarProdutos();
        } catch (error) {
            console.error("Erro:", error);
        }
    }
}