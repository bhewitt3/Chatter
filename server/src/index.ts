import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'
import http from 'http';
import {Server} from 'socket.io';

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

  socket.on('joinConversation', ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.conversationId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
});
const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    })
}

startServer();

