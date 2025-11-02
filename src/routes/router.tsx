import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Protected from '../components/Protected';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CreateGym from '../pages/CreateGym';
import ViewAllGyms from '../pages/ViewAllGyms';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/dashboard',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin']}>
                        <Dashboard />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/gyms/create',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <CreateGym />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/gyms/all',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <ViewAllGyms />
                    </Protected>
                ),
            },
        ],
    },
    // Add more routes here as needed
]);
