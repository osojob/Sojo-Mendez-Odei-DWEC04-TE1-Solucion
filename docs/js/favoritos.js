const listaFavoritos = document.getElementById("lista-favoritos");
const sinFavoritos = document.getElementById("sin-favoritos");

let favoritos = JSON.parse(localStorage.getItem("mis-favoritos")) || [];

// Funcion que se encarga de cargar las series a las que hemos dado favorito
if (favoritos.length === 0) {
    sinFavoritos.hidden = false;
    listaFavoritos.hidden = true;
} else {
    sinFavoritos.hidden = true;
    listaFavoritos.hidden = false;

    let htmlFavoritos = "";

    favoritos.forEach(serie => {
        // Sacamos la imagen y nombre
        const imagen = serie.image ? serie.image.medium : "";

        htmlFavoritos += `
            <div class="favorito-card" onclick="window.location.href='detalle.html?id=${serie.id}&nombre=${encodeURIComponent(serie.name)}'">
                <img src ="${imagen}" alt="${serie.name}">
                <strong>${serie.name}</strong>
            </div>
        `;
    });

    // Metemos todo el HTML
    listaFavoritos.innerHTML = htmlFavoritos;
}