document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log('ID do user:', userId);
    console.log('Token armazenado:', token);

    // Verificação para garantir que o token e o userId existam antes de prosseguir
    if (!token || !userId) {
        alert('Token ou ID do usuário não encontrados. Faça o login novamente.');
        window.location.href = 'signin.html';
        return;
    }

    // Função para buscar os dados do usuário
    fetchUserData(userId, token);

    function fetchUserData(userId, token) {
        let retryCount = 0;
        const maxRetries = 3;

        fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do usuário: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 200) {
                const user = data.user;
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userEmail').textContent = user.email;
                document.getElementById('userCreated').textContent = new Date(user.created_at).toLocaleString('pt-BR');
                console.log('Dados do user:', user);

                document.getElementById('userInfo').classList.remove('d-none');
            } else {
                document.getElementById('messageError').textContent = 'Erro ao carregar o usuário. Tente novamente.';
                document.getElementById('messageError').classList.remove('d-none');
            }
        })
        .catch(error => {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.log(`Tentativa ${retryCount} de ${maxRetries}`);
                fetchUserData(userId, token);
            } else {
                console.error('Erro ao carregar o usuário após várias tentativas:', error);
                alert('Erro ao carregar os dados do usuário. Faça login novamente.');
                window.location.href = 'signin.html';
            }
        });
    }
});