//Tania y Vianey fetch/data
const electricChargerApi = 'https://api-electric-charger.herokuapp.com/electricCharger';
let settings = {
    method: 'GET',
};

const getData = () => {
    fetch(electricChargerApi, settings)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log('error');
        });
}

getData();