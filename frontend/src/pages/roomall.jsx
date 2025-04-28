import { useEffect, useState } from 'react';
import {
    Card,
    Modal,
    notification,
    Button,
    Input,
    Table,
    DatePicker,
    Select,
} from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';
import { getAllRoomsApi } from '../util/api';
import axios from '../util/axios.customize';

dayjs.extend(utc);

const RoomAll = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const authData = JSON.parse(localStorage.getItem('authData'));

    // New: state cho tính tổng thời gian
    const [isDurationModalVisible, setIsDurationModalVisible] = useState(false);
    const [durationRoomID, setDurationRoomID] = useState('');
    const [durationStartDate, setDurationStartDate] = useState('');
    const [durationEndDate, setDurationEndDate] = useState('');
    const [durationResultList, setDurationResultList] = useState([]);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getAllRoomsApi();
            if (res.redirect) {
                navigate(res.redirect);
            }
            if (!res?.message) {
                setDataSource(res);
            } else {
                notification.error({
                    message: 'Unautherized',
                    description: res.message,
                });
            }
        };
        fetchDetail();
    }, []);

    const showModal = (record) => {
        setSelectedRow(record);
        setFormData(record);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedRow(null);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (authData.user.role !== 'admin') {
            notification.error({
                message: 'Không có quyền',
                description: 'Bạn không có quyền xóa phòng!',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${selectedRow.RoomID}?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await axios.delete(`/v1/api/roomall/${selectedRow.RoomID}`);
                    setDataSource((prev) =>
                        prev.filter((u) => u.RoomID !== selectedRow.RoomID)
                    );
                    notification.success({
                        message: 'Xóa thành công',
                        description: `Phòng ${selectedRow.RoomID} đã bị xóa.`,
                    });
                    handleClose();
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể xóa phòng!',
                    });
                }
            },
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.post(`/v1/api/roomall/${formData.RoomID}`, formData);
            notification.success({
                message: 'Cập nhật thành công',
            });
            setDataSource((prev) =>
                prev.map((u) => (u.RoomID === formData.RoomID ? formData : u))
            );
            setIsEditing(false);
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại',
            });
        }
    };

    // New: handle tính tổng thời gian
    const handleCalculateDuration = async () => {
        if (!durationStartDate || !durationEndDate) {
            notification.warning({
                message: 'Vui lòng nhập ngày bắt đầu và kết thúc',
            });
            return;
        }

        try {
            const res = await axios.post(`/v1/api/booking-duration`, {
                params: {
                    startDate: durationStartDate,
                    endDate: durationEndDate,
                    roomId: durationRoomID || undefined,
                },
            });
            if (!res.data || res.data.length === 0) {
                console.log('test lenght', durationRoomID);

                setDurationResultList([
                    { RoomID: durationRoomID, totalDuration: 0 },
                ]);
            } else {
                setDurationResultList(res.data);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tính tổng thời gian',
                description: error.response?.data?.message || 'Có lỗi xảy ra!',
            });
        }
    };

    const columns = [
        {
            title: 'Phòng',
            dataIndex: 'RoomID',
            key: 'RoomID',
            filters: Array.from(
                new Set(dataSource.map((item) => item.RoomID))
            ).map((room) => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.RoomID === value,
            sorter: (a, b) => a.RoomID.localeCompare(b.RoomID),
        },
        {
            title: 'Tên phòng',
            dataIndex: 'RoomName',
            key: 'RoomName',
            filters: Array.from(
                new Set(dataSource.map((item) => item.RoomName))
            ).map((room) => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.RoomName === value,
            sorter: (a, b) => a.RoomName.localeCompare(b.RoomName),
        },
        {
            title: 'Loại phòng',
            dataIndex: 'RoomType',
            key: 'RoomType',
            sorter: (a, b) => a.RoomType.localeCompare(b.RoomType),
        },
        {
            title: 'Thời gian tối đa',
            dataIndex: 'TimeLimit',
            key: 'TimeLimit',
            sorter: (a, b) => a.TimeLimit.localeCompare(b.TimeLimit),
        },
        {
            title: 'CCCD',
            dataIndex: 'CCCD',
            key: 'CCCD',
            sorter: (a, b) => a.CCCD.localeCompare(b.CCCD),
        },
        {
            title: 'Sức chứa',
            dataIndex: 'RoomCapacity',
            key: 'RoomCapacity',
            render: (text) => (text === null ? 1 : text),
            sorter: (a, b) => (a.RoomCapacity ?? 1) - (b.RoomCapacity ?? 1),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Quản lí phòng</h2>

            {/* New: nút tính tổng thời gian */}
            <Button
                type="primary"
                className="mb-4"
                onClick={() => setIsDurationModalVisible(true)}
            >
                Tính tổng thời gian đặt phòng
            </Button>

            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="RoomID"
                bordered
                pagination={{
                    pageSizeOptions: ['10', '20', `${dataSource.length}`],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trên ${total} bản ghi`,
                }}
                onRow={(record) => ({
                    onClick: () => showModal(record),
                })}
            />

            {/* Modal chi tiết phòng */}
            <Modal
                title={`Chi tiết phòng ${selectedRow?.RoomID} - ${selectedRow?.RoomName}`}
                open={isModalVisible}
                onCancel={handleClose}
                centered
                maskClosable={true}
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        Đóng
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            if (!isEditing) {
                                setIsEditing(true);
                            } else {
                                handleUpdate();
                            }
                        }}
                    >
                        {isEditing ? 'Lưu' : 'Cập nhật'}
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        onClick={handleDelete}
                        disabled={authData.user.role !== 'admin'}
                    >
                        Xóa
                    </Button>,
                ]}
            >
                {selectedRow && (
                    <div className="space-y-2">
                        <div>
                            <b>ID phòng:</b> {formData.RoomID}
                        </div>
                        <div>
                            <b>Tên phòng:</b> {formData.RoomName}
                        </div>
                        <div>
                            <b>Thời lượng:</b> {formData.TimeLimit}
                        </div>
                        <div>
                            <b>Sức chứa:</b> {formData.RoomCapacity ?? 1}
                        </div>
                        <div>
                            <b>CCCD quản lí:</b> {formData.CCCD}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal tính tổng thời gian */}
            <Modal
                title="Tính tổng thời gian đặt phòng"
                open={isDurationModalVisible}
                onCancel={() => {
                    setIsDurationModalVisible(false);
                    setDurationStartDate('');
                    setDurationEndDate('');
                    setDurationRoomID('');
                    setDurationResultList([]);
                }}
                onOk={handleCalculateDuration}
                width={800}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            placeholder="Chọn RoomID (bỏ trống để tính tất cả)"
                            value={durationRoomID}
                            onChange={(value) => setDurationRoomID(value)}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="">Tất cả phòng</Select.Option>
                            {dataSource.map((room) => (
                                <Select.Option
                                    key={room.RoomID}
                                    value={room.RoomID}
                                >
                                    {room.RoomID}
                                </Select.Option>
                            ))}
                        </Select>
                        <DatePicker
                            placeholder="Ngày bắt đầu"
                            style={{ width: '100%' }}
                            value={
                                durationStartDate
                                    ? dayjs(durationStartDate)
                                    : null
                            }
                            onChange={(date) => {
                                setDurationStartDate(
                                    date ? date.format('YYYY-MM-DD') : ''
                                );
                            }}
                        />
                        <DatePicker
                            placeholder="Ngày kết thúc"
                            style={{ width: '100%' }}
                            value={
                                durationEndDate ? dayjs(durationEndDate) : null
                            }
                            onChange={(date) => {
                                setDurationEndDate(
                                    date ? date.format('YYYY-MM-DD') : ''
                                );
                            }}
                        />
                    </div>

                    {durationResultList.length > 0 && (
                        <Table
                            dataSource={durationResultList}
                            columns={[
                                {
                                    title: 'Phòng',
                                    dataIndex: 'RoomID',
                                    key: 'RoomID',
                                },
                                {
                                    title: 'Tổng thời gian đặt',
                                    dataIndex: 'totalDuration',
                                    key: 'totalDuration',
                                },
                            ]}
                            rowKey="RoomID"
                            bordered
                            pagination={false}
                            className="mt-4"
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RoomAll;
