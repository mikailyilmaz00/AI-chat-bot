import { useState } from "react";
import Message from "./Message";
import ChatInput from "./chatInput"

export default function ChatWindow() {
    const [messages, setMessages] = useState([
        { text: "Hej, jeg er her for at hjælpe dig.👋", role: "ai"}
    ])

const handleSend  = (newMessage) => {
    if (!newMessage.trim()) return;

    const updated = [...messages, { text: newMessage, role: "User"}]
    setMessages(updated);

    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            { text: "AI placeholder svar", role: "ai" }
        ])
    }, 500)
    }

return (
    <div className="chat-window">
        <div className="messages">
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} role={msg.role} />
            ))}
        </div>
        <ChatInput onSend={handleSend} />
    </div>

        )
    }
