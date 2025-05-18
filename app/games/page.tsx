'use client'

import { useState } from 'react'
import {
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Box,
  Text,
  Badge,
  Stack,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import GameCard from '../components/games/GameCard'
import CreateGameForm from '../components/games/CreateGameForm'
import { FaSearch, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa'

interface Court {
  id: string
  name: string
  address: string
}

interface Team {
  id: string
  name: string
}

interface Game {
  id: string
  title: string
  location: string
  date: string
  time: string
  currentParticipants: number
  maxParticipants: number
  level: string
  status: string
}

function GameCardComponent({ game }: { game: Game }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const statusColors = {
    SCHEDULED: 'blue',
    IN_PROGRESS: 'green',
    COMPLETED: 'gray',
    CANCELLED: 'red',
  }

  return (
    <Box
      p={6}
      bg={bgColor}
      boxShadow="md"
      borderRadius="lg"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
    >
      <Stack spacing={3}>
        <Badge
          colorScheme={statusColors[game.status]}
          alignSelf="flex-start"
        >
          {game.status === 'SCHEDULED' && '예정된 경기'}
          {game.status === 'IN_PROGRESS' && '진행 중'}
          {game.status === 'COMPLETED' && '종료'}
          {game.status === 'CANCELLED' && '취소됨'}
        </Badge>

        <Text fontSize="sm" color="gray.500">
          {format(new Date(game.dateTime), 'PPP EEE p', { locale: ko })}
        </Text>

        <Heading size="md" mb={2}>
          {game.homeTeam.name} vs {game.awayTeam.name}
        </Heading>

        <Text fontSize="sm" color="gray.600">
          {game.court.name}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {game.court.address}
        </Text>

        <Link href={`/games/${game.id}`} passHref>
          <Button as="a" size="sm" colorScheme="blue" variant="outline" mt={2}>
            자세히 보기
          </Button>
        </Link>
      </Stack>
    </Box>
  )
}

export default function GamesPage() {
  const [filter, setFilter] = useState({
    status: '',
  })
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { data: games, isLoading, refetch } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: fetchGames,
  })

  const { data: courts } = useQuery<Court[]>({
    queryKey: ['courts'],
    queryFn: async () => {
      const response = await fetch('/api/courts')
      if (!response.ok) {
        throw new Error('경기장 목록을 불러오는데 실패했습니다.')
      }
      return response.json()
    }
  })

  const filteredGames = games?.filter(game => {
    const matchesStatus = !filter.status || game.status === filter.status
    return matchesStatus
  })

  const handleJoinGame = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('경기 참가 신청에 실패했습니다.')
      }

      toast({
        title: '참가 신청 성공',
        status: 'success',
        duration: 3000,
      })

      refetch()
    } catch (error) {
      toast({
        title: '참가 신청 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text>로딩 중...</Text>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="lg" mb={4}>
              경기 신청하기
            </Heading>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray" />
              </InputLeftElement>
              <Input placeholder="경기 검색하기" />
            </InputGroup>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {games?.map((game) => (
              <Link href={`/games/${game.id}`} key={game.id}>
                <Card
                  height="100%"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Heading size="md" color="blue.500">
                            {game.title}
                          </Heading>
                          <Badge colorScheme="green">
                            {game.status}
                          </Badge>
                        </HStack>
                        <Badge colorScheme="blue" mb={2}>
                          {game.level}
                        </Badge>
                      </Box>

                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <FaMapMarkerAlt color="blue" />
                          <Text>{game.location}</Text>
                        </HStack>
                        <HStack>
                          <FaClock color="blue" />
                          <Text>{`${game.date} ${game.time}`}</Text>
                        </HStack>
                        <HStack>
                          <FaUsers color="blue" />
                          <Text>{`${game.currentParticipants}/${game.maxParticipants}명 참가 중`}</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

async function fetchGames() {
  const response = await fetch('/api/games')
  if (!response.ok) {
    throw new Error('경기 목록을 불러오는데 실패했습니다.')
  }
  return response.json()
} 