import type { ConversationPreview } from "../types/chat";
import { ListGroup } from "react-bootstrap";
import { formatDistanceToNow } from 'date-fns';
import { shortenDistance } from "../utilities/DistanceToNow";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import "./sidebar.css";

type SidebarProps = {
  conversations: ConversationPreview[];
  onSelectConversation: (conversationId: number, withId: number) => void;
}


const Sidebar = ({conversations, onSelectConversation}: SidebarProps) => {
  const navigate = useNavigate();
  const {user, logout} = useAuth();

  const handleLogout = async() => {
    await logout();
    navigate('/');
  }

 return (
    <div className="sidebar-container bg-secondary" >
      <div className="bg-secondary-dark text-light text-center">
        <img
        src="src/assets/ChatterLogo.png"
        height={60}
        />
      </div>
      <ListGroup>
        {conversations.length === 0 && (
          <ListGroup.Item>No conversations found.</ListGroup.Item>
        )}
        {conversations.map((conv) => (
          <ListGroup.Item key={conv.Id} action className="custom-list-item bg-secondary" onClick={() => onSelectConversation(conv.Id, conv.WithUserId)}>
            <div className="d-flex align-items-start gap-2">
              {/* Avatar container */}
              <div>
                <img
                  src="src/assets/user.png"
                  width={35}
                  height={35}
                  className="rounded-circle mt-2 me-1"
                  alt="avatar"
                />
              </div>

              {/* Text content container */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between name-container">
                  <p className="text-truncate text-light  mb-0 fs-5">{conv.WithUserDisplay}</p>
                  <small className="text-light">
                    {shortenDistance(
                      formatDistanceToNow(new Date(conv.LastMessageAt), {
                        addSuffix: true,
                      })
                    )}
                  </small>
                </div>
                <div
                  className="text-truncate message-preview"
                  style={{ maxWidth: "220px" }}
                >
                  {conv.LastMessage || "No messages yet"}
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="profile-tab d-flex justify-content-between bg-secondary-dark">
        <div className="d-flex align-items-center">
          <img src="src/assets/user.png" width={40} />
          <p className="text-white m-0 ms-3">{user?.DisplayName}</p>
        </div> 
        <span className="material-symbols-outlined logout" onClick={handleLogout}>logout</span>
      </div>
      
    </div>
  );
};

export default Sidebar
