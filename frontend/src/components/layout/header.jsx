import { useContext, useState } from 'react';
import {
    HomeOutlined,
    MailOutlined,
    SendOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    console.log('>>>auth   ', auth);
    const items = [
        {
            label: <Link to={'/'}>Home page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/write'}>Write sth for me</Link>,
            key: 'Write',
            icon: <SendOutlined />,
        },

        {
            label: <Link to={'/blog'}>Blog</Link>,
            key: 'Blog',
            icon: <MailOutlined />,
        },
        ...(auth.isAuthenticated
            ? [
                  {
                      label: <Link to={'/user'}>User</Link>,
                      key: 'user',
                      icon: <UsergroupAddOutlined />,
                  },
              ]
            : []),

        {
            label: `Welcome ${auth?.user?.name ?? ''}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated
                    ? [
                          {
                              label: (
                                  <span
                                      onClick={() => {
                                          localStorage.clear('access_token');
                                          setCurrent('home');
                                          navigate('/');
                                          setAuth({
                                              isAuthenticated: false,
                                              user: {
                                                  email: '',
                                                  name: '',
                                                  role: '',
                                              },
                                          });
                                      }}
                                  >
                                      Đăng xuất
                                  </span>
                              ),
                              key: 'logout',
                          },
                      ]
                    : [
                          {
                              label: <Link to={'/login'}>Login</Link>,
                              key: 'login',
                          },
                      ]),
            ],
        },
    ];
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};
export default Header;
