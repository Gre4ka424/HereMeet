import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Heading,
  Text,
  Link,
  VStack,
  Alert,
  AlertIcon,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      location: '',
      bio: '',
      avatarUrl: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Имя обязательно'),
      email: Yup.string().email('Некорректный email').required('Email обязателен'),
      password: Yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно'),
      age: Yup.number()
        .min(18, 'Должно быть не менее 18 лет')
        .max(100, 'Должно быть не более 100 лет')
        .required('Возраст обязателен')
        .integer('Возраст должен быть целым числом'),
      gender: Yup.string().required('Пол обязателен'),
      location: Yup.string().required('Местоположение обязательно'),
      bio: Yup.string().max(1000, 'Не более 1000 символов'),
      avatarUrl: Yup.string().url('Должен быть корректный URL').notRequired()
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      
      try {
        // Удаляем confirmPassword перед отправкой
        const { confirmPassword, ...userData } = values;
        
        await register(userData);
        
        toast({
          title: 'Регистрация успешна',
          description: 'Добро пожаловать в MeetHere!',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        
        navigate('/users');
      } catch (err) {
        setError(err.response?.data?.message || 'Произошла ошибка при регистрации');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="md">
        <VStack spacing={6}>
          <Heading as="h1" size="xl" textAlign="center">
            Регистрация
          </Heading>
          
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="start">
              {/* Основная информация */}
              <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                <FormLabel>Имя</FormLabel>
                <Input
                  id="name"
                  name="name"
                  {...formik.getFieldProps('name')}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                <FormLabel>Пароль</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}>
                <FormLabel>Подтверждение пароля</FormLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
              </FormControl>
              
              {/* Информация для профиля */}
              <FormControl isInvalid={formik.touched.age && formik.errors.age}>
                <FormLabel>Возраст</FormLabel>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  {...formik.getFieldProps('age')}
                />
                <FormErrorMessage>{formik.errors.age}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.gender && formik.errors.gender}>
                <FormLabel>Пол</FormLabel>
                <Select
                  id="gender"
                  name="gender"
                  placeholder="Выберите пол"
                  {...formik.getFieldProps('gender')}
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другой</option>
                </Select>
                <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.location && formik.errors.location}>
                <FormLabel>Местоположение</FormLabel>
                <Input
                  id="location"
                  name="location"
                  placeholder="Например: Москва"
                  {...formik.getFieldProps('location')}
                />
                <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.bio && formik.errors.bio}>
                <FormLabel>О себе</FormLabel>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Расскажите о себе..."
                  {...formik.getFieldProps('bio')}
                />
                <FormErrorMessage>{formik.errors.bio}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={formik.touched.avatarUrl && formik.errors.avatarUrl}>
                <FormLabel>URL аватара</FormLabel>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  placeholder="https://example.com/avatar.jpg"
                  {...formik.getFieldProps('avatarUrl')}
                />
                <FormErrorMessage>{formik.errors.avatarUrl}</FormErrorMessage>
              </FormControl>
              
              <Button
                mt={6}
                colorScheme="blue"
                isLoading={isLoading}
                type="submit"
                width="full"
              >
                Зарегистрироваться
              </Button>
            </VStack>
          </form>
          
          <Text>
            Уже есть аккаунт?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Войти
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register; 