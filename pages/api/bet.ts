import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    
    const bet = req.body

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("betPlayer", bet);

    // return message
    res.status(201).json(bet);
  }
};
