import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

/*
[프로세스]
- 유저가 업로드 시 서버에게 CloudFlare URL 요청
- 서버에서 CloudFlare에게 URL 요청
- CloudFlare가 서버에 URL 전달
- 서버가 유저에게 URL 전달
- 유저는 URL로 파일 업로드

=> (서버를 통해) 토근을 노출시키지 않으면서도 우리 서버에 이미지를 저장할 필요 없는 프로세스
*/

// CloudFlare가 준 빈 URL을 받아 유저에게 전달해줄 핸들러
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  res.json({
    ok: true,
    url: "",
  });

  return res.status(200).end();
}

export default withApiSession(withHandler({
  methods: ["POST"],
  handler,
}));	
