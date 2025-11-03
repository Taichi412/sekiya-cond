import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';
import App from './App';
import Returns from './pages/Returns';
import News from './pages/News';
import Events from './pages/Events';
import Chat from './pages/Chat';
import Me from './pages/Me';
import { queryClient } from './lib/queryClient';
import './i18n';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Returns /> },
      { path: 'news', element: <News /> },
      { path: 'events', element: <Events /> },
      { path: 'chat', element: <Chat /> },
      { path: 'me', element: <Me /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
