'use client'

import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  Divider,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaWheelchair } from 'react-icons/fa'
import Link from 'next/link'

// 임시 데이터
const mockGameDetail = {
  id: '1',
  title: '휠체어 친화적인 농구 모임',
  date: '2025년 4월 20일',
  time: '14:00 - 16:00',
  location: '장애인 체육센터 B',
  address: '서울시 강남구 삼성동 123',
  currentParticipants: 4,
  maxParticipants: 8,
  level: '중급',
  status: '모집중',
  host: {
    id: '1',
    name: '김리바운드',
    level: '상급',
  },
  description: '휠체어 농구를 즐기는 모든 분들을 환영합니다. 함께 즐겁게 운동해요!',
  requirements: '휠체어 접근성 필요',
  facilities: {
    elevator: true,
    ramp: true,
    parking: true,
    toilet: true,
    wheelchairSeats: true,
  },
}

export default function GameDetail() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 현재 사용자가 호스트인지 확인 (임시로 true로 설정)
  const isHost = true

  const handleJoin = async () => {
    setIsLoading(true)
    try {
      // TODO: API 연동
      await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이

      toast({
        title: '참가 신청이 완료되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/mypage')
    } catch (error) {
      toast({
        title: '참가 신청에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* 헤더 섹션 */}
          <HStack spacing={4} justify="space-between">
            <HStack spacing={4}>
              <IconButton
                icon={<FaArrowLeft />}
                aria-label="뒤로 가기"
                variant="ghost"
                onClick={() => router.back()}
              />
              <Heading size="lg">경기 상세 정보</Heading>
            </HStack>
            {isHost && (
              <Link href={`/games/${mockGameDetail.id}/edit`} passHref>
                <Button colorScheme="blue" variant="outline">
                  경기 수정
                </Button>
              </Link>
            )}
          </HStack>

          {/* 메인 정보 카드 */}
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="lg">{mockGameDetail.title}</Heading>
                  <Badge
                    colorScheme={mockGameDetail.status === '모집중' ? 'green' : 'red'}
                    p={2}
                    borderRadius="md"
                  >
                    {mockGameDetail.status}
                  </Badge>
                </HStack>

                <Divider />

                <VStack spacing={4} align="stretch">
                  <HStack>
                    <FaClock />
                    <Text fontWeight="bold">일시:</Text>
                    <Text>{mockGameDetail.date} {mockGameDetail.time}</Text>
                  </HStack>

                  <HStack>
                    <FaMapMarkerAlt />
                    <Text fontWeight="bold">장소:</Text>
                    <Text>{mockGameDetail.location}</Text>
                  </HStack>

                  <HStack>
                    <FaUsers />
                    <Text fontWeight="bold">참가 인원:</Text>
                    <Text>
                      {mockGameDetail.currentParticipants}/{mockGameDetail.maxParticipants}명
                    </Text>
                  </HStack>

                  <HStack>
                    <FaWheelchair />
                    <Text fontWeight="bold">난이도:</Text>
                    <Badge colorScheme="blue">{mockGameDetail.level}</Badge>
                  </HStack>
                </VStack>

                <Divider />

                <Box>
                  <Text fontWeight="bold" mb={2}>주최자 정보</Text>
                  <HStack>
                    <Text>{mockGameDetail.host.name}</Text>
                    <Badge colorScheme="purple">{mockGameDetail.host.level}</Badge>
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>경기 설명</Text>
                  <Text>{mockGameDetail.description}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>시설 정보</Text>
                  <HStack spacing={4} wrap="wrap">
                    {mockGameDetail.facilities.elevator && (
                      <Badge colorScheme="green">엘리베이터</Badge>
                    )}
                    {mockGameDetail.facilities.ramp && (
                      <Badge colorScheme="green">경사로</Badge>
                    )}
                    {mockGameDetail.facilities.parking && (
                      <Badge colorScheme="green">장애인 주차장</Badge>
                    )}
                    {mockGameDetail.facilities.toilet && (
                      <Badge colorScheme="green">장애인 화장실</Badge>
                    )}
                    {mockGameDetail.facilities.wheelchairSeats && (
                      <Badge colorScheme="green">휠체어석</Badge>
                    )}
                  </HStack>
                </Box>

                <Divider />

                <HStack justify="flex-end" spacing={4}>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    목록으로
                  </Button>
                  {!isHost && (
                    <Button
                      colorScheme="blue"
                      onClick={handleJoin}
                      isLoading={isLoading}
                    >
                      참가 신청하기
                    </Button>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
} 