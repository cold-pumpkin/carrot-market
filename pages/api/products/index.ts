import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { 
    body : { name, price, description },
    session : { user },
  } = req;

  const product = await client.product.create({
    data: {
      name, 
      price: +price,   // 숫자 타입으로 변경
      description,
      image: "XX",
      user: {
        connect: {
          id: user?.id,
        }
      }
    },
  });

  res.json({
    ok: true,
    product,
  });
}

export default withApiSession(withHandler({
	method: "POST", 
	handler: handler, 
	isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));	
