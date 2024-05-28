import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import '@cloudscape-design/global-styles/index.css';
import ErrorPage from './routes/error-page';
import { RT_APPLICATIONS, RT_HOME, RT_WEALTH } from './lib/routes';
import HomePage from './routes/home-page';
import ApplicationsPage from './routes/applications-page';
import WealthPage from './routes/wealth-page';

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
      { path: RT_APPLICATIONS, element: <ApplicationsPage /> },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
