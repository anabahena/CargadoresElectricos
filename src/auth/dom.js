//Input
//User signup
const registerName = document.getElementById('register-name');
const registerMail = document.getElementById('register-mail');
const registerPassword = document.getElementById('register-password');

//User Login
const loginName = document.getElementById('login-name');
const loginMail = document.getElementById('login-mail');
const loginPassword = document.getElementById('login-password');

//Section
const welcomeView = document.getElementById('welcome-box');
const loginView = document.getElementById('login-box');
const registerView = document.getElementById('register-box');

//Buttons to render sections
const renderLogin = document.getElementById('toLoginView');
const renderSignUp = document.getElementById('toSignupView');

//Button to send info to firebase
const loginBtn = document.getElementById('sendingLogin-info');
const registerBtn = document.getElementById('sendingRegister-info');


//Function to display selected area
const goSection = (section) => {
    welcomeView.classList.add('hide');
    loginView.classList.add('hide');
    section.classList.remove('hide');
}

//Events
renderSignUp.addEventListener('click', () => {
    goSection(registerView)
});


renderLogin.addEventListener('click', () => {
    goSection(loginView)
});

registerBtn.addEventListener('click', () => {
    console.log('entra a registerBtn');
    
    // signUp(registerMail.value,registerPassword.value);
});

loginBtn.addEventListener('click', () => {
console.log('Inicia sesión');
});

loginBtn.addEventListener('click', () => {
    console.log('esto es para iniciar sesion');
});


