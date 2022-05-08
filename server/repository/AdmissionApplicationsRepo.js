import AdmissionApplication from '../models/AdmissionApplication.js';
import fs from "fs-extra";

class AdmissionApplicationsRepo {
    async addAdmission(admission) {
        return AdmissionApplication.create(admission);
    }

    async updateAdmission(admission) {
        return AdmissionApplication.updateOne({_id: admission._id}, admission);
    }

    async getAllAdmissions() {
        return AdmissionApplication.find();
    }

    async getUserAdmissions(userEmail) {
        return AdmissionApplication.find({author: userEmail});
    }

    async getAdmissionsByAcademicYear(year) {
        return AdmissionApplication.find({forAcademicYear: year});
    }

    async getAdmissionsByStatus(status) {
        return AdmissionApplication.find({status: status});
    }

    async getAdmissionsByAcademicYearAndStatus(year, status) {
        return AdmissionApplication.find({forAcademicYear: year, status: status});
    }

    async getAdmissionById(id) {
        return AdmissionApplication.findById(id);
    }

    async getSummaryReport() {
        const sumAdmissionsPerGrade = await AdmissionApplication.aggregate([
            {
                $group: {
                    _id: {
                        grade: "$applySchoolGrade"
                    },
                    totalAdmissionsForGrade: {$sum: 1},
                }
            },
            {"$sort": {"_id": 1}}
        ]);
        const sumAdmissionsPerStatus = await AdmissionApplication.aggregate([
            {
                $group: {
                    _id: {
                        status: "$status"
                    },
                    totalAdmissionsForStatus: {$sum: 1},
                },
            },
        ]);
        return {
            sumAdmissionsPerGrade: sumAdmissionsPerGrade,
            sumAdmissionsPerStatus: sumAdmissionsPerStatus
        };
    }

    async getSummaryReportByYear(year) {
        const sumAdmissionsPerGrade = await AdmissionApplication.aggregate([
            {"$match": {"forAcademicYear": year}},
            {
                $group: {
                    _id: {
                        grade: "$applySchoolGrade"
                    },
                    totalAdmissionsForGrade: {$sum: 1},
                }
            },
            {"$sort": {"_id": 1}}
        ]);
        const sumAdmissionsPerStatus = await AdmissionApplication.aggregate([
            {"$match": {"forAcademicYear": year}},
            {
                $group: {
                    _id: {
                        status: "$status"
                    },
                    totalAdmissionsForStatus: {$sum: 1},
                },
            },
        ]);
        return {
            sumAdmissionsPerGrade: sumAdmissionsPerGrade,
            sumAdmissionsPerStatus: sumAdmissionsPerStatus
        };
    }

    async addAttachments(admissionId, attachments) {
        const admission = await this.getAdmissionById(admissionId);
        admission.attachments.push(...attachments);
        return await this.updateAdmission(admission);
    }

    getAdmissionApplicationCount() {
        return AdmissionApplication.countDocuments({});
    }

    async initDB() {
        try {
            let admissionApplicationCount = await this.getAdmissionApplicationCount();
            if (admissionApplicationCount == 0) {
                const admissionApps = await this.loadDataFromJsonFile();
                for (let admissionApp of admissionApps) {
                    await this.addAdmission(admissionApp);
                }
                admissionApplicationCount = await this.getAdmissionApplicationCount();
                console.log('Done initDB for AdmissionApplicationsRepo, Documents Count = ', admissionApplicationCount);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async loadDataFromJsonFile() {
        return await fs.readJson('./server/data/admissions.json');
    }
}

export default new AdmissionApplicationsRepo();
