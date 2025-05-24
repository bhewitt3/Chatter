import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { conversationsByUser, messagesByConversationId, startConversation } from '../controllers/chatController';
const router = express.Router();


router.route('/new').post(authenticateJWT, startConversation);

router.route('/all').get(authenticateJWT, conversationsByUser);

router.route('/messages').get(authenticateJWT, messagesByConversationId);

export default router;