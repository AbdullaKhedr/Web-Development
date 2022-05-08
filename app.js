import admissionAppsStatusRepo from './server/repository/AdmissionApplicationStatusRepo.js';
import admissionAppsRepo from './server/repository/AdmissionApplicationsRepo.js';
import academicYearsRepo from './server/repository/AcademicYearsRepo.js';
import authRepo from './server/repository/AuthRepo.js';
import router from './server/routes.js';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

mongoose.connect(
    'mongodb://127.0.0.1:27017/sms',
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    async function (err) {
        if (err) {
            console.log("Database connection Failed" + err);
        } else {
            console.log('Database connection Started');
            // init all repos if they are empty
            await admissionAppsStatusRepo.initDB();
            await admissionAppsRepo.initDB();
            await academicYearsRepo.initDB();
            await authRepo.initDB();
            console.log('Database Initialize Done');
        }
    });

const port = 4000;
const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server started @http://localhost:${port}`);
})
