import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/AuthWrapper.jsx';
import WritePage from './pages/write.jsx';
import BlogPage from './pages/blog.jsx';
import RoomInfo from './pages/room_info.jsx';
import History from './pages/history.jsx';
import RoomBookingCalendar from './pages/RoomBookingCalendar.jsx';
import HistoryAll from './pages/historyall.jsx';
import Profile from './pages/profile.jsx';
import Violate from './pages/violate.jsx';
import RoomAll from './pages/roomall.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'user',
                element: <UserPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'room',
                element: <RoomInfo />,
            },
            {
                path: 'history',
                element: <History />,
            },
            {
                path: 'historyall',
                element: <HistoryAll />,
            },
            {
                path: 'violate',
                element: <Violate />,
            },
            {
                path: 'room/:roomID',
                element: <RoomInfo />,
            },
            {
                path: 'booking/:roomID',
                element: <RoomBookingCalendar />,
            },
            {
                path: 'profile/:id',
                element: <Profile />,
            },
            {
                path: 'roomall',
                element: <RoomAll />,
            },
        ],
    },

    {
        path: 'write',
        element: <WritePage />,
    },
    {
        path: 'blog',
        element: <BlogPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <AuthWrapper>
        <RouterProvider router={router} />
    </AuthWrapper>
    // </React.StrictMode>
);
