import AcademicYear from '../models/AcademicYear.js';
import fs from "fs-extra";

class AcademicYearsRepo {
    addAcademicYear(academicYear) {
        return AcademicYear.create(academicYear);
    }

    getAllAcademicYears() {
        return AcademicYear.find({});
    }

    getOpenForAdmissionYear() {
        return AcademicYear.find({openForAdmission: true});
    }

    getAcademicYearsCount() {
        return AcademicYear.countDocuments({});
    }

    async initDB() {
        try {
            let academicYearsCount = await this.getAcademicYearsCount();
            if (academicYearsCount == 0) {
                const academicYears = await this.loadDataFromJsonFile();
                for (let academicYear of academicYears) {
                    await this.addAcademicYear(academicYear);
                }
                academicYearsCount = await this.getAcademicYearsCount();
                console.log('Done initDB for AcademicYearsRepo, Documents Count = ', academicYearsCount);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async loadDataFromJsonFile() {
        return await fs.readJson('./server/data/academicYears.json');
    }
}

export default new AcademicYearsRepo();
