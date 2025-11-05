import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Protected from '../components/Protected';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CreateGym from '../pages/CreateGym';
import ViewAllGyms from '../pages/ViewAllGyms';
import ViewAllUsers from '../pages/ViewAllUsers';
import ViewAllConsultants from '../pages/ViewAllConsultants';

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
                    <Protected requiredRole={['superadmin', 'admin']}>
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
    {
        path: '/users/all',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <ViewAllUsers />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/consultants/all',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <ViewAllConsultants />
                    </Protected>
                ),
            },
        ],
    },
    // Add more routes here as needed
]);
