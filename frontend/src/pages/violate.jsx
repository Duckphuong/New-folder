import { useEffect, useState } from 'react';
import { getViolateApi } from '../util/api';
import { Card, Modal, notification } from 'antd';
import React from 'react';
import { Table, Tag, Badge } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';
dayjs.extend(utc);
const Violate = () => {
    const navigate = useNavigate();
    const [historys, setHistory] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getViolateApi();
            if (res.redirect) {
                navigate(res.redirect);
            }
            console.log('check res', res);
            if (!res?.message) {
                setHistory(res);
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
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedRow(null);
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        return dayjs.utc(timeStr).format('HH:mm');
    };

    const columns = [
        {
            title: 'Mã phiếu',
            dataIndex: 'TicketID',
            key: 'TicketID',
            sorter: (a, b) => a.TicketID.localeCompare(b.TicketID),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Phòng',
            dataIndex: 'RoomID',
            key: 'RoomID',
            filters: Array.from(
                new Set(historys.map((item) => item.RoomID))
            ).map((room) => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.RoomID === value,
            sorter: (a, b) => a.RoomID.localeCompare(b.RoomID),
        },
        {
            title: 'Ngày mượn',
            dataIndex: 'Borrowed_Date',
            key: 'Borrowed_Date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) =>
                dayjs(a.Borrowed_Date).unix() - dayjs(b.Borrowed_Date).unix(),
        },
        {
            title: 'Giờ mượn',
            dataIndex: 'Borrowed_Time',
            key: 'Borrowed_Time',
            render: formatTime,
            sorter: (a, b) =>
                dayjs.utc(a.Borrowed_Time).unix() -
                dayjs.utc(b.Borrowed_Time).unix(),
        },
        {
            title: 'Giờ trả dự kiến',
            dataIndex: 'Expected_Return_Time',
            key: 'Expected_Return_Time',
            render: formatTime,
            sorter: (a, b) =>
                dayjs.utc(a.Expected_Return_Time).unix() -
                dayjs.utc(b.Expected_Return_Time).unix(),
        },
        {
            title: 'Thời lượng (phút)',
            dataIndex: 'Duration',
            key: 'Duration',
            sorter: (a, b) => a.Duration - b.Duration,
        },
        {
            title: 'Thiết bị',
            dataIndex: 'DeviceID',
            key: 'DeviceID',
            render: (text) => text || <i>Không</i>,
            sorter: (a, b) =>
                (a.DeviceID || '').localeCompare(b.DeviceID || ''),
        },
        {
            title: 'Số lượng',
            dataIndex: 'Quantity',
            key: 'Quantity',
            render: (qty) => qty ?? <i>--</i>,
            sorter: (a, b) => (a.Quantity ?? 0) - (b.Quantity ?? 0),
        },
        {
            title: 'CCCD',
            dataIndex: 'CCCD',
            key: 'CCCD',
            filters: Array.from(new Set(historys.map((item) => item.CCCD))).map(
                (cccd) => ({
                    text: cccd,
                    value: cccd,
                })
            ),
            onFilter: (value, record) => record.CCCD === value,
            sorter: (a, b) => a.CCCD.localeCompare(b.CCCD),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'TicketStatus',
            key: 'TicketStatus',
            filters: [
                { text: 'Chờ xử lý', value: 'NONE' },
                { text: 'Đang mượn', value: 'PENDING' },
                { text: 'Hoàn tất', value: 'DONE' },
            ],
            onFilter: (value, record) => {
                const status = record.TicketStatus || 'NONE';
                return status === value;
            },
            sorter: (a, b) => {
                const getOrder = (status) => {
                    if (!status) return 0;
                    if (status === 'PENDING') return 1;
                    return 2;
                };
                return getOrder(a.TicketStatus) - getOrder(b.TicketStatus);
            },
            render: (status) => {
                if (!status) return <Tag color="default">Chờ xử lý</Tag>;
                return status === 'PENDING' ? (
                    <Tag color="orange">PENDING</Tag>
                ) : status === 'LATE' ? (
                    <Tag color="yellow">LATE</Tag>
                ) : status === 'CANCEL' ? (
                    <Tag color="red">CANCEL</Tag>
                ) : (
                    <Tag color="green">PAID</Tag>
                );
            },
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Lịch sử vi phạm</h2>
            <Table
                columns={columns}
                dataSource={historys}
                rowKey="TicketIDNum"
                bordered
                pagination={{
                    pageSizeOptions: ['10', '20', `${historys.length}`],
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
                title={`Chi tiết phiếu ${selectedRow?.TicketID}`}
                open={isModalVisible}
                onCancel={handleClose}
                footer={null}
                centered
                maskClosable={true}
            >
                {selectedRow && (
                    <div className="space-y-2">
                        <p>
                            <b>Phòng:</b> {selectedRow.RoomID}
                        </p>
                        <p>
                            <b>Ngày mượn:</b>{' '}
                            {dayjs(selectedRow.Borrowed_Date).format(
                                'DD/MM/YYYY'
                            )}
                        </p>
                        <p>
                            <b>Giờ mượn:</b>{' '}
                            {formatTime(selectedRow.Borrowed_Time)}
                        </p>
                        <p>
                            <b>Giờ trả dự kiến:</b>{' '}
                            {formatTime(selectedRow.Expected_Return_Time)}
                        </p>
                        <p>
                            <b>Giờ trả thực tế:</b>{' '}
                            {dayjs
                                .utc(selectedRow.Actual_Return_Time)
                                .format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                        <p>
                            <b>Thời lượng:</b> {selectedRow.Duration} phút
                        </p>
                        <p>
                            <b>Thiết bị:</b> {selectedRow.DeviceID || 'Không'}
                        </p>
                        <p>
                            <b>Số lượng:</b> {selectedRow.Quantity ?? '--'}
                        </p>
                        <p>
                            <b>Trạng thái:</b> {selectedRow.TicketStatus}
                        </p>
                        <p>
                            <b>CCCD:</b> {selectedRow.CCCD}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Violate;
