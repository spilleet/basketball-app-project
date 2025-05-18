import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const courts = await prisma.court.findMany()
    return NextResponse.json(courts)
  } catch (error) {
    console.error('Error fetching courts:', error)
    return NextResponse.json(
      { error: '경기장 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 