/* Referencias a elementos del DOM */
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const cargando = document.getElementById("cargando");
const mensajeError = document.getElementById("mensaje-error");
const sinResultados = document.getElementById("sin-resultados");
const newsContainer = document.getElementById("news-container");

/* Funcion para validacion del input */
function validarInput(input) { 
    if (input.value.trim() === "") { // Si el input está vacío, se agrega la clase "error"
        input.classList.add("error");
        return false;
    } else { // Si el input no está vacío, se elimina la clase "error"
        input.classList.remove("error");
        return true;
    }
}

function validarFormulario() {
    const inputs = document.querySelectorAll("input");
    let formularioValido = true;

    inputs.forEach((input) => {
        if (!validarInput(input)) {
            formularioValido = false;
        }
    });

    return formularioValido;
}

/* Funciones para control de mensajes de estado */
function ocultarMensajes() {
    if (cargando) cargando.style.display = "none";
    if (mensajeError) mensajeError.style.display = "none";
    if (sinResultados) sinResultados.style.display = "none";
}

/* Agregar un mensaje de cargando noticias al presionar el boton */
function mostrarCargando() {
    ocultarMensajes();
    if (cargando) {
        cargando.style.display = "block";
    }
}

function mostrarError(texto) {
    ocultarMensajes();
    if (mensajeError) {
        if (texto) mensajeError.textContent = texto;
        mensajeError.style.display = "block";
    }
}

function mostrarSinResultados() {
    ocultarMensajes();
    if (sinResultados) {
        sinResultados.style.display = "block";
    }
}

/* Crea la APIKEY para acceder a la fuente de datos */
const API_KEY = "b4ef6c23d9a848549b9b6fddd5573371";

/* Implementa la funcionalidad de búsqueda de noticias con fetch, async/await y trycatch */
async function buscarNoticias(query) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al buscar noticias:", error);
        throw error;
    }
}

/* Función para mostrar las noticias en el DOM */
function renderizarNoticias(articulos) {
    newsContainer.innerHTML = "";

    if (!articulos || articulos.length === 0) {
        mostrarSinResultados();
        return;
    }

    ocultarMensajes();

    articulos.forEach((articulo) => {
        const card = document.createElement("article");
        card.classList.add("noticia-card");

        const imagen = articulo.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80";

        card.innerHTML = `
            <img src="${imagen}" alt="${articulo.title || 'Noticia'}" loading="lazy">
            <div class="contenido">
                <h3>${articulo.title || 'Sin título'}</h3>
                <p>${articulo.description || 'Sin descripción disponible.'}</p>
                <a href="${articulo.url}" target="_blank" rel="noopener noreferrer">Leer más &rarr;</a>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

/* Evento de envío del formulario */
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const query = searchInput.value.trim();
        newsContainer.innerHTML = "";
        mostrarCargando();

        try {
            const data = await buscarNoticias(query);
            if (data.status === "error") {
                mostrarError(data.message || "Error al consultar la API.");
            } else {
                renderizarNoticias(data.articles);
            }
        } catch (error) {
            mostrarError("Ocurrió un error al cargar las noticias. Verifica tu conexión.");
        }
    });
}
