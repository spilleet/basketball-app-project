import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 400 }
      )
    }

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password, // 실제 환경에서는 비밀번호를 해시화해야 합니다
        name,
        role: 'USER',
      },
    })

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    )
  }
} 