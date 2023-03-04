import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

// URL : /api/posts
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question },
    session: { user },
  } = req;

  // 포스트 작성
  if (req.method === "POST") {
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
  }

  // 전체 포스트 조회
  if (req.method === "GET") {
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            interests: true,
            answers: true,
          }
        }
      },
    });
    
    res.json({
      ok: true,
      posts,
    });
  }

  
	
	return res.status(200).end();
}

export default withApiSession(withHandler({
	methods: ["GET", "POST"], 
	handler, 
	isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));	
