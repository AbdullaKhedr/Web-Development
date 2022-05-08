import mongoose from 'mongoose'

const schema = mongoose.Schema;
const options = {toJSON: {virtuals: true}};
const applicationSchema = new schema(
    {
        fName: {
            type: String,
            required: [true, 'First name cannot be empty']
        },
        lName: {
            type: String,
            required: [true, 'Last name cannot be empty']
        },
        DOB: {
            type: String,
            required: [true, 'Date of Birth cannot be empty']
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Gender cannot be empty']
        },
        currentSchoolName: String,
        currentSchoolGrade: Number,
        applySchoolGrade: Number,
        message: String,
        author: {
            type: String,
            required: [true, 'Author cannot be empty']
        },
        creationDate: {
            type: Date,
            default: Date.now
            // type: String,
            // default: new Date().toISOString().split('T')[0]
        },
        status: String,
        forAcademicYear: String,
        notes: Array,
        attachments: Array,
        testResults: Array
    }, options
);

applicationSchema.virtual('id').get(function () {
    return this._id
});

const AdmissionApplication = mongoose.model('AdmissionApplication', applicationSchema);

export default AdmissionApplication;
