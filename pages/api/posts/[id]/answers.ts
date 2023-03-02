import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req;

  /*
  const post = await client.post.findUnique({
    where: {
      id: Number(id?.toString())
    },
    select: {
      id: true,
    }
  });

  // answer를 저장하기 전에 해당 post가 존재하는지 체크하기
    ( => if (!post) 케이스 시 404 에러 처리할 것!)
  */

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: Number(id?.toString()),
        }
      },
      answer,
    },
  });
  
  res.json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);