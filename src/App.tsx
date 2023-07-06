import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './navbar/navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Products } from './products/products';
import { Dashboard } from './dashboard/dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className='bgImage'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/products' element={<Products />} />
          </Routes>
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>

  );
}

export default App;
