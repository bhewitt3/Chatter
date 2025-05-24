import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import type { ConversationPreview } from "../types/chat";
import { getConversations } from "../api/api_chat"
import type { ApiResponse } from "../types/api";
import ChatWindow from "../components/ChatWindow";


const Dashboard = () => {
  //All conversations with preview of last message
  const [conversationPreviews, setConversationPreviews] = useState<ConversationPreview[]>([]);
  //ID of the active conversation
  const [activeConversation, setActiveConversation] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversations = async() => {
      const data: ApiResponse<ConversationPreview[]> | undefined = await getConversations();
      console.log(data);
      if (data && data.data) {
        setConversationPreviews(data.data);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="flex">
      <Sidebar 
        conversations={conversationPreviews}
        onSelectConversation={(id) => setActiveConversation(id)}
       />
      <ChatWindow conversationId={activeConversation}/>
    </div>
  )
}

export default Dashboard
