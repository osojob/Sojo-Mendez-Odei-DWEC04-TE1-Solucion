// Funcion general que hace el fetch
async function obtenerDatos(url) {
    try {
        // Hacemos el fetch de la URL de la API elegida, en mi caso Deezer
        const respuesta = await fetch(url);

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // Los devolvemos al array de series
        return datos;
    } catch (error) {
        throw error;
    }
}

// Funcion para obtener las series en tendencia
async function obtenerSeriesTendencia() {
    const url = `https://api.tvmaze.com/shows`;
    return await obtenerDatos(url);
}

// Funcion para obtener los episodios de una serie
async function obtenerEpisodiosSerie(id) {
    const url = `https://api.tvmaze.com/shows/${id}/episodes`;
    return await obtenerDatos(url);
}

// Funcion para obtener los detalles de la serie
async function obtenerDetalleSerie(id) {
    const url = `https://api.tvmaze.com/shows/${id}`;
    return await obtenerDatos(url);
}

// Funcion para obtener el reparto
async function obtenerElencoSerie(id) {
    const url = `https://api.tvmaze.com/shows/${id}/cast`;
    return await obtenerDatos(url);
}