import express from 'express';
import admissionAppsStatusesService from "./services/AdmissionAppsStatusesService.js";
import admissionAppsService from "./services/AdmissionApplicationsService.js";
import academicYearsService from "./services/AcademicYearsService.js";
import authService from "./services/AuthService.js";

const router = express.Router();

/** Admission Applications Routes **/
router.route('/admissions')
    .get(admissionAppsService.getAdmission)
    .post(admissionAppsService.addAdmission)
    .put(admissionAppsService.updateAdmission)

router.route('/admissions/stats')
    .get(admissionAppsService.getSummaryReport)

router.route('/admissions/:admissionId/attachments')
    .post(admissionAppsService.uploadAttachments)

router.route('/admissions/:admissionId/deleteAttachment/:attachmentIndex')
    .delete(admissionAppsService.deleteAttachment)

/** Users Routes **/
router.route('/users')
    .get(authService.getUsers)
    .post(authService.addUser)
    .put(authService.updateUser)

/** Admission Applications Statuses Routes **/
router.route('/statuses')
    .get(admissionAppsStatusesService.getAppStatuses)
    .post(admissionAppsStatusesService.addAppStatuses)

/** Academic Years Routes **/
router.route('/years')
    .get(academicYearsService.getAllAcademicYears)
    .post(academicYearsService.addAcademicYear)

router.route('/years/open')
    .get(academicYearsService.getOpenForAdmissionYear)

export default router;
