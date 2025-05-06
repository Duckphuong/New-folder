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
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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
        setIsAddModalVisible(false);
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
            console.log('formData', formData);
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

    const handleAdd = async () => {
        try {
            console.log('formDataaddd', formData);
            await axios.post(`/v1/api/roomall`, formData);
            notification.success({
                message: 'Cập nhật thành công',
            });
            setDataSource((prev) =>
                prev.map((u) => (u.RoomID === formData.RoomID ? formData : u))
            );
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
            render: (value) => `${value / 60} tiếng`,
            sorter: (a, b) => a.TimeLimit.localeCompare(b.TimeLimit),
        },
        {
            title: 'QuanLyCCCD',
            dataIndex: 'QuanLyCCCD',
            key: 'QuanLyCCCD',
            sorter: (a, b) => a.QuanLyCCCD.localeCompare(b.QuanLyCCCD),
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

            <Button
                type="primary"
                className="mb-4"
                onClick={() => setIsAddModalVisible(true)}
            >
                Thêm phòng
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
                            <b>ID phòng:</b>
                            <p>{formData.RoomID}</p>
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
                                <Select
                                    style={{ width: '100%' }}
                                    value={`${formData.TimeLimit / 60} tiếng`}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            TimeLimit: value,
                                        })
                                    }
                                    options={[
                                        {
                                            label: '1 tiếng',
                                            value: '60',
                                        },
                                        {
                                            label: '2 tiếng',
                                            value: '120',
                                        },
                                        {
                                            label: '3 tiếng',
                                            value: '180',
                                        },
                                        {
                                            label: '4 tiếng',
                                            value: '240',
                                        },
                                        {
                                            label: '5 tiếng',
                                            value: '300',
                                        },
                                    ]}
                                    placeholder="Chọn loại phòng chi tiết"
                                />
                            ) : (
                                <p>{formData.TimeLimit / 60} tiếng</p>
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
                                    value={formData.QuanLyCCCD}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            TimeCCCDLimit: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{formData.QuanLyCCCD}</p>
                            )}
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

            <Modal
                title={'Thêm phòng'}
                open={isAddModalVisible}
                onCancel={handleClose}
                centered
                maskClosable={true}
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        Đóng
                    </Button>,
                    <Button
                        key="add"
                        type="primary"
                        onClick={() => {
                            if (!isEditing) {
                                setIsEditing(true);
                            } else {
                                handleAdd();
                            }
                        }}
                    >
                        Thêm
                    </Button>,
                ]}
            >
                <div className="space-y-2">
                    <div>
                        <b>ID phòng:</b>
                        {
                            <Input
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        RoomID: e.target.value,
                                    })
                                }
                            />
                        }
                    </div>

                    <div>
                        <b>Tên phòng:</b>
                        <Input
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    RoomName: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <b>Loại phòng:</b>

                        <Select
                            style={{ width: '100%' }}
                            value={formData.RoomType}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    RoomType: value,
                                })
                            }
                            options={[
                                {
                                    label: 'Phòng học cá nhân',
                                    value: 'Phòng học cá nhân',
                                },
                                {
                                    label: 'Phòng học nhóm',
                                    value: 'Phòng học nhóm',
                                },
                                {
                                    label: 'Phòng thuyết trình',
                                    value: 'Phòng thuyết trình',
                                },
                            ]}
                            placeholder="Chọn loại phòng chi tiết"
                        />
                    </div>
                    <div>
                        <b>Thời lượng:</b>

                        <Select
                            style={{ width: '100%' }}
                            value={formData.TimeLimit}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    TimeLimit: value,
                                })
                            }
                            options={[
                                {
                                    label: '1 tiếng',
                                    value: '60',
                                },
                                {
                                    label: '2 tiếng',
                                    value: '120',
                                },
                                {
                                    label: '3 tiếng',
                                    value: '180',
                                },
                                {
                                    label: '4 tiếng',
                                    value: '240',
                                },
                                {
                                    label: '5 tiếng',
                                    value: '300',
                                },
                            ]}
                            placeholder="Chọn loại phòng chi tiết"
                        />
                    </div>

                    <div>
                        <b>Sức chứa:</b>
                        <Input
                            value={formData.RoomCapacity}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    RoomCapacity: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RoomAll;
