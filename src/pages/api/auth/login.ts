import type { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  console.log(req.headers);
  return null;
};

export default handler;
