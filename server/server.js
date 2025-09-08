import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'


const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
const openAiKey = process.env.OPENAI_API_KEY
const configuration = new Configuration({
    apiKey: openAiKey
})

const openai = new OpenAIApi(configuration)

io.on('connection', (socket) => {
    console.log('New user connected')
socket.on('chat message', async(message) => {
    const userInput = message.userInput
    

    const response = await openai.createChatCompletion({
        model: 'gpt-4.1-nano',
        messages: [
            { role: 'user', content: userInput}
        ]
    })

    const botReply = response.data.choices[0].message.content

    socket.emit('chat message', {
        user: 'bot',
        text: botReply
    })

})
})

server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001')
})