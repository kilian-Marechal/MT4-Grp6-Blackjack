import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("startGame", true);

    // return message
    res.status(201).json(true);
  }
};
