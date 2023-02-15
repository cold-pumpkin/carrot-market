import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { prisma } from "@prisma/client";

async function handler(
	req: NextApiRequest, res:NextApiResponse
) {
	const { email, phone } = req.body;
	const payload = phone ? { phone: +phone } : { email };
	
	// upsert
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
	
	console.log("user : ", user);

	res.status(200).end();

}

export default withHandler("POST", handler);