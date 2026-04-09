import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Protected from '../components/Protected';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CreateGym from '../pages/CreateGym';
import ViewAllGyms from '../pages/ViewAllGyms';
import ViewAllUsers from '../pages/ViewAllUsers';
import ViewAllConsultants from '../pages/ViewAllConsultants';
import Revenue from '../pages/Revenue';
import CreateUser from '../pages/CreateUser';
import UserExcelUploadPage from '../pages/UserExcelUploadPage';
import WellnessRecord from '../pages/WellnessRecord';
import ConsultantAlerts from '../pages/ConsultantAlerts';

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
    {
        path: '/revenue',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <Revenue />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/user/create',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <CreateUser />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/users/upload',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['superadmin', 'admin']}>
                        <UserExcelUploadPage />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/coordinator/wellness-record',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['coordinator']}>
                        <WellnessRecord />
                    </Protected>
                ),
            },
        ],
    },
    {
        path: '/consultant/alerts',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Protected requiredRole={['consultant']}>
                        <ConsultantAlerts />
                    </Protected>
                ),
            },
        ],
    }
    // Add more routes here as needed
]);
