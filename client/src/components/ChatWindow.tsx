

const ChatWindow = ({conversationId}: {conversationId: number | null}) => {
  return (
    <div className="text-center">
    <h2>{conversationId}</h2>
    </div>
  )
}

export default ChatWindow
