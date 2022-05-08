class AdmissionApplicationsRepo {
    async addAdmission(admissionApp) {
        let url = `/api/admissions`;
        const configs = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(admissionApp)
        }
        return await fetch(url, configs);
    }

    async getUserAdmissions(userEmail) {
        let url = `/api/admissions?email=${userEmail}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getAdmissionsByAcademicYear(year) {
        let url = `/api/admissions?year=${year}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getAdmissionsByStatus(status) {
        let url = `/api/admissions?status=${status}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getAdmissionsByAcademicYearAndStatus(year, status) {
        let url = `/api/admissions?year=${year}&status=${status}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getAllAdmissions() {
        let url = `/api/admissions`;
        const response = await fetch(url);
        return await response.json();
    }

    async getAdmissionById(id) {
        let url = `/api/admissions?id=${id}`;
        const response = await fetch(url);
        return await response.json();
    }

    async updateAdmission(admissionApp) {
        let url = `/api/admissions`;
        const configs = {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(admissionApp)
        }
        return await fetch(url, configs);
    }

    /**
     * @param index is the index of the attachment in the attachments array in an admission object
     * @param admissionId is the admission id of the admission object to be updated (by deleting the attachment)
     * @returns {Promise<Response>}
     */
    async deleteAttachment(index, admissionId) {
        let url = `/api/admissions/${admissionId}/deleteAttachment/${index}`;
        return await fetch(url, {method: 'DELETE'});
    }

    async getSummaryReport(year) {
        let url;
        if (year)
            url = `/api/admissions/stats?year=${year}`;
        else
            url = `/api/admissions/stats`;
        const response = await fetch(url);
        return await response.json();
    }

    setUpdateAdmissionId(id) {
        return localStorage.updateAdmissionId = id;
    }

    getUpdateAdmissionId() {
        return localStorage.updateAdmissionId;
    }

    removeUpdateAdmissionId() {
        return delete localStorage.updateAdmissionId;
    }
}

export default new AdmissionApplicationsRepo();
