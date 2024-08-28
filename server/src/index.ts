import cors from '@koa/cors'
import { createServer } from 'http'
import Koa from 'koa'
import koaBody from 'koa-body'
import { parseCookie } from 'koa-cookies'
import { Server } from 'socket.io'
import { addUser, removeUser } from './lib/chatFunctions'
import connectMongoDb from './lib/connectToDb'
import router from './routes/userRoutes'

const app = new Koa()
connectMongoDb()

const httpServer = createServer(app.callback())
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", credentials: true } })

app.use(koaBody({ multipart: true }))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(parseCookie())

app.use(router.routes()).use(router.allowedMethods())

io.on('connection', socket => {

    socket.on('join room', ({ to }) => {
        socket.join(String(to));
    })

    socket.on('reciever-join', ({ reciever, amount }, callback) => {
        socket.join(String(reciever))
        socket.to(String(reciever)).emit('reciever-notification', `Payment received: ${amount}`)
        callback()
    })

    socket.on('personal-join', ({ username, amount }: { username: string, amount: number }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room: username })
        if (error) { return callback(error) }
        socket.join(user?.room!)
        io.to(user?.room!).emit('personal-notification', `Funds added: ${amount}`)
        removeUser(socket.id)
        callback()
    })

    socket.on('disconnect', () => {
        removeUser(socket.id)
    })
})

httpServer.listen(4000, () => {
    console.log("Server is running on port http://localhost:4000");
}) 