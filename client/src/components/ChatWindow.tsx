import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { getConversationMessages } from '../api/api_chat';
import type { User } from '../types/user';
import { userById } from '../api/api_user';
import './chatWindow.css'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

type ChatWindowProps = {
  conversationId: number | null;
  withUserId: number | null
}

const ChatWindow = ({conversationId, withUserId}: ChatWindowProps) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [withUser, setWithUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if(conversationId == null){
        return;
      }
      const fetchedMessages = await getConversationMessages(conversationId);
      if(fetchedMessages.data){
        setMessages(fetchedMessages.data);
      }
    };

    const fetchWithUser = async () => {
      if(withUserId == null || conversationId == null){
        return;
      }
      const fetchedWithUser = await userById(withUserId);
      if(fetchedWithUser.data){
        console.log(fetchedWithUser.data);
        setWithUser(fetchedWithUser.data);
      }
    }

    fetchMessages();
    fetchWithUser();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  if (!user){
    navigate('/login');
    return;
  }


  return (
    <div className="chat-container bg-secondary-dark">
      {messages && withUser ? (
        <div>
          <div className='top-bar bg-secondary text-white'>
            <img
              src='/src/assets/user.png'
              height={40} />
            <h3>{withUser.DisplayName}</h3>
          </div>
          <div className='messages-container'>
            {messages.length > 0 && messages.map((message) => {
              return message.SenderId == user.Id ?
              (
                <div className=' message-line my-message-line'>
                  <div className=' message-container my-message-container'>
                    <p className='my-message message' key={message.Id}>{message.Content}</p>
                  </div>
                </div>
              ) 
              :
              (
                <div className='with-message-line message-line'>
                  <div className='message-container with-message-container bg-light'>
                    <p className='with-message message' key={message.Id}>{message.Content}</p>
                  </div>
                </div>
              )
            })} 
          </div>
        <div ref={bottomRef} />
      </div>
      ) : (
        <div> no message</div>
      )}
      
    </div>
  )
}

export default ChatWindow
