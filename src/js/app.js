let pagina = 1;

const cita = {
    nombre:'',
    fecha:'',
    hora:'',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta DIV actual
    mostraSeccion();

    //Oculta o muestra una sección según el tab que se presiona
    cambiarSeccion();

    //Paginación anterior y siguiente
    paginaSiguiente();
    paginaAnterior();

    //Mostrar y Ocultar botones de paginación
    botonesPaginador();

    //Valida información de la cita y muestra resumen o mensaje de error
    mostrarResumen();

    //Almacena el nombre de la cita
    nombreCita();

    //Almacena el fecha de la cita
    fechaCita();

    //Deshabilita días pasados
    deshabilitarFechaAnterior();
};

function mostraSeccion(){
    //Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina clase de actual en tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta el botón de la sección actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //Llamar función de mostrarSeccion
            mostraSeccion();
            botonesPaginador();
        })
    });
}

async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        //Generar HTML
        servicios.forEach(servicio => {
            const {id,nombre,precio} = servicio;

            //DOM Scripting

            //Generar div que contiene al Servicio
            const servicioContenedor = document.createElement('DIV');
            servicioContenedor.classList.add('servicio');
            servicioContenedor.dataset.idServicio = id;

            //Selecciona el servicio
            servicioContenedor.onclick = seleccionarServicio;

            //Generar nombre del Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio del Servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Agregar Precio y Nombre al div contenedor
            servicioContenedor.appendChild(nombreServicio);
            servicioContenedor.appendChild(precioServicio);
            
            // Inyectar Servicios al HTML
            document.querySelector('#servicios').appendChild(servicioContenedor);
        });

        } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;

    //Forzar que el elemento clickeado es el DIV contenedor
    if(e.target.tagName === 'DIV'){
        elemento = e.target;
    }
    else{
        elemento = e.target.parentElement;
    }

    //Selecciona o deselecciona el elemento
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        //Elimina servicio de la cita
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj);

        //Agrega servicio a la cita
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina <= 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina >= 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else{
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }
    mostraSeccion();
}

function mostrarResumen(){
    //Destructuring
    const{nombre, fecha, hora, servicios} = cita;

    //
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Validación de datos
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan Datos de Servicios, nombre, fecha u hora';
        noServicios.classList.add('invalidar-cita');
        
        //Agregar a ResumenDiv
        resumenDiv.appendChild(noServicios);
    }
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //Validación de que nombreTexto no esté vacío
        if (nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no Válido','error');
        } else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje,tipo){

    //Si ya hay alerta, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if(tipo === 'error'){
        alerta.classList.add('error')
    }
    //Insertar alerta al HTML
    document.querySelector('.formulario').appendChild(alerta);

    //Temporizado de alerta
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Sábados y Domingos cerrado','error')
        } else{
            cita.fecha = fechaInput.value;
        }
    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth()+1;
    const dia = fechaAhora.getDate()+1;

    //Formato deseado YYYY-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}