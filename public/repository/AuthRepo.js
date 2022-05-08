class AuthRepo {
    async registerUser(registrationForm) {
        let url = `/api/users`;
        const configs = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(registrationForm)
        }
        return await fetch(url, configs);
    }

    async getUserByEmail(userEmail) {
        let url = `/api/users/?email=${userEmail}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getUserById(id) {
        let url = `/api/users?id=${id}`;
        const response = await fetch(url);
        return await response.json();
    }

    async updateUser(registrationForm) {
        let url = `/api/users`;
        const configs = {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(registrationForm)
        }
        return await fetch(url, configs);
    }

    setCurrentUser(email) {
        return localStorage.currentUserEmail = email;
    }

    setCurrentRole(role) {
        return localStorage.currentUserRole = role;
    }

    getCurrentUser() {
        return localStorage.currentUserEmail;
    }

    getCurrentRole() {
        return localStorage.currentUserRole;
    }

    setUpdateUserId(id) {
        return localStorage.updateUserId = id;
    }

    getUpdateUserId() {
        return localStorage.updateUserId;
    }

    removeUpdateUserId() {
        return delete localStorage.updateUserId;
    }

    logOutCurrentUser() {
        return delete localStorage.currentUserEmail && delete localStorage.currentUserRole;
    }
}

export default new AuthRepo();



