document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario");
    const mesActualElemento = document.querySelector(".mesActual");
    const contenedorHorarios = document.querySelector(".horarios-disponibles");
    const formularioReserva = document.getElementById("formularioReserva");
    const hamburger = document.querySelector('.hamburger-menu');
    const menuNav = document.querySelector('.menu-nav');
    let lastScrollTop = 0;
    let anoActual;
    let mesActual;
    let fechaSeleccionada;
    let horarioSeleccionado;
    const horariosReservadosPorFecha = {};

    // Obtener los datos guardados del almacenamiento local al cargar la página
    const datosGuardados = localStorage.getItem("datosReservas");
    if (datosGuardados) {
        Object.assign(horariosReservadosPorFecha, JSON.parse(datosGuardados));
    }

    const hoy = new Date();
    anoActual = hoy.getFullYear();
    mesActual = hoy.getMonth();

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    generarCalendario(anoActual, mesActual);

    function generarCalendario(ano, mes) {
        const primerDiaDelMes = new Date(ano, mes, 1);
        const ultimoDiaDelMes = new Date(ano, mes + 1, 0);
        const diasEnMes = ultimoDiaDelMes.getDate();
        const primerDiaSemana = primerDiaDelMes.getDay(); // Día de la semana del primer día del mes

        const diasElemento = calendario.querySelector(".dias");
        diasElemento.innerHTML = ""; // Limpia los días existentes antes de generar los nuevos

        mesActualElemento.textContent = meses[mes] + " " + ano;

        // Rellenar los días del mes
        for (let i = 0; i < primerDiaSemana; i++) {
            const diaVacio = document.createElement("div");
            diaVacio.classList.add("dia-vacio");
            diasElemento.appendChild(diaVacio);
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const diaElemento = document.createElement("div");
            diaElemento.classList.add("dia");
            diaElemento.textContent = dia;
            diasElemento.appendChild(diaElemento);
        }
    }

    document.getElementById("mesAnterior").addEventListener("click", function() {
        contenedorHorarios.style.display = "none";
        formularioReserva.style.display = "none";
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            anoActual--;
        }
        generarCalendario(anoActual, mesActual);
    });

    document.getElementById("mesSiguiente").addEventListener("click", function() {
        contenedorHorarios.style.display = "none";
        formularioReserva.style.display = "none";
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            anoActual++;
        }
        generarCalendario(anoActual, mesActual);
    });

    calendario.querySelector(".dias").addEventListener("click", function(event) {
        contenedorHorarios.style.display = "none";
        formularioReserva.style.display = "none";

        const dia = event.target.textContent;
        fechaSeleccionada = new Date(anoActual, mesActual, dia);
        mostrarHorariosDisponibles(fechaSeleccionada);
        contenedorHorarios.style.display = "flex";
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

    function mostrarHorariosDisponibles(fecha) {
        contenedorHorarios.innerHTML = "";

        const horariosReservadosParaFecha = horariosReservadosPorFecha[fecha.toLocaleDateString('es-ES')] || [];

        const horariosDisponibles = ["09:00hs", "10:00hs", "11:00hs", "12:00hs", "13:00hs", "14:00hs", "15:00hs"];
        const eligeHorario = document.createElement("div");
        eligeHorario.textContent = "ELIGE UNA FRANJA HORARIA PARA " + fecha.toLocaleDateString('es-ES');
        eligeHorario.style.fontWeight = "bold";
        contenedorHorarios.appendChild(eligeHorario);

        const contenedorHorariosDiv = document.createElement("div");
        contenedorHorariosDiv.classList.add("horarios-container");
        horariosDisponibles.forEach(horario => {
            const opcion = document.createElement("div");
            opcion.classList.add("horario");
            opcion.textContent = horario;

            // Verificar si el horario está reservado
            const horarioReservado = horariosReservadosParaFecha.find(reserva => reserva.horario === horario);
            if (horarioReservado) {
                opcion.classList.add("reservado");
            }

            contenedorHorariosDiv.appendChild(opcion);
        });
        contenedorHorarios.appendChild(contenedorHorariosDiv);
    }

    contenedorHorarios.addEventListener("click", function(event) {
        if (event.target.classList.contains("horario")) {
            horarioSeleccionado = event.target.textContent;
            const fechaKey = fechaSeleccionada.toLocaleDateString('es-ES');
            const horarioReservado = horariosReservadosPorFecha[fechaKey]?.find(reserva => reserva.horario === horarioSeleccionado);
            if (horarioReservado) {
                const reserv = document.createElement("div");
                reserv.classList.add("reserv");
                reserv.textContent = "La franja horaria seleccionada no está disponible. Por favor, elija otra.";
                reserv.style.color = "red";
                contenedorHorarios.appendChild(reserv);
                setTimeout(() => {
                    reserv.style.display = "none";
                }, 3000);
            } else {
                mostrarFormularioReserva();
                contenedorHorarios.style.display = "none";
            }
        }
    });

    function mostrarFormularioReserva() {
        formularioReserva.style.display = "flex";
    }

    formularioReserva.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.toUpperCase();
        const telefonoInput = document.getElementById("telefono");
        const telefono = telefonoInput.value;

        const regexTelefonoEuropeo = /^(\+|\d)[\d\s\-()+]{6,20}$/;

        telefonoInput.value = "";

        if (!regexTelefonoEuropeo.test(telefono)) {
            const mensajeError = document.createElement("div");
            mensajeError.style.display = "flex";
            mensajeError.textContent = "El número de teléfono ingresado no es válido. Por favor, introduzca un número válido.";
            mensajeError.style.color = "red";
            mensajeError.classList.add("mensaje-error");
            telefonoInput.addEventListener("click", function(event) {
                mensajeError.style.display = "none";
            });

            formularioReserva.appendChild(mensajeError);
            return;
        }

        const fechaKey = fechaSeleccionada.toLocaleDateString('es-ES');
        // Asegúrate de que horariosReservadosPorFecha[fechaKey] esté inicializado
        if (!horariosReservadosPorFecha[fechaKey]) {
            horariosReservadosPorFecha[fechaKey] = [];
        }

        horariosReservadosPorFecha[fechaKey] = horariosReservadosPorFecha[fechaKey].reduce((accum, reserva) => {
            if (reserva.horario !== horarioSeleccionado) {
                accum.push(reserva);
            }
            return accum;
        }, []);

        horariosReservadosPorFecha[fechaKey].push({
            nombre: nombre,
            horario: horarioSeleccionado,
            telefono: telefono
        });

        localStorage.setItem("datosReservas", JSON.stringify(horariosReservadosPorFecha));

        Swal.fire({
            title: "¡Perfecto!",
            text: "Reserva realizada con éxito. Nombre: " + nombre + ", Teléfono: " + telefono + ", Fecha: " + fechaSeleccionada.toLocaleDateString('es-ES') + ", Horario: " + horarioSeleccionado,
            imageUrl: "../assets/joel-1.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Imagen personalizada"
        });

        formularioReserva.reset();
        formularioReserva.style.display = "none";
        contenedorHorarios.style.display = "none";
    });

    obtenerClima('Andorra la Vella');
    obtenerForecast('Andorra la Vella'); 
});

function obtenerClima(ciudad) {
    const apiKey = 'd6aa396a076d72edeeb89d5496d30ab4';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de red al obtener el clima');
            }
            return response.json();
        })
        .then(data => {
            mostrarInfoClima(data);
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
        });
}

function mostrarInfoClima(data) {
    const contenedorClima = document.getElementById("clima");

    if (!contenedorClima) {
        console.error("Elemento con id 'clima' no encontrado.");
        return;
    }
    console.log(data);
    contenedorClima.innerHTML = `
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Clima: ${data.weather[0].description}</p>
        
    `;
}

function obtenerForecast(ciudad) {
    const apiKey = 'd6aa396a076d72edeeb89d5496d30ab4';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de red al intentar obtener el pronóstico');
            }
            return response.json();
        })
        .then(data => {
            mostrarForecast(data);
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico:', error);
        });
}

function mostrarForecast(data) {
    const contenedorForecast = document.getElementById("forecast");

    if (!contenedorForecast) {
        console.error("Elemento con id 'forecast' no encontrado.");
        return;
    }

    contenedorForecast.innerHTML = "";
    
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString('es-ES');
        const forecastElement = document.createElement("div");
        forecastElement.innerHTML = `
            <p> ${dateString}</p>
            <p> ${forecast.main.temp}°C</p>
            <p> ${forecast.weather[0].description}</p>
        `;
        contenedorForecast.appendChild(forecastElement);
    }
}
