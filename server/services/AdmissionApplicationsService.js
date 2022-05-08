import admissionsRepo from '../repository/AdmissionApplicationsRepo.js';
import formidable from "formidable";
import {readFile, writeFile, unlink, mkdir, access} from 'fs/promises'
import {fileURLToPath} from "url";

class AdmissionApplicationsService {
    async addAdmission(req, res) {
        try {
            const application = req.body;
            await admissionsRepo.addAdmission(application);
            res.status(201).send('Application added Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async updateAdmission(req, res) {
        try {
            const application = req.body;
            await admissionsRepo.updateAdmission(application);
            res.status(201).send('Application updated Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getAdmission(req, res) {
        try {
            if (req.query.id) {
                res.status(200).json(await admissionsRepo.getAdmissionById(req.query.id));
            } else if (req.query.email) {
                res.status(200).json(await admissionsRepo.getUserAdmissions(req.query.email));
            } else if (req.query.year && req.query.status) {
                res.status(200).json(await admissionsRepo.getAdmissionsByAcademicYearAndStatus(req.query.year, req.query.status));
            } else if (req.query.year) {
                res.status(200).json(await admissionsRepo.getAdmissionsByAcademicYear(req.query.year));
            } else if (req.query.status) {
                res.status(200).json(await admissionsRepo.getAdmissionsByStatus(req.query.status));
            } else {
                res.status(200).json(await admissionsRepo.getAllAdmissions());
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getSummaryReport(req, res) {
        try {
            if (req.query.year) {
                res.status(200).json(await admissionsRepo.getSummaryReportByYear(req.query.year));
            } else {
                res.status(200).json(await admissionsRepo.getSummaryReport());
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async uploadAttachments(req, res) {
        try {
            const admissionId = req.params.admissionId;
            const formData = formidable({multiples: true});
            formData.parse(req, async (err, fields, files) => {
                const uploadedFiles = [];
                try {
                    await access('./public/attachments/');
                } catch (e) {
                    await mkdir('./public/attachments/');
                }
                try {
                    await access(`./public/attachments/${admissionId}`);
                } catch (e) {
                    await mkdir(`./public/attachments/${admissionId}`);
                }
                if (Array.isArray(files.attachments)) {
                    for (let file of files.attachments) {
                        const fileName = file.name;
                        const fileContent = await readFile(file.path);
                        await writeFile(`./public/attachments/${admissionId}/${fileName}`, fileContent);
                        uploadedFiles.push({
                            filePath: `/attachments/${admissionId}/${fileName}`,
                            fileName: fileName
                        });
                    }
                } else {
                    const fileName = files.attachments.name;
                    const fileContent = await readFile(files.attachments.path);
                    await writeFile(`./public/attachments/${admissionId}/${fileName}`, fileContent);
                    uploadedFiles.push({
                        filePath: `/attachments/${admissionId}/${fileName}`,
                        fileName: fileName
                    });
                }
                fields.attachments = uploadedFiles;
                await admissionsRepo.addAttachments(admissionId, uploadedFiles);
                res.status(201).send('Attachments uploaded Successfully');
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async deleteAttachment(req, res) {
        try {
            const admissionId = req.params.admissionId;
            const attachmentIndex = req.params.attachmentIndex;
            const admission = await admissionsRepo.getAdmissionById(admissionId);
            const removedFile = admission.attachments.splice(attachmentIndex, 1);
            await admissionsRepo.updateAdmission(admission);
            // delete the file from the disk also
            const currentUrl = new URL(`../../public/attachments/${admissionId}/`, import.meta.url);
            const currentPath = fileURLToPath(currentUrl);
            await unlink(`${currentPath}${removedFile[0].fileName}`);
            console.log(`Path deleted: ${currentPath}${removedFile[0].fileName}`);

            res.status(201).send('Attachment deleted Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

}

export default new AdmissionApplicationsService();
