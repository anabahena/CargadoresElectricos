class UI {
    constructor() {
        // Instanciar la API
        this.api = new API();
        // Crear los mapas en un grupo
        this.markers = new L.LayerGroup();
        // Iniciar el mapa
        this.map = this.mapInit();
    }
    mapInit() {
            // Inicializar y obtener la propiedad del mapa
            var map = L.map("map");
            const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

            function buscarLocalizacion(e) {
                L.marker(e.latlng).addTo(map);
            }

            function errorLocalizacion(e) {
                alert(
                    "No es posible encontrar su ubicación. Es posible que tenga que activar la geolocalización."
                );
            }
    map.locate({ setView: true, maxZoom: 40 });
    map.on("locationerror", errorLocalizacion);
    map.on("locationfound", buscarLocalizacion);

    return map;
  }

  // Mostrar Estaciones de la api
  showStations() {
    this.api.getData().then(data => {
      // Muestra los pines en el Mapa
      this.showPins(data);
    });
  }
  // Muestra los pines
  showPins(data) {
    this.markers.clearLayers();

    // Recorrer establecimientos
    data.forEach(element => {
      // Destructuración
         const { name, plug_type, kw_price, state, geolocation, rating } = element;
         
         const rate = parseInt(rating, 10);

      const starRating = `
                         <div class="star-rating">
                         ${this.getRating(rate, 4)}
                         ${this.getRating(rate, 5)}
                         ${this.getRating(rate, 2)}
                         ${this.getRating(rate, 3)}
                         ${this.getRating(rate, 1)}
                         </div>
                         `;

      const optionsPopUp = L.popup().setContent(`
                            <p>Dirección:</p> 
                            <p> <b>Nombre:</b> ${name}</p>
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                            <p> <b>Disponibilidad:</b> ${state}</p>
                            ${starRating}
                            `);

      // Agregar el Pin
      const marker = new L.marker([
        parseFloat(geolocation.latitude),
        parseFloat(geolocation.longitude)
      ]).bindPopup(optionsPopUp);

      this.markers.addLayer(marker);
    });
    this.markers.addTo(this.map);
  }

  // Itzel. Código para crear Star Rating
     getRating(rate, i) {       
      if (rate !== i) {
        return `
               <input id="star-${i}" type="radio" name="rating" value="star-${i}">
               <label for="star-${i}" title="${i} stars">
               <i class="active fa fa-star" aria-hidden="true"></i>
               </label>
               `;
      }

      if (rate === i) {
        return `
               <input id="star-${i}" type="radio" name="rating" value="star-${i}" checked>
               <label for="star-${i}" title="${i} stars">
               <i class="active fa fa-star" aria-hidden="true"></i>
               </label>
               `;
      }    
  }

  // Obtiene las sugerencias de la REST API
  obtenerSugerencias(search) {
    this.api.getData().then(data => {
      // Obtener los resultados
      //const resultados = datos.respuestaJSON.results;

      // Enviar el JSON y la busqueda al Filtro
      this.filtrarSugerencias(data, search);
    });
  }

  // Filtrar las sugerencias de busqueda
  filtrarSugerencias(data, search) {
    const filterData = data.filter(
      filter => filter.name.toLowerCase().indexOf(search) !== -1
    );

    // Mostrar pines del Filtro
    this.showPins(filterData);
  }
}
