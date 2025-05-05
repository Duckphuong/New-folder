import React, { useState } from 'react';
import { Select, DatePicker, TimePicker, Button, Space } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    SearchOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const SearchBar = ({ onSearch }) => {
    const [roomType, setRoomType] = useState('personal');
    const handleSearch = () => {
        onSearch({ roomType });
    };
    return (
        <div className="p-4 bg-white rounded shadow-md flex flex-wrap gap-4 items-center justify-between">
            <Space size="large" wrap>
                {/* Cơ sở */}
                <div>
                    <div className="text-gray-600 text-sm mb-1">
                        <EnvironmentOutlined /> Cơ sở
                    </div>
                    <Select defaultValue="cs1" style={{ width: 120 }}>
                        <Option value="cs1">Cơ sở 1</Option>
                        <Option value="cs2">Cơ sở 2</Option>
                    </Select>
                </div>

                {/* Ngày */}
                <div>
                    <div className="text-gray-600 text-sm mb-1">
                        <CalendarOutlined /> Ngày
                    </div>
                    <DatePicker format="DD MMM YYYY" />
                </div>

                {/* Giờ bắt đầu */}
                <div>
                    <div className="text-gray-600 text-sm mb-1">
                        <ClockCircleOutlined /> Giờ bắt đầu
                    </div>
                    <TimePicker format="HH:mm" />
                </div>

                {/* Giờ kết thúc */}
                <div>
                    <div className="text-gray-600 text-sm mb-1">
                        <ClockCircleOutlined /> Giờ kết thúc
                    </div>
                    <TimePicker format="HH:mm" />
                </div>

                {/* Loại phòng */}
                <div>
                    <div className="text-gray-600 text-sm mb-1">
                        <UserOutlined /> Loại phòng
                    </div>
                    <Select
                        defaultValue="personal"
                        value={roomType}
                        onChange={(value) => setRoomType(value)}
                        style={{ width: 120 }}
                    >
                        <Option value="Phòng học cá nhân">Cá nhân</Option>
                        <Option value="Phòng học nhóm">Nhóm</Option>
                        <Option value="Phòng thuyết trình">Thuyết trình</Option>
                    </Select>
                </div>

                {/* Nút tìm kiếm */}
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </Button>
            </Space>
        </div>
    );
};

export default SearchBar;
