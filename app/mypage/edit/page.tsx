'use client'

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
  Avatar,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCamera } from 'react-icons/fa'

export default function EditProfile() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '김리바운드',
    email: 'rebound@example.com',
    level: '중급',
    profileImage: 'https://bit.ly/broken-link',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: 이미지 업로드 API 연동
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: API 연동
      await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이

      toast({
        title: '프로필이 업데이트되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/mypage')
    } catch (error) {
      toast({
        title: '프로필 업데이트에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="white">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg">프로필 수정</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* 프로필 이미지 섹션 */}
              <Box position="relative" alignSelf="center">
                <Avatar
                  size="2xl"
                  name={profile.name}
                  src={profile.profileImage}
                />
                <IconButton
                  aria-label="Change profile image"
                  icon={<FaCamera />}
                  size="sm"
                  colorScheme="blue"
                  rounded="full"
                  position="absolute"
                  bottom="0"
                  right="0"
                  onClick={() => document.getElementById('imageInput')?.click()}
                />
                <Input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={handleImageUpload}
                />
              </Box>

              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>이메일</FormLabel>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>레벨</FormLabel>
                <Select
                  value={profile.level}
                  onChange={(e) =>
                    setProfile({ ...profile, level: e.target.value })
                  }
                >
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                  <option value="상급">상급</option>
                </Select>
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                >
                  저장하기
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  )
} 