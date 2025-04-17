import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Avatar,
  Badge,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Spinner,
  Center,
  VStack,
  HStack,
  Divider,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  
  // Модальные окна
  const { isOpen: isMessageOpen, onOpen: onMessageOpen, onClose: onMessageClose } = useDisclosure();
  const { isOpen: isMeetupOpen, onOpen: onMeetupOpen, onClose: onMeetupClose } = useDisclosure();

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
        setUser(response.data);
      } catch (error) {
        setError('Ошибка при загрузке профиля пользователя');
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить профиль пользователя',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, toast]);

  // Формик для отправки сообщения
  const messageFormik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Сообщение не может быть пустым').max(500, 'Сообщение слишком длинное')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/messages`, {
          receiverId: parseInt(id),
          content: values.content
        });
        
        toast({
          title: 'Сообщение отправлено',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        resetForm();
        onMessageClose();
        navigate(`/chats/${id}`);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить сообщение',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error('Error sending message:', error);
      }
    }
  });

  // Формик для создания встречи
  const meetupFormik = useFormik({
    initialValues: {
      date: '',
      location: ''
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required('Дата и время обязательны')
        .min(new Date(), 'Дата должна быть в будущем'),
      location: Yup.string().required('Место встречи обязательно').max(200, 'Слишком длинное название места')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/meetups`, {
          receiverId: parseInt(id),
          date: values.date,
          location: values.location
        });
        
        toast({
          title: 'Встреча предложена',
          description: 'Ваше предложение о встрече отправлено',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        resetForm();
        onMeetupClose();
        navigate('/meetups');
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать встречу',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error('Error creating meetup:', error);
      }
    }
  });

  // Обработчик кнопки отправки сообщения
  const handleMessageButton = () => {
    onMessageOpen();
  };

  // Обработчик кнопки назначения встречи
  const handleMeetupButton = () => {
    onMeetupOpen();
  };

  // Обработчик перехода в чат
  const goToChat = () => {
    navigate(`/chats/${id}`);
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error || !user) {
    return (
      <Center py={10}>
        <Text color="red.500">{error || 'Пользователь не найден'}</Text>
      </Center>
    );
  }

  return (
    <Box>
      {/* Профиль пользователя */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        bg="white"
        shadow="md"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Левая колонка с аватаром */}
        <Box
          w={{ base: 'full', md: '300px' }}
          p={6}
          bg="gray.50"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            size="2xl"
            name={user.name}
            src={user.avatarUrl}
            mb={4}
          />
          <Heading as="h2" size="lg" textAlign="center" mb={2}>
            {user.name}, {user.age}
          </Heading>
          <Badge colorScheme={user.gender === 'male' ? 'blue' : 'pink'} fontSize="md" mb={4}>
            {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другой'}
          </Badge>
          <HStack spacing={2} mb={2}>
            <FaMapMarkerAlt />
            <Text>{user.location}</Text>
          </HStack>
        </Box>

        {/* Правая колонка с информацией и кнопками */}
        <Box flex="1" p={6}>
          <VStack align="stretch" spacing={4}>
            <Heading as="h3" size="md">
              О пользователе
            </Heading>
            <Text>{user.bio || 'Информация отсутствует'}</Text>

            <Divider my={4} />

            {/* Кнопки действий */}
            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                leftIcon={<FaEnvelope />}
                onClick={handleMessageButton}
                flex="1"
              >
                Написать сообщение
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<FaCalendarAlt />}
                onClick={handleMeetupButton}
                flex="1"
              >
                Предложить встречу
              </Button>
            </HStack>
            <Button
              variant="outline"
              onClick={goToChat}
              w="full"
            >
              Перейти в чат
            </Button>
          </VStack>
        </Box>
      </Flex>

      {/* Модальное окно для отправки сообщения */}
      <Modal isOpen={isMessageOpen} onClose={onMessageClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={messageFormik.handleSubmit}>
            <ModalHeader>Отправить сообщение {user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={messageFormik.touched.content && messageFormik.errors.content}>
                <FormLabel>Сообщение</FormLabel>
                <Textarea
                  placeholder="Напишите ваше сообщение..."
                  {...messageFormik.getFieldProps('content')}
                />
                <FormErrorMessage>{messageFormik.errors.content}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onMessageClose}>
                Отмена
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={messageFormik.isSubmitting}>
                Отправить
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Модальное окно для создания встречи */}
      <Modal isOpen={isMeetupOpen} onClose={onMeetupClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={meetupFormik.handleSubmit}>
            <ModalHeader>Предложить встречу {user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={meetupFormik.touched.date && meetupFormik.errors.date}>
                  <FormLabel>Дата и время</FormLabel>
                  <Input
                    type="datetime-local"
                    {...meetupFormik.getFieldProps('date')}
                  />
                  <FormErrorMessage>{meetupFormik.errors.date}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={meetupFormik.touched.location && meetupFormik.errors.location}>
                  <FormLabel>Место встречи</FormLabel>
                  <Input
                    placeholder="Например: Кафе 'Встреча', ул. Пушкина, 10"
                    {...meetupFormik.getFieldProps('location')}
                  />
                  <FormErrorMessage>{meetupFormik.errors.location}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onMeetupClose}>
                Отмена
              </Button>
              <Button colorScheme="green" type="submit" isLoading={meetupFormik.isSubmitting}>
                Создать встречу
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfile; 