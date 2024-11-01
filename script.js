let produtos = [];
let produtoAtual = null;

document.getElementById('produto-form').addEventListener('submit', adicionarOuAtualizarProduto);

function adicionarOuAtualizarProduto(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const preco = document.getElementById('preco').value;
    const imagemInput = document.getElementById('imagem');

    if (!nome || !preco || !imagemInput.files.length) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imagem = e.target.result;
        const produtoData = { nome, preco, imagem };

        if (produtoAtual) {
            fetch(`http://localhost:3000/produtos/${produtoAtual.id}`, { // Porta 3000
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao atualizar produto');
                return response.json();
            })
            .then(data => {
                produtoAtual = null;
                document.getElementById('produto-form').reset();
                exibirProdutos();
            })
            .catch(error => alert(error.message));
        } else {
            fetch('http://localhost:3000/produtos', { // Porta 3000
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao criar produto');
                return response.json();
            })
            .then(data => {
                exibirProdutos();
            })
            .catch(error => alert(error.message));
        }
    };
    reader.readAsDataURL(imagemInput.files[0]);
}

function exibirProdutos() {
    fetch('http://localhost:3000/produtos') // Porta 3000
    .then(response => {
        if (!response.ok) throw new Error('Erro ao exibir produtos');
        return response.json();
    })
    .then(data => {
        produtos = data;
        const container = document.querySelector('.items');
        container.innerHTML = '';

        produtos.forEach(produto => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <div class="product">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100px; height: 100px;">
                </div>
                <h3>${produto.nome}</h3>
                <span>R$ ${produto.preco}</span>
                <div class="button-container">
                    <button onclick="prepararAtualizacao('${produto.id}')">Atualizar</button>
                    <button class="btn excluir" onclick="excluirProduto('${produto.id}')">Excluir</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    })
    .catch(error => alert(error.message));
}

function excluirProduto(id) {
    fetch(`http://localhost:3000/produtos/${id}`, { // Porta 3000
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir produto');
        exibirProdutos();
    })
    .catch(error => alert(error.message));
}

function prepararAtualizacao(id) {
    const produto = produtos.find(prod => prod.id === id);
    if (produto) {
        document.getElementById('nome').value = produto.nome;
        document.getElementById('preco').value = produto.preco;
        produtoAtual = produto; // Salva o produto atual para atualização
    }
}

// Carrega produtos no carregamento da página
document.addEventListener('DOMContentLoaded', exibirProdutos);
document.getElementById('year').textContent = new Date().getFullYear();

