import { Server } from "socket.io";
import { getParticipantIdsByConversationId, readMessage } from "../repositories/chatRepository";
import { Message } from "../models/message/message.types";

export const initSocket = (io: Server) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
    
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
    
      socket.on('joinUserRoom', (userId: number) => {
        socket.join(`user-${userId}`);
        console.log(`Socket ${socket.id} joined user-${userId} room`);
      });
    
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
};