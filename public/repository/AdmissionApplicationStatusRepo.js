class AdmissionApplicationStatusRepo {
    async addApplicationStatuses(applicationStatuses) {
        let url = `/api/statuses`;
        const configs = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(applicationStatuses)
        }
        return await fetch(url, configs);
    }

    async getAllApplicationStatuses() {
        let url = `/api/statuses`;
        const response = await fetch(url);
        return await response.json();
    }
}

export default new AdmissionApplicationStatusRepo();
