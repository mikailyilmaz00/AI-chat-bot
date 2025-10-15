import { text } from "express";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"
import "../"


function SpeechInput() {
    const [text, setText] = useState("")
    const [username, setUsername] = useState("")
    const [messages, setMessages] = useState([])
    const recognitionRef = useRef(null)
    const socketRef = useRef(null)
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState("")
    


    useEffect(() => {
        socketRef.current = io()
        socketRef.current.on('chat message', (message) => {
            setMessages((prev) => [...prev, message])
        })

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition()
    recognition.lang = "da-DK"
    recognition.interimResults = false;


    const recognitionHandler = (e) => {
        const last = e.results.length - 1;
        const transcript = e.results[last][0].transcript
        setText(transcript)

        if (socketRef.current) {
            socketRef.current.emit("chat message", { user: username, text: transcript })
        }
    }


    recognitionRef.current = recognition;
    recognition.addEventListener("result", recognitionHandler)
    recognition.addEventListener("end", () => { setIsListening(false) })
    recognition.addEventListener("error", (event) => { setIsListening(false); setError("Something went wrong " + event.error) })

    return () => {
        recognition.removeEventListener("result", recognitionHandler)
        recognitionRef.current = null
        socketRef.current.disconnect()
    }
    }, [])

const handleStart = () => {
    if (recognitionRef.current) {
        setIsListening(true)
        setError("")
        recognitionRef.current.start()
    }
}

const handleSubmit = (e) => {
    e.preventDefault();
    if (socketRef.current && text.trim() !== "") {
        socketRef.current.emit("chat message", { user: username, text : text })
        setText("")
    }

}

const handleSetUsername = (e) => {
    e.preventDefault()
    if (username.trim() !== "")
        console.log("Username set to:", username)
}
return (
  <div className="chat-container">
    {!username ? (
      <form className="username-form" onSubmit={handleSetUsername}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Indtast dit navn"
        />
        <button type="submit">Vælg brugernavn</button>
      </form>
    ) : (
      <>
        <div className="chat-window">
          <ul className="messages-list">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`message-bubble ${
                  message.user === username ? "user-message" : "ai-message"
                }`}
              >
                <strong>{message.user}:</strong> {message.text}
              </li>
            ))}
          </ul>
        </div>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv en besked..."
          />
          <button type="submit">Send</button>
          <button type="button" onClick={handleStart}>🎤</button>
        </form>

        {isListening && <p className="listening-text">🎧 Lytter...</p>}
        {error && <p className="error-text">{error}</p>}
      </>
    )}
  </div>
);


}
export default SpeechInput;