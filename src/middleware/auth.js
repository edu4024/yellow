import jwt from 'jsonwebtoken'
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.auth
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const userId = decodedToken._id
        if (userId) {
            next()
        } else {
            throw 'Invalid user token'
        }
    } catch (e) {
        res.redirect('/signup')
    }
}
export default authenticate