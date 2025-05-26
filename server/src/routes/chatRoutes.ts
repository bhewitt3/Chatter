import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { conversationsByUser, messagesByConversationId, saveMessage, startConversation } from '../controllers/chatController';
const router = express.Router();


router.route('/new').post(authenticateJWT, startConversation);

router.route('/all').get(authenticateJWT, conversationsByUser);

router.route('/messages').post(authenticateJWT, messagesByConversationId);

router.route('/message').post(authenticateJWT, saveMessage);

export default router;