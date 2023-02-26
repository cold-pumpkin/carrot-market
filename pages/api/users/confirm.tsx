import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number,
		}
	}
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
	const { token } = req.body;
  console.log(token);

	const foundToken = await client.token.findUnique({
		where : {
			payload: token,
		},
		include: {
			user: true,		// userId만 리턴하는게 아닌, user 테이블에서 필드들을 조회하여 리턴
		}
	});
	if (!foundToken) {
		return res.status(404).end();
	}

	// 쿠키에 유저ID 담아 암호화
	req.session.user = {
		id: foundToken.userId	
	}
	await req.session.save();

	// 토큰은 한번 사용 후 DB에서 삭제
	await client.token.deleteMany({
		where: {
			userId: foundToken.userId,
		}
	});

  res.json({ ok: true });
}

export default withApiSession(withHandler({
	methods: ["POST"], 
	handler: handler, 
	isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));