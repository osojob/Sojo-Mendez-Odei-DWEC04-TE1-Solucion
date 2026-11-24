async function obtenerSeriesTendencia() {
    try {
        // Hacemos el fetch de la URL de la API elegida, en mi caso Deezer
        const respuesta = await fetch("https://api.tvmaze.com/shows");

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // Los devolvemos al array de series
        return datos;
    } catch (error) {
        throw error;
    }
}