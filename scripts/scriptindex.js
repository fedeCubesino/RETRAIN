document.addEventListener("DOMContentLoaded", function() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    const textosTarj = document.querySelectorAll('.textos-tarj h2');
    const imagenes = document.querySelectorAll('.imagen');
    const tarjetasCount = tarjetas.length;
    const imagenesCount = imagenes.length;
    let currentIndex = 0;
    let animationRunning = true;
    let clickTimeout;

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

        currentIndex = (currentIndex + 1) % tarjetasCount;
        setTimeout(startAnimation, 5000); 
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
});
