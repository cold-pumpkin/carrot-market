import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;

  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          }
        }
      }
    });

    res.json({
      ok: true,
      stream,
    });
  } else if (req.method === "GET") {
    //const streams = await client.stream.findMany({});  // TODO : pagination 추가
    
    // 무한 스크롤
    const { page } = req.query;
    const offset = 10;

    const streams = await client.stream.findMany({
      take: offset,
      skip: (Number(page) - 1) * offset,
    });

    res.json({
      ok: true,
      streams,
      ...(streams.length === 0 ? { end: true } : {}),
    });
  }
}

export default withApiSession(withHandler({
	methods: ["GET", "POST"], 
	handler: handler
}));	
