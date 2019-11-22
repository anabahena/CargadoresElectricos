//Tania y Vianey fetch/data
// import fetch from '../node_modules/node-fetch';
// // the API url
// const url = "https://api-electric-charger.herokuapp.com/electricCharger";
// // method to use for node-fetch
// let settings = { method: "Get" };
// // make the request
// fetch(url, settings)
//     .then(res => res.json())
//     .then((data) => {
//         console.log(data);
//     });

const electricChargerApi = 'https://api-electric-charger.herokuapp.com/electricCharger';
let settings = {
    method: 'Get',
    mode: 'no-cors',
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
