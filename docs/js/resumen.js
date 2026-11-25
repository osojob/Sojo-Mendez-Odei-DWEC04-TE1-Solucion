// Recogemos los elementos
const ranking = document.getElementById("ranking");
const cargando = document.getElementById("cargando");
const errorDiv = document.getElementById("error");

// Variables globales
let seriesGlobal = [];
let seriesPintadas = [];

// Paginacion
let paginaActual = 1;
const seriesPorPagina = 10;

// Creamos variable para leer si existen datos previos en el localStorage
let favoritos = JSON.parse(localStorage.getItem("mis-favoritos")) || [];

// Funcion async que carga el ranking
async function cargarRanking() {
    try {
        // Recogemos en una constante la funcion que obtiene las series en tendencia
        const series = await obtenerSeriesTendencia();
        cargando.hidden = true;
        seriesGlobal = series;

        // Pinta el ranking de series
        pintarRanking(seriesGlobal);
    } catch (error) {
        cargando.hidden = true;
        errorDiv.hidden = false,
        console.error("Detalle del error:", error);
    }
}

// Funcion para pintar las series en la tabla
function pintarRanking(series) {
    // Filtramos series que tienen nota y ordenamos de mayor a menor
    const rankingOrdenado = series
        .filter(serie => serie.rating.average !== null)
        .sort((a, b) => b.rating.average - a.rating.average);

    // Recortamos array para mostrar solo las primeras 50 series
    const top50 = rankingOrdenado.slice(0, 50);

    // Calculamo inicio y fin de página actual
    const inicio = (paginaActual - 1) * seriesPorPagina;
    const fin = inicio + seriesPorPagina;

    // Cortamos las series que se muestran por pagina
    const seriesDeLaPagina = top50.slice(inicio, fin);

    let filasHTML = "";
    seriesPintadas = seriesDeLaPagina;

    // Recorremos las series de la página actual
    seriesDeLaPagina.forEach((serie, indice) => {
        // Cogemos los datos que nos interesa incluir en la tabla
        const año = serie.premiered ? serie.premiered.substring(0, 4) : "N/A";
        const nota = serie.rating.average || "N/A";
        const imagen = serie.image ? serie.image.medium : "";
        const esFavorito = favoritos.some(fav => fav.id === serie.id);
        const estrella = esFavorito ? "★" : "☆";

        // Creamos las filas y metemos los datos
        filasHTML += `
            <tr onclick="window.location.href='pages/detalle.html?id=${serie.id}&nombre=${encodeURIComponent(serie.name)}'" style="cursor: pointer;">
                <td class="puesto">${inicio + indice + 1}</td>
                <td>
                    <div class="serie">
                        <img src="${imagen}" alt=${serie.name}">
                        <strong>${serie.name}</strong>
                    </div>
                </td>
                <td>${año}</td>
                <td>${nota}</td>
                <td>
                    <span class="estrella" onclick="event.stopPropagation(); marcarFavorito(${indice})">${estrella}</span>
                </td>
            </tr>
        `;
    });

    // Metemos todo el HTML en el tbody
    ranking.innerHTML = filasHTML;

    // Actualizamos texto de la página y estado de los botones
    document.getElementById("info-pagina").textContent = "Página " + paginaActual;
    document.getElementById("btn-anterior").disabled = (paginaActual === 1);
    document.getElementById("btn-siguiente").disabled = (fin >= series.length);
}

// Funcion para marcar una serie como favorita
function marcarFavorito(indice) {
    const serie = seriesPintadas[indice];
    const yaEsFavorita = favoritos.some(fav => fav.id === serie.id);

    if (yaEsFavorita) {
        favoritos = favoritos.filter(fav => fav.id !== serie.id);
    } else {
        favoritos.push(serie);
    }
    // Añadimos al localStorage la serie marcada favorita
    localStorage.setItem("mis-favoritos", JSON.stringify(favoritos));

    // Volvemos a pintar la tabla para que se vea la estrella al momento
    pintarRanking(seriesGlobal);
}

// Eventos de los botones
document.getElementById("btn-anterior").addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        pintarRanking(seriesGlobal);
    }
});

document.getElementById("btn-siguiente").addEventListener("click", () => {
    const totalSeries = 50;
    const maxPaginas = Math.ceil(totalSeries / seriesPorPagina);
    if (paginaActual < maxPaginas) {
        paginaActual++;
        pintarRanking(seriesGlobal);
    }
});


// Llamamos a la funcion
cargarRanking();