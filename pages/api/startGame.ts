import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {

    res?.socket?.server?.io?.emit("startGame");

    // return message
    res.status(201).json("Game has started");
  }
};
