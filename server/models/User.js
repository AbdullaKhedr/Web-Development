import mongoose from 'mongoose'

const schema = mongoose.Schema;
const options = {toJSON: {virtuals: true}};
const userSchema = new schema(
    {
        email: {
            type: String,
            required: [true, 'Email cannot be empty'],
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password cannot be empty']
        },
        f_fname: String,
        f_lname: String,
        f_id: String,
        f_homephone: String,
        f_mobile: String,
        f_email: String,
        f_occupation: String,
        f_employer: String,

        m_fname: String,
        m_lname: String,
        m_id: String,
        m_homephone: String,
        m_mobile: String,
        m_email: String,
        m_occupation: String,
        m_employer: String,

        role: {
            type: String,
            required: [true, 'Role cannot be empty']
        }
    }, options
);

userSchema.virtual('id').get(function () {
    return this._id
});

const User = mongoose.model('User', userSchema);

export default User;
