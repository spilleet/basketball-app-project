const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // 샘플 사용자 생성
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: '홍길동',
      password: 'password123', // 실제 환경에서는 해시된 비밀번호를 사용해야 합니다
      role: 'USER',
    },
  })

  // 샘플 경기장 생성
  const court1 = await prisma.court.create({
    data: {
      name: '올림픽 체육관',
      address: '서울시 송파구 올림픽로 424',
      description: '장애인 농구 전용 코트',
    },
  })

  const court2 = await prisma.court.create({
    data: {
      name: '체육문화회관',
      address: '서울시 강남구 삼성로 123',
      description: '실내 농구장',
    },
  })

  // 샘플 팀 생성
  const team1 = await prisma.team.create({
    data: {
      name: '서울 드래곤즈',
      description: '서울 연합 휠체어 농구팀',
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: '부산 씨걸스',
      description: '부산 연합 휠체어 농구팀',
    },
  })

  console.log('시드 데이터가 성공적으로 생성되었습니다.')
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 중 오류가 발생했습니다:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 