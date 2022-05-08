import authRepo from '../repository/AuthRepo.js';

const loginEmail = document.querySelector('#email');
const loginPassword = document.querySelector('#password');

const loginForm = document.querySelector('#login_form');
loginForm.addEventListener('submit', login);

// Once the user open the home page, check if there is a current User logged in, if so navigate to Dashboard (Admissions Table)
const currentUser = await authRepo.getCurrentUser();
console.log("Current User: ", currentUser);
if (currentUser !== undefined && currentUser !== '') {
    window.location = "../user-home.html";
}

async function login(event) {
    if (!loginForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault();

    // Start do what i want to happen on submit clicked
    const user = await authRepo.getUserByEmail(loginEmail.value);
    console.log("User to login: ", user);
    if (user) {
        if (user.password == loginPassword.value) {
            authRepo.setCurrentUser(user.email);
            authRepo.setCurrentRole(user.role);
            alert("Welcome");
            loginForm.reset();
            window.location = "../user-home.html";
        } else
            alert("Login Failed");
    } else {
        alert("You are not registered yet, Please Register First!");
    }
}

const openAdmissionBtn = document.querySelector('.openAdmission');
openAdmissionBtn.addEventListener('click', openAdmission);

async function openAdmission() {
    const currentUser = await authRepo.getCurrentUser();
    if (currentUser !== undefined && currentUser !== '') {
        window.location = "../admission.html";
    } else
        alert('Please Login First!');
}
