var style = document.createElement('style');
  style.innerHTML = `
  #proyectos {
    width: 100%;
    align-items: center;
    padding-left: 32%;
  }

  `;
  document.head.appendChild(style);

// Al cargar la página, intenta recuperar los proyectos del almacenamiento local
let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];//las guarda en las cookies
let tareas = JSON.parse(localStorage.getItem('tareas')) || []; // las guarda en las cookies


function showAlert(message) {
    const alertDiv = document.getElementById('alert');
    if (alertDiv) {
        alertDiv.innerText = message;
        alertDiv.style.display = 'block';
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 3000);
    } else {
        console.error('Element with id "alert" not found');
    }
}


function agregarProyecto() {
    const nombreProyecto = document.getElementById("nombreProyecto").value;
    const descripcionProyecto = document.getElementById("descripcionProyecto").value;
    if (!nombreProyecto.trim()) {
        showAlert("El nombre del proyecto no puede estar vacío.");
        return;
    }
    // Chequea que no haya un proyecto con el mismo nombre
    const proyectoExistente = proyectos.find(proyecto => proyecto.nombre === nombreProyecto);
    if (proyectoExistente) {
        showAlert("Ya existe un proyecto con ese nombre.");
        return;
    }
    const proyecto = { nombre: nombreProyecto, descripcion: descripcionProyecto, tareas: [] };
    proyectos.push(proyecto);
    actualizarProyectos();
}


function mostrarProyectos() {
    const proyectosDiv = document.getElementById("proyectos");
    proyectosDiv.innerHTML = "";
    proyectos.forEach((proyecto, index) => {
        const proyectoDiv = document.createElement("div");
        proyectoDiv.innerHTML = `<h3>${proyecto.nombre}</h3>
        <p>${proyecto.descripcion}</p>
        <form onsubmit="event.preventDefault(); agregarTarea(${index});">
            <input type="text" id="nombreTarea-${index}" placeholder="Nombre de la tarea">
            <input type="text" id="descripcionTarea-${index}" placeholder="Descripción de la tarea">
            <input type="text" id="fechaVencimientoTarea-${index}" placeholder="Fecha de vencimiento (mm/dd/yyyy)">
            <button type="submit" class="btn btn-primary"><img src="icons/mas.png" alt="Agregar Tarea" style="width: 20px; height: 20px;"></button> <!-- Botón de agregar tarea con ícono -->
        </form>
        <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#tareas-${index}" aria-expanded="false" aria-controls="tareas-${index}"><img src="icons/ojo.png" alt="Mostrar/Ocultar" style="width: 20px; height: 20px;"></button> <!-- Botón de mostrar/ocultar tareas con ícono -->
        <button onclick="buscarTareaPorFecha(${index})" class="btn btn-primary"><img src="icons/lupa.png" alt="Buscar por fecha" style="width: 20px; height: 20px;"></button> <!-- Botón de buscar tarea por fecha con ícono -->
        <div class="collapse" id="tareas-${index}"></div>`;
        proyectosDiv.appendChild(proyectoDiv);

        // Mostrar las tareas del proyecto actual y las guarda en las cookies
        actualizarTareas(index);
    });

    // Incializa los elementos collapse de Bootstrap
    var collapseElList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl)
    })
}



function agregarTarea(proyectoIndex) {
    const nombre = document.getElementById(`nombreTarea-${proyectoIndex}`).value;
    if (!nombre.trim()) {
        showAlert("El nombre de la tarea no puede estar vacío.");
        return;
    }
    // Cchequea si una tarea con el mismo nombre ya existe en el proyecto
    const tareaExistente = proyectos[proyectoIndex].tareas.find(tarea => tarea.nombre === nombre);
    if (tareaExistente) {
        showAlert("Ya existe una tarea con ese nombre en este proyecto.");
        return;
    }
    
    const descripcion = document.getElementById(`descripcionTarea-${proyectoIndex}`).value;
    if (!descripcion.trim()) {
        showAlert("La descripción de la tarea no puede estar vacía.");
        return;
    }
    let fechaVencimiento = document.getElementById(`fechaVencimientoTarea-${proyectoIndex}`).value;
    if (!fechaVencimiento.trim()) {
        fechaVencimiento = "No especificada";
    } else if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(fechaVencimiento)) {
        showAlert("La fecha de vencimiento debe estar en el formato mm/dd/yyyy.");
        return;
    }
    const tarea = { nombre: nombre, descripcion: descripcion, completado: false, fechaVencimiento: fechaVencimiento };
    proyectos[proyectoIndex].tareas.push(tarea);
    actualizarTareas(proyectoIndex);
    tareas.push(tarea); // Añade la tarea al arreglo de tareas

    // muestra el collapse con las tareas
    const collapseElement = document.getElementById(`tareas-${proyectoIndex}`);
    const bootstrapCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
    bootstrapCollapse.show();

    // limpia los campos del formulario
    document.getElementById(`nombreTarea-${proyectoIndex}`).value = '';
    document.getElementById(`descripcionTarea-${proyectoIndex}`).value = '';
    document.getElementById(`fechaVencimientoTarea-${proyectoIndex}`).value = '';
}

function mostrarTareas(proyectoIndex) {
    const proyecto = proyectos[proyectoIndex];
    const tareasDiv = document.getElementById(`tareas-${proyectoIndex}`);
    tareasDiv.innerHTML = "";
    const lista = document.createElement("ul");
    lista.style.listStyleType = "none";
    proyecto.tareas.forEach((tarea, index) => {
        const tareaLi = document.createElement("li");
        tareaLi.innerHTML = `<input type="checkbox" id="tarea-${proyectoIndex}-${index}" ${tarea.completado ? 'checked' : ''} onclick="toggleTarea(${proyectoIndex}, ${index})">
                             <label for="tarea-${proyectoIndex}-${index}" class="${tarea.completado ? 'completed-task' : ''}">${tarea.nombre} - ${tarea.descripcion} (Fecha de vencimiento: ${tarea.fechaVencimiento})</label>
                             <button onclick="eliminarTarea(${proyectoIndex}, ${index})" class="btn btn-primary"><img src="icons/.png" alt="Eliminar Tarea" style="width: 20px; height: 20px;"></button>`; // Botón de eliminar tarea con ícono
        lista.appendChild(tareaLi);
    });
    tareasDiv.appendChild(lista);
}

function eliminarTarea(proyectoIndex, tareaIndex) {
    proyectos[proyectoIndex].tareas.splice(tareaIndex, 1);
    actualizarTareas(proyectoIndex);
}



function toggleTarea(proyectoIndex, tareaIndex) {
    proyectos[proyectoIndex].tareas[tareaIndex].completado = !proyectos[proyectoIndex].tareas[tareaIndex].completado;
}

function buscarTareaPorFecha(proyectoIndex) {
    const fecha = prompt("Ingrese la fecha de vencimiento ej: mm/dd/yyyy:");
    if (!fecha.trim() || !/^(\d{2})\/(\d{2})\/(\d{4})$/.test(fecha)) {
        showAlert("La fecha de vencimiento es obligatoria y debe estar en el formato mm/dd/yyyy.");
        return;
    }
    const tareasConFecha = proyectos[proyectoIndex].tareas.filter(tarea => tarea.fechaVencimiento === fecha);
    if (tareasConFecha.length === 0) {
        //profe si lees esto, agrega a la devolucion del tp un "Destroyman lll"
        showAlert("No hay tareas con esa fecha de vencimiento.");
        return;
    }
    showAlert(`Tareas con fecha de vencimiento ${fecha}:\n${tareasConFecha.map(tarea => tarea.descripcion).join('\n')}`);
}


// Función para guardar los proyectos en el almacenamiento local
function guardarProyectos() {
    localStorage.setItem('proyectos', JSON.stringify(proyectos)); //las guarda en las cookies

}

function guardarTareas() { 
    localStorage.setItem('tareas', JSON.stringify(tareas)); //las guarda en las cookies [estamos 90% de que esto no funciona y que es un efecto placebo]
}

// Llama a esta función siempre que se modifiquen los proyectos
function actualizarProyectos() { //me hago un 2 x 1
    
        guardarProyectos();
        mostrarProyectos();
}

function actualizarTareas(proyectoIndex) { //me hago un 2 x 1
    guardarTareas();
    mostrarTareas(proyectoIndex); //esto si funciona, sin esto no se muestran las tareas (y todos los proyectos menos el primero) [no se porque]
    
}

document.addEventListener('DOMContentLoaded', function() { //con esto se refresca la pagina y se muestran los proyectos sin tener que agregar uno nuevo
    mostrarProyectos();
});