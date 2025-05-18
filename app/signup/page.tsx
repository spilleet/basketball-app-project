'use client'

import {
  Container,
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import SignupForm from '../components/auth/SignupForm'

export default function SignupPage() {
  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mb={2}>회원가입</Heading>
          <Text color="gray.600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" passHref>
              <ChakraLink color="blue.500">로그인하기</ChakraLink>
            </Link>
          </Text>
        </Box>

        <SignupForm />
      </VStack>
    </Container>
  )
} 