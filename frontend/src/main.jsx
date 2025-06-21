import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import '@cloudscape-design/global-styles/index.css';
import ErrorPage from './routes/error-page';
import {
  RT_APPLICATIONS,
  RT_HEALTH,
  RT_HOME,
  RT_INVENTORY_MANAGEMENT,
  RT_TASKS,
  RT_WEALTH,
} from './lib/routes';
import HomePage from './routes/home-page';
import ApplicationsPage from './routes/applications-page';
import WealthPage from './routes/wealth-page';
import HealthPage from './routes/health-page';
import TasksPage from './routes/tasks-page';
import InventoryManagement from './routes/inventory-management';
import './index.css';

const container = document.getElementById('root');

const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: RT_HOME,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: RT_HOME, element: <HomePage /> },
      { path: RT_WEALTH, element: <WealthPage /> },
      { path: RT_HEALTH, element: <HealthPage /> },
      { path: RT_APPLICATIONS, element: <ApplicationsPage /> },
      { path: RT_TASKS, element: <TasksPage /> },
      { path: RT_INVENTORY_MANAGEMENT, element: <InventoryManagement /> },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
