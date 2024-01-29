import { Router } from "express";
import cors from "cors"; // Import cors middleware
import multer from "multer";
const upload = multer();
const router = Router();


router.use(cors());

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js';
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the mail
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app
router.route('/upload').post(upload.single("file"), controller.uploadVideo);

/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/videos').get(controller.fetchVideos);
router.route('/analytics').get(controller.fetchAnalytics);

/** PUT Methods */
router.route('/updateUser').put(Auth, controller.updateUser); // to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // to reset password

router.route('/videos/:username/:videoId').delete(controller.deleteVideo);

export default router;