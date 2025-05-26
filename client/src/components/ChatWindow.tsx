import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { getConversationMessages, saveMessage } from '../api/api_chat';
import type { User } from '../types/user';
import { userById } from '../api/api_user';
import './chatWindow.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import type { ApiResponse } from '../types/api';
import { io, Socket } from 'socket.io-client';

type ChatWindowProps = {
  conversationId: number | null;
  withUserId: number | null;
};

const ChatWindow = ({ conversationId, withUserId }: ChatWindowProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [withUser, setWithUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch messages and withUser info when conversationId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId == null) return;
      const fetchedMessages = await getConversationMessages(conversationId);
      if (fetchedMessages.data) setMessages(fetchedMessages.data);
    };

    const fetchWithUser = async () => {
      if (withUserId == null || conversationId == null) return;
      const fetchedWithUser = await userById(withUserId);
      if (fetchedWithUser.data) setWithUser(fetchedWithUser.data);
    };

    fetchMessages();
    fetchWithUser();
  }, [conversationId, withUserId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup and manage socket connection for current conversation
  useEffect(() => {
    if (!conversationId) return;

    const socket = io('http://localhost:5000', {
      path: '/socket.io',
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.on('connect', () => {
      console.log("socket connected:", socket.id);
      socket.emit('joinConversation', { conversationId });
    });

    socket.on('receiveMessage', (incomingMessage: Message) => {
      setMessages((prevMessages) => [incomingMessage, ...prevMessages]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [conversationId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (conversationId && user) {
        const response: ApiResponse<Message> = await saveMessage(conversationId, user.Id, newMessage);
        if (response.type === 'success' && response.data) {
          setNewMessage('');
          socketRef.current?.emit('sendMessage', response.data);

        }
      }
    } catch (err) {
      console.error('Failed to save message.');
    }
  };
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="chat-container">
      {messages && withUser ? (
        <>
          <div className="top-bar bg-secondary">
            <img src="/src/assets/user.png" height={40} />
            <h3>{withUser.DisplayName}</h3>
          </div>

          <div className="messages-container">
            <div ref={bottomRef} />
            {messages.map((message) => (
              message.SenderId === user.Id ? (
                <div className="message-line my-message-line" key={message.Id}>
                  <div className="message-container my-message-container">
                    <p className="message">{message.Content}</p>
                  </div>
                </div>
              ) : (
                <div className="message-line with-message-line" key={message.Id}>
                  <div className="message-container with-message-container bg-light">
                    <p className="message">{message.Content}</p>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="message-form-container bg-secondary ">
            <Form className="input-form d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                value={newMessage}
                placeholder="Enter a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <Button type="submit" className="ms-2">
                <span className="material-symbols-outlined text-light send-message">send</span>
              </Button>
            </Form>
            
          </div>
        </>
      ) : (
        <div>No messages</div>
      )}
    </div>
  );
};

export default ChatWindow;