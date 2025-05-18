'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Divider,
} from '@chakra-ui/react'
import { FaBasketballBall, FaHistory, FaMedal } from 'react-icons/fa'
import Link from 'next/link'

// 임시 데이터
const mockUserData = {
  name: '김리바운드',
  email: 'rebound@example.com',
  profileImage: 'https://bit.ly/broken-link',
  level: '중급',
  gamesPlayed: 15,
  wins: 10,
}

const mockCurrentGames = [
  {
    id: '1',
    title: '휠체어 친화적인 농구 모임',
    date: '2025년 4월 20일',
    time: '14:00 - 16:00',
    location: '장애인 체육센터 B',
    status: '참가 확정',
  },
  {
    id: '2',
    title: '주말 농구 모임',
    date: '2025년 4월 21일',
    time: '16:00 - 18:00',
    location: '종합운동장 C',
    status: '신청 중',
  },
]

const mockGameHistory = [
  {
    id: '3',
    title: '정기 농구 모임',
    date: '2025년 3월 15일',
    result: '승리',
    score: '21-15',
    mvp: true,
  },
  {
    id: '4',
    title: '친선 경기',
    date: '2025년 3월 10일',
    result: '패배',
    score: '18-21',
    mvp: false,
  },
]

export default function MyPage() {
  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.xl" py={8}>
        {/* 프로필 섹션 */}
        <Card mb={8}>
          <CardBody>
            <HStack spacing={8} align="start">
              <Avatar
                size="2xl"
                name={mockUserData.name}
                src={mockUserData.profileImage}
              />
              <VStack align="start" spacing={4} flex={1}>
                <Box>
                  <Heading size="lg">{mockUserData.name}</Heading>
                  <Text color="gray.600">{mockUserData.email}</Text>
                </Box>
                <HStack spacing={4}>
                  <Badge colorScheme="blue" p={2} borderRadius="md">
                    레벨: {mockUserData.level}
                  </Badge>
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    총 {mockUserData.gamesPlayed}경기
                  </Badge>
                  <Badge colorScheme="purple" p={2} borderRadius="md">
                    {mockUserData.wins}승
                  </Badge>
                </HStack>
                <Link href="/mypage/edit" passHref>
                  <Button colorScheme="blue" size="sm">
                    프로필 수정
                  </Button>
                </Link>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* 탭 섹션 */}
        <Tabs colorScheme="blue" isLazy>
          <TabList mb={4}>
            <Tab>참여 중인 경기</Tab>
            <Tab>경기 이력</Tab>
          </TabList>

          <TabPanels>
            {/* 참여 중인 경기 패널 */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {mockCurrentGames.map((game) => (
                  <Card key={game.id}>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" width="100%">
                          <Heading size="md">{game.title}</Heading>
                          <Badge
                            colorScheme={
                              game.status === '참가 확정' ? 'green' : 'yellow'
                            }
                          >
                            {game.status}
                          </Badge>
                        </HStack>
                        <Text color="gray.600">
                          {game.date} {game.time}
                        </Text>
                        <Text color="gray.600">{game.location}</Text>
                        <Button size="sm" variant="outline" colorScheme="blue">
                          상세 보기
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* 경기 이력 패널 */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {mockGameHistory.map((game) => (
                  <Card key={game.id}>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" width="100%">
                          <Heading size="md">{game.title}</Heading>
                          <Badge
                            colorScheme={game.result === '승리' ? 'green' : 'red'}
                          >
                            {game.result}
                          </Badge>
                        </HStack>
                        <Text color="gray.600">{game.date}</Text>
                        <Text fontWeight="bold">점수: {game.score}</Text>
                        {game.mvp && (
                          <Badge colorScheme="yellow">
                            <HStack spacing={1}>
                              <FaMedal />
                              <Text>MVP</Text>
                            </HStack>
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
} 