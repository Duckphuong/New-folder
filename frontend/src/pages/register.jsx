import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    notification,
    Row,
    DatePicker,
    message,
} from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import HCMUTLogo from '../assets/HCMUT.svg.png';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
dayjs.extend(utc);
const RegisterPage = () => {
    const naviGate = useNavigate();
    const onFinish = async (values) => {
        const { name, email, password, LName, FName, CCCD, BDate } = values;
        const Date = dayjs(BDate).format('YYYY-MM-DD');

        console.log({ ...values, Date });
        try {
            const res = await createUserApi(
                name,
                email,
                password,
                LName,
                FName,
                CCCD,
                Date
            );

            console.log('API Response:', res);

            if (res.status === 200) {
                notification.success({
                    message: 'CREATE USER',
                    description: 'success',
                });
                naviGate('/login');
            } else {
                notification.error({
                    message: 'CREATE USER FAILED',
                    description: 'User exists or error',
                });
            }
        } catch (error) {
            console.error('API Error:', error);
            notification.error({
                message: 'CREATE USER HAS ERROR',
                description: 'CREATE USER HAS ERROR',
            });
        }
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
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                        {
                                            pattern:
                                                /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/,
                                            message:
                                                'Email must contain @hcmut.edu.vn',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Tên đăng nhập"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="FName"
                                    name="FName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your FName!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="LName"
                                    name="LName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your LName!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your password!',
                                        },
                                        {
                                            min: 6,
                                            message:
                                                'Password must be at least 6 characters',
                                        },
                                        {
                                            max: 15,
                                            message:
                                                'Password cannot be longer than 15 characters',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="CCCD"
                                    name="CCCD"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your CCCD!',
                                        },
                                        {
                                            pattern: /^[0-9]{12}$/,
                                            message: 'CCCD phải là 12 chữ số!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Ngày sinh"
                                    name="BDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày sinh!',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to={'/'}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link to={'/login'}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default RegisterPage;
