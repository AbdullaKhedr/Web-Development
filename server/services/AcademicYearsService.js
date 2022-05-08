import academicYearsRepo from '../repository/AcademicYearsRepo.js';

class AcademicYearsService {
    async addAcademicYear(req, res) {
        try {
            const year = req.body;
            await academicYearsRepo.addAcademicYear(year);
            res.status(201).send('Year added Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getAllAcademicYears(req, res) {
        try {
            const years = await academicYearsRepo.getAllAcademicYears();
            res.status(200).json(years);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getOpenForAdmissionYear(req, res) {
        try {
            const openYear = await academicYearsRepo.getOpenForAdmissionYear();
            res.status(200).json(openYear);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new AcademicYearsService();
