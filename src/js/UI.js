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
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      const customIcon = new L.Icon({
        iconUrl: "https://image.flaticon.com/icons/svg/1089/1089237.svg",
        iconSize: [50, 50],
        iconAnchor: [25, 50]
      });

      const optionsPopUp = L.popup().setContent(`
                            <p> <b>Punto de ruta</b> </p>
                              `);
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;




                // console.log(pos.coords.accuracy);

                const btnLlegar = document.getElementById('btn-llegar')

                const calcularRoute = () => {

                    L.Routing.control({
                            lineOptions: {
                                styles: [
                                    { color: 'white', opacity: 0.9, weight: 9 },
                                    { color: 'green', opacity: 1, weight: 5 }
                                ]
                            },


                            waypoints: [
                                L.latLng(latitude, longitude),
                                L.latLng(21.87982, -102.296)
                            ],
                            createMarker: function(i, dStart, n) {
                                return L.marker(dStart.latLng, {
                                    draggable: true,
                                    bounceOnAdd: true,
                                    bounceOnAddOptions: {
                                        duration: 1000,
                                        height: 800,
                                        function() {
                                            (popup.openOn(map))
                                        }
                                    },

                                    icon: customIcon
                                }).bindPopup(optionsPopUp).openPopup();
                            },
                            routeWhileDragging: true,
                        },



                    ).addTo(map);
                }

                btnLlegar.addEventListener('click', calcularRoute);

            }

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
    const optionsPopUp = L.popup().setContent(`
            <p> <b>Aquí estás</b> </p>
              `);
    const customIcon = new L.Icon({
      iconUrl: "https://image.flaticon.com/icons/svg/1020/1020348.svg",
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    });

    function buscarLocalizacion(e) {
      L.marker(e.latlng, {
        icon: customIcon
      })
        .bindPopup(optionsPopUp)
        .openPopup()
        .addTo(map);
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
      const {
        adress,
        name,
        plug_type,
        kw_price,
        state,
        geolocation,
        rating
      } = element;
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
                            <p style="color: green"> <b>Disponible</b> </p>
                            <p>${name}</p>
                            <p>Dirección: ${adress}</p>
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                              ${starRating}
                              `);
    const icon = new L.Icon({
      iconUrl: "./assets/free-loc.png",
      iconSize: [35, 50],
      iconAnchor: [20, 50]
    });
      // Agregar el Pin
      const marker = new L.marker(
        [parseFloat(geolocation.latitude), parseFloat(geolocation.longitude)],
        { icon: icon }
      ).bindPopup(optionsPopUp);
      this.markers.addLayer(marker);
    });
    // Recorrer establecimientos
    bussyStations.forEach(element => {
      // Destructuración
      const {
        adress,
        name,
        plug_type,
        kw_price,
        state,
        geolocation,
        rating
      } = element;
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
                            <p style="color: red"> <b>Ocupada</b> </p>
                            <p>${name}</p>
                            <p>Dirección: ${adress}</p>
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                              ${starRating}
                              `);
          const icon = new L.Icon({
            iconUrl: "./assets/bussy-loc.png",
            iconSize: [35, 50],
            iconAnchor: [20, 50]
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
}
/* 
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
 }); */
