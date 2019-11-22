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
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

    //función para trazar ruta desde ubicación usuario
   /*  var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      console.log(pos.coords.accuracy);

      L.Routing.control({
        waypoints: [
          L.latLng(latitude, longitude),
          L.latLng(19.420184, -99.160555)
        ],
        routeWhileDragging: true
      }).addTo(map);
    }

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
 */
    const customIcon = new L.Icon({
      iconUrl: "https://image.flaticon.com/icons/svg/854/854866.svg",
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    });

    function buscarLocalizacion(e) {
      L.marker(e.latlng, {
        icon: customIcon
      }).addTo(map);
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

    //Obtener estaciones libres
    const freeStations = data.filter(
      filter => filter.state.indexOf("free") !== -1
    );
    //Obtener estaciones ocupadas
    const bussyStations = data.filter(
      filter => filter.state.indexOf("busy") !== -1
    );

    // Recorrer establecimientos
    freeStations.forEach(element => {
      // Destructuración
      const { adress, name, plug_type, kw_price, state, geolocation, rating } = element;

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
                            <p>${name}</p>
                            <p>Dirección: ${adress}</p> 
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                            <p style="color: green"> <b>Disponible</b> </p>
                            ${starRating}
                            `);

      // Agregar el Pin
      const marker = new L.marker([
        parseFloat(geolocation.latitude),
        parseFloat(geolocation.longitude)
      ]).bindPopup(optionsPopUp);

      this.markers.addLayer(marker);
    });
    // Recorrer establecimientos
    bussyStations.forEach(element => {
      // Destructuración
      const { adress, name, plug_type, kw_price, state, geolocation, rating } = element;

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
                            <p>${name}</p>
                            <p>Dirección: ${adress}</p> 
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                            <p style="color: red"> <b>Ocupada</b> </p>
                            ${starRating}
                            `);

      const myCustomColour = "#BD2214";

      const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 2.3rem;
  height: 2.3rem;
  display: block;
  left: -1.2rem;
  top: -1.2rem;
  position: relative;
  border-radius: 10rem 10rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

      const icon = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      });

      // Agregar el Pin
      const marker = new L.marker(
        [parseFloat(geolocation.latitude), parseFloat(geolocation.longitude)],
        { icon: icon }
      ).bindPopup(optionsPopUp);

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

  /* 
    obtenerRuta() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      console.log(latitude, longitude);

      L.Routing.control({
        waypoints: [
          L.latLng(19.421348, -99.163183),
          L.latLng(19.420184, -99.160555)
        ],
        routeWhileDragging: true
      }).addTo(map);
    }

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

  }
    navigator.geolocation.getCurrentPosition(success, error, options); */
}

//Create empty geojson with mouseover and mouseout events
/*                  geojson_feature = L.geoJson(false, {
                pointToLayer: function(feature, latlng) {
                  return L.marker(latlng, { icon: IconStyleOne });
                },
                onEachFeature: function(feature, layer) {
                  layer.on("mouseover", function(e) {
                    layer.setIcon(IconStyleOne);
                  });
                  layer.on("mouseout", function(e) {
                    layer.setIcon(IconStyleTwo);
                  });
                }
              }).addTo(this.map); */

/* class UI {
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

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 1,
                maxZoom: 18,
                ext: 'png'
            }).addTo(map);

            L.Routing.control({
                waypoints: [
                    L.latLng(19.421348, -99.163183),
                    L.latLng(19.420184, -99.160555)
                ],
                routeWhileDragging: true
            }).addTo(map);

            let customIcon = new L.Icon({
                iconUrl: 'https://image.flaticon.com/icons/svg/854/854866.svg',
                iconSize: [50, 50],
                iconAnchor: [25, 50]
            });




            function buscarLocalizacion(e) {
                L.marker(e.latlng, { icon: customIcon }).addTo(map);
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
} */
