import { useEffect, useState } from 'react';
import { Card, Modal, notification, Button, Input } from 'antd';
import React from 'react';
import { Table, Tag, Badge } from 'antd';
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

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getAllRoomsApi();
            if (res.redirect) {
                navigate(res.redirect);
            }
            console.log('check res', res);
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
                description: 'Bạn không có quyền xóa người dùng!',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${selectedRow.email}?`,
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
                        description: `Phòng  ${selectedRow.RoomID} đã bị xóa.`,
                    });
                    handleClose();
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể xóa người dùng!',
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
            filters: Array.from(
                new Set(dataSource.map((item) => item.RoomType))
            ).map((room) => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.RoomType === value,
            sorter: (a, b) => a.RoomType.localeCompare(b.RoomType),
        },
        {
            title: 'Thời gian tối đa',
            dataIndex: 'TimeLimit',
            key: 'TimeLimit',
            filters: Array.from(
                new Set(dataSource.map((item) => item.TimeLimit))
            ).map((TimeLimit) => ({
                text: TimeLimit,
                value: TimeLimit,
            })),
            onFilter: (value, record) => record.TimeLimit === value,
            sorter: (a, b) => a.TimeLimit.localeCompare(b.TimeLimit),
        },
        {
            title: 'CCCD',
            dataIndex: 'CCCD',
            key: 'CCCD',
            filters: Array.from(
                new Set(dataSource.map((item) => item.CCCD))
            ).map((cccd) => ({
                text: cccd,
                value: cccd,
            })),
            onFilter: (value, record) => record.CCCD === value,
            sorter: (a, b) => a.CCCD.localeCompare(b.CCCD),
        },
        {
            title: 'Sức chứa',
            dataIndex: 'RoomCapacity',
            key: 'RoomCapacity',
            render: (text) => (text === null ? 1 : text),
            filters: Array.from(
                new Set(
                    dataSource.map((item) =>
                        item.RoomCapacity === null ? 1 : item.RoomCapacity
                    )
                )
            ).map((RoomCapacity) => ({
                text: RoomCapacity === null ? '1' : RoomCapacity,
                value: RoomCapacity,
            })),
            onFilter: (value, record) =>
                (record.RoomCapacity === null ? 1 : record.RoomCapacity) ===
                value,
            sorter: (a, b) =>
                (a.RoomCapacity === null ? 1 : a.RoomCapacity).localeCompare(
                    b.RoomCapacity === null ? 1 : b.RoomCapacity
                ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Quản lí phòng</h2>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="TicketIDNum"
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
                            <b>ID phòng:</b>
                            {isEditing ? (
                                <Input
                                    value={formData.RoomID}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            RoomID: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.RoomID}</p>
                            )}
                        </div>

                        <div>
                            <b>Tên phòng:</b>
                            {isEditing ? (
                                <Input
                                    value={formData.RoomName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            RoomName: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.RoomName}</p>
                            )}
                        </div>
                        <div>
                            <b>Thời lượng:</b>
                            {isEditing ? (
                                <Input
                                    value={formData.TimeLimit}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            TimeLimit: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.TimeLimit}</p>
                            )}
                        </div>
                        {/* <div>
                            <b>Thiết bị:</b>{' '}
                            {isEditing ? (
                                <Input
                                    value={formData.HasProjector}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            HasProjector: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.HasProjector}</p>
                            )}
                        </div> */}
                        <div>
                            <b>Sức chứa:</b>
                            {isEditing ? (
                                <Input
                                    value={formData.RoomCapacity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            RoomCapacity: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.RoomCapacity}</p>
                            )}
                        </div>
                        <div>
                            <b>CCCD quản lí:</b>
                            {isEditing ? (
                                <Input
                                    value={formData.CCCD}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            TimeCCCDLimit: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.CCCD}</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RoomAll;
