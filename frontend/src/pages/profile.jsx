// Profile.jsx
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, notification, Descriptions } from 'antd';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { getUserApi } from '../util/api';
import { useNavigate, useParams } from 'react-router-dom';
import HCMUTLogo from '../assets/HCMUT.svg.png';
import img1 from '../assets/slide/slbk.jpg';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getUserApi(id);
                if (res.redirect) {
                    navigate(res.redirect);
                }
                if (!res?.message) {
                    setProfile(res[0]);
                } else {
                    notification.error({
                        message: 'Unauthorized',
                        description: res.message,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchDetail();
    }, [id]);

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card
                className="w-full max-w-2xl rounded-2xl shadow-lg"
                cover={
                    <img
                        alt="cover"
                        src={img1}
                        className="h-40 object-cover rounded-t-2xl"
                    />
                }
                actions={[
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="text-blue-500"
                    >
                        Edit Profile
                    </Button>,
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        className="text-blue-500"
                    >
                        Settings
                    </Button>,
                ]}
            >
                <div className="flex flex-col items-center mb-4">
                    <Avatar size={80} src={HCMUTLogo} className="mb-2" />
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                </div>

                <Descriptions
                    title="Thông tin người dùng"
                    column={1}
                    bordered
                    size="small"
                >
                    <Descriptions.Item label="Họ">
                        {profile.FName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên">
                        {profile.LName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {profile.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="CCCD">
                        {profile.CCCD}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">
                        {new Date(profile.BDate).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                        {profile.role}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lần vi phạm">
                        {profile.SoLanPhat}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default Profile;
