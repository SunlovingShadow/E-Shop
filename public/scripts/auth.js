// /public/scripts/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');

    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = icon.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                icon.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
});
