import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"


function SpeechInput() {
    const [text, setText] = useState()
    const [username, setUsername] = useState()
    const [message, setMessage] = useState()
    const [recognitionRefef] = useRef()
    const [socketRef] = useRef()
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState()
    }


    useEffect(() => {
        socketRef.current = io()
        socketRef.current.on('chat message', (message) => {
            setMessages((prev) => [...prev, message])
        })
    })