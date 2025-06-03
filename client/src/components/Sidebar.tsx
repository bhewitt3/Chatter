import type { ConversationPreview } from "../types/chat";
import { ListGroup } from "react-bootstrap";
import { formatDistanceToNow } from 'date-fns';
import { shortenDistance } from "../utilities/DistanceToNow";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import "./sidebar.css";
import { useState } from "react";
import { Form } from "react-bootstrap";

type SidebarProps = {
  conversations: ConversationPreview[];
  onSelectConversation: (conversationId: number, withId: number) => void;
  activeConversationId: number | null;
}


const Sidebar = ({ conversations, onSelectConversation, activeConversationId }: SidebarProps) => {
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const [search, setSearch] = useState("");

  const handleLogout = async() => {
    await logout();
    navigate('/');
  };

 return (
    <div className="sidebar-container bg-secondary" >
      <div className="bg-secondary-dark text-light text-center">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <img
          src="src/assets/logo.png"
          height={60}
          />
          <h2>Chatter</h2>
        </div>
        <div className=" search-new-message bg-secondary ps-3 pe-3">
          <Form className="search-form d-flex" >
            <Form.Control
              type="text"
              value={search}
              placeholder="Search contacts..."
              onChange={(e) => setSearch(e.target.value)}
              className="bg-primary-xxlight border-0 contact-search"
              required
              />
          </Form> 
          {/* <Button className="ms-2">
            <span className="material-symbols-outlined text-light send-message">send</span>
          </Button> */}
        </div>
      </div>
       
      <ListGroup>
        {conversations.length === 0 && (
          <ListGroup.Item className="bg-secondary custom-list-item text-white text-center">No conversations found.</ListGroup.Item>
        )}
        {/* Conversation list */}
        {conversations.map((conv) => {
        const unread = conv.ReadAt == null && conv.SenderId !== user?.Id;
        return (
          <ListGroup.Item 
            key={conv.Id}
            action
            className={`
              custom-list-item
              bg-secondary
              ${activeConversationId !== null && conv.Id === activeConversationId ? 'custom-list-item-active' : ''} 
              ${unread ? 'fw-medium' : ''}
            `}
            onClick={() => onSelectConversation(conv.Id, conv.WithUserId)}
          >
            <div className="d-flex align-items-start gap-2">
              {/* Avatar container */}
              <div>
                <img
                  src={conv.WithUserAvatar ? conv.WithUserAvatar : 'src/assets/user.png'}
                  width={45}
                  height={45}
                  className="rounded-circle mt-2 me-1"
                  alt="avatar"
                />
              </div>

              {/* Text content container */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between name-container">
                  <p className="text-truncate text-light mb-0 fs-5 name-text">{conv.WithUserDisplay}</p>
                  <div className="d-flex">
                    <small className="text-light">
                      {shortenDistance(
                        formatDistanceToNow(new Date(conv.LastMessageAt), {
                          addSuffix: true,
                        })
                      )}
                    </small>
                    {unread && <div className="unread-icon"></div>}
                  </div>
                 
                </div>
                <div
                  className={`text-truncate message-preview ${unread ? 'text-light' : ''}`}
                  style={{ maxWidth: "220px" }}
                >
                  {conv.LastMessage || "No messages yet"}
                </div>
              </div>
            </div>
          </ListGroup.Item>
        )})}
      </ListGroup>
      <div className="profile-tab d-flex justify-content-between bg-secondary-dark">
        <div className="d-flex align-items-center">
          <img src={user?.ProfileImageUrl ? user.ProfileImageUrl : 'src/assets/user.png'} width={45} className="rounded-circle" />
          <p className="text-white m-0 ms-3">{user?.DisplayName}</p>
        </div> 
        <span className="material-symbols-outlined logout" onClick={handleLogout}>logout</span>
      </div>
      
    </div>
  );
};

export default Sidebar
