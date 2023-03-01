import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question },
    session: { user },
  } = req;

  const post = await client.post.create({
    data: {
      question,
      user: {
        connect: {
          id: user?.id,
        }
      }
    }
  });

  res.json({
    ok: true,
    post,
  });
	
	return res.status(200).end();
}

export default withApiSession(withHandler({
	methods: ["POST"], 
	handler, 
	isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));	