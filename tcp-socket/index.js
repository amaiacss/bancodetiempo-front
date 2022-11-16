const { Socket } = require('socket.io');

const app = require('express')();
const httpServer = require('http').createServer(app);
const opts = { 
    cors: 
    { 
        origins: ['http://localhost:4200']
    } 
}
const io = require('socket.io')(httpServer, opts)

const port = process.env.PORT || 3000;

const users = {}

io.on('connection', socket => {
    // socket.emit es el mensaje que enviamos desde el servidor.
    // 'chat-message' es el nombre que le vamos a dar a esta emisión
    // para llamarlo desde el cliente, deberemos hacer: socket.on('chat-message')
    socket.emit('connection-message', 'Connected') //displays in the client that connects

    socket.on('join', (data) => {
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('user-joined', data.username)
    })

    socket.on('leave', (data) => {
        socket.leave(data.room)
        socket.broadcast.to(data.room).emit('user-leaved', data.username)
    })

    socket.on('message', data => {
        socket.in(data.room).emit('new-message', {username:data.username, text:data.text})
    })

    // socket.on('disconnect', () => {
       
    // })
})

httpServer.listen(port, () => console.log(`listening on port ${port}`));