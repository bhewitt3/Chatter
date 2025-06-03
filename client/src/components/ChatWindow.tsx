import { useState, useEffect, useRef } from 'react';
import type { ConversationPreview, Message } from '../types/chat';
import { getConversationMessages, saveMessage } from '../api/api_chat';
import type { User } from '../types/user';
import { userById } from '../api/api_user';
import './chatWindow.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import type { ApiResponse } from '../types/api';
import EmptyChatWindow from './EmptyChatWindow';
import { getSocket } from '../utilities/socket';

type ChatWindowProps = {
  conversationId: number | null;
  withUserId: number | null;
  onClose: () => void;
  onCreateConversation: (newConv: ConversationPreview, withUserId: number) => void;
};

const ChatWindow = ({ conversationId, withUserId, onClose, onCreateConversation }: ChatWindowProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [withUser, setWithUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef(getSocket());


  // Fetch messages and withUser info when conversationId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId == null) return;
      const fetchedMessages = await getConversationMessages(conversationId);
      if (fetchedMessages.data) {
        setMessages(fetchedMessages.data);
        fetchedMessages.data.forEach((message: Message) => {
          if (message.SenderId !== user?.Id && !message.ReadAt){
            socket.current.emit('readMessage', message);
          }
        });
      }
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
    if (!conversationId || !socket) return;

    const handleReceiveMessage = (incomingMessage: Message) => {
      if (incomingMessage.ConversationId === conversationId) {
        setMessages((prevMessages) => [incomingMessage, ...prevMessages ]);
        if (incomingMessage.SenderId !== user?.Id){
          socket.current.emit('readMessage', incomingMessage);
        }
      }
    };

    const handleMessageRead = (messageId: number) => {
      setMessages((prevMessages) => 
        prevMessages.map((msg) =>
          msg.Id === messageId ? {...msg, ReadAt: new Date()} : msg)
      );
    };

    socket.current.on('receiveMessage', handleReceiveMessage);
    socket.current.on('messageRead', handleMessageRead);
    return () => {
      socket.current.off('receiveMessage', handleReceiveMessage);
      socket.current.off('messageRead', handleMessageRead);
    }
    
  }, [conversationId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (conversationId && user) {
        const response: ApiResponse<Message> = await saveMessage(conversationId, user.Id, newMessage);
        if (response.type === 'success' && response.data) {
          setNewMessage('');
          socket.current.emit('sendMessage', response.data);
        }
      }
    } catch (err) {
      console.error('Failed to save message.');
    }
  };

  const handleCloseChat = () => {
    setMessages([]);
    setWithUser(null);
    onClose();
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const lastUserMessage = [...messages]
    .filter((msg) => msg.SenderId === user.Id && msg.ReadAt !== null)
    .sort((a, b) => new Date(b.SentAt).getTime() - new Date(a.SentAt).getTime())[0];

  return (
    <div className="chat-container">
      {messages && withUser ? (
        <>
        {/* Top chat window bar */}
          <div className="top-bar bg-secondary d-flex justify-content-between ">
            <div className='d-flex gap-2'>
              <img 
              src={withUser.ProfileImageUrl ? withUser.ProfileImageUrl :"/src/assets/user.png"}
              height={40}
              className='rounded-circle'/>
              <h3>{withUser.DisplayName}</h3>
            </div>
            <div className='d-flex gap-4'>
              <Button>
                <span className="material-symbols-outlined pt-1">
                  call
                </span>
              </Button>
              <Button>
                <span className="material-symbols-outlined pt-1">
                  videocam
                </span>
              </Button>
              <span className="material-symbols-outlined close pt-1" onClick={handleCloseChat}>
                close
              </span>
            </div>
          </div>
          {/* Main messages window */}
          <div className="messages-container">
            <div ref={bottomRef} />
            {messages.map((message) => {
              const isMyMessage = message.SenderId === user.Id;
              const isLastMyMessage = message.Id === lastUserMessage?.Id;
              const isRead = message.ReadAt != null;

              return isMyMessage ? (
                <div className='message-line-wrapper' key={message.Id}>
                  <div className="message-line my-message-line">
                    <div className="message-container my-message-container bg-primary text-light">
                      <p className="message">{message.Content}</p>
                    </div>
                  </div>
                  {isLastMyMessage && isRead && (
                    <p className="read-receipt">
                      read{' '}
                      {new Date(message.ReadAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <div className='message-line-wrapper' key={message.Id}>
                  <div className="message-line with-message-line" key={message.Id}>
                    <div className="message-container with-message-container bg-light">
                      <p className="message">{message.Content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom bar */}
          <div className="message-form-container bg-secondary ">
            <Form className="input-form d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                value={newMessage}
                placeholder="Enter a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <Button type="submit" className="ms-2 send-button">
                <span className="material-symbols-outlined text-light send-message">send</span>
              </Button>
            </Form>
            
          </div>
        </>
      ) : (
        <EmptyChatWindow onCreateConversation={onCreateConversation}/>
      )}
    </div>
  );
};

export default ChatWindow;