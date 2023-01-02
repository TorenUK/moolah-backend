import express from 'express'
import config from '@app/config'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import routes from '@routes/index.route'
import configureMongoose from '@db/configure.mongoose'
import http from 'http'
import {Server} from 'socket.io'
import {handleError} from '@middleware/handle.error'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {cors: {origin: '*'}})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('message', 'hello from moolah backend')
})

io.on('message', (msg) => {
  console.log(msg)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(helmet())
app.use(cors())

app.use('/', routes)

configureMongoose(config.db)

// handle errors
app.use(handleError)

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`)
})
// socket.io server
server.listen(3333)
