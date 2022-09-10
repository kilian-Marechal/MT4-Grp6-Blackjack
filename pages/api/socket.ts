import { Server } from "socket.io"

const SocketHandler = (req: Request, res: any) => {
  let players: any = {}

  if (res.socket.server.io) {
    console.log('Socket is already running')
    // const io = res.socket.server.io

    // io.on('connection', (socket: any) => {
    //   const total = io.engine.clientsCount;
    //   socket.emit('getCount', total)
    // })
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket: any) => {
      // const total = io.engine.clientsCount;
      // socket.emit('getCount', total)
      
      if(players[socket.id] == undefined) {
        players[socket.id] = {socketID : socket.id,  inputValue : ""};
        io.emit('players', players)
        console.log(players)
      }

      socket.on('disconnect', () => {
        delete players[socket.id]
        io.emit('players', players)
        console.log(players)
      })

      socket.on('input-change', (msg: string) => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler