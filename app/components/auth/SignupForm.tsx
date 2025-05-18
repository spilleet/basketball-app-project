'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {}
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const name = formData.get('name') as string

    if (!email) newErrors.email = '이메일을 입력해주세요.'
    if (!password) newErrors.password = '비밀번호를 입력해주세요.'
    if (!confirmPassword) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    if (!name) newErrors.name = '이름을 입력해주세요.'
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name'),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '회원가입에 실패했습니다.')
      }

      toast({
        title: '회원가입이 완료되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: '오류가 발생했습니다.',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>이메일</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="example@example.com"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.password}>
          <FormLabel>비밀번호</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="********"
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.confirmPassword}>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="********"
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>이름</FormLabel>
          <Input
            name="name"
            placeholder="홍길동"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="가입 중..."
        >
          회원가입
        </Button>
      </Stack>
    </Box>
  )
} 