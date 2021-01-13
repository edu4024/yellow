import User from '../../models/User'
import passport from 'passport'
import userPassport from '../../config/passport/userPassport'
userPassport(passport)
import errorHandler from '../../errorHandler/errorHandler'

const checkUser = (email, res) => {
    return User.findOne({
        email: email
    })
        .then(user => {
            return user
        })
        .catch( error => {
            errorHandler(error, res)
        })
}

const checkPass = (user, password, res) => {
    if (!user) {
        errorHandler('Authentication failed. Wrong login.', res)
    } else {
        return user.comparePassword(password)
    }
}

const createUser = (email, password, name, lastName, res) => {
    return User.create({
        email: email,
        password: password,
        name: name,
        lastName: lastName
    })
        .then( user => {
            return user
        })
        .catch( error => {
            errorHandler(error, res)
        })
}

const createToken = (user, res) => {
    if (user) {
        const token = user.generateToken()
        return user
            .updateOne({token: token})
            .then( () => {
                return token
            })
            .catch( error => {
                errorHandler(error, res)
            })
    } else {
        errorHandler('Authentication failed. User not found', res)
    }

}

export default {
    /**
     * Compose all data to result response package
     *
     * @param responseCode - 200 | 400 | 500
     * @param message - any info text message
     * @param data - response data object
     *
     * @return ready object for REST response
     */
    userSingin: async (req, res, callback) => {
        try {
            const { email, password, name, lastName } = req.body
            const checkEmail = await User.checkExistingField('email', email)
            if (checkEmail) {
                callback(
                    {
                        status: 409,
                        success: false
                    }
                )
            }
            const user = await createUser(email, password, name, lastName, res)
            const token = await createToken(user, res)
            await callback({
                status: 200,
                success: true,
                token: token,
                data: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName
                }
            })
        } catch (e) {
            errorHandler(e, res)
        }
    },

    userSingup : async (req, res, callback) => {
        /* eslint-disable */
        try {
            const { email, password } = req.body
            const checkEmail = await User.checkExistingField('email', email) ? true : callback({status:404, success: false})
            const user = await checkUser(email, res)
            const check = await checkPass(user, password, res) ? true: callback({status:400, success: false})
            const token = await createToken(user, res)
            await callback({
                status: 200,
                success: true,
                token: token,
                data: {
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName
                }
            })
        } catch (e) {
            errorHandler(e, res)
        }
    }
}

