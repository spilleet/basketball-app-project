'use client'

import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function CreateGamePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: API 연동
      router.push('/games')
    } catch (error) {
      console.error('경기 등록 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.md" py={8}>
        <Box mb={8} display="flex" alignItems="center" gap={4}>
          <Link href="/" passHref>
            <IconButton
              icon={<FaArrowLeft />}
              aria-label="뒤로 가기"
              variant="ghost"
              color="blue.500"
            />
          </Link>
          <Heading as="h1" size="lg" color="black">
            경기 등록하기
          </Heading>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={8}
          borderRadius="2xl"
          boxShadow="sm"
        >
          <VStack spacing={6} align="stretch">
            {/* 경기장 선택 */}
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
                경기장 선택
              </Text>
              <FormControl isRequired>
                <Select placeholder="장소를 선택하세요">
                  <option value="olympic">올림픽공원 SK핸드볼경기장</option>
                  <option value="jangchung">장충체육관</option>
                  <option value="jamsil">잠실실내체육관</option>
                </Select>
              </FormControl>
            </Box>

            {/* 날짜 및 시간 */}
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
                날짜 및 시간
              </Text>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>날짜</FormLabel>
                  <Input type="date" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>시작 시간</FormLabel>
                  <Input type="time" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>종료 시간</FormLabel>
                  <Input type="time" />
                </FormControl>
              </VStack>
            </Box>

            {/* 참가자 정보 */}
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
                참가자 정보
              </Text>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>필요 인원</FormLabel>
                  <Select>
                    <option value="4">4명</option>
                    <option value="6">6명</option>
                    <option value="8">8명</option>
                    <option value="10">10명</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>난이도</FormLabel>
                  <Select>
                    <option value="beginner">초급</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">상급</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>추가 요구사항</FormLabel>
                  <Input placeholder="휠체어 접근성 등" />
                </FormControl>
              </VStack>
            </Box>

            {/* 경기 설명 */}
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
                경기 설명
              </Text>
              <FormControl>
                <Textarea
                  placeholder="경기에 대한 설명과 참가자에게 전달할 내용을 작성해주세요"
                  rows={4}
                />
              </FormControl>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isLoading}
              w="full"
            >
              경기 등록하기
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
} 