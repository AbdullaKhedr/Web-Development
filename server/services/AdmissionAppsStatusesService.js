import admissionApplicationStatusRepo from '../repository/AdmissionApplicationStatusRepo.js';

class AdmissionAppsStatusesService {
    async getAppStatuses(req, res) {
        try {
            const appStatuses = await admissionApplicationStatusRepo.getAllApplicationStatuses();
            res.status(200).json(appStatuses);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async addAppStatuses(req, res) {
        try {
            const appStatus = req.body;
            await admissionApplicationStatusRepo.addApplicationStatuses(appStatus);
            res.status(201).send('Application Status added Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new AdmissionAppsStatusesService();
