import {
    Button,
    Input,
    Modal,
    notification,
    Select,
    Table,
    Tag,
    DatePicker,
} from 'antd';
import { useEffect, useState } from 'react';
import { getUsersApi } from '../util/api';
import axios from '../util/axios.customize';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';
dayjs.extend(utc);

function UserPage() {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const authData = JSON.parse(localStorage.getItem('authData'));

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUsersApi();
            if (res.redirect) {
                navigate(res.redirect);
            }
            if (!res?.message) {
                setDataSource(res);
            } else {
                notification.error({
                    message: 'Unauthorized',
                    description: res.message,
                });
            }
        };
        fetchUser();
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
                    await axios.delete(`/v1/api/user/${selectedRow.id}`);
                    setDataSource((prev) =>
                        prev.filter((u) => u.id !== selectedRow.id)
                    );
                    notification.success({
                        message: 'Xóa thành công',
                        description: `Người dùng ${selectedRow.email} đã bị xóa.`,
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
            await axios.post(`/v1/api/user/${formData.id}`, formData);
            notification.success({
                message: 'Cập nhật thành công',
            });
            setDataSource((prev) =>
                prev.map((u) => (u.id === formData.id ? formData : u))
            );
            setIsEditing(false);
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại',
            });
        }
    };

    const handleCCCDBlur = () => {
        const cccdPattern = /^[0-9]{12}$/; // Kiểm tra chỉ có 12 chữ số
        if (!cccdPattern.test(formData.CCCD)) {
            notification.error({
                message: 'Lỗi CCCD',
                description: 'CCCD phải có 12 chữ số.',
            });
        }
    };

    const columns = [
        {
            title: 'FName',
            dataIndex: 'FName',
            sorter: (a, b) => a.FName.localeCompare(b.FName),
        },
        {
            title: 'LName',
            dataIndex: 'LName',
            sorter: (a, b) => a.LName.localeCompare(b.LName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Student', value: 'student' },
                { text: 'Lecture', value: 'lecture' },
            ],
            render: (role) => {
                if (role === 'admin') return <Tag color="red">Admin</Tag>;
                return role === 'student' ? (
                    <Tag color="green">Student</Tag>
                ) : (
                    <Tag color="orange">Lecture</Tag>
                );
            },
        },
        {
            title: 'CCCD',
            dataIndex: 'CCCD',
        },
        {
            title: 'BDate',
            dataIndex: 'BDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) => dayjs(a.BDate).unix() - dayjs(b.BDate).unix(),
        },
        {
            title: 'Hành động',
            render: (_, user) => (
                <Button
                    type="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        showModal(user);
                    }}
                >
                    Xem
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 50 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={'id'}
                pagination={{
                    pageSizeOptions: ['10', '20', `${dataSource.length}`],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trên ${total} bản ghi`,
                }}
            />
            <Modal
                title={`Chi tiết người dùng ${
                    formData?.FName + ' ' + formData?.LName
                }`}
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
                <div className="space-y-2">
                    <div>
                        <b>First Name:</b>
                        {isEditing ? (
                            <Input
                                value={formData.FName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        FName: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <p>{formData.FName}</p>
                        )}
                    </div>
                    <div>
                        <b>Last Name:</b>
                        {isEditing ? (
                            <Input
                                value={formData.LName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        LName: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <p>{formData.LName}</p>
                        )}
                    </div>
                    <div>
                        <b>Email:</b>
                        {isEditing ? (
                            <Input
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <p>{formData.email}</p>
                        )}
                    </div>
                    <div>
                        <b>Ngày sinh:</b>
                        {isEditing ? (
                            <DatePicker
                                value={dayjs(formData.BDate)}
                                format="DD/MM/YYYY"
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        BDate: date ? date.toISOString() : null,
                                    })
                                }
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <p>{dayjs(formData.BDate).format('DD/MM/YYYY')}</p>
                        )}
                    </div>
                    <div>
                        <b>CCCD:</b>
                        {isEditing ? (
                            <Input
                                value={formData.CCCD}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        CCCD: e.target.value,
                                    })
                                }
                                onBlur={handleCCCDBlur}
                            />
                        ) : (
                            <p>{formData.CCCD}</p>
                        )}
                    </div>
                    <div>
                        <b>Số lần vi phạm còn</b>
                        <p>{formData.SoLanPhat}</p>
                    </div>
                    <div>
                        <b>Role:</b>
                        {isEditing && authData.user.role === 'admin' ? (
                            <Select
                                value={formData.role}
                                onChange={(value) =>
                                    setFormData({ ...formData, role: value })
                                }
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'student', label: 'Student' },
                                    { value: 'lecture', label: 'Lecture' },
                                ]}
                            />
                        ) : (
                            <Tag
                                color={
                                    formData.role === 'admin'
                                        ? 'red'
                                        : formData.role === 'student'
                                        ? 'green'
                                        : 'orange'
                                }
                            >
                                {formData.role}
                            </Tag>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default UserPage;
