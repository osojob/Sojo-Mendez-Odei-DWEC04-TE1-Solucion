// Guardamos en constantes los parametros de la serie
const parametros = new URLSearchParams(window.location.search);
const idSerie = parametros.get("id");
const nomSerie = parametros.get("nombre");

// Cambiamos el titulo dependiendo de a que serie se entre
const titulo = document.getElementById("titulo-serie");
titulo.textContent = nomSerie;

// Funcion para cargar los episodios en la hoja de detalles
async function cargarEpisodios() {
    // Episodios
    const episodios = await obtenerEpisodiosSerie(idSerie);
    
    // Detalles y elenco
    const detalle = await obtenerDetalleSerie(idSerie);
    const elenco = await obtenerElencoSerie(idSerie);
   
    // Capturamos los elementos que necesitamos del HTML
    const poster = document.getElementById("poster-serie");
    const sinopsis = document.getElementById("sinopsis-serie");
    
    const contenedorElenco = document.getElementById("elenco-serie");
    let htmlElenco = "";

    elenco.forEach(actor => {
        // Sacamos imagen, nombre y personaje
        const foto = actor.person.image?.medium;
        const nombre = actor.person.name;
        const personaje = actor.character.name;

        htmlElenco += `
            <div class="actor-card">
                <img src="${foto}" alt="${nombre}">
                <strong>${nombre}</strong>
                <span>${personaje}</span>
            </div>
        `;
    });

    // Metemos el HTML en el contenedor
    contenedorElenco.innerHTML = htmlElenco;

    poster.src = detalle.image.original;
    sinopsis.innerHTML = detalle.summary;
    
    calcularNotasPorTemporadas(episodios);
}

function calcularNotasPorTemporadas(episodios) {
    let etiquetas = [];
    let valores = [];
    let episodiosPorTemporada = [];

    let sumas = {};
    let conteos = {};

    episodios.forEach(episodio => {
        // Filtramos para comprobar que el episodio tiene nota
        if (episodio.rating && episodio.rating.average) {
            const temporada = episodio.season;
            const nota = episodio.rating.average;

            // Inicializamos a 0 si es la primera vez que se ve la temporada
            if (!sumas[temporada]) {
                sumas[temporada] = 0;
                conteos[temporada] = 0;
            }

            // Sumamos la nota y duración
            sumas[temporada] += nota;
            conteos[temporada]++;
        }
    });

    for (let temporada in sumas) {
        // Calculamos notas medias por temporada y redondeamos a 1 decimal
        etiquetas.push("Temporada " + temporada);
        valores.push((sumas[temporada] / conteos[temporada]).toFixed(1));

        // Metemos los episodios por temporada
        episodiosPorTemporada.push(conteos[temporada]);
    }

    // Creamos el gráfico
    const ctx = document.getElementById('grafico-temporadas').getContext('2d');

    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Nota media',
                    data: valores,
                    backgroundColor: 'rgba(255, 241, 44, 0.64)',
                    borderColor: 'rgb(248, 248, 29)',
                    borderWidth: 1,
                    yAxisID: 'y',
                    barPercentage: 0.9,
                    categoryPercentage: 0.5
                }, 
                {
                    label: 'Nº de episodios',
                    data: episodiosPorTemporada,
                    type: 'line',
                    borderColor: 'rgb(191, 20, 174)',
                    backgroundColor: 'rgba(197, 19, 167, 0.42)',
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            font: {
                family: '"Space Mono", monospace'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8fafc'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#f8fafc',
                        font: {
                            family: '"Space Mono", monospace',
                            size: 12
                        }
                    }
                },
                y: {
                    ticks: { color: '#f8fafc' },
                    beginAtZero: true,
                    max: 10,
                    position: 'left',
                    title: { display: true, text: 'Nota', color: '#afef1a' }
                },
                y1: {
                    ticks: { color: '#f8fafc' },
                    beginAtZero: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Episodios', color: '#afef1a' }
                }
            }
        }
    });
}

// Llamamos al metodo para cargar episodios
cargarEpisodios();