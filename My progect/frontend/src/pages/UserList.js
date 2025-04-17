import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useDisclosure,
  Collapse,
  Spinner,
  Center,
  Text,
  useToast
} from '@chakra-ui/react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import UserCard from '../components/UserCard';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  // Состояние для фильтров
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    location: ''
  });

  // Загрузка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Создаем параметры запроса из фильтров
      const params = {};
      if (filters.gender) params.gender = filters.gender;
      if (filters.minAge) params.minAge = filters.minAge;
      if (filters.maxAge) params.maxAge = filters.maxAge;
      if (filters.location) params.location = filters.location;
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, { params });
      setUsers(response.data);
    } catch (error) {
      setError('Ошибка при загрузке пользователей');
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка пользователей при монтировании и изменении фильтров
  useEffect(() => {
    fetchUsers();
  }, []); // Только при монтировании

  // Обработчик изменения фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Применение фильтров
  const applyFilters = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      gender: '',
      minAge: '',
      maxAge: '',
      location: ''
    });
    
    // Вызываем загрузку пользователей с пустыми фильтрами
    fetchUsers();
  };

  return (
    <Box>
      {/* Заголовок и кнопка фильтров */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">
          Список пользователей
        </Heading>
        <Button
          leftIcon={<FaFilter />}
          onClick={onToggle}
          colorScheme="blue"
          variant="outline"
        >
          Фильтры
        </Button>
      </Flex>

      {/* Панель фильтров */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          p={5}
          mb={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
        >
          <form onSubmit={applyFilters}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <FormControl>
                <FormLabel>Пол</FormLabel>
                <Select
                  name="gender"
                  placeholder="Все"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другой</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Возраст от</FormLabel>
                <Input
                  name="minAge"
                  type="number"
                  placeholder="Мин. возраст"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Возраст до</FormLabel>
                <Input
                  name="maxAge"
                  type="number"
                  placeholder="Макс. возраст"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Местоположение</FormLabel>
                <Input
                  name="location"
                  placeholder="Например: Москва"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </FormControl>
            </SimpleGrid>

            <Flex mt={4} justifyContent="flex-end">
              <Button variant="ghost" mr={3} onClick={resetFilters}>
                Сбросить
              </Button>
              <Button leftIcon={<FaSearch />} colorScheme="blue" type="submit">
                Применить
              </Button>
            </Flex>
          </form>
        </Box>
      </Collapse>

      {/* Список пользователей */}
      {loading ? (
        <Center py={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : error ? (
        <Center py={10}>
          <Text color="red.500">{error}</Text>
        </Center>
      ) : users.length === 0 ? (
        <Center py={10}>
          <Text>Пользователи не найдены</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default UserList; 