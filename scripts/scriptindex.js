document.addEventListener("DOMContentLoaded", function() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    const textosTarj = document.querySelectorAll('.textos-tarj h2');
    const imagenes = document.querySelectorAll ('.imagen');
    const tarjetasCount = tarjetas.length;
    const imagenesCount = imagenes.length;
    const progressBars = document.querySelectorAll('.progress-bar .progress');
    let currentIndex = 0;
    let animationRunning = true;
    let clickTimeout;
    const hamburger = document.querySelector('.hamburger-menu');
    const menuNav = document.querySelector('.menu-nav');
    let lastScrollTop = 0;

    function startAnimation() {
        if (!animationRunning) return;
    
        tarjetas.forEach((tarjeta) => {
            tarjeta.style.opacity = 0;
        });
    
        tarjetas[currentIndex].style.opacity = 0.8;
        textosTarj.forEach((texto, idx) => {
            if (idx === currentIndex) {
                texto.classList.remove('texto');
                texto.classList.add('texto-tarjeta');
            } else {
                texto.classList.add('texto');
                texto.classList.remove('texto-tarjeta');
            }
        });
    
        imagenes.forEach((imagen) => {
            imagen.style.opacity = 0;
            imagen.style.transform = 'scale(1.2)';
        });
    
        imagenes[currentIndex].style.opacity = 1;
        imagenes[currentIndex].style.transform = 'scale(1)';
    
        updateProgressBars(currentIndex);
        currentIndex = (currentIndex + 1) % tarjetasCount;
        setTimeout(startAnimation, 5000); 
    }
    
    function updateProgressBars(index) {
        progressBars.forEach((progressBar, idx) => {
            if (idx === index) {
                progressBar.style.transition = 'none'; // Elimina la transición previa
                progressBar.style.width = '0%'; // Reinicia la barra de progreso
                setTimeout(() => {
                    progressBar.style.transition = 'width 5s linear'; // Añade la nueva transición
                    progressBar.style.width = '100%'; // Llena la barra de progreso
                }, 50); // Retraso para permitir el reinicio
            } else {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%'; // Reinicia las barras que no están activas
            }
        });
    }

    startAnimation();

    textosTarj.forEach((texto, i) => {
        texto.addEventListener('click', function() {
            clearTimeout(clickTimeout); 
            animationRunning = false; 

            /* Mostrar la tarjeta y el texto correspondientes al hacer clic */
            tarjetas.forEach((tarjeta, idx) => {
                tarjeta.style.opacity = 0;
                if (idx === i) {
                    tarjeta.classList.add('active');
                    tarjeta.style.opacity = 0.8;
                }
            });

            textosTarj.forEach((t, idx) => {
                if (idx === i) {
                    t.classList.remove('texto');
                    t.classList.add('texto-tarjeta');
                } else {
                    t.classList.add('texto');
                    t.classList.remove('texto-tarjeta');
                }
            });

            imagenes.forEach((imagen, idx) => {
                imagen.style.opacity = 0;
                imagen.style.transform = 'scale(1.2)';
                if (idx === i) {
                    imagen.style.opacity = 1;
                    imagen.style.transform = 'scale(1)';
                }
            });

            clickTimeout = setTimeout(() => {
                animationRunning = true;
                startAnimation();
            }, 10000); 
        });
    });
    hamburger.addEventListener('click', () => {
        menuNav.classList.toggle('active');
    });
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo
            menuNav.classList.remove('active');
        } 
        lastScrollTop = scrollTop;
    });
});

    


