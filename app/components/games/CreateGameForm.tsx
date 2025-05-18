'use client'

import { useState } from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { Court } from '@prisma/client'
import { parse, format } from 'date-fns'

interface CreateGameFormProps {
  courts: Court[]
  onSuccess?: () => void
}

export default function CreateGameForm({ courts, onSuccess }: CreateGameFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    courtId: '',
    skillLevel: '',
    maxPlayers: 10,
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const baseDate = parse(formData.date, 'yyyy-MM-dd', new Date())
      const startDateTime = parse(formData.startTime, 'HH:mm', baseDate)
      const endDateTime = parse(formData.endTime, 'HH:mm', baseDate)

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: format(baseDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
          startTime: format(startDateTime, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
          endTime: format(endDateTime, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
        }),
      })

      if (!response.ok) {
        throw new Error('경기 생성에 실패했습니다.')
      }

      toast({
        title: '경기 생성 성공',
        status: 'success',
        duration: 3000,
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: '경기 생성 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
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
        <FormLabel>경기장</FormLabel>
        <Select
          name="courtId"
          value={formData.courtId}
          onChange={handleChange}
          placeholder="경기장을 선택하세요"
        >
          {courts.map(court => (
            <option key={court.id} value={court.id}>
              {court.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>실력 수준</FormLabel>
        <Select
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          placeholder="실력 수준을 선택하세요"
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

      <Button
        type="submit"
        colorScheme="blue"
        isLoading={isLoading}
        mt={4}
      >
        경기 생성
      </Button>
    </VStack>
  )
} 