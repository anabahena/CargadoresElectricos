const registerName = document.getElementById('register-name');
const registerMail = document.getElementById('register-mail');
const registerPassword = document.getElementById('register-password');

const registerBtn = document.getElementById('sending-info');

const signUp = (registerMail, registerPassword) => {
    let email = registerMail.value;
    console.log(email);
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    // .then(()=> {
    //     console.log('hola');
    // })
    //     .catch((error) => {
    //         // Handle Errors here.
    //         let errorCode = error.code;
    //         let errorMessage = error.message;
    //         console.log(errorCode);
    //         console.log(errorMessage);
    //     });
}

registerBtn.addEventListener('click', signUp);