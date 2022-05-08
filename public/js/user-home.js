import admissionAppsStatusRepo from '../repository/AdmissionApplicationStatusRepo.js';
import admissionAppsRepo from '../repository/AdmissionApplicationsRepo.js';
import academicYearsRepo from '../repository/AcademicYearsRepo.js';
import authRepo from '../repository/AuthRepo.js';

document.addEventListener("DOMContentLoaded", async () => {
    admissionAppsRepo.removeUpdateAdmissionId();
    /*
    Because we set type='module' in <script type="module" src="./app.js"></script>, then we have to
    Attach these functions to the window object to make them available to the html page.
    Or use addEventListener to bind handler.
    */
    window.editUserAccount = editUserAccount;
    window.logOut = logOut;
    window.editAdmission = editAdmission;
    window.withdrawAdmission = withdrawAdmission;
    window.openAdmission = openAdmission;

    // Admin
    window.filterByYear = filterByYear;
    window.filterByStatus = filterByStatus;
    window.getSummaryReport = getSummaryReport;
    window.reportByYear = reportByYear;

    await getAdmissions();
});
const admissionsTableBody = document.querySelector('#admissions-table-body');

async function getAdmissions() {
    /*
    1. User email (account) is added as (author) to the new created admission application,
    2. and we keep track of what account is using the website through local storage, by adding the account email after login
    3. then we can get all admissions related to that user only (currentUser), then we fill the table
    4. in case of the currentUser ia the Admin user, then we get all admission applications from the db and display them.
    */

    // This should get all admissions related to the current logged in user only (that stored in a localStorage key)
    const currentUserEmail = await authRepo.getCurrentUser()
    const currentUserRole = await authRepo.getCurrentRole()

    // Check if there is a current logged in user
    if (currentUserEmail !== undefined && currentUserEmail !== "") {
        if (currentUserRole === "principal") { // This is the admin, so display all admission applications
            const allAdmissions = await admissionAppsRepo.getAllAdmissions();
            await setUpAdminTableHeader();
            admissionsTableBody.innerHTML = admissionToHTMlADMIN(allAdmissions);
            const navOptionsList = document.querySelector('.nav-options-list');
            navOptionsList.innerHTML += `<li><a class="summaryReport" href="#"  onclick="getSummaryReport()">Applications Summary Report</a></li>`;
        } else {
            console.log("The returned current user: ", currentUserEmail);
            const userAdmissions = await admissionAppsRepo.getUserAdmissions(currentUserEmail);
            console.log("Admission applications returned for the current user: ", userAdmissions);
            // now we should populate the data in the table
            admissionsTableBody.innerHTML = admissionToHTMl(userAdmissions);
            userAdmissions.forEach(ad => ad.testResults.forEach(r => {
                if (r.toNotify) {
                    const confirmed = confirm(`New Test Result [Name: ${r.testName}, Score: ${r.testScore}] have been added`);
                    if (confirmed) {
                        r.toNotify = false;
                        admissionAppsRepo.updateAdmission(ad);
                    }
                }
            }));
        }
    } else {
        window.location = "../index.html";
    }
}


/** Handel log out **/
async function logOut() {
    if (authRepo.logOutCurrentUser())
        window.location = "../index.html";
}


/** Handel edit account **/
async function editUserAccount() {
    const currentUserEmail = await authRepo.getCurrentUser()
    if (currentUserEmail !== undefined && currentUserEmail !== '') {
        const currentUser = await authRepo.getUserByEmail(currentUserEmail);
        authRepo.setUpdateUserId(currentUser.id);
        window.location = "../register.html";
    } else
        alert('Please Login First!');
}


/** For normal user (parent) usage **/
function admissionToHTMl(admission) {
    return admission.map(ad => {
        let html = ` <tr>
                <td>${ad.fName} ${ad.lName}</td>
                <td>${ad.creationDate.substr(0, 10)}</td>
                <td>${ad.forAcademicYear}</td>
                <td>${ad.status}</td>
                <td class="actions">
                    <button class="btn action-btn green" onclick="openAdmission('${ad.id}')">Open</button>`;
        if (ad.status !== 'Submitted')
            html += `
                </td>
             </tr>`;
        else
            html += `
                    <button class="btn action-btn" onclick="editAdmission('${ad.id}')">Edit</button>
                    <button class="btn action-btn red" onclick="withdrawAdmission('${ad.id}')">Withdraw</button>
                </td>
             </tr>`;
        return html;
    }).join('\n')
}


/** Handel edit admission **/
async function editAdmission(id) {
    if (id) { // valid id
        admissionAppsRepo.setUpdateAdmissionId(id);
        window.location = "../admission.html";
    }
}


/** Handel withdraw admission **/
async function withdrawAdmission(id) {
    const confirmed = confirm(`Are you sure you want to withdraw the application?`);
    if (confirmed) {
        const admission = await admissionAppsRepo.getAdmissionById(id);
        admission.status = 'Withdrawn';
        await admissionAppsRepo.updateAdmission(admission);
        alert(`Application with id: ${id} has been withdrawn`);
        await getAdmissions();
    }
}


/** For Admin user usage **/
async function setUpAdminTableHeader() {
    // configure special table header for the admin
    const academicYears = await academicYearsRepo.getAllAcademicYears();
    const applicationStatuses = await admissionAppsStatusRepo.getAllApplicationStatuses();
    const yearsHTML = academicYears.map(y => `<option value="${y.year}">${y.year}</option>`).join('\n');
    const statusesHTML = applicationStatuses.map(s => `<option value="${s.name}">${s.name}</option>`).join('\n');
    document.querySelector('#admissions-table-head').innerHTML = `<thead>
        <tr>
            <th>Application for</th>
            <th>Date Created</th>
            <th>Academic Year <select id="academicYearFilter" onchange="filterByYear(this.value)">
                <option value="All">All</option>
                ${yearsHTML}
            </select></th>
            <th>Status <select id="statusFilter" onchange="filterByStatus(this.value)">
                <option value="All">All</option>
                ${statusesHTML}
            </select></th>
            <th colspan="2">Action</th>
        </tr>
    </thead>`;
}

function admissionToHTMlADMIN(admission) {
    return admission.map(ad => {
        return ` <tr>
                <td>${ad.fName} ${ad.lName}</td>
                <td>${ad.creationDate.substr(0, 10)}</td>
                <td>${ad.forAcademicYear}</td>
                <td>${ad.status}</td>
                <td class="actions" colspan="2">
                    <button class="btn action-btn" onclick="editAdmission('${ad.id}')">Edit</button>
                    <button class="btn action-btn green" onclick="openAdmission('${ad.id}')">Open</button>
                </td>
             </tr>`
    }).join('\n');
}

async function filterByYear(year) {
    if (year !== 'All')
        admissionsTableBody.innerHTML = admissionToHTMlADMIN(await admissionAppsRepo.getAdmissionsByAcademicYear(year));
    else
        admissionsTableBody.innerHTML = admissionToHTMlADMIN(await admissionAppsRepo.getAllAdmissions());
}

async function filterByStatus(status) {
    if (status !== 'All')
        admissionsTableBody.innerHTML = admissionToHTMlADMIN(await admissionAppsRepo.getAdmissionsByStatus(status));
    else
        admissionsTableBody.innerHTML = admissionToHTMlADMIN(await admissionAppsRepo.getAllAdmissions());
}

// async function filterByYearAndStatus(year, status) {
//     if (year !== 'All' && status !== 'ALl')
//         admissionsTableBody.innerHTML = admissionToHTMlADMIN(await admissionAppsRepo.getAdmissionsByAcademicYearAndStatus(year, status));
// }

async function openAdmission(id) {
    admissionAppsRepo.setUpdateAdmissionId(id);
    window.location = "../view-admission.html";
}

// opens the model
async function getSummaryReport() {
    const academicYears = await academicYearsRepo.getAllAcademicYears();
    document.querySelector('#academicYear').innerHTML = '<option value="All">All</option>' + academicYears.map(y => `<option value="${y.year}">${y.year}</option>`).join('\n');
    await reportByYear('All');
    document.querySelector('.report-model').style.display = "block";
}

async function reportByYear(year) {
    let report;
    if (year === 'All') {
        report = await admissionAppsRepo.getSummaryReport();
    } else {
        report = await admissionAppsRepo.getSummaryReport(year);
    }
    document.querySelector('.report-model-content').innerHTML = `
        <br>
        <h3>Total Applications per Grade:</h3>
        <table style="width: 70%">
        ${report.sumAdmissionsPerGrade.map(grade => {
            return `<tr>
                    <td>Grade ${grade._id.grade}: </td>
                    <td>${grade.totalAdmissionsForGrade} Applications</td>
                    </tr>
                `
        }).join('\n')}
        </table>
        <br>
        <h3>Total Applications per Satus:</h3>
        <table style="width: 70%">
        ${report.sumAdmissionsPerStatus.map(status => {
            return `<tr>
                    <td>Status ${status._id.status}: </td>
                    <td>${status.totalAdmissionsForStatus} Applications</td>
                    </tr>
                `
        }).join('\n')}
        </table>
        `
}

/** Handel Close All Models */
const allModels = document.getElementsByClassName('model');
for (let model of allModels) {
    const modelCloseBtn = document.querySelector(`#${model.id} .close`)
    modelCloseBtn.onclick = function () {
        model.style.display = "none";
    }
}
