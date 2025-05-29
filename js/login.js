document.addEventListener('DOMContentLoaded', function () {

    const baseUrl = 'http://10.92.199.75:8080'; // URL base da API



    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const rememberMe = document.getElementById('rememberMe');

    // Alternar visibilidade da senha
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Abrir modal de esqueci a senha
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        forgotPasswordModal.show();
    });

    // Submissão do formulário de login
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Exibir loading
        const loginText = document.getElementById('loginText');
        const loginSpinner = document.getElementById('loginSpinner');
        loginText.classList.add('d-none');
        loginSpinner.classList.remove('d-none');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${baseUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const error = await res.json();
                alert("Ocorreu um erro ao fazer login: " + (error.message || error));
                // Resetar loading
                loginText.classList.remove('d-none');
                loginSpinner.classList.add('d-none');
                return;
            }
            const data = await res.json();

            // Login bem-sucedido
              // Login bem-sucedido
            if (rememberMe.checked) {
                 sessionStorage.setItem('Token', data.token);
                 localStorage.removeItem('Token'); // Garante que só um local armazene
            } else {
                localStorage.setItem('Token', data.token);
                sessionStorage.removeItem('Token');
            }
            
            alert('Login realizado com sucesso!');
            window.location.href = 'index.html';

        } catch (err) {
            alert("Erro de conexão com o servidor.");
            loginText.classList.remove('d-none');
            loginSpinner.classList.add('d-none');
        }

        /*         setTimeout(() => {
                // Simular resposta da API
                if (email === 'admin@glanz.com' && password === '123456') {
                // Login bem-sucedido - salvar status e redirecionar
                sessionStorage.setItem('isLoggedIn', 'true');
                alert('Login realizado com sucesso!');
                window.location.href = 'index.html';
                } else {
                // Exibir erro
                loginError.textContent = 'E-mail ou senha incorretos. Tente novamente.';
                loginError.classList.remove('d-none');
                
                // Resetar loading
                loginText.classList.remove('d-none');
                loginSpinner.classList.add('d-none');
            }
        }, 1500); */
    });

    // Submissão do formulário de recuperação de senha
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('recoveryEmail').value;

        // Simular envio de e-mail (substituir por chamada real à API)
        console.log('Solicitação de recuperação para:', email);

        // Feedback ao usuário
        alert(`Um link de recuperação foi enviado para ${email} (simulado)`);
        forgotPasswordModal.hide();
    });

    // Validação em tempo real
    document.getElementById('email').addEventListener('input', function () {
        if (this.validity.typeMismatch) {
            this.setCustomValidity('Por favor, insira um e-mail válido');
        } else {
            this.setCustomValidity('');
        }
    });

});