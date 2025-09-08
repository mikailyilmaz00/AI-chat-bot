import React, {useState, useEffect, useRef} from "react";
import { io } from "socket.io-client";

function SpeechInput() {
    
    const [text, setText] = useState("")
    const [username, setUsername] = useState("")
    const [messages, setMessages] = useState([])
    const recognitionRef = useRef(null)
    const socketRef = useRef(null)
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState(false)

    
    
    
    
    useEffect(() => {
        socketRef.current = io();
        
        socketRef.current.on("chat message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })


        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US';
        recognition.interimResults = false; 
        
        
        
        const recognitionHandler = (e) => {
            const last = e.results.length - 1;
            const transcript = e.results[last][0].transcript
            setText(transcript);
            
            if (socketRef.current) {
                socketRef.current.emit("chat message", transcript)
            }
        }
        
        recognitionRef.current = recognition;
        recognition.addEventListener("result", recognitionHandler);

        recognition.addEventListener("end", () => {
            setIsListening(false)
        })

        recognition.addEventListener("error", (event) => {
            setIsListening(false)
            setError("There is an issue " + event.error)
        })


    return () => {
        recognition.removeEventListener("result", recognitionHandler) 
        recognitionRef.current = null
        socketRef.current.disconnect()
    }

}, [])

const handleStart = () => {
    if (recognitionRef.current) {
        setIsListening(true)
        setError(null)
        recognitionRef.current.start()
    }
}

const handleSubmit = (e)  => {
    e.preventDefault();

    if (socketRef.current && text.trim() !== "") {
        socketRef.current.emit("chat message", {
            user: username,
            text: text
        });
        setText("")
    }
}

const handleSetUsername = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
        console.log("Username set to:", username)
    }
}

return (
    <>
    {!username ? (
        <div>
        <form onSubmit={handleSetUsername}>
        <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name" 
        />
        <button type="submit">Type your name</button>
        </form>
    </div>
    ) : (
    <div>
        <form onSubmit={handleSubmit}>
        <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or speak here"
    />
    <button  type="submit">Send</button>
    </form>
        

        <button onClick= {handleStart}>Start Talking</button>
 
    {isListening && <p style={{ color: "green" }}>🎤 Listening... </p>}
    {error && <p style= {{ color: "red" }}>{error}</p>}
        <ul>
        {messages.map((message, index) => (
        <li key={index}>
            <strong>{message.user}:</strong> {message.text}
            </li>
        ))}
        </ul>
    </div>

)}
</>
);
}


export default SpeechInput;
