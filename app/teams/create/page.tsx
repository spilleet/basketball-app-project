'use client'

import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTeamPage() {
  const router = useRouter()
  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: API 연동
      toast({
        title: '팀이 생성되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/teams')
    } catch (error) {
      toast({
        title: '팀 생성에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.md" py={12}>
        <Heading as="h1" size="xl" mb={8}>
          새 팀 만들기
        </Heading>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="lg"
          boxShadow="md"
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>팀 이름</FormLabel>
              <Input placeholder="팀 이름을 입력하세요" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>활동 지역</FormLabel>
              <Input placeholder="주 활동 지역을 입력하세요" />
            </FormControl>

            <FormControl>
              <FormLabel>팀 소개</FormLabel>
              <Textarea
                placeholder="팀을 소개해주세요"
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>연락처</FormLabel>
              <Input placeholder="연락 가능한 번호를 입력하세요" />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
            >
              팀 만들기
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
} 