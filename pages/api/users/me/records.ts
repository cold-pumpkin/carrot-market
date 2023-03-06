import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

//=> /api/users/me/records?kind=[Favorite/Purchase/Sale]
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind }
  } = req;
  
  console.log("records", kind);

  const favorites = await client.record.findMany({
    where: {
      userId: user?.id,
      kind: kind as Kind
    },
    include: {
      product: true,
    }
  });

  res.json({
    ok: true,
    favorites,
  });
	
	return res.status(200).end();
}

export default withApiSession(withHandler({
	methods: ["GET"], 
	handler: handler, 
	isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));	
