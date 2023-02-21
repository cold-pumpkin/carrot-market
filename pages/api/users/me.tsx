import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
	
	return res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("GET", handler), {	// cookieName & password 기반으로 쿠키 가져옴
	cookieName: "carrotsession",
	password: "123312313131123312313131123312313131123312313131123312313131123312313131",
});