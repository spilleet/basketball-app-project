import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: {
        id: params.id,
      },
      include: {
        court: true,
        homeTeam: true,
        awayTeam: true,
        host: true,
      },
    })

    if (!game) {
      return NextResponse.json(
        { error: '경기를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: '경기 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      date,
      startTime,
      endTime,
      skillLevel,
      maxPlayers,
      description,
      requirements,
    } = body

    const updatedGame = await prisma.game.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        skillLevel,
        maxPlayers,
        description,
        requirements,
      },
    })

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: '경기 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}