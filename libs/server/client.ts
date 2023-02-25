import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined
}

const client = global.client || new PrismaClient(); // global.client가 없으면 새로운 클라이언트 생성

if (process.env.NODE_ENV === "development") {
  global.client = client;
}

export default client;