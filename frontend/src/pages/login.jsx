import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { ArrowLeftOutlined } from '@ant-design/icons';

import HCMUTLogo from '../assets/HCMUT.svg.png';

const LoginPage = () => {
    const naviGate = useNavigate();

    const { setAuth } = useContext(AuthContext);
    const onFinish = async (values) => {
        const { email, password } = values;
        try {
            const res = await loginApi(email, password);
            if (res && res.EC === 0) {
                localStorage.setItem(
                    'authData',
                    JSON.stringify({
                        access_token: res.access_token,
                        user: {
                            email: res.user.email,
                            name: res.user.name,
                            role: res.user.role,
                            CCCD: res.user.CCCD,
                            id: res.user.id,
                            SoLanPhat: res.user.SoLanPhat,
                        },
                    })
                );
                notification.success({
                    message: 'LOGIN USER',
                    description: 'success',
                });
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res?.user?.email ?? '',
                        name: res?.user?.name ?? '',
                        role: res?.user?.role ?? '',
                        CCCD: res?.user?.CCCD ?? '',
                        id: res?.user?.id ?? '',
                        SoLanPhat: res?.user?.SoLanPhat ?? '',
                    },
                });
                naviGate('/');
            } else {
                notification.error({
                    message: 'LOGIN USER HAS ERROR',
                    description: res?.EM ?? 'error',
                });
            }
            console.log('Success:', res);
        } catch (error) {
            notification.error({
                message: 'LOGIN USER HAS ERROR',
                description: error?.response?.data?.EM ?? 'error',
            });
        }
        // eslint-disable-next-line no-debugger
        // debugger;
    };

    return (
        <Row justify={'center'} style={{ marginTop: '30px' }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: '15px',
                        margin: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                >
                    <div className="flex justify-center items-center mb-4">
                        <img
                            src={HCMUTLogo}
                            alt="HCMUT Logo"
                            style={{ width: '150px' }}
                        />
                    </div>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item className="text-center">
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={'/'}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        Chưa có tài khoản?{' '}
                        <Link to={'/register'}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default LoginPage;
