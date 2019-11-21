class API {
    async getData() {
        // Obtener desde la API
        const response = await fetch("./data/stations.json");
        // Retornar como JSON
        const json = await response.json();
        //Entra a el 'key' stations
        const data = json.stations;
        // console.log(data);

        // Retornar el objeto
        return data;
    }
}