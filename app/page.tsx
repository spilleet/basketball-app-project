'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  Icon,
  Button,
} from '@chakra-ui/react'
import { FaBasketballBall, FaMapMarkedAlt, FaUsers } from 'react-icons/fa'
import Link from 'next/link'

export default function Home() {
  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.xl" py={16}>
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            as="h1"
            size="2xl"
            color="blue.500"
            fontWeight="bold"
          >
            리바운드
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            모두를 위한 농구, 새로운 도약
          </Text>
          <Text fontSize="lg" color="gray.500" maxW="3xl">
            접근성 있는 경기장 정보부터 팀 매칭까지, 
            함께 뛰는 농구를 만듭니다
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Link href="/games/create" passHref>
            <Card
              height="100%"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={FaBasketballBall} w={10} h={10} color="blue.500" />
                  <Heading size="md">경기 등록하기</Heading>
                  <Text color="gray.600">
                    새로운 경기를 만들고 팀원을 모집해보세요
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>

          <Link href="/games" passHref>
            <Card
              height="100%"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={FaUsers} w={10} h={10} color="blue.500" />
                  <Heading size="md">경기 신청하기</Heading>
                  <Text color="gray.600">
                    진행 중인 경기에 참여해보세요
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>

          <Link href="/courts" passHref>
            <Card
              height="100%"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={FaMapMarkedAlt} w={10} h={10} color="blue.500" />
                  <Heading size="md">경기장 정보</Heading>
                  <Text color="gray.600">
                    접근성 좋은 경기장을 찾아보세요
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>
        </SimpleGrid>
      </Container>
    </Box>
  )
} 