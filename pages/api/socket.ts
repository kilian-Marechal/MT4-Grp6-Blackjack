import { Server } from "socket.io"

const SocketHandler = (req: Request, res: any) => {
  let playersID: any = {}

  if (res.socket.server.io) {
    console.log('Socket is already running')
    const io = res.socket.server.io

    io.on('connection', (socket: any) => {
      const total = io.engine.clientsCount;
      socket.emit('getCount', total)
    })
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket: any) => {
      const total = io.engine.clientsCount;
      socket.emit('getCount', total)
      
      if(playersID[socket.id] == undefined) {
        playersID[socket.id] = {socketID : socket.id};
        io.emit('playersID', playersID)
        console.log(playersID)
      }

      socket.on('disconnect', () => {
        delete playersID[socket.id]
        io.emit('playersID', playersID)
        console.log(playersID)
      })
    })
  }
  res.end()
}

export default SocketHandler