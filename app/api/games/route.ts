import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dateTime, courtId, homeTeamId, awayTeamId } = body

    // 시드 데이터에서 생성한 사용자를 찾습니다
    const host = await prisma.user.findFirst({
      where: {
        email: 'user1@example.com'
      }
    })

    if (!host) {
      return NextResponse.json(
        { error: '호스트 사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const game = await prisma.game.create({
      data: {
        dateTime: new Date(dateTime),
        courtId,
        homeTeamId,
        awayTeamId,
        hostId: host.id,
        status: 'SCHEDULED',
      },
      include: {
        court: true,
        homeTeam: true,
        awayTeam: true,
        host: true,
      },
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: '경기 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        court: true,
        homeTeam: true,
        awayTeam: true,
        host: true,
      },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: '경기 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 