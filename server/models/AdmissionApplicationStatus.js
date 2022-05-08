import mongoose from 'mongoose'

const schema = mongoose.Schema;
const options = {toJSON: {virtuals: true}};
const applicationStatusSchema = new schema(
    {
        name: {
            type: String,
            required: [true, 'Admission Application Status cannot be empty']
        }
    }, options
);

applicationStatusSchema.virtual('id').get(function () {
    return this._id
});

const AdmissionApplicationStatus = mongoose.model('AdmissionApplicationStatus', applicationStatusSchema);

export default AdmissionApplicationStatus;
