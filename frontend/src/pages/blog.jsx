import { Button, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';
import axios from '../util/axios.customize';

function BlogPage() {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            console.log('check res>>>>> ', res);

            if (!res?.message) {
                setDataSource(res);
            } else {
                //
                notification.error({
                    message: 'Unautherized',
                    description: res.message,
                });
            }
        };
        fetchUser();
    }, []);

    const handleDelete = async (userId) => {
        const authData = JSON.parse(localStorage.getItem('authData'));
        console.log(authData.access_token, authData.role);
        const userToDelete = dataSource.find((user) => user._id === userId);

        if (authData.role !== 'admin' || userToDelete.role === 'admin') {
            alert('Bạn không có quyền xóa người dùng!');
            return;
        }
        axios.delete(`/v1/api/user/${userId}`).then(() => {
            setDataSource((dataSource) =>
                dataSource.filter((user) => user._id !== userId)
            );
        });
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (_, user) => (
                <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(user._id)}
                >
                    Delete
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
                rowKey={'_id'}
            />
        </div>
    );
}

export default BlogPage;
