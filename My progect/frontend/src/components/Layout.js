import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxW="container.xl" py={6} flex="1">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout; 