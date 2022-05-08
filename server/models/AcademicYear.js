import mongoose from 'mongoose'

const schema = mongoose.Schema;
const options = {toJSON: {virtuals: true}};
const academicYearSchema = new schema(
    {
        year: {
            type: String,
            required: [true, 'Year cannot be empty']
        },
        openForAdmission: {
            type: Boolean,
            default: false
        }
    }, options
);

academicYearSchema.virtual('id').get(function () {
    return this._id
});

const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

export default AcademicYear;
