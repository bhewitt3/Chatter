import express from 'express'
import { getCurrentUser, loginUser, logout, registerUser, userById } from '../controllers/authController';
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/me').get(getCurrentUser);

router.route('/logout').post(logout);

router.route('/userbyid').post(userById);
export default router;