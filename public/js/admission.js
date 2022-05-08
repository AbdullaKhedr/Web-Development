import admissionAppsRepo from '../repository/AdmissionApplicationsRepo.js';
import academicYearsRepo from '../repository/AcademicYearsRepo.js';
import authRepo from '../repository/AuthRepo.js';

const admissionForm = document.querySelector('#admission_form');
admissionForm.addEventListener('submit', submitAdmissionApplication);

let isEditing = false;

// To check if editing mode, then populate the admission object to the form
const id = admissionAppsRepo.getUpdateAdmissionId();
let admissionApp;
if (id) {
    admissionApp = await admissionAppsRepo.getAdmissionById(id);
    // Convert JSON object to Form
    FormDataJson.fillFormFromJsonValues(admissionForm, admissionApp);
    // this lib used to fill the form, is not handling the radio buttons well, therefore I have to handle them manually
    if (admissionApp.gender === 'male')
        document.querySelector('#s_gender_male').checked = true;
    else
        document.querySelector('#s_gender_female').checked = true;

    isEditing = true;
}

async function submitAdmissionApplication(event) {
    if (!admissionForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault();

    // Start do what i want to happen on submit clicked
    const newApp = formToObject(admissionForm);
    if (isEditing) {
        // those data ware not in the form, so i have to add them again
        newApp.author = admissionApp.author;
        newApp.status = admissionApp.status;
        newApp.creationDate = admissionApp.creationDate;
        newApp.forAcademicYear = admissionApp.forAcademicYear;
        newApp.notes = admissionApp.notes;
        newApp.attachments = admissionApp.attachments;
        newApp.testResults = admissionApp.testResults;
        newApp._id = admissionApp._id;
        newApp.__v = admissionApp.__v;

        console.log('Updates Admission: ', newApp);
        await admissionAppsRepo.updateAdmission(newApp);
        alert(`Admission has been updated`);
        admissionAppsRepo.removeUpdateAdmissionId();
    } else {
        newApp.author = authRepo.getCurrentUser();
        newApp.status = "Submitted";
        // no need to add the creation date from here since the mongodb will set it by default to Date.now
        // newApp.creationDate = new Date().toISOString().split('T')[0];
        const openYear = await academicYearsRepo.getOpenForAdmissionYear();
        newApp.forAcademicYear = openYear[0].year;
        newApp.notes = [];
        newApp.attachments = [];
        newApp.testResults = [];
        console.log(newApp);
        await admissionAppsRepo.addAdmission(newApp);
        alert(`Admission has been Created`);
    }
    window.location = "../user-home.html";
}

function formToObject(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData) {
        data[key] = value;
    }
    return data;
}
