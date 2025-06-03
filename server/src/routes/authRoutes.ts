import express from 'express'
import { getCurrentUser, loginUser, logout, registerUser, searchDisplayNames, userById } from '../controllers/authController';
import upload from '../middleware/upload';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.route('/register').post(upload.single('avatar'),registerUser);

router.route('/login').post(loginUser);

router.route('/me').get(getCurrentUser);

router.route('/logout').post(logout);

router.route('/userbyid').post(userById);

router.route('/searchDisplayNames').post(searchDisplayNames);

export default router;