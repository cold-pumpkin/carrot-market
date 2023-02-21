import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
	const { token } = req.body;
  console.log(token);

	const exists = await client.token.findUnique({
		where : {
			payload: token,
		},
		include: {
			user: true,		// userId만 리턴하는게 아닌, user 테이블에서 필드들을 조회하여 리턴
		}
	});
	if (!exists) {
		res.status(404).end();
	}

	// 쿠키에 유저ID 담아 암호화
	req.session.user = {
		id: exists?.userId
	}
	await req.session.save();

	console.log('exists', exists);
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
	password: "123312313131123312313131123312313131123312313131123312313131123312313131"
});