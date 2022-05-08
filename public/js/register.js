import authRepo from '../repository/AuthRepo.js';

const registrationForm = document.querySelector('#registration_form');
registrationForm.addEventListener('submit', register);

let isEditing = false;
let userToUpdate = null;

// To check if editing mode, then populate the user object to the form
const id = authRepo.getUpdateUserId();
if (id) {
    userToUpdate = await authRepo.getUserById(id);
    console.log("User to be updated:", userToUpdate);
    // Convert JSON object to Form
    FormDataJson.fillFormFromJsonValues(registrationForm, userToUpdate);
    isEditing = true;
}

async function register(event) {
    if (!registrationForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault();

    // Start do what i want to happen on submit clicked
    const newRegistration = formToObject(registrationForm);
    if (isEditing) {
        newRegistration._id = userToUpdate.id;
        newRegistration.__v = userToUpdate.__v;
        console.log("User after Updating:", newRegistration);
        await authRepo.updateUser(newRegistration);
        isEditing = false;
        authRepo.removeUpdateUserId();
        // to make sure we have the new mail stored if the user updates the email
        authRepo.setCurrentUser(newRegistration.email);
        alert(`You have update your account successfully!`);
    } else {
        newRegistration.role = 'parent';
        await authRepo.registerUser(newRegistration);
        alert(`You have creat an account successfully!`);
    }
    window.location = "../index.html";
    registrationForm.reset();
}

function formToObject(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData) {
        data[key] = value;
    }
    return data;
}
