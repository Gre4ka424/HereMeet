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
  Heading,
  Text,
  Link,
  VStack,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Некорректный email')
        .required('Email обязателен'),
      password: Yup.string()
        .required('Пароль обязателен')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      
      try {
        await login(values);
        
        toast({
          title: 'Вход выполнен',
          description: 'Вы успешно авторизовались',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        navigate('/users');
      } catch (err) {
        setError(err.response?.data?.message || 'Неверный email или пароль');
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
            Вход в систему
          </Heading>
          
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="start">
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
              
              <Button
                mt={6}
                colorScheme="blue"
                isLoading={isLoading}
                type="submit"
                width="full"
              >
                Войти
              </Button>
            </VStack>
          </form>
          
          <Text>
            Ещё нет аккаунта?{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              Зарегистрироваться
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login; 