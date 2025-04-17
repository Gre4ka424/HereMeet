import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Stack,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Link,
  Container,
  IconButton
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      borderBottom="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          py={4}
        >
          {/* Логотип */}
          <Flex align="center" mr={5}>
            <Text
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              color="brand.500"
            >
              MeetHere
            </Text>
          </Flex>

          {/* Мобильное меню */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={toggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />

          {/* Навигационные ссылки */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
            width={{ base: 'full', md: 'auto' }}
            alignItems="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
            spacing={{ base: 4, md: 6 }}
          >
            {currentUser && (
              <>
                <Link as={RouterLink} to="/users">Пользователи</Link>
                <Link as={RouterLink} to="/chats">Сообщения</Link>
                <Link as={RouterLink} to="/meetups">Встречи</Link>
                {currentUser.isAdmin && (
                  <Link as={RouterLink} to="/admin">Админ панель</Link>
                )}
              </>
            )}
          </Stack>

          {/* Правая часть - кнопки авторизации или профиль */}
          <Box
            display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
            mt={{ base: 4, md: 0 }}
          >
            {currentUser ? (
              <Menu>
                <MenuButton as={Button} variant="ghost" borderRadius="full">
                  <Flex align="center">
                    <Avatar 
                      size="sm" 
                      name={currentUser.name} 
                      src={currentUser.avatarUrl || ''}
                      mr={2}
                    />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {currentUser.name}
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">Мой профиль</MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Stack direction="row" spacing={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Войти
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                >
                  Регистрация
                </Button>
              </Stack>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 