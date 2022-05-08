import User from '../models/User.js';
import fs from "fs-extra";

class AuthRepo {
    registerUser(registrationForm) {
        return User.create(registrationForm);
    }

    updateUser(registrationForm) {
        return User.updateOne({_id: registrationForm._id}, registrationForm);
    }

    getUserByEmail(userEmail) {
        return User.findOne({email: userEmail});
    }

    getUserById(id) {
        return User.findById(id);
    }

    getAllUsers() {
        return User.find({});
    }

    getUsersCount() {
        return User.countDocuments({});
    }

    async initDB() {
        try {
            let usersCount = await this.getUsersCount();
            if (usersCount == 0) {
                const users = await this.loadDataFromJsonFile();
                for (let user of users) {
                    await this.registerUser(user);
                }
                usersCount = await this.getUsersCount();
                console.log('Done initDB for AuthRepo, Documents Count = ', usersCount);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async loadDataFromJsonFile() {
        return await fs.readJson('./server/data/users.json');
    }
}

export default new AuthRepo();
