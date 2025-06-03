import Sidebar from "../components/Sidebar"
import { useEffect, useState, useRef } from "react"
import type { ConversationPreview, ConversationUpdatePayload } from "../types/chat";
import { getConversations } from "../api/api_chat"
import type { ApiResponse } from "../types/api";
import ChatWindow from "../components/ChatWindow";
import { getSocket } from "../utilities/socket";
import { useAuth } from "../context/AuthContext";


const Dashboard = () => {
  //All conversations with preview of last message
  const [conversationPreviews, setConversationPreviews] = useState<ConversationPreview[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [withUserId, setWithUserId] = useState<number | null>(null);
  const joinedConversations = useRef<Set<number>>(new Set());
  const socket = useRef(getSocket());
  const activeConversationRef = useRef<number | null>(null);
    const { user } = useAuth();

  //fetch conversations and subscribe to new ones
  useEffect(() => {
    const fetchAndJoin = async () => {
      socket.current.emit("joinUserRoom", user?.Id);
      const data: ApiResponse<ConversationPreview[]> = await getConversations();
      if (data && data.data) {
        setConversationPreviews(data.data);
        const ids: number[] = data.data
          .map((c) => c.Id)
          .filter((id) => !joinedConversations.current.has(id));

        ids.forEach(id => joinedConversations.current.add(id));

        if (ids.length > 0) {
          socket.current.emit("joinConversations", ids);
        }
      }
    };
  fetchAndJoin();

  const handleNewConversation = (newConv: ConversationPreview) => {
    setConversationPreviews((prev) => {
      const exists = prev.some((c) => c.Id === newConv.Id);
      if (!exists) socket.current.emit("joinConversations", [newConv.Id]);
      return exists ? prev : [newConv, ...prev];
    });
  };

  const handleConversationUpdated = (update: ConversationUpdatePayload) => {
    setConversationPreviews((prevConversations) => {
      const updated = prevConversations.map((conv) => {
        const isCurrentlyViewing = 
          activeConversationRef.current === update.Id && update.SenderId !== user?.Id;

        return conv.Id === update.Id
        ? {
            ...conv,
            LastMessage: update.LastMessage,
            LastMessageAt: update.LastMessageAt,
            SenderId: update.SenderId,
            ReadAt: isCurrentlyViewing? new Date(): update.ReadAt,
          }
        : conv
      });
      return updated.sort(
        (a, b) => new Date(b.LastMessageAt).getTime() - new Date(a.LastMessageAt).getTime());
    });
  }

  socket.current.on("newConversation", handleNewConversation);
  socket.current.on("conversationUpdated", handleConversationUpdated);

  return () => {
    socket.current.off("newConversation", handleNewConversation);
    socket.current.off("conversationUpdated", handleConversationUpdated);
  };
}, []);

  const onSelectConversation = (conversationId: number | null, withId: number | null) => {
    setActiveConversation(conversationId);
    activeConversationRef.current = conversationId;
    setWithUserId(withId);

    if (conversationId !== null) {
      setConversationPreviews((prev) => 
        prev.map((conv) => 
          conv.Id === conversationId && conv.ReadAt == null && conv.SenderId !== user?.Id 
          ? {...conv, ReadAt: new Date()}
          : conv
        )
      );
    }
  };

  const handleCloseConversation = () => {
    setActiveConversation(null);
    activeConversationRef.current = null;
    setWithUserId(null);
  };

  const openNewConversation = (newConv: ConversationPreview, withUser: number) => {
    setConversationPreviews((prev) => {
      const exists = prev.some((c) => c.Id === newConv.Id);
      if(!exists){
        socket.current.emit("joinConversations", [newConv.Id]);
        return [newConv, ...prev];
      }
      return prev;
    });
    setActiveConversation(newConv.Id);
    activeConversationRef.current = newConv.Id;
    setWithUserId(withUser);

    socket.current.emit("newConversation", newConv);
  }
  
  return (
    <div className="flex">
      <Sidebar 
        conversations={conversationPreviews}
        onSelectConversation={onSelectConversation}
        activeConversationId={activeConversation}
       />
      <ChatWindow 
        conversationId={activeConversation}
        withUserId={withUserId}
        onClose={handleCloseConversation}
        onCreateConversation={openNewConversation}
      />
    </div>
  )
}

export default Dashboard
