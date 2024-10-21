document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registerForm');
    const mensagem = document.getElementById('mensagem');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        console.error('Token ou ID do usuário não encontrados. Faça login novamente.');
        mensagem.textContent = 'Erro: Token ou ID do usuário não encontrados. Faça login novamente.';
        window.location.href = 'signin.html';
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Previne o comportamento padrão de recarregar a página

        const user = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
        };

        const password = document.getElementById('password').value;
        const password_confirmation = document.getElementById('password_confirmation').value;

        // Se a senha foi preenchida, adiciona ao objeto user
        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

            if (!passwordRegex.test(password)) {
                mensagem.textContent = 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.';
                console.log('Erro na validação da senha.');
                return;
            }

            if (password !== password_confirmation) {
                mensagem.textContent = 'A confirmação da senha não corresponde à senha.';
                console.log('Erro: confirmação da senha não corresponde.');
                return;
            }

            user.password = password;
            user.password_confirmation = password_confirmation;
        }

        console.log('Enviando dados do usuário para atualização:', user);

        // Envia a requisição para atualizar o usuário
        fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            console.log('Resposta da API recebida:', response);
            if (!response.ok) {
                throw new Error('Erro ao realizar a atualização');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados retornados pela API:', data);
            if (data.status === 200) {
                mensagem.textContent = `Usuário ${user.name} foi atualizado com sucesso!`;

                // Após 3 segundos, redireciona para a página de visualização
                setTimeout(() => {
                    window.location.href = 'view.html';  // Altere para o caminho correto da sua página de visualização
                }, 3000);
            } else {
                mensagem.textContent = 'Erro ao atualizar: ' + data.mensagem;
                console.error('Erro na atualização:', data.mensagem);
            }
        })
        .catch(error => {
            mensagem.textContent = 'Erro ao realizar a atualização. Tente novamente.';
            console.error('Erro de rede ao tentar atualizar:', error);
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function(e) {
        e.preventDefault();  // Previne qualquer comportamento padrão
        window.location.href = 'view.html';  // Altere para o caminho correto da sua página de visualização
    });
});
