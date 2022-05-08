import fs from 'fs-extra';
import AdmissionApplicationStatus from '../models/AdmissionApplicationStatus.js';

class AdmissionApplicationStatusRepo {
    addApplicationStatuses(applicationStatuses) {
        return AdmissionApplicationStatus.create(applicationStatuses);
    }

    getAllApplicationStatuses() {
        return AdmissionApplicationStatus.find({});
    }

    getAdmissionApplicationStatusCount() {
        return AdmissionApplicationStatus.countDocuments({});
    }

    async initDB() {
        try {
            let admissionApplicationStatusCount = await this.getAdmissionApplicationStatusCount();
            if (admissionApplicationStatusCount == 0) {
                const applicationStatuses = await this.loadDataFromJsonFile();
                for (let appStatus of applicationStatuses) {
                    await this.addApplicationStatuses(appStatus);
                }
                admissionApplicationStatusCount = await this.getAdmissionApplicationStatusCount();
                console.log('Done initDB for AdmissionApplicationStatusRepo, Documents Count = ', admissionApplicationStatusCount);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async loadDataFromJsonFile() {
        return await fs.readJson('./server/data/applicationStatus.json');
    }
}

export default new AdmissionApplicationStatusRepo();
