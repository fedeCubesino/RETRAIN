



document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario");
    const mesActualElemento = document.querySelector(".mesActual");
    const contenedorHorarios = document.querySelector (".horarios-disponibles");
    const formularioReserva = document.getElementById("formularioReserva");
    let anoActual;
    let mesActual;
    let fechaSeleccionada;
    let horarioSeleccionado;
    let reservaRealizada;
    let botonContinuar;
    const horariosReservadosPorFecha = {};  
     
        /* Obtener los datos guardados del almacenamiento local al cargar la página */
    const datosGuardados = localStorage.getItem("datosReservas");
    if (datosGuardados) {
        Object.assign(horariosReservadosPorFecha, JSON.parse(datosGuardados));
    }

     /* Obtener la fecha actual */

    const hoy = new Date();
    anoActual = hoy.getFullYear();
    mesActual = hoy.getMonth();

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    generarCalendario(anoActual, mesActual);

     /* Función para generar el calendario */

    
    function generarCalendario(ano, mes) {
        const primerDiaDelMes = new Date(ano, mes, 1);
        const ultimoDiaDelMes = new Date(ano, mes + 1, 0);
        const diasEnMes = ultimoDiaDelMes.getDate();

        const diasElemento = calendario.querySelector(".dias");
        diasElemento.innerHTML = "";   /* Limpia los días existentes antes de generar los nuevos */

        
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
        }
    }

     /* Evento para cambiar al mes anterior */

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

    /*  Evento para cambiar al mes siguiente */

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

     /* Evento para seleccionar una fecha específica */

    calendario.querySelector(".dias").addEventListener("click", function(event) {
        contenedorHorarios.style.display = "none";
        formularioReserva.style.display = "none";
        
        const dia = event.target.textContent;
        fechaSeleccionada = new Date(anoActual, mesActual, dia);
        mostrarHorariosDisponibles(fechaSeleccionada);
        contenedorHorarios.style.display = "flex";
    });
    
     /* Mostrar las opciones de horarios */
     function mostrarHorariosDisponibles(fecha) {
        contenedorHorarios.innerHTML = "";   /* Limpia las opciones de horarios existentes */
    
        const horariosReservadosParaFecha = horariosReservadosPorFecha[fecha.toLocaleDateString('es-ES')] || [];
    
        /* Horarios disponibles para el día seleccionado */
        const horariosDisponibles = ["09:00hs", "10:00hs", "11:00hs", "12:00hs", "13:00hs", "14:00hs", "15:00hs"];
        const eligeHorario = document.createElement("div");
        eligeHorario.textContent = "Elige un horario para el  " + fecha.toLocaleDateString('es-ES');
        eligeHorario.style.fontWeight = "bold";
        contenedorHorarios.appendChild(eligeHorario);
    
        /* Mostrar las opciones de horarios disponibles */
        const contenedorHorariosDiv = document.createElement("div");
contenedorHorariosDiv.classList.add("horarios-container");
        // Supongamos que 'horariosDisponibles' es tu array de horarios
horariosDisponibles.forEach(function(horario) {
    // Crear un nuevo div para cada horario
    const opcion = document.createElement("div");
    opcion.classList.add("horario");
    
    // Establecer el texto del div de la opción como el horario
    opcion.textContent = horario;

    // Establecer el estilo del div de la opción
    opcion.style.lineHeight = "5px";
            
            // Verificar si el horario está reservado
            if (horariosReservadosParaFecha.some(reserva => reserva.horario === horario)) {
                opcion.classList.add("reservado");
            }
    
            contenedorHorariosDiv.appendChild(opcion);
        });
        contenedorHorarios.appendChild(contenedorHorariosDiv);
    };

     /* Evento para seleccionar un horario */

     contenedorHorarios.addEventListener("click", function(event) {
        
        if (event.target.classList.contains("horario")) {
            horarioSeleccionado = event.target.textContent;
            const fechaKey = fechaSeleccionada.toLocaleDateString('es-ES');
            const horariosReservados = horariosReservadosPorFecha[fechaKey];
            if (horariosReservados && horariosReservados.some(reserva => reserva.horario === horarioSeleccionado)) {
                const reserv = document.createElement("div");
                reserv.classList.add("reserv");
                reserv.textContent = "Los horarios en rojo no estan disponibles, elije otro por favor.";
                reserv.style.color = "red"
                contenedorHorarios.appendChild(reserv);
                contenedorHorarios.addEventListener("click", function(event) {
                    reserv.style.display = "none";
                });
                
            } else {
                mostrarFormularioReserva();
                contenedorHorarios.style.display= "none";
                
            }
        }
    });
    
     /* Mostrar el formulario de reserva */
    function mostrarFormularioReserva() {
        formularioReserva.style.display = "flex";
    }
    
     /* Maneja el envío del formulario */
    formularioReserva.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.toUpperCase();
        const telefonoInput = document.getElementById("telefono");
        const telefono = telefonoInput.value;

        const regexTelefonoArgentino = /^\(?(0)?(11|[2368]\d)([ \-])?(\d{4})[ \-]?(\d{4})$/;

        // Verificar si el número de teléfono coincide con el formato esperado
        telefonoInput.value = "";
        
        if (!regexTelefonoArgentino.test(telefono)) {
            // Crear un elemento de mensaje de error
            
            const mensajeError = document.createElement("div");
            mensajeError.style.display = "flex";
            mensajeError.textContent = "El número de teléfono ingresado no es válido. Por favor, ingrese un número válido.";
            mensajeError.style.color = "red";
            mensajeError.classList.add("mensaje-error")
            telefonoInput.addEventListener("click", function(event) {
                mensajeError.style.display = "none";
            });
            
    
            // Agregar el mensaje de error al contenedor
            formularioReserva.appendChild(mensajeError);
    
            return; 
        }
        
         /* Guardar el horario reservado para la fecha seleccionada */

         if (!horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')]) {
            horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')] = [];
        }
        horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')].push({
            nombre: nombre,
            horario: horarioSeleccionado,
            telefono: telefono
        });

    // Guardar los datos actualizados en el almacenamiento local
    localStorage.setItem("datosReservas", JSON.stringify(horariosReservadosPorFecha));

    Swal.fire({
        title: "Sweet!",
        text: "¡Reserva realizada con éxito! Nombre: " + nombre + ", Teléfono: " + telefono + ", Fecha: " + fechaSeleccionada.toLocaleDateString('es-ES') + ", Horario: " + horarioSeleccionado,
        imageUrl: "../assets/joel-1.jpg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });



    /* Limpiar el formulario y ocultarlo después de enviar */
    formularioReserva.reset();
    formularioReserva.style.display = "none";
    contenedorHorarios.style.display = "none";
        });
});


