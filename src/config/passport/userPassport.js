import jwt from 'passport-jwt'
const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt
import User from '../../models/User'
import { config } from 'dotenv'

config()
function userPassport (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromHeader('auth'),
        secretOrKey: process.env.SECRET,
    }
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User
            .findOne({
                _id: jwt_payload._id
            })
            .then((user) => {
                return done(null, user) })
            .catch((error) => {
                return done(error, false) })
    }))
}
export default userPassport