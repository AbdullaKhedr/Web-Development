import authRepo from '../repository/AuthRepo.js';

class AuthService {
    async addUser(req, res) {
        try {
            const user = req.body;
            await authRepo.registerUser(user);
            res.status(201).send('User added Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async updateUser(req, res) {
        try {
            const user = req.body;
            await authRepo.updateUser(user);
            res.status(201).send('User Updated Successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getUsers(req, res) {
        try {
            if (req.query.id) {
                res.status(200).json(await authRepo.getUserById(req.query.id));
            } else if (req.query.email) {
                const user = await authRepo.getUserByEmail(req.query.email);
                res.status(200).json(user);
            } else {
                const users = await authRepo.getAllUsers();
                res.status(200).json(users);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await authRepo.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new AuthService();
