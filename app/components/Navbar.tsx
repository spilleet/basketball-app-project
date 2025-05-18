'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
  Link as ChakraLink,
  useColorMode,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: '경기',
    children: [
      {
        label: '경기 찾기',
        subLabel: '참여할 경기를 찾아보세요',
        href: '/games',
      },
      {
        label: '경기 만들기',
        subLabel: '새로운 경기를 만드세요',
        href: '/games/create',
      },
    ],
  },
  {
    label: '팀',
    children: [
      {
        label: '팀 찾기',
        subLabel: '팀을 찾아보세요',
        href: '/teams',
      },
      {
        label: '팀 만들기',
        subLabel: '새로운 팀을 만드세요',
        href: '/teams/create',
      },
    ],
  },
  {
    label: '경기장',
    href: '/courts',
  },
  {
    label: '커뮤니티',
    href: '/community',
  },
]

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.800')
  const isLoggedIn = true // 임시로 로그인 상태 설정

  return (
    <Box
      bg={bgColor}
      px={4}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link href="/" passHref>
            <ChakraLink
              fontWeight="bold"
              fontSize="lg"
              _hover={{ textDecoration: 'none' }}
            >
              장애인 농구 매칭
            </ChakraLink>
          </Link>

          <Flex alignItems="center">
            <Stack direction="row" spacing={4} alignItems="center">
              <Link href="/games" passHref>
                <Button variant="ghost">경기 신청</Button>
              </Link>
              <Link href="/games/create" passHref>
                <Button variant="ghost">경기 등록</Button>
              </Link>
              <Link href="/courts" passHref>
                <Button variant="ghost">경기장 정보</Button>
              </Link>

              {isLoggedIn ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar size="sm" />
                  </MenuButton>
                  <MenuList>
                    <Link href="/mypage" passHref>
                      <MenuItem icon={<FaUser />}>마이페이지</MenuItem>
                    </Link>
                    <MenuItem onClick={() => {}}>로그아웃</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Link href="/login" passHref>
                    <Button variant="ghost">로그인</Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button colorScheme="blue">회원가입</Button>
                  </Link>
                </>
              )}

              <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </Stack>
          </Flex>
        </Flex>
      </Container>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link href={href || '#'} passHref>
      <Box
        as="a"
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
      >
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'blue.400' }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}
          >
            <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Box>
    </Link>
  )
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Link href={href || '#'} passHref>
        <Box
          py={2}
          as="a"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Box>
      </Link>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} href={child.href || '#'} passHref>
                <Text as="a" py={2}>
                  {child.label}
                </Text>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
} 