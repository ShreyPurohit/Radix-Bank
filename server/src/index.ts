import cors from '@koa/cors'
import { createServer } from 'http'
import Koa from 'koa'
import koaBody from 'koa-body'
import { parseCookie } from 'koa-cookies'
import { Server } from 'socket.io'
import connectMongoDb from './lib/connectToDb'
import router from './routes/userRoutes'

const app = new Koa()
connectMongoDb()

const httpServer = createServer(app.callback())
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } })

app.use(koaBody({ multipart: true }))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(parseCookie())

app.use(router.routes()).use(router.allowedMethods())

io.on('connection', socket => {
    console.log("New Connection");
    socket.on('send-notification', (amount, callback) => {
        console.log(amount);

        const socketID = socket.id
        io.to(socketID).emit('notification', `Funds added: ${amount}`)
        callback()
    })
})

httpServer.listen(4000, () => {
    console.log("Server is running on port http://localhost:4000");
}) 