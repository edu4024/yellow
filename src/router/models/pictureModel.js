import User from '../../models/User'
import Picture from '../../models/Picture'
import getToken from '../token'
import errorHandler from '../../errorHandler/errorHandler'
import fs from 'fs'
import moment from 'moment'
moment.locale('ru')

const findUser = (token) => {
    return User.findOne({
        token: token
    })
}

const checkPictures = (user) => {
    return Picture.findOne({
        userId: user._id
    })
}

const createRecord = (check, user, files) => {
    if (check) {
        return updatePicture(check, files)
    } else {
        return Picture
            .create({
                userId: user._id
            })
            .then(result => {
                return updatePicture(result, files)
            })
    }
}

const updatePicture = async (check, files) => {
    let updated
    for (let i = 0; i< files.length; i++) {
        await Picture
            .findOneAndUpdate({
                _id: check._id
            },
            {'$push': {
                img: {
                    name: files[i].filename,
                    link: `${process.env.LINK}/uploads/${files[i].filename}`,
                    contentType: files[i].mimetype
                }
            }
            },
            {'new':true,'useFindAndModify': false})
            .exec()
            .then(result => updated = result)
    }

    return updated
}

const pictureList = (user) => {
    return Picture.findOne({
        userId: user._id
    })
}

const getPictureList = (pictures) => {
    let picturesList = []
    pictures.forEach(pic => {
        let img = fs.readFileSync(`uploads/${pic.name}`)
        return picturesList.push({
            img: img,
            link: pic.link
        })
    })
    return picturesList
}

export default {
    postPicture: async (req, res, callback) => {
        const token = getToken(req.headers)
        const files = req.files
        if  (token) {
            try {
                const user = await findUser(token)
                const check = await checkPictures(user)
                const record = await createRecord(check, user, files)
                await callback({status: 200, success: true, data: record})
            } catch (e) {
                errorHandler(e, res)
            }
        } else {
            return errorHandler('Authentication failed. Wrong token.', res)
        }
    },

    getPicture: async (req, res, callback) => {
        const token = getToken(req.headers)
        if (token) {
            try {
                const user = await findUser(token)
                const pictures = await pictureList(user)
                const picturesList = await getPictureList(pictures.img)
                await callback({status: 200, success: true, token: token, data: picturesList})
            } catch (e) {
                return errorHandler(e, res)
            }
        } else {
            return errorHandler('Authentication failed. Wrong token.', res)
        }
    }
}