import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

// URL : /api/posts
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // 포스트 작성
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
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
    const {
      query: { latitude, longitude }  // URL의 쿼리 파라미터 정보
    } = req;
    const parsedLatitude = parseFloat(latitude!.toString());
    const parsedLongitude = parseFloat(longitude!.toString());
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
      where: {
        latitude: {
          gte: parsedLatitude - 0.01,  // greater than or equals
          lte: parsedLatitude + 0.01,  // less than or equals
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        }
      }
    });
    console.log('ggg', parsedLatitude, parsedLongitude);
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
