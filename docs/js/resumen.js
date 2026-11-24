// Recogemos llos elementos
const ranking = document.getElementById("ranking");
const cargando = document.getElementById("cargando");
const errorDiv = document.getElementById("error");

// Funcion async que carga el ranking
async function cargarRanking() {
    try {
        // Recogemos en una constante la funcion que obtiene las series en tendencia
        const series = await obtenerSeriesTendencia();

        cargando.hidden = true;
        
        // Pinta el ranking de series
        pintarRanking(series);
    } catch (error) {
        cargando.hidden = true;
        errorDiv.hidden = false,
        console.error("Detalle del error:", error);
    }
}

// Funcion para pintar las series en la tabla
function pintarRanking(series) {
    // Filtramos series qeu tienen nota y ordenamos de mayor a menor
    const rankingOrdenado = series.filter(serie => serie.rating.average !== null).sort((a, b) => b.rating.average - a.rating.average);

    // Recortamos array para mostrar solo las primeras 20 series
    const top20 = rankingOrdenado.slice(0, 20);

    let filasHTML = "";

    // Recorremos series
    top20.forEach((serie, indice) => {
        // Cogemos los datos que nos interesan
        const año = serie.premiered ? serie.premiered.substring(0, 4) : "N/A";
        const nota = serie.rating.average || "N/A";
        const imagen = serie.image ? serie.image.medium : "";
        
        // Creamos las filas y metemos los datos
        filasHTML += `
            <tr onclick="window.location.href='pages/detalle.html?id=${serie.id}&nombre=${encodeURIComponent(serie.name)}'" style="cursor: pointer;">
                <td class="puesto">${indice + 1}</td>
                <td>
                    <div class="serie">
                        <img src="${imagen}" alt=${serie.name}">
                        <strong>${serie.name}</strong>
                    </div>
                </td>
                <td>${año}</td>
                <td>${nota}</td>
            </tr>
        `;
    });

    // Metemos todo el HTML en el tbody
    ranking.innerHTML = filasHTML;
}

// Llamamos a la funcion
cargarRanking();