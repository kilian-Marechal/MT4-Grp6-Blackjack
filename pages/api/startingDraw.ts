import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    
    const startingDrawPlayers = req.body

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("startingDraw", startingDrawPlayers);

    // return message
    res.status(201).json(startingDrawPlayers);
  }
};
