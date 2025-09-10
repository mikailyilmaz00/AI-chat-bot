import { useState } from "react";
import Message from "./Message";
import chatInput from "./chatInput"
import { text } from "express";

export default function ChatWindow() {
    const [messages, setMessage] = useState([
        { text: "Hej, jeg er din AI-assistent.👋", role: "ai"}
    ])
}
const handleSend  = (newMessage) => {
    if (!newMessage.trim()) return;
    
}