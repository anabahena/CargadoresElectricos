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

  /* mapInit() {
    // Inicializar y obtener la propiedad del mapa
    const map = L.map("map").setView([19.390519, -99.3739778], 6);

    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; " + mapLink + " Contributors",
      maxZoom: 18
    }).addTo(map);

    return map;
  } */

  // Mostrar Establecimientos de la api
  showStations() {
    this.api.getData().then(data => {
      //const result = data;
      //console.log(data);

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
      const { id, name, plug_type, kw_price, state, geolocation } = element;

      const optionsPopUp = L.popup().setContent(`
                            <p>Dirección:</p> 
                            <p> <b>Nombre:</b> ${name}</p>
                            <p> <b>Precio:</b> $ ${kw_price}</p>
                            <p> <b>Conector:</b> ${plug_type}</p>
                            <p> <b>Disponibilidad:</b> ${state}</p>
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
      filter => filter.state.indexOf(search) !== -1
    );

    // Mostrar pines del Filtro
    this.showPins(filterData);
  }
}
