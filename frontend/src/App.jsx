import { useContext, useEffect } from 'react';
import axios from './util/axios.customize';
import Header1 from './components/layout/header1';
import Footer from './components/layout/footer';

import { Outlet } from 'react-router-dom';
import { AuthContext } from './components/context/auth.context';
import { Spin } from 'antd';

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
    useEffect(() => {
        const fetchAuth = async () => {
            setAppLoading(true);
            const res = await axios.get(`/v1/api/account`);
            if (res && !res.message) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.email,
                        name: res.name,
                        role: res.role,
                        CCCD: res.CCCD,
                        id: res.id,
                    },
                });
            }
            setAppLoading(false);
        };
        fetchAuth();
    }, []);
    return (
        <div>
            {appLoading === true ? (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                    }}
                >
                    <div className="text-center font-bold text-xl">
                        Chờ chút nha ní...
                    </div>
                    <Spin></Spin>
                </div>
            ) : (
                <>
                    {' '}
                    <Header1 />
                    <Outlet />
                    <Footer />
                </>
            )}
        </div>
    );
}

export default App;
