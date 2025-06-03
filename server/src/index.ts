import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'
import http from 'http';
import {Server} from 'socket.io';
import { initSocket } from './helpers/socket';

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

initSocket(io);

const startServer = async () => {
    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    })
};

startServer();

