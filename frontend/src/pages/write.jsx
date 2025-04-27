import { Button, Col, Form, Input, notification, Row } from 'antd';
import { postWritePage } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const WritePage = () => {
    const naviGate = useNavigate();
    const onFinish = async (values) => {
        const { name, email, mess } = values;
        try {
            const res = await postWritePage(name, email, mess);

            console.log('API Response:', res); // Debug xem response chứa gì

            if (res.status === 200) {
                notification.success({
                    message: 'WRITE MESS',
                    description: 'success',
                });
                naviGate('/');
                return;
            }
        } catch (error) {
            console.error('API Error:', error);
            notification.error({
                message: 'CREATE USER HAS ERROR',
                description: error.response?.data?.EM ?? 'error',
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
                    <legend>What do you want to say?</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Name"
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
                            label="Say some thing for me"
                            name="mess"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your mess!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={'/'}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                </fieldset>
            </Col>
        </Row>
    );
};

export default WritePage;
