import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'
import http from 'http';
import {Server} from 'socket.io';
import { getParticipantIdsByConversationId, readMessage } from './repositories/chatRepository';
import { Message } from './models/message/message.types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
}));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join multiple rooms
  socket.on('joinConversations', (conversationIds: number[]) => {
    conversationIds.forEach((id) => {
      socket.join(`conversation-${id}`);
      console.log(`Socket ${socket.id} joined room conversation-${id}`);
    });
  });

  socket.on('sendMessage', async (message: Message) => {
    io.to(`conversation-${message.ConversationId}`).emit('receiveMessage', message);

    const participantIds: number[] | null = await getParticipantIdsByConversationId(message.ConversationId);
    if(participantIds){
      const conversationUpdatePayload = {
        Id: message.ConversationId,
        LastMessage: message.Content,
        LastMessageAt: message.SentAt,
        SenderId: message.SenderId,
        ReadAt: message.ReadAt
      };
      participantIds.forEach((id: number) => {
        io.to(`user-${id}`).emit('conversationUpdated', conversationUpdatePayload);
      });
    }
  });

  socket.on('readMessage', async (message: Message) => {
    const updated: boolean = await readMessage(message.Id);
    if(updated){
      io.to(`user-${message.SenderId}`).emit('messageRead', message.Id);
      const conversationUpdatePayload = {
        Id: message.ConversationId,
        LastMessage: message.Content,
        LastMessageAt: message.SentAt,
        SenderId: message.SenderId,
        ReadAt: message.ReadAt
      }
      io.to(`user-${message.SenderId}`).emit('conversationUpdated', conversationUpdatePayload);
    }
  });

  socket.on('newConversation', async (conversation) => {
    const participantIds = await getParticipantIdsByConversationId(conversation.Id)
    if(participantIds){
      participantIds.forEach((userId: number) => {
        io.to(`user-${userId}`).emit('newConversation', conversation);
      });
    }
  });

  // socket.on('conversationUpdated', (conversation) => {
  //   // Broadcast to all users involved
  //   conversation.participantIds.forEach((userId: number) => {
  //     io.to(`user-${userId}`).emit('conversationUpdated', conversation);
  //   });
  // });

  socket.on('joinUserRoom', (userId: number) => {
    socket.join(`user-${userId}`);
    console.log(`Socket ${socket.id} joined user-${userId} room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const startServer = async () => {
    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    })
}

startServer();

