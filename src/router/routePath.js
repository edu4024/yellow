import express from 'express'
import userController from './controllers/userController'
import runningController from './controllers/runningController'
import pictureController from './controllers/pictureController'
import upload from './controllers/uploadController'
import auth from '../middleware/auth'

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
router.post('/record', auth, runningController.runRecord)
router.get('/list', auth, runningController.runList)
router.get('/report', auth, runningController.runReport)
/**
 * picture routes
 *
 * @param responseCode - 200 | 400 | 302
 * @param header.auth - user token
 * @param data - response data array of objects
 *
 */
router.post('/picture', auth, upload.array('files', 5), pictureController.post)
router.get('/picture',auth, pictureController.get)

export default router
