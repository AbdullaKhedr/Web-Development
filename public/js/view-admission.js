import authRepo from '../repository/AuthRepo.js';
import admissionAppsRepo from '../repository/AdmissionApplicationsRepo.js';
import admissionAppsStatusRepo from '../repository/AdmissionApplicationStatusRepo.js';

document.addEventListener("DOMContentLoaded", async () => {
    // model for adding a note
    window.addNoteModel = addNoteModel;
    window.saveNote = saveNote;
    // model for listing all the notes, and edit or delete any of them
    window.showNotesModel = showNotesModel;
    window.deleteNote = deleteNote;
    window.editNote = editNote;
    // model for adding an attachment
    window.addAttachmentModel = addAttachmentModel;
    // model for listing all the attachment, and delete any of them
    window.showAttachmentsModel = showAttachmentsModel;
    window.deleteAttachment = deleteAttachment;
    // model for the admin to be able to edit admission status
    window.updateAdmissionStatusModel = updateAdmissionStatusModel;
    window.updateStatus = updateStatus;
    // model for the admin to add a test result
    window.testResultModel = testResultModel;
    window.saveTest = saveTest;

    window.showTestsModel = showTestsModel;

});

const admissionId = admissionAppsRepo.getUpdateAdmissionId();
let currentAdmission = await admissionAppsRepo.getAdmissionById(admissionId);

// Get current user role, then if it is the (principal) add more options
const currentUserRole = authRepo.getCurrentRole();
if (currentUserRole == 'principal') {
    const actionsDiv = document.querySelector('.actions');
    actionsDiv.innerHTML += `<button class="btn action-btn green" onclick="updateAdmissionStatusModel()">Update Status</button>
            <button class="btn action-btn green" onclick="testResultModel()">Add Test Result</button>`;
}

const admissionModel = document.querySelector('.view-app-content');
let viewAdmissionTable = `
            <tr><td>Student First Name</td><td>${currentAdmission.fName}</td></tr>
            <tr><td>Student Last Name</td><td>${currentAdmission.lName}</td></tr>
            <tr><td>Student Gender</td><td>${currentAdmission.gender}</td></tr>
            <tr><td>Student Date of Birth</td><td>${currentAdmission.DOB}</td></tr>
            <tr><td>Student Current School Name</td><td>${currentAdmission.currentSchoolName}</td></tr>
            <tr><td>Student Current School Grade</td><td>${currentAdmission.currentSchoolGrade}</td></tr>
            <tr><td>Student Apply to School Grade</td><td>${currentAdmission.applySchoolGrade}</td></tr>
            <tr><td>Application for Academic Year</td><td>${currentAdmission.forAcademicYear}</td></tr>
            <tr><td>Application Status</td><td>${currentAdmission.status}</td></tr>
            <tr><td>Application Messages</td><td>${currentAdmission.message}</td></tr>`;
admissionModel.innerHTML = viewAdmissionTable;


/** Handel Change (update) AdmissionApplication status by the Admin */
async function updateAdmissionStatusModel() {
    const changeStatusModelContent = document.querySelector('.change-status-model-content');
    const applicationStatuses = await admissionAppsStatusRepo.getAllApplicationStatuses();
    changeStatusModelContent.innerHTML = applicationStatuses.map(s =>
        `<input type="radio" id="${s.name}" name="status" value="${s.name}">&nbsp;<label for="${s.name}">${s.name}</label><br>`).join('\n');
    const changeStatusModel = document.querySelector('.change-status-model');
    changeStatusModel.style.display = "block";
}

async function updateStatus() {
    const statusRadios = document.getElementsByName('status');
    let status;
    for (let i = 0, length = statusRadios.length; i < length; i++) {
        if (statusRadios[i].checked) {
            status = statusRadios[i].value;
            break;
        }
    }
    if (status)
        currentAdmission.status = status;
    await admissionAppsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel add note for admission application **/
async function addNoteModel() {
    const noteModel = document.querySelector('.note-model');
    noteModel.style.display = "block";
}

async function saveNote() {
    const note = document.querySelector('#note').value;
    currentAdmission.notes.push(note);
    console.log(currentAdmission.notes);
    console.log(currentAdmission);
    await admissionAppsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel list, edit notes for admission application */
async function showNotesModel() {
    if (currentAdmission.notes.length != 0) {
        const editDeleteNotesModel = document.querySelector('.edit-delete-notes-model');
        editDeleteNotesModel.style.display = "block";
        const notesList = document.querySelector('.notes-list');
        const notesListHTML = currentAdmission.notes.map((n, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><textarea class="filed" id="edited-note">${n}</textarea></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn green" onclick="editNote(${index})">Update</button></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteNote(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
        notesList.innerHTML = notesListHTML;
    } else
        alert('There are no notes!');
}

async function deleteNote(index) {
    currentAdmission.notes.splice(index, 1);
    await admissionAppsRepo.updateAdmission(currentAdmission);
    if (currentAdmission.notes.length >= 1)
        await showNotesModel();
    else
        location.reload();
}

async function editNote(index) {
    currentAdmission.notes[index] = document.querySelector('#edited-note').value;
    await admissionAppsRepo.updateAdmission(currentAdmission);
    alert('The note have been updated');
}


/** Handel add attachment for admission application **/
async function addAttachmentModel() {
    const attachmentModel = document.querySelector('.attachment-model');
    attachmentModel.style.display = "block";
    const attachmentForm = document.querySelector('#attachment-form');
    attachmentForm.action = `/api/admissions/${admissionAppsRepo.getUpdateAdmissionId()}/attachments`;
}


/** Handel list, edit attachments for admission application */
async function showAttachmentsModel() {
    if (currentAdmission.attachments.length != 0) {
        const editDeleteAttachmentsModel = document.querySelector('.edit-delete-attachments-model');
        editDeleteAttachmentsModel.style.display = "block";
        const attachmentsList = document.querySelector('.attachments-list');
        const attachmentsListHTML = currentAdmission.attachments.map((att, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><img class="filed" src="${att.filePath}" alt="img" style="max-height: 200px"/></td>
                    <td style="padding: 10px 20px;">${att.fileName}</td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn green"><a href="${att.filePath}">Download</a></button></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteAttachment(${index})">Delete</button></td>
                </tr>`;
        }).join('\n');
        attachmentsList.innerHTML = attachmentsListHTML;
    } else
        alert('There are no attachments!')
}

async function deleteAttachment(index) {
    await admissionAppsRepo.deleteAttachment(index, admissionId);
    // currentAdmission has been changed in the db so update it (refresh it)
    currentAdmission = await admissionAppsRepo.getAdmissionById(admissionId);
    if (currentAdmission.attachments.length >= 1)
        await showAttachmentsModel();
    else
        location.reload();
}


/** Handel add test grade */
async function testResultModel() {
    const testModel = document.querySelector('.test-result-model');
    testModel.style.display = "block";
}

async function saveTest() {
    const testName = document.querySelector('#test').value;
    const testScore = document.querySelector('#score').value;
    let testObject = {testName, testScore, toNotify: true};
    currentAdmission.testResults.push(testObject);
    await admissionAppsRepo.updateAdmission(currentAdmission);
    location.reload();
}

// TODO: complete (edit / delete) test result
async function showTestsModel() {
    if (currentAdmission.testResults.length != 0) {
        document.querySelector('.edit-delete-tests-model').style.display = "block";
        const testsList = document.querySelector('.tests-list');
        const notesListHTML = currentAdmission.testResults.map((t, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;">${t.testName}</td>
                    <td style="padding: 10px 20px;"><input type="number" class="filed" id="edited-note" value="${t.testScore}"></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn green" onclick="editTest(${index})">Update</button></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteTest(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
        testsList.innerHTML = notesListHTML;
    } else
        alert('There are no Tests!');
}


/** Handel Close All Models */
const allModels = document.getElementsByClassName('model');
for (let model of allModels) {
    const modelCloseBtn = document.querySelector(`#${model.id} .close`)
    modelCloseBtn.onclick = function () {
        model.style.display = "none";
    }
}
