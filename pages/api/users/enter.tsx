import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { prisma } from "@prisma/client";

async function handler(
	req: NextApiRequest, 
	res: NextApiResponse<ResponseType>
) {
	const { email, phone } = req.body;
	const user = phone ? { phone: +phone } : email ? { email } : null;
	if (!user) {
		return res.status(400).json({ ok: false });
	}
	
	// upsert
	/*
	const user = await client.user.upsert({
		where: {
			...payload,
		},	
		create: {
			name: "Anonymous",
			...payload,
		},
		update: {},
	});
	*/
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	const token = await client.token.create({
		data: {
			payload,
			user : {
				connectOrCreate: {
					where: {
						...user,
					},	
					create: {
						name: "Anonymous",
						...user	,
					},
				}
			}
		}
	})

	console.log("token : ", token);

	res.status(200).end();

}

export default withHandler("POST", handler);