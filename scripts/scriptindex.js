document.addEventListener("DOMContentLoaded", function() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    const imagenes = document.querySelectorAll(".imagen");
    const tarjetasCount = tarjetas.length;
    const imagenesCount = imagenes.length;
    let currentIndex = 0;
    var index = 0;

    function startAnimation() {
        
        // Oculta todas las tarjetas
        tarjetas.forEach((tarjeta) => {
            tarjeta.style.opacity = 0;
            tarjeta.style.transition = 'opacity 1.5s ease'; 
        });
    
        // Muestra la tarjeta actual
        tarjetas[currentIndex].style.opacity = 0.8;
    
        // Actualiza los colores de los h2
        const textos = document.querySelectorAll('.textos-tarj h2');

textos.forEach((texto, index) => {
    
    if (index === currentIndex) {
        texto.classList.remove('texto'); 
        texto.classList.add('texto-tarjeta'); 
    } else {
        texto.classList.add('texto'); 
        texto.classList.remove('texto-tarjeta'); 
    }
        });
    
        currentIndex = (currentIndex + 1) % tarjetasCount;
        setTimeout(startAnimation, 5000); 
    }
    

    
    startAnimation();

    function cambiarImagen() {
        imagenes.forEach((imagen) => {
            imagen.style.opacity = 0;
            imagen.style.transition = 'opacity 0.5s ease, transform 1s ease';
            imagen.style.transform = 'scale(1.2)';
        });
        imagenes[index].style.opacity = 1;
        imagenes[index].style.transition = 'opacity 0.5s ease, transform 1s ease'; 
        imagenes[index].style.transform = 'scale(1)'; 
        // Mostrar la primera imagen
        index = (index + 1) % imagenesCount;
        
            // Inicia la animación de la próxima tarjeta después de un breve retraso
            setTimeout(cambiarImagen, 5000); 
    }
    cambiarImagen();
});
