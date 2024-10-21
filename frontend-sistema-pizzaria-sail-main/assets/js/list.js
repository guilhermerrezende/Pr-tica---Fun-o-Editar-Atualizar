document.addEventListener('DOMContentLoaded', function() {
    let isPageLoaded = false;
    if (isPageLoaded) return; // Se a página já foi carregada, não executa novamente
    isPageLoaded = true;

    console.log('Página carregada');
    listarUsuarios(); // A chamada é feita apenas ao carregar a página
});

async function listarUsuarios() {
    const token = localStorage.getItem('token');
    const userIdLogado = localStorage.getItem('userId');
    console.log('Token armazenado:', token);
    console.log('ID do usuário logado:', userIdLogado);

    let retryCount = 0;
    const maxRetries = 3;

    try {
        if (token) {
            console.log('Token encontrado, fazendo requisição para a API...');

            const response = await fetch('http://localhost:8000/api/user/listar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Resposta da API recebida:', response);

            if (response.ok) {
                const usuarios = await response.json();
                console.log('Dados dos usuários recebidos:', usuarios);
                
                const tabelaUsuarios = document.getElementById('tabelaUsuarios');
                tabelaUsuarios.innerHTML = '';

                usuarios.users.data.forEach((usuario, index) => {
                    console.log(`Adicionando usuário ${usuario.name} na tabela`);
                    const dataCriacao = new Date(usuario.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${usuario.name}</td>
                        <td>${usuario.email}</td>
                        <td>${dataCriacao}</td>
                        <td>
                            ${usuario.id != userIdLogado
                            ? `<button class="btn btn-danger btn-sm excluir-usuario" data-id="${usuario.id}">
                                    <i class="fas fa-trash-alt"></i>
                                   </button>`
                            : ''}
                        </td>
                    `;
                    tabelaUsuarios.appendChild(row);
                });

                console.log('Usuários foram adicionados na tabela.');

                document.querySelectorAll('.excluir-usuario').forEach(button => {
                    button.addEventListener('click', async function () {
                        const userId = this.getAttribute('data-id');
                        console.log('Clique detectado no botão de excluir para o usuário:', userId);
                        const confirmar = confirm('Tem certeza que deseja excluir este usuário?');
                        if (confirmar) {
                            await excluirUsuario(userId);
                        }
                    });
                });
            } else {
                console.error('Erro ao buscar os usuários, status:', response.status);
                const mensagemErro = document.getElementById('mensagemErro');
                mensagemErro.textContent = 'Erro ao buscar a lista de usuários. Por favor, tente novamente.';
                mensagemErro.classList.remove('d-none');
            }
        } else {
            console.log('Token não encontrado. Solicite ao usuário que faça login novamente.');
            const mensagemErro = document.getElementById('mensagemErro');
            mensagemErro.textContent = 'Token não encontrado. Faça login novamente.';
            mensagemErro.classList.remove('d-none');
        }
    } catch (error) {
        retryCount++;
        if (retryCount <= maxRetries) {
            console.log(`Tentativa ${retryCount} de ${maxRetries}`);
            listarUsuarios();
        } else {
            console.error('Erro ao carregar a lista de usuários após várias tentativas:', error);
            const mensagemErro = document.getElementById('mensagemErro');
            mensagemErro.textContent = 'Erro ao carregar a lista de usuários. Tente novamente.';
            mensagemErro.classList.remove('d-none');
        }
    }
}

// Função para excluir o usuário
async function excluirUsuario(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8000/api/user/deletar/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            listarUsuarios(); // Recarregar a lista de usuários
        } else {
            throw new Error('Erro ao excluir o usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o usuário.');
    }
}

// Chama a função para listar os usuários assim que a página for carregada
document.addEventListener('DOMContentLoaded', listarUsuarios);