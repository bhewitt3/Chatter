import { Button, Form, ListGroup } from "react-bootstrap";
import React, { useState } from 'react';
import type { ConversationPreview, InitialMessageInput } from "../types/chat";
import type { User } from "../types/user";
import { usersByDisplayName } from "../api/api_user";
import './emptyChatWindow.css'
import { startConversation } from "../api/api_chat";
import { useAuth } from "../context/AuthContext";

type Props = {
  onCreateConversation: (newConv: ConversationPreview, withUserId: number) => void;
}

const EmptyChatWindow = ({ onCreateConversation }: Props) => {
  const initialState: InitialMessageInput = {
    recipientDisplayName: "",
    message: ""
  };
  const [formData, setFormData] = useState<InitialMessageInput>(initialState);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const {user} = useAuth();

  const handleDisplayNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setFormData({...formData, recipientDisplayName: input});

    if(input.length === 0) {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    if(input.length > 0){
      const response = await usersByDisplayName(input);
      const matches = response.data;
      if(matches){
        setSuggestions(matches);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (name: string) => {
    setFormData({...formData, recipientDisplayName: name});
    setShowSuggestions(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if (user){
        const response = await startConversation(
        user?.Id,
        formData.recipientDisplayName,
        formData.message
        );
        if (response.type === 'success' && response.data !== undefined){
          onCreateConversation(response.data, response.data?.WithUserId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="text-center text-light mt-5 w-50 mx-auto">
      <h2>Start a Conversation</h2>
      <Form 
      className="w-50 mx-auto position-relative"
      onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="text-start d-block">Display Name:</Form.Label>
          <Form.Control 
          className="bg-secondary-light text-light placeholder-light"
          type="text"
          value={formData.recipientDisplayName}
          placeholder="Display Name"
          onChange={handleDisplayNameChange}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // small delay to allow click
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          required
          />
          {showSuggestions && suggestions.length > 0 && (
            <ListGroup className="position-absolute w-100 z-1">
              {suggestions.map((suggestion, idx) => (
                <ListGroup.Item
                  key={idx}
                  action
                  onClick={() => handleSuggestionClick(suggestion.DisplayName)}
                  className="bg-secondary text-light">
                    <div className="d-flex justify-content-start gap-3">
                    <img 
                    src={suggestion?.ProfileImageUrl ? suggestion.ProfileImageUrl : 'src/assets/user.png'}
                    width={30}
                    height={30}/>
                    {suggestion.DisplayName}
                    </div>
                  </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label className="text-start d-block mt-2">Message:</Form.Label>
          <Form.Control 
          as="textarea"
          rows={4}
          value={formData.message}
          placeholder="message"
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          className="bg-secondary-light text-light placeholder-light"
          />
        </Form.Group>
        <Button type="submit" className="mt-4">Send message</Button>
      </Form>
    </div>
  )
}

export default EmptyChatWindow
