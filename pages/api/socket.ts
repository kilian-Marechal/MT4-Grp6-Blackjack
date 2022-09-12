import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  let players: any = {}

  if (res.socket.server.io) {
    console.log('Socket is already running')
    // const io = res.socket.server.io
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO((res.socket.server as any))
    res.socket.server.io = io

    io.on('connection', (socket: any) => {      
      if(players[socket.id] == undefined) {
        players[socket.id] = {socketID : socket.id, draw: false, cards: [], cardsValue: 0, money: 1000, bet: 0};
        io.emit('players', players)
        console.log(players)
      }

      socket.on('disconnect', () => {
        delete players[socket.id]
        io.emit('players', players)
        console.log(players)
      })

      // socket.on('input-change', (msg: string) => {
      //   socket.broadcast.emit('update-input', msg)
      // })
    })
  }
  res.end()
}

export default SocketHandler