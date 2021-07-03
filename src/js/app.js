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
};

function mostraSeccion(){
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

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

            //Eliminar mostrar-seccion de la sección anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');
            
            //Agrega mostrar-seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //Elimina clase de actual en tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');
            console.log(document.querySelector('.tabs .actual'));
            
            //Agregar clase de actual donde dimos click
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');
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
};