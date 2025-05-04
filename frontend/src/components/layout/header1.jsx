import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HistoryOutlined,
    RobotFilled,
    SettingOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { AuthContext } from '../context/auth.context';
import HCMUTLogo from '../../assets/HCMUT.svg.png';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');

    const handleLogout = () => {
        console.log('use logout');
        localStorage.clear('access_token');
        setAuth({
            isAuthenticated: false,
            user: { email: '', name: '', role: '', CCCD: '', id: '' },
        });
        setCurrent('home');
        navigate('/');
    };

    console.log('auth.user.role', auth, auth.user.role, auth.user.CCCD);

    const menuItems = [
        ...(auth.isAuthenticated && auth.user.role === 'admin'
            ? [
                  {
                      label: <Link to={'/user'}>Quản lí người dùng</Link>,
                      key: 'user',
                      icon: <UsergroupAddOutlined />,
                  },
                  {
                      label: <Link to={'/roomall'}>Quản lí phòng</Link>,
                      key: 'roomall',
                      icon: <RobotFilled />,
                  },
                  {
                      label: <Link to={'/historyall'}>Lịch sử đặt phòng</Link>,
                      key: 'historyall',
                      icon: <HistoryOutlined />,
                  },
                //   {
                //       label: <Link to={'/violate'}>Lịch sử vi phạm</Link>,
                //       key: 'violate',
                //       icon: <HistoryOutlined />,
                //   },
                  {
                      label: `Welcome ${auth?.user?.name ?? ''}`,
                      key: 'SubMenu',
                      icon: <SettingOutlined />,
                      children: [
                          {
                              label: (
                                  <Link to={`/profile/${auth.user.id}`}>
                                      Profile
                                  </Link>
                              ),
                              key: 'profile',
                          },
                          {
                              label: (
                                  <span onClick={handleLogout}>Đăng xuất</span>
                              ),
                              key: 'logout',
                          },
                      ],
                  },
              ]
            : auth.isAuthenticated &&
              (auth.user.role === 'student' || auth.user.role === 'lecture')
            ? [
                  {
                      label: <Link to={'/history'}>Lịch sử đặt phòng</Link>,
                      key: 'history',
                      icon: <HistoryOutlined />,
                  },
                  {
                      label: `Welcome ${auth?.user?.name ?? ''}`,
                      key: 'SubMenu',
                      icon: <SettingOutlined />,
                      children: [
                          {
                              label: (
                                  <Link to={`/profile/${auth.user.id}`}>
                                      Profile
                                  </Link>
                              ),
                              key: 'profile',
                          },
                          {
                              label: (
                                  <span onClick={handleLogout}>Đăng xuất</span>
                              ),
                              key: 'logout',
                          },
                      ],
                  },
              ]
            : [
                  {
                      label: 'Tài khoản',
                      key: 'SubMenu',
                      icon: <SettingOutlined />,
                      children: [
                          {
                              label: <Link to={'/login'}>Đăng nhập</Link>,
                              key: 'login',
                          },
                          {
                              label: (
                                  <Link to={'/register'}>Tạo tài khoản</Link>
                              ),
                              key: 'register',
                          },
                      ],
                  },
              ]),
    ];

    return (
        <div className="flex justify-between items-center  bg-white px-6 py-2 shadow-sm sticky top-0 z-10">
            <Link to="/" className="flex items-center gap-3 no-underline">
                <img
                    src={HCMUTLogo}
                    alt="HCMUT"
                    className="w-[60px] h-auto object-contain"
                />
                <div className="hidden md:block leading-tight">
                    <div className="text-sm text-blue-600 font-medium">
                        ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
                    </div>
                    <div className="text-xl text-blue-900 font-bold">
                        TRƯỜNG ĐẠI HỌC BÁCH KHOA
                    </div>
                </div>
            </Link>

            <Menu
                mode="horizontal"
                selectedKeys={[current]}
                onClick={(e) => setCurrent(e.key)}
                items={menuItems}
                style={{ minWidth: '150px', width: 'auto' }}
            />
        </div>
    );
};

export default Header;
