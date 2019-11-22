//Input
//User signup
const registerName = document.getElementById('register-name');
const registerMail = document.getElementById('register-mail');
const registerPassword = document.getElementById('register-password');

console.log(registerMail, registerName.value, registerPassword);


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
const loginBtn = document.getElementById('sendingRegister-info');
const registerBtn = document.getElementById('sendingLogin-info');


//Function to display selected area
const goSection = (section) => {
    welcomeView.classList.add('hide');
    loginView.classList.add('hide');
    section.classList.remove('hide');
}

//Events
renderSignUp.addEventListener('click', () => {
    goSection(loginView)
});


renderLogin.addEventListener('click', () => {
    goSection(registerView)
});

registerBtn.addEventListener('click', () => {
    console.log('entra a registerBtn', registerMail.value, registerPassword.value);
    
    // signUp(registerMail.value,registerPassword.value);
});

loginBtn.addEventListener('click', () => {
    console.log('esto es para iniciar sesion');
});


