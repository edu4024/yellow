import express from 'express'
import userController from './controllers/userController'
import runningController from './controllers/runningController'
import pictureController from './controllers/pictureController'
import passport from 'passport'
import upload from './controllers/uploadController'

const router = express.Router()

/**
 * user routes
 *
 * @param responseCode - 200 | 400 | 409
 * @param req.body - user data
 * @parama data - response data object
 */
router.post('/signin', userController.userSingin)
router.post('/signup', userController.userSingup)
/**
 * runing routes
 *
 * @param responseCode - 200 | 400 | 302
 * @param header.auth - user token
 * @param data - response data object
 *
 */
router.post('/record', passport.authenticate('jwt', {failureRedirect: '/signup', session: false}), runningController.runRecord)
router.get('/list', passport.authenticate('jwt', {failureRedirect: '/signup', session: false}),runningController.runList)
router.get('/report', passport.authenticate('jwt', {failureRedirect: '/signup', session: false}), runningController.runReport)
/**
 * picture routes
 *
 * @param responseCode - 200 | 400 | 302
 * @param header.auth - user token
 * @param data - response data array of objects
 *
 */
router.post('/picture', passport.authenticate('jwt', {failureRedirect: '/signup', session: false}), upload.array('files', 5), pictureController.post)
router.get('/picture', passport.authenticate('jwt', {failureRedirect: '/signup', session: false}), pictureController.get)

export default router
