let pagina = 1;

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
    }else{
        elemento.classList.add('seleccionado');
    }
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
        console.log(pagina);
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
        console.log(pagina);
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