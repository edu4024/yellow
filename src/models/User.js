/* eslint-disable */
import mongoose from 'mongoose'
const Schema = mongoose.Schema
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const saltRounds = 10

const UserSchema = new Schema({
    token: String,
    email: {
        type: String,
        required: true,
        createIndexes: { unique: true }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        this.password = await bcrypt.hash(this.password, salt)
        return next()
    } catch (err) {
        return next(err)
    }
})

UserSchema.methods.comparePassword = async function (data) {
    const match = await bcrypt.compare(data, this.password)
    return match
}

UserSchema.methods.generateToken = function () {
    return jwt.sign(JSON.parse(JSON.stringify(this)), process.env.SECRET, {expiresIn: '7 days'})
}

UserSchema.statics.checkExistingField = async (field, value) => {
    const checkField = await User.findOne({ [`${field}`]: value })
    return checkField
}

const User = mongoose.model('User', UserSchema)
export default mongoose.model('user', UserSchema)