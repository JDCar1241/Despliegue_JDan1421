document.getElementById("btn").addEventListener("click", () => {
  alert("¡Despliegue exitoso, Jairo! 🎉");
});
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    } else {
        document.getElementById('theme-toggle').textContent = '🌙';
    }

    // Alternar tema oscuro/claro
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        document.getElementById('theme-toggle').textContent = isLight ? '☀️' : '🌙';
    });

    // Interactividad del botón principal
    document.getElementById('btn').addEventListener('click', () => {
        alert('¡Despliegue exitoso, Jairo! 🎉');
        const cardText = document.querySelector('.card p');
        cardText.innerText = '¡Gracias por hacer clic! Explora mis proyectos y contáctame en Instagram.';
    });

    // Navegación suave para los enlaces del menú
    document.querySelectorAll('.navbar a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajuste por el navbar fijo
                    behavior: 'smooth'
                });
            }
        });
    });
});