
let proyectos = [];

function agregarProyecto() {
    const nombreProyecto = document.getElementById("nombreProyecto").value;
    if (!nombreProyecto.trim()) {
        showModal("El nombre del proyecto no puede estar vacío.");
        return;
    }
    // Check if a project with the same name already exists
    const proyectoExistente = proyectos.find(proyecto => proyecto.nombre === nombreProyecto);
    if (proyectoExistente) {
        showModal("Ya existe un proyecto con ese nombre.");
        return;
    }
    const proyecto = { nombre: nombreProyecto, descripcion: "", tareas: [] };
    proyectos.push(proyecto);
    mostrarProyectos();
}

// function mostrarProyectos() {
//     const proyectosDiv = document.getElementById("proyectos");
//     proyectosDiv.innerHTML = "";
//     proyectos.forEach((proyecto, index) => {
//         const proyectoDiv = document.createElement("div");
//         proyectoDiv.innerHTML = `<h3>${proyecto.nombre}</h3>
//         <p>${proyecto.descripcion}</p>
//         <button onclick="agregarTarea(${index})" class="btn btn-primary">Agregar Tarea</button>
//         <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#tareas-${index}" aria-expanded="false" aria-controls="tareas-${index}">Mostrar/Ocultar Tareas</button>
//         <button onclick="buscarTareaPorFecha(${index})" class="btn btn-primary">Buscar Tarea por Fecha de Vencimiento</button>
//         <div class="collapse" id="tareas-${index}"></div>`;
//         proyectosDiv.appendChild(proyectoDiv);
//     });

//     // Initialize all collapse components
//     var collapseElList = [].slice.call(document.querySelectorAll('.collapse'));
//     var collapseList = collapseElList.map(function (collapseEl) {
//         return new bootstrap.Collapse(collapseEl);
//     });
// }

function mostrarProyectos() {
    const proyectosDiv = document.getElementById("proyectos");
    proyectosDiv.innerHTML = "";
    proyectos.forEach((proyecto, index) => {
        const proyectoDiv = document.createElement("div");
        proyectoDiv.innerHTML = `<h3>${proyecto.nombre}</h3>
        <p>${proyecto.descripcion}</p>
        <form onsubmit="event.preventDefault(); agregarTarea(${index});">
            <input type="text" id="descripcionTarea-${index}" placeholder="Descripción de la tarea">
            <input type="text" id="fechaVencimientoTarea-${index}" placeholder="Fecha de vencimiento (mm/dd/yyyy)">
            <button type="submit" class="btn btn-primary">Agregar Tarea</button>
        </form>
        <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#tareas-${index}" aria-expanded="false" aria-controls="tareas-${index}">Mostrar/Ocultar Tareas</button>
        <button onclick="buscarTareaPorFecha(${index})" class="btn btn-primary">Buscar Tarea por Fecha de Vencimiento</button>
        <div class="collapse" id="tareas-${index}"></div>`;
        proyectosDiv.appendChild(proyectoDiv);
    });

    // Initialize all collapse components
    var collapseElList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl)
    })
}

function agregarTarea(proyectoIndex) {
    const descripcion = document.getElementById(`descripcionTarea-${proyectoIndex}`).value;
    if (!descripcion.trim()) {
        showModal("La descripción de la tarea no puede estar vacía.");
        return;
    }
    let fechaVencimiento = document.getElementById(`fechaVencimientoTarea-${proyectoIndex}`).value;
    if (!fechaVencimiento.trim()) {
        fechaVencimiento = "No especificada";
    } else if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(fechaVencimiento)) {
        showModal("La fecha de vencimiento debe estar en el formato mm/dd/yyyy.");
        return;
    }
    const tarea = { descripcion: descripcion, completado: false, fechaVencimiento: fechaVencimiento };
    proyectos[proyectoIndex].tareas.push(tarea);
    mostrarTareas(proyectoIndex);

    // Show the collapse element
    const collapseElement = document.getElementById(`tareas-${proyectoIndex}`);
    const bootstrapCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
    bootstrapCollapse.show();

    // Clear the form fields
    document.getElementById(`descripcionTarea-${proyectoIndex}`).value = '';
    document.getElementById(`fechaVencimientoTarea-${proyectoIndex}`).value = '';
}

function mostrarTareas(proyectoIndex) {
    const proyecto = proyectos[proyectoIndex];
    const tareasDiv = document.getElementById(`tareas-${proyectoIndex}`);
    tareasDiv.innerHTML = "";
    const lista = document.createElement("ul");
    proyecto.tareas.forEach((tarea, index) => {
        const tareaLi = document.createElement("li");
        tareaLi.innerHTML = `<input type="checkbox" id="tarea-${proyectoIndex}-${index}" ${tarea.completado ? 'checked' : ''} onclick="toggleTarea(${proyectoIndex}, ${index})">
                             <label for="tarea-${proyectoIndex}-${index}">${tarea.descripcion}</label>`;
        lista.appendChild(tareaLi);
    });
    tareasDiv.appendChild(lista);
}


// functionbuscarTareaFecha(){ 

// };

function toggleTarea(proyectoIndex, tareaIndex) {
    proyectos[proyectoIndex].tareas[tareaIndex].completado = !proyectos[proyectoIndex].tareas[tareaIndex].completado;
}

function buscarTareaPorFecha(proyectoIndex) {
    const fecha = prompt("Ingrese la fecha de vencimiento ej: mm/dd/yyyy:");
    if (!fecha.trim() || !/^(\d{2})\/(\d{2})\/(\d{4})$/.test(fecha)) {
        showModal("La fecha de vencimiento es obligatoria y debe estar en el formato mm/dd/yyyy.");
        return;
    }
    const tareasConFecha = proyectos[proyectoIndex].tareas.filter(tarea => tarea.fechaVencimiento === fecha);
    if (tareasConFecha.length === 0) {
        showModal("No hay tareas con esa fecha de vencimiento.");
        return;
    }
    showModal(`Tareas con fecha de vencimiento ${fecha}:\n${tareasConFecha.map(tarea => tarea.descripcion).join('\n')}`);
}

function showModal(message) {
    document.getElementById('myModalContent').innerText = message;
    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
    myModal.show();
}