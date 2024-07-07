document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario-reservas");
    const mesActualElemento = document.querySelector(".mesActual");
    let reservaElemento;
    let anoActual;
    let mesActual;
    let fechaSeleccionada;
    let horariosReservadosPorFecha = {};  
    const calendarioReservas = document.querySelector(".calendario-reservas");
    const hamburger = document.querySelector('.hamburger-menu');
    const menuNav = document.querySelector('.menu-nav');
    let lastScrollTop = 0;
    if (localStorage.getItem("datosReservas")) {
        const datosReservas = JSON.parse(localStorage.getItem("datosReservas"));
        horariosReservadosPorFecha = datosReservas;
    }
    
    const hoy = new Date();
    anoActual = hoy.getFullYear();
    mesActual = hoy.getMonth();

    const meses =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    ;

    generarCalendario(anoActual, mesActual);

    function generarCalendario(ano, mes) {
        const primerDiaDelMes = new Date(ano, mes, 1);
        const ultimoDiaDelMes = new Date(ano, mes + 1, 0);
        const diasEnMes = ultimoDiaDelMes.getDate();
        const diasElemento = calendario.querySelector(".dias-res");
        diasElemento.innerHTML = "";   
        /* Limpia los días existentes y las reservas antes de generar los nuevos */
        
        const titulosAnteriores = document.querySelectorAll(".reservas-dia");
        titulosAnteriores.forEach(titulo => titulo.remove());

        const reservasAnteriores = document.querySelectorAll(".reserva-elem");
        reservasAnteriores.forEach(reserva => reserva.remove());
        
        mesActualElemento.textContent = meses[mes] + " " + ano;

        /* Calendario con los días del mes */
        for (let i = 0; i < primerDiaDelMes.getDay(); i++) {
            const diaVacio = document.createElement("div");
            diaVacio.classList.add("dia");
            diasElemento.appendChild(diaVacio);
        }

        for (let i = 1; i <= diasEnMes; i++) {
            const diaElemento = document.createElement("div");
            diaElemento.classList.add("dia");
            diaElemento.textContent = i;
            diasElemento.appendChild(diaElemento);
        const fecha = new Date(ano, mes, i);
        const fechaNormalizada = fecha.toLocaleDateString();

  /* Verificar si hay horarios disponibles para este día */
  
        if (horariosReservadosPorFecha[fechaNormalizada] && horariosReservadosPorFecha[fechaNormalizada].length > 0) {
        diaElemento.classList.add("disponible");
        }
    }
}

    document.getElementById("mesAnterior-res").addEventListener("click", function() {
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            anoActual--;
        }
        generarCalendario(anoActual, mesActual);
    });

    document.getElementById("mesSiguiente-res").addEventListener("click", function() {
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            anoActual++;
        }
        generarCalendario(anoActual, mesActual);
    });


    calendario.querySelector(".dias-res").addEventListener("click", function(event) {
        const dia = event.target.textContent;
        fechaSeleccionada = new Date(anoActual, mesActual, dia);
        
        mostrarReservasEnCalendario(fechaSeleccionada);
    });
    
    hamburger.addEventListener('click', () => {
        menuNav.classList.toggle('active');
    });
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            menuNav.classList.remove('active');
        } 
        lastScrollTop = scrollTop;
    });
    function mostrarReservasEnCalendario(fechaSeleccionada) {
        const fechaSeleccionadaStr = fechaSeleccionada.toLocaleDateString('es-ES');
     /* Eliminar los elementos de título y reservas anteriores */
        const titulosAnteriores = document.querySelectorAll(".reservas-dia");
        titulosAnteriores.forEach(titulo => titulo.remove());

    const reservasAnteriores = document.querySelectorAll(".reserva-elem");
    reservasAnteriores.forEach(reserva => reserva.remove());
    
        const reservasDelDia = horariosReservadosPorFecha[fechaSeleccionadaStr];
        if (reservasDelDia) {
            const tituloDia = document.createElement("div");
            tituloDia.textContent = fechaSeleccionadaStr;
            tituloDia.classList.add("reservas-dia");
            calendarioReservas.appendChild(tituloDia);
    
            reservasDelDia.forEach(reserva => {
                const reservaElemento = document.createElement("div");
                reservaElemento.textContent = "Nombre: " + reserva.nombre + "\n" + ", Horario: " + reserva.horario + "\n\n";
                calendarioReservas.appendChild(reservaElemento);
                reservaElemento.classList.add("reserva-elem")
            });
        } else {
            const reservaElemento = document.createElement("div");
            reservaElemento.classList.add("reserva-elem")
            reservaElemento.textContent = "No hay reservas para la fecha ";
            calendarioReservas.appendChild(reservaElemento);
        }
    }
    
    
});
