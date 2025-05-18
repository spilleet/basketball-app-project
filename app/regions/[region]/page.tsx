'use client'

import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { BsPeople } from 'react-icons/bs'
import { MdLocationOn } from 'react-icons/md'

export default function RegionPage() {
  const params = useParams()
  const region = params.region as string

  const getRegionName = (region: string) => {
    const regionMap: { [key: string]: string } = {
      'gangnam': '서울 강남구',
      'songpa': '서울 송파구',
      'seocho': '서울 서초구',
    }
    return regionMap[region] || region
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
            {getRegionName(region)}
          </Heading>
        </Box>

        <VStack spacing={4} align="stretch">
          <Link href={`/games/create?region=${region}`} passHref>
            <Box
              bg="blue.500"
              p={8}
              borderRadius="2xl"
              cursor="pointer"
              _hover={{ bg: 'blue.600' }}
              color="white"
              position="relative"
              overflow="hidden"
            >
              <Box textAlign="center">
                <Icon as={IoMdAdd} w={10} h={10} mb={4} />
                <Heading size="md" mb={2}>경기 등록하기</Heading>
                <Text>나만의 농구 경기를 만들어보세요</Text>
              </Box>
            </Box>
          </Link>

          <Link href={`/games?region=${region}`} passHref>
            <Box
              bg="blue.500"
              p={8}
              borderRadius="2xl"
              cursor="pointer"
              _hover={{ bg: 'blue.600' }}
              color="white"
              position="relative"
              overflow="hidden"
            >
              <Box textAlign="center">
                <Icon as={BsPeople} w={10} h={10} mb={4} />
                <Heading size="md" mb={2}>경기 신청하기</Heading>
                <Text>열린 농구 경기에 참여해보세요</Text>
              </Box>
            </Box>
          </Link>

          <Link href={`/courts?region=${region}`} passHref>
            <Box
              bg="blue.500"
              p={8}
              borderRadius="2xl"
              cursor="pointer"
              _hover={{ bg: 'blue.600' }}
              color="white"
              position="relative"
              overflow="hidden"
            >
              <Box textAlign="center">
                <Icon as={MdLocationOn} w={10} h={10} mb={4} />
                <Heading size="md" mb={2}>운동장/체육관 정보</Heading>
                <Text>접근성 정보 확인 및 등록하기</Text>
              </Box>
            </Box>
          </Link>
        </VStack>
      </Container>
    </Box>
  )
} 