//Tania y Vianey fetch/data
//Guardando la URL de la API para cargadores eléctricos
const electricChargerApi = 'https://api-electric-charger.herokuapp.com/electricCharger';

console.log(electricChargerApi);
//Crear función que guarda la data
const getData = () => {
    fetch(electricChargerApi)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        console.log('error');
    });
}

getData();