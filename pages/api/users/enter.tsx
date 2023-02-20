import twilio from "twilio";
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { prisma } from "@prisma/client";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

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
	const payload = Math.floor(100000 + Math.random() * 900000) + "";	// 6자리 랜덤 숫자
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

	if (phone) {
/* 		const message = await twilioClient.messages.create({
			messagingServiceSid: process.env.TWILIO_MSID,
			to: process.env.MY_PHONE!,	// 메시지 확인을 위해 body의 phone 대신 내 번호 셋팅
			body: `Your login token is ${payload}.`
		});

		console.log("message : ", message); */

	} else if (email) {
		/* const mail = await nodemailer.createTransport({
			service: 'Gmail',
    	auth: { 
				user: process.env.MY_EMAIL, 
				pass: process.env.MY_APP_PW 
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		const mailOptions = {
			to: process.env.MY_EMAIL,
			subject: '[carrot market]가입 인증 메일',
			html: `Your token is <strong>${token}</strong>`,
		}

		const message = await mail.sendMail(mailOptions);
		console.log("message: ", message);
		*/
	}
	
	return res.json({
		ok: true,
	});
}

export default withHandler("POST", handler);