'use client'

import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function TeamsPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.xl" py={12}>
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={4}>
            팀 관리
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8}>
            함께 할 팀을 찾거나 새로운 팀을 만들어보세요
          </Text>
          <Link href="/teams/create" passHref>
            <Button colorScheme="blue" size="lg">
              새 팀 만들기
            </Button>
          </Link>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {/* 임시 팀 데이터 */}
          <Box
            p={6}
            bg={cardBgColor}
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
          >
            <Heading size="md" mb={2}>
              서울 드래곤즈
            </Heading>
            <Text color="gray.600" mb={4}>
              서울 지역 휠체어 농구팀
            </Text>
            <Text fontSize="sm" mb={2}>
              멤버: 10명
            </Text>
            <Text fontSize="sm">
              활동지역: 서울특별시
            </Text>
          </Box>

          <Box
            p={6}
            bg={cardBgColor}
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
          >
            <Heading size="md" mb={2}>
              부산 타이거즈
            </Heading>
            <Text color="gray.600" mb={4}>
              부산 연합 휠체어 농구팀
            </Text>
            <Text fontSize="sm" mb={2}>
              멤버: 8명
            </Text>
            <Text fontSize="sm">
              활동지역: 부산광역시
            </Text>
          </Box>

          <Box
            p={6}
            bg={cardBgColor}
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
          >
            <Heading size="md" mb={2}>
              대전 이글스
            </Heading>
            <Text color="gray.600" mb={4}>
              대전 지역 휠체어 농구팀
            </Text>
            <Text fontSize="sm" mb={2}>
              멤버: 12명
            </Text>
            <Text fontSize="sm">
              활동지역: 대전광역시
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
} 