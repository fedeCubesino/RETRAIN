document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario");
    const mesActualElemento = document.querySelector(".mesActual");
    const contenedorHorarios = document.querySelector(".horarios-disponibles");
    const formularioReserva = document.getElementById("formularioReserva");
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

        const diasElemento = calendario.querySelector(".dias");
        diasElemento.innerHTML = ""; // Limpia los días existentes antes de generar los nuevos

        mesActualElemento.textContent = meses[mes] + " " + ano;

        // Calendario con los días del mes utilizando map
        const dias = Array.from({ length: diasEnMes }, (_, index) => index + 1);
        const diasHtml = dias.map(dia => {
            const diaElemento = document.createElement("div");
            diaElemento.classList.add("dia");
            diaElemento.textContent = dia;
            return diaElemento;
        });

        diasElemento.append(...diasHtml);
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

    // Mostrar las opciones de horarios
    function mostrarHorariosDisponibles(fecha) {
        contenedorHorarios.innerHTML = "";

        const horariosReservadosParaFecha = horariosReservadosPorFecha[fecha.toLocaleDateString('es-ES')] || [];

        const horariosDisponibles = ["09:00hs", "10:00hs", "11:00hs", "12:00hs", "13:00hs", "14:00hs", "15:00hs"];
        const eligeHorario = document.createElement("div");
        eligeHorario.textContent = "ELEGIR UN HORARIO PARA " + fecha.toLocaleDateString('es-ES');
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
                reserv.textContent = "El horario seleccionado no está disponible. Por favor elige otro.";
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
            mensajeError.textContent = "El número de teléfono ingresado no es válido. Por favor ingresa un número válido.";
            mensajeError.style.color = "red";
            mensajeError.classList.add("mensaje-error");
            telefonoInput.addEventListener("click", function(event) {
                mensajeError.style.display = "none";
            });

            formularioReserva.appendChild(mensajeError);
            return;
        }

        const fechaKey = fechaSeleccionada.toLocaleDateString('es-ES');
        horariosReservadosPorFecha[fechaKey] = horariosReservadosPorFecha[fechaKey]?.reduce((accum, reserva) => {
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
            text: "¡Reserva realizada exitosamente! Nombre: " + nombre + ", Teléfono: " + telefono + ", Fecha: " + fechaSeleccionada.toLocaleDateString('es-ES') + ", Horario: " + horarioSeleccionado,
            imageUrl: "../assets/joel-1.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Imagen personalizada"
        });

        formularioReserva.reset();
        formularioReserva.style.display = "none";
        contenedorHorarios.style.display = "none";
    });
    
});
document.addEventListener("DOMContentLoaded", function() {
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
            console.log('Datos obtenidos del clima:', data);  /* Verificar los datos obtenidos */
            mostrarInfoClima(data);
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
        });
}

function mostrarInfoClima(data) {

    const ciudad = data.name;
    const temperatura = data.main.temp;
    const descripcion = data.weather[0].description;
    const icono = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const humedad = data.main.humidity;
    const presion = data.main.pressure;
    const velocidadViento = data.wind.speed;
    const direccionViento = data.wind.deg;
    const nubes = data.clouds.all;

    const climaElemento = document.getElementById('clima');
    if (climaElemento) {
        climaElemento.innerHTML = `
            <h2>Clima en ${ciudad}</h2>
            <img src="${icono}" alt="${descripcion}">
            <p>${temperatura} °C</p>
            <p>${descripcion}</p>
            <p>Humedad: ${humedad}%</p>
            <p>Presión: ${presion} hPa</p>
            <p>Velocidad del viento: ${velocidadViento} m/s</p>
            <p>Dirección del viento: ${direccionViento}°</p>
            <p>Nubes: ${nubes}%</p>
        `;
    } else {
        console.error('Elemento con id "clima" no encontrado');
    }
}
function obtenerForecast(ciudad) {
    const apiKey = 'd6aa396a076d72edeeb89d5496d30ab4';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de red al obtener el pronóstico del clima');
            }
            return response.json();
        })
        .then(data => {
            mostrarForecast(data);
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico del clima:', error);
        });
}
function mostrarForecast(data) {
    const forecastElemento = document.getElementById('forecast');
    forecastElemento.innerHTML = '<h2>Pronóstico para los próximos días</h2>';
    const listaPronostico = data.list.filter(item => item.dt_txt.endsWith('12:00:00'));

    listaPronostico.forEach(pronostico => {
        const fecha = new Date(pronostico.dt * 1000);
        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        const temperatura = pronostico.main.temp;
        const descripcion = pronostico.weather[0].description;
        const icono = `https://openweathermap.org/img/wn/${pronostico.weather[0].icon}.png`;

        const diaForecast = document.createElement('div');
        diaForecast.classList.add('day-forecast');
        diaForecast.innerHTML = `
            <h3>${diaSemana}</h3>
            <img src="${icono}" alt="${descripcion}">
            <p>${descripcion}</p>
            <p>Temperatura: ${temperatura} °C</p>
        `;
        forecastElemento.appendChild(diaForecast);
    });
}