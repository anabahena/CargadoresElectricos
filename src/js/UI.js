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

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 1,
                maxZoom: 18,
                ext: 'png'
            }).addTo(map);

            L.Routing.control({
                waypoints: [
                    L.latLng(57.74, 11.94),
                    L.latLng(57.6792, 11.949)

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
            const { name, plug_type, kw_price, state, geolocation } = element;
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