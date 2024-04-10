var style = document.createElement('style');
  style.innerHTML = `
  #proyectos {
    width: 100%;
    align-items: center;
    padding-left: 32%;
  }

  `;
  document.head.appendChild(style);

let proyectos = [];

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
    // Check if a project with the same name already exists
    const proyectoExistente = proyectos.find(proyecto => proyecto.nombre === nombreProyecto);
    if (proyectoExistente) {
        showAlert("Ya existe un proyecto con ese nombre.");
        return;
    }
    const proyecto = { nombre: nombreProyecto, descripcion: descripcionProyecto, tareas: [] };
    proyectos.push(proyecto);
    mostrarProyectos();
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
    const nombre = document.getElementById(`nombreTarea-${proyectoIndex}`).value;
    if (!nombre.trim()) {
        showAlert("El nombre de la tarea no puede estar vacío.");
        return;
    }
    // Check if a task with the same name already exists
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
    mostrarTareas(proyectoIndex);

    // Show the collapse element
    const collapseElement = document.getElementById(`tareas-${proyectoIndex}`);
    const bootstrapCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
    bootstrapCollapse.show();

    // Clear the form fields
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
                             <label for="tarea-${proyectoIndex}-${index}">${tarea.nombre} - ${tarea.descripcion}</label>`;
        lista.appendChild(tareaLi);
    });
    tareasDiv.appendChild(lista);
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
        showAlert("No hay tareas con esa fecha de vencimiento.");
        return;
    }
    showAlert(`Tareas con fecha de vencimiento ${fecha}:\n${tareasConFecha.map(tarea => tarea.descripcion).join('\n')}`);
}
