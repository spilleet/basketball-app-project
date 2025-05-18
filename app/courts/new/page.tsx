'use client'

import { useState } from 'react'
import {
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function NewCourtPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contact: '',
    operatingHours: '',
    price: '',
    courtType: '',
    floorType: '',
    wheelchairAccess: false,
    rampInfo: '',
    elevatorInfo: '',
    toiletInfo: '',
    parkingInfo: '',
    showerInfo: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('경기장 등록에 실패했습니다.')
      }

      toast({
        title: '경기장 등록 성공',
        status: 'success',
        duration: 3000,
      })

      router.push('/courts')
    } catch (error) {
      toast({
        title: '경기장 등록 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
        <Heading>새 경기장 등록</Heading>

        <FormControl isRequired>
          <FormLabel>경기장 이름</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>주소</FormLabel>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>위도</FormLabel>
          <Input
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>경도</FormLabel>
          <Input
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>연락처</FormLabel>
          <Input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>운영 시간</FormLabel>
          <Input
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>이용료</FormLabel>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>경기장 유형</FormLabel>
          <Select
            name="courtType"
            value={formData.courtType}
            onChange={handleChange}
            placeholder="경기장 유형을 선택하세요"
          >
            <option value="실내">실내</option>
            <option value="실외">실외</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>바닥 재질</FormLabel>
          <Input
            name="floorType"
            value={formData.floorType}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">휠체어 접근 가능</FormLabel>
          <Switch
            isChecked={formData.wheelchairAccess}
            onChange={() => handleSwitchChange('wheelchairAccess')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>경사로 정보</FormLabel>
          <Textarea
            name="rampInfo"
            value={formData.rampInfo}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>엘리베이터 정보</FormLabel>
          <Textarea
            name="elevatorInfo"
            value={formData.elevatorInfo}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>화장실 정보</FormLabel>
          <Textarea
            name="toiletInfo"
            value={formData.toiletInfo}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>주차장 정보</FormLabel>
          <Textarea
            name="parkingInfo"
            value={formData.parkingInfo}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>샤워실 정보</FormLabel>
          <Textarea
            name="showerInfo"
            value={formData.showerInfo}
            onChange={handleChange}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          size="lg"
        >
          경기장 등록
        </Button>
      </VStack>
    </Container>
  )
} 