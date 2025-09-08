const socket = io()

const input = document.getElementById('userInput')
const sendBtn = document.getElementById('send')
const messagesDiv = document.getElementById('messages')
const toggleFontBtn = document.getElementById('toggleFont')
const toggleSpeechBtn = document.getElementById('toggleSpeech')
const dictationBtn = document.getElementById('dictation')
const toggleLargeTextBtn = document.getElementById('toggleLargeText')
const dyslexicFont = document.getElementById("toggleDyslexicFont")




let speechEnabled = false;


dyslexicFont.addEventListener("click", () => {
  document.body.classList.toggle("dyslexic-font");
});
// Forstør tekst
toggleLargeTextBtn.addEventListener('click', () => {
    document.body.classList.toggle('large')
})

// Skift til læsevenlig font
toggleFontBtn.addEventListener('click', () => {
    document.body.classList.toggle('dyslexic')
})

// Toggle oplæsning
toggleSpeechBtn.addEventListener('click', () => {
    speechEnabled = !speechEnabled;
    alert(speechEnabled ? '🔊 Oplæsning aktiveret' : '🔇 Oplæsning slået fra')
})

// Send besked
sendBtn.addEventListener('click', () => {
    const messageText = input.value
    if (messageText.trim() !== '') {
        socket.emit('chat message', { userInput: messageText })
        addMessage('🧑‍💻 Du', messageText)
        input.value = ''
    }
})

// Lyt til beskeder fra serveren
socket.on('chat message', (data) => {
    addMessage(data.user, data.text)

    if (speechEnabled) {
        const utterance = new SpeechSynthesisUtterance(data.text)
        utterance.lang = 'da-DK'
        speechSynthesis.speak(utterance)
    }
})

// Tilføj besked i chat
function addMessage(sender, text) {
    const msgEl = document.createElement('p')
    msgEl.innerHTML = `<strong>${sender}:</strong> ${text}`
    messagesDiv.appendChild(msgEl)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// Tale-til-tekst knap
dictationBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Talegenkendelse understøttes ikke i din browser.')
        return
    }

    const recognition = new webkitSpeechRecognition()
    recognition.lang = 'da-DK'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        input.value = transcript
    }

    recognition.onerror = (event) => {
        alert('Talegenkendelse fejl: ' + event.error)
    }

    recognition.start()
})
