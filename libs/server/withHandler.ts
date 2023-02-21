import { NextApiRequest, NextApiResponse } from "next";


export interface ResponseType {
	ok: boolean,
	[key: string]: any;
}


export default function withHandler(
    method:"GET"|"POST"|"DELETE", 
    fn: (req: NextApiRequest, res:NextApiResponse) => void
) {
    // 로직 실행 후 넘겨받은 함수를 실행
    return async function(req: NextApiRequest, res:NextApiResponse) : Promise<any> {
        if (req.method !== method) {
            return res.status(405).end();
        }
        try {
            await fn(req, res)
        } catch(error)  {
            console.log(error);
            return res.status(500).json({ error });
        }
    };

}