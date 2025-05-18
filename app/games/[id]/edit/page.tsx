'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  IconButton,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

interface Game {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  courtId: string
  skillLevel: string
  maxPlayers: number
  description: string
  requirements: string
}

export default function EditGamePage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [game, setGame] = useState<Game | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    courtId: '',
    skillLevel: '',
    maxPlayers: 10,
    description: '',
    requirements: '',
  })

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${params.id}`)
        if (!response.ok) {
          throw new Error('경기 정보를 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setGame(data)
        setFormData({
          title: data.title,
          date: data.date.split('T')[0],
          startTime: data.startTime.split('T')[1].substring(0, 5),
          endTime: data.endTime.split('T')[1].substring(0, 5),
          courtId: data.courtId,
          skillLevel: data.skillLevel,
          maxPlayers: data.maxPlayers,
          description: data.description || '',
          requirements: data.requirements || '',
        })
      } catch (error) {
        toast({
          title: '오류 발생',
          description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
          status: 'error',
          duration: 3000,
        })
        router.push('/games')
      }
    }

    fetchGame()
  }, [params.id, router, toast])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('경기 수정에 실패했습니다.')
      }

      toast({
        title: '경기 수정 완료',
        status: 'success',
        duration: 3000,
      })

      router.push(`/games/${params.id}`)
    } catch (error) {
      toast({
        title: '경기 수정 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!game) {
    return null
  }

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack spacing={4}>
            <Link href={`/games/${params.id}`} passHref>
              <IconButton
                icon={<FaArrowLeft />}
                aria-label="뒤로 가기"
                variant="ghost"
              />
            </Link>
            <Heading size="lg">경기 수정</Heading>
          </HStack>

          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="sm"
          >
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel>경기 제목</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>날짜</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>시작 시간</FormLabel>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>종료 시간</FormLabel>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>난이도</FormLabel>
                <Select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                >
                  <option value="beginner">입문</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">상급</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>최대 인원</FormLabel>
                <NumberInput
                  min={2}
                  max={20}
                  value={formData.maxPlayers}
                  onChange={(_, value) => handleNumberChange('maxPlayers', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>경기 설명</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>참가 요구사항</FormLabel>
                <Input
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
                w="full"
              >
                수정 완료
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 