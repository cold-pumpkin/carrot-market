import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;
  console.log(req.query);

  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  // releated products 조회
  const terms = product?.name.split(" ").map(word => ({
    name: {
      contains: word,
    }
  }));

  const releatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        }
      }
    },
  })
  
  console.log(releatedProducts);

  res.json({ 
    ok: true, 
    product,
    releatedProducts,
  });
}

export default withApiSession(withHandler({
	methods: ["GET"], 
	handler: handler, 
	isPrivate: true
}));	
