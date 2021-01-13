import mongoose from 'mongoose'
import mongodb from 'mongodb'
const ObjectId =  mongodb.ObjectID
const Schema = mongoose.Schema

const RunningSchema = new Schema({
    distance: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    avSpeed: {
        type: Number,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    }
})
/* eslint-disable */
const Running = mongoose.model('Running', RunningSchema)
export default mongoose.model('running', RunningSchema)