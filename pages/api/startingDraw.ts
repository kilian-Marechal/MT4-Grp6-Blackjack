import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    
    const players = req.body

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("startingDraw", players);

    // return message
    res.status(201).json(players);
  }
};
