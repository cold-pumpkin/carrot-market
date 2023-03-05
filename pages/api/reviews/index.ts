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
  } = req;

  const reviews = await client.review.findMany({
    where: { 
      createdForId: Number(user?.id),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          avatar: true,
        }
      }
    }
  });

  res.json({
    ok: true,
    reviews,
  });
	
	return res.status(200).end();
}

export default withApiSession(withHandler({
	methods: ["GET"], 
	handler: handler
}));	
