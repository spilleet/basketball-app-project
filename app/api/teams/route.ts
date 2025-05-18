import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const teams = await prisma.team.findMany()
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: '팀 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 