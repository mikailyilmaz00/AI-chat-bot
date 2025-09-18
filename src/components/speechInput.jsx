import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"


function SpeechInput() {
    const [text, setText] = useState("")
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [recognitionRefef] = useRef("")
    const [socketRef] = useRef("")
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState("")
    }


    useEffect(() => {
        socketRef.current = io()
        socketRef.current.on('chat message', (message) => {
            setMessages((prev) => [...prev, message])
        })
    })

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition()
    recognition.lang = "da-DK", "en-EN"
    recognition.interimResults = false;


    const recognitionHandler = (e) => {
        const last = e.results.length - 1;
        const transcript = e.results[last][0].transcript
        setText(transcript)

        if (socketRef.current) {
            socketRef.current.emit("", transcript)
        }
    }
    