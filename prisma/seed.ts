import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// 데이터베이스에 데이터 생성
async function main() {
  [...Array.from(Array(10).keys())].forEach(async item => {
    await client.stream.create({
      data: {
        name: '엘지 스탠바이미' + String(item),
        description: '이거 진짜 좋음 ㄷㄷ ' + + String(item),
        price: 1000,
        user: {
          connect: {
            id: 1,
          }
        }
      }
    });
    console.log(`${item}/100`);
  });
}

main()
  .catch(e => console.log(e))
  .finally(() => client.$disconnect());