'use client'

import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Stack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaWheelchair, FaParking } from 'react-icons/fa'
import { TbElevator } from 'react-icons/tb'
import { TbStairsUp } from 'react-icons/tb'
import { FaRestroom } from 'react-icons/fa6'
import { useState, useEffect } from 'react'

export default function CourtsPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const courts = [
    {
      id: 1,
      name: '올림픽공원 SK핸드볼경기장',
      address: '서울특별시 송파구 올림픽로 424',
      description: '국제규격의 실내 농구장',
      accessibility: {
        elevator: true,
        ramp: true,
        wheelchairParking: true,
        accessibleRestroom: true,
        wheelchairSeating: true,
      },
      accessibilityDetails: {
        entrance: '주 출입구 경사로 있음 (경사도 1/12)',
        elevator: '주 출입구 옆 엘리베이터 이용 가능',
        parking: '장애인 전용 주차구역 4면',
        restroom: '각 층 장애인 화장실 구비',
        seating: '1층 휠체어 전용 관람석 10석',
      },
    },
    {
      id: 2,
      name: '장충체육관',
      address: '서울특별시 중구 동호로 241',
      description: '역사적인 실내 체육관',
      accessibility: {
        elevator: true,
        ramp: true,
        wheelchairParking: true,
        accessibleRestroom: true,
        wheelchairSeating: true,
      },
      accessibilityDetails: {
        entrance: '정문 경사로 설치 (경사도 1/12)',
        elevator: '좌측 출입구 엘리베이터 있음',
        parking: '장애인 전용 주차구역 3면',
        restroom: '1층, 2층 장애인 화장실',
        seating: '1층 휠체어 전용석 8석',
      },
    },
    {
      id: 3,
      name: '잠실실내체육관',
      address: '서울특별시 송파구 올림픽로 25',
      description: '다목적 실내 체육관',
      accessibility: {
        elevator: true,
        ramp: true,
        wheelchairParking: true,
        accessibleRestroom: true,
        wheelchairSeating: true,
      },
      accessibilityDetails: {
        entrance: '정문 및 후문 경사로 있음 (경사도 1/12)',
        elevator: '중앙 로비 엘리베이터 이용 가능',
        parking: '장애인 전용 주차구역 5면',
        restroom: '각 층 장애인 화장실 완비',
        seating: '1층 휠체어 전용 관람석 12석',
      },
    },
  ]

  if (!isClient) {
    return null
  }

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.xl" py={12}>
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={4}>
            경기장 정보
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8}>
            장애인 접근성 정보가 포함된 경기장 안내
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {courts.map((court) => (
            <Box
              key={court.id}
              bg={cardBgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
            >
              <Stack spacing={4}>
                <Heading size="md">{court.name}</Heading>
                <Text color="gray.600">{court.description}</Text>
                <Text fontSize="sm">{court.address}</Text>

                <Stack direction="row" spacing={2} mb={2}>
                  {court.accessibility.elevator && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                      <Icon as={TbElevator} />
                      엘리베이터
                    </Badge>
                  )}
                  {court.accessibility.ramp && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                      <Icon as={TbStairsUp} />
                      경사로
                    </Badge>
                  )}
                  {court.accessibility.wheelchairParking && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                      <Icon as={FaParking} />
                      장애인 주차
                    </Badge>
                  )}
                  {court.accessibility.accessibleRestroom && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                      <Icon as={FaRestroom} />
                      장애인 화장실
                    </Badge>
                  )}
                  {court.accessibility.wheelchairSeating && (
                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                      <Icon as={FaWheelchair} />
                      휠체어석
                    </Badge>
                  )}
                </Stack>

                <Box bg="gray.50" p={4} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>상세 접근성 정보</Text>
                  <Stack spacing={2}>
                    <Text fontSize="sm">• 출입구: {court.accessibilityDetails.entrance}</Text>
                    <Text fontSize="sm">• 엘리베이터: {court.accessibilityDetails.elevator}</Text>
                    <Text fontSize="sm">• 주차: {court.accessibilityDetails.parking}</Text>
                    <Text fontSize="sm">• 화장실: {court.accessibilityDetails.restroom}</Text>
                    <Text fontSize="sm">• 관람석: {court.accessibilityDetails.seating}</Text>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
} 