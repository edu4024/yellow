import mongoose from 'mongoose'
import mongodb from 'mongodb'
const ObjectId =  mongodb.ObjectID
const Schema = mongoose.Schema

const PictureSchema = new Schema({
    img: [{
        name: String,
        link: String,
        contentType: String
    }],
    userId: {
        type: ObjectId,
        required: true
    }
})
/* eslint-disable */
const Picture = mongoose.model('Picture', PictureSchema)
export default mongoose.model('picture', PictureSchema)