import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/utils/types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const draw = req.body;

    console.log(draw)

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("drawPlayer", draw);

    // return message
    res.status(201).json(draw);
  }
};
