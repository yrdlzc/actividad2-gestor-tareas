/**
 * ==========================================================
 * ACTIVIDAD 2 - DESARROLLO FULL STACK
 * GESTOR DE TAREAS
 * ==========================================================
 * Descripción:
 * Aplicación para la gestión de tareas mediante
 * Programación Orientada a Objetos, JavaScript ES6+,
 * manipulación del DOM y almacenamiento local.
 * ==========================================================
 */

/**
 * Representa una tarea individual.
 */
class Tarea {
    constructor(id, nombre, completada = false) {
        this.id = id;
        this.nombre = nombre;
        this.completada = completada;
    }

    /**
     * Actualiza el nombre de la tarea.
     * @param {string} nuevoNombre
     */
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }

    /**
     * Cambia el estado de completada a pendiente
     * o viceversa.
     */
    cambiarEstado() {
        this.completada = !this.completada;
    }
}

/**
 * Gestiona todas las tareas del sistema.
 */
class GestorDeTareas {

    constructor() {
        this.tareas = [];

        this.inputTarea = document.getElementById("nueva-tarea");
        this.listaTareas = document.getElementById("lista-tareas");
        this.mensajeError = document.getElementById("mensaje-error");

        this.cargarTareas();
        this.renderizarTareas();
    }

    /**
     * Agrega una nueva tarea.
     * @param {string} nombre
     */
    agregarTarea(nombre) {

        const nuevaTarea = new Tarea(
            Date.now(),
            nombre
        );

        this.tareas.push(nuevaTarea);

        this.guardarTareas()
            .then(() => this.renderizarTareas());
    }

    /**
     * Edita una tarea existente.
     * @param {number} id
     */
    editarTarea(id) {

        const tarea = this.tareas.find(
            (tarea) => tarea.id === id
        );

        if (!tarea) {
            return;
        }

        let nuevoNombre = prompt(
            "Ingrese el nuevo nombre de la tarea:",
            tarea.nombre
        );

        if (
            nuevoNombre === null ||
            nuevoNombre.trim() === ""
        ) {
            return;
        }

        nuevoNombre = nuevoNombre.trim();

        tarea.editar(
            nuevoNombre
        );

        this.guardarTareas()
            .then(() => this.renderizarTareas());
    }

    /**
     * Elimina una tarea.
     * @param {number} id
     */
    eliminarTarea(id) {

        const confirmar = confirm(
            "¿Desea eliminar esta tarea?"
        );

        if (!confirmar) {
            return;
        }

        this.tareas = this.tareas.filter(
            (tarea) => tarea.id !== id
        );

        this.guardarTareas()
            .then(() => this.renderizarTareas());
    }

    /**
     * Cambia el estado de una tarea.
     * @param {number} id
     */
    cambiarEstadoTarea(id) {

        const tarea = this.tareas.find(
            (tarea) => tarea.id === id
        );

        if (!tarea) {
            return;
        }

        tarea.cambiarEstado();

        this.guardarTareas()
            .then(() => this.renderizarTareas());
    }

    /**
     * Guarda las tareas en LocalStorage
     * utilizando una Promesa.
     * Requisito solicitado en la rúbrica.
     */
    guardarTareas() {

        return new Promise((resolve) => {

            localStorage.setItem(
                "tareas",
                JSON.stringify(this.tareas)
            );

            resolve();
        });
    }

    /**
     * Recupera las tareas almacenadas.
     */
    cargarTareas() {

        const datosGuardados =
            localStorage.getItem("tareas");

        if (!datosGuardados) {
            return;
        }

        const datos =
            JSON.parse(datosGuardados);

        this.tareas = datos.map(
            (tarea) =>
                new Tarea(
                    tarea.id,
                    tarea.nombre,
                    tarea.completada
                )
        );
    }

    /**
     * Muestra las tareas en pantalla.
     */
    renderizarTareas() {

        this.listaTareas.innerHTML = "";

        this.tareas.forEach((tarea) => {

            const elemento = document.createElement("li");

            elemento.className = tarea.completada
                ? "tarea completada"
                : "tarea";

            elemento.innerHTML = `
                <div class="contenido-tarea">
                    <span>${tarea.nombre}</span>
                </div>

                <div class="grupo-botones">

                    <button
                        class="btn-completar"
                        onclick="gestor.cambiarEstadoTarea(${tarea.id})">
                        ${tarea.completada ? "Reabrir" : "Completar"}
                    </button>

                    <button
                        class="btn-editar"
                        onclick="gestor.editarTarea(${tarea.id})">
                        Editar
                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="gestor.eliminarTarea(${tarea.id})">
                        Eliminar
                    </button>

                </div>
            `;

            this.listaTareas.appendChild(elemento);
        });
    }

    /**
     * Valida la entrada del usuario.
     */
    validarEntrada(nombre) {

        if (nombre.trim() === "") {

            this.mensajeError.textContent =
                "Debe ingresar una tarea.";

            return false;
        }

        this.mensajeError.textContent = "";

        return true;
    }
}

/**
 * ==========================================================
 * INSTANCIA PRINCIPAL
 * ==========================================================
 */
const gestor = new GestorDeTareas();

/**
 * ==========================================================
 * EVENTOS
 * ==========================================================
 */
const botonAgregar = document.getElementById("agregar-tarea");

const agregarNuevaTarea = () => {

    const nombreTarea =
        gestor.inputTarea.value;

    if (!gestor.validarEntrada(nombreTarea)) {
        return;
    }

    gestor.agregarTarea(
        nombreTarea.trim()
    );

    gestor.inputTarea.value = "";
    gestor.inputTarea.focus();
};

botonAgregar.addEventListener(
    "click",
    agregarNuevaTarea
);

gestor.inputTarea.addEventListener(
    "keypress",
    (evento) => {

        if (evento.key === "Enter") {
            agregarNuevaTarea();
        }
    }
);