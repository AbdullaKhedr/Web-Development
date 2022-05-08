class AcademicYearsRepo {
    async addAcademicYear(AcademicYear) {
        let url = `/api/years`;
        const configs = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(AcademicYear)
        }
        return await fetch(url, configs);
    }

    async getAllAcademicYears() {
        let url = `/api/years`;
        const response = await fetch(url);
        return await response.json();
    }

    async getOpenForAdmissionYear() {
        let url = `/api/years/open`;
        const response = await fetch(url);
        return await response.json();
    }
}

export default new AcademicYearsRepo();
