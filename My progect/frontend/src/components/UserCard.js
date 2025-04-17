import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Heading,
  Avatar,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');

  const navigateToProfile = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        cursor: 'pointer'
      }}
      onClick={navigateToProfile}
    >
      {/* Аватар */}
      <Box position="relative" height="200px" bg="gray.100">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
          >
            <Avatar
              size="2xl"
              name={user.name}
              bg="brand.500"
              color="white"
            />
          </Box>
        )}
      </Box>

      <Box p={5}>
        <Stack spacing={2}>
          {/* Имя и возраст */}
          <Heading as="h3" size="md">
            {user.name}, {user.age}
          </Heading>

          {/* Пол */}
          <Badge colorScheme={user.gender === 'male' ? 'blue' : 'pink'} alignSelf="flex-start">
            {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}
          </Badge>

          {/* Местоположение */}
          <Stack direction="row" alignItems="center" fontSize="sm" color="gray.500">
            <FaMapMarkerAlt />
            <Text>{user.location}</Text>
          </Stack>

          {/* Краткая биография */}
          {user.bio && (
            <Text
              fontSize="sm"
              color="gray.600"
              noOfLines={2}
              title={user.bio}
            >
              {user.bio}
            </Text>
          )}

          {/* Кнопка просмотра профиля */}
          <Button
            mt={2}
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigateToProfile();
            }}
          >
            Просмотреть профиль
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserCard; 