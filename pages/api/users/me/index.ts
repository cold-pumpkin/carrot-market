import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

// /api/users/me
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });

    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId }
    } = req;

    // 기존과 다른 값 입력한 경우만 업데이트
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        }
      }));

      // 중복체크
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 존재하는 이메일입니다!"
        });
      }

      // 이메일 업데이트
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        }
      });

      res.json({ ok: true });
    }

    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        }
      }));

      // 중복체크
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 존재하는 전화번호입니다!"
        });
      }

      // 전화번호 업데이트
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        }
      });
      res.json({ ok: true });
    }

    if (name) {
      // 이름 업데이트
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        }
      });
      res.json({ ok: true });
    }

    if (avatarId) {
      // 프로필 이미지 업데이트
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        }
      });
      res.json({ ok: true });
    }

    // 변경이 일어나지 않은 경우
    res.json({ ok: true });
  }
}

export default withApiSession(withHandler({
  methods: ["GET", "POST"],
  handler: handler,
  isPrivate: true		// true인 경우 로그인 유저만 호출 가능
}));	
