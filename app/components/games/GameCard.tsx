'use client'

import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import { Game, Court } from '@prisma/client'

interface GameCardProps {
  game: Game & {
    court: Court
  }
  onJoin?: (gameId: string) => void
  isParticipant?: boolean
}

export default function GameCard({ game, onJoin, isParticipant }: GameCardProps) {
  const toast = useToast()

  const handleJoin = async () => {
    if (!onJoin) return
    
    try {
      onJoin(game.id)
    } catch (error) {
      toast({
        title: '참가 신청 실패',
        description: '경기 참가 신청에 실패했습니다.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const gameDate = parseISO(game.date.toString())
  const startTime = parseISO(game.startTime.toString())
  const endTime = parseISO(game.endTime.toString())

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      _hover={{ shadow: 'md' }}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Badge colorScheme={game.status === '대기중' ? 'green' : 'blue'}>
            {game.status}
          </Badge>
          <Badge colorScheme="purple">{game.skillLevel}</Badge>
        </HStack>

        <Heading size="md">{game.court.name}</Heading>
        
        <Text color="gray.600">
          {format(gameDate, 'PPP', { locale: ko })}
        </Text>
        
        <Text color="gray.600">
          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
        </Text>

        <HStack justify="space-between">
          <Text>
            참가 인원: {game.currentPlayers}/{game.maxPlayers}명
          </Text>
          {!isParticipant && game.status === '대기중' && (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleJoin}
              isDisabled={game.currentPlayers >= game.maxPlayers}
            >
              참가 신청
            </Button>
          )}
          {isParticipant && (
            <Badge colorScheme="green">참가 신청됨</Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  )
} 