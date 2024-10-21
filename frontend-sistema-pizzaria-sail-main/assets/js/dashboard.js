// dashboard.js ajustado com controle de loops e tentativas

document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
        fetchUserData(token);
    } else {
        console.log('Token não encontrado. Solicite ao usuário que faça login novamente.');
        const mensagemErro = document.createElement('div');
        mensagemErro.textContent = 'Token não encontrado. Por favor, faça login novamente.';
        mensagemErro.classList.add('alert', 'alert-danger');
        document.body.prepend(mensagemErro);
    }

    function fetchUserData(token) {
        let retryCount = 0;
        const maxRetries = 3;

        fetch('http://localhost:8000/api/user', {
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
            if (data && data.usuario && data.usuario.name) {
                welcomeMessage.textContent = `Welcome, ${data.usuario.name}!`;
            } else {
                alert('Usuário não encontrado. Faça login novamente.');
                window.location.href = 'signin.html';
            }
        })
        .catch(error => {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.log(`Tentativa ${retryCount} de ${maxRetries}`);
                fetchUserData(token);
            } else {
                console.error('Erro ao carregar os dados do usuário após várias tentativas:', error);
                alert('Erro ao carregar os dados do usuário. Faça login novamente.');
                window.location.href = 'signin.html';
            }
        });
    }
});