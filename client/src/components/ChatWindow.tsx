import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { getConversationMessages } from '../api/api_chat';
import type { User } from '../types/user';
import { userById } from '../api/api_user';
import './chatWindow.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Form } from 'react-bootstrap';

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
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    // handle sending message logic here
    console.log('Send message:', newMessage);
    setNewMessage('');
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
            <div ref={bottomRef} />
          </div>

          <div className="message-form-container bg-secondary">
            <Form className='input-form'>
              <Form.Group>
                <Form.Control
                  type="text"
                  value={newMessage}
                  placeholder="Enter a message..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
            <span onClick={handleSubmit} className='material-symbols-outlined text-light send-message'>send</span>
          </div>
        </>
      ) : (
        <div>No messages</div>
      )}
    </div>
  );
};

export default ChatWindow;