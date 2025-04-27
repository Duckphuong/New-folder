import {
    WifiOutlined,
    CommentOutlined,
    DesktopOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import img1 from '../assets/slide/sanbong.jpeg';
import { useEffect, useState } from 'react';
import { cancelTicketApi, getHistoryApi, returnTicketApi } from '../util/api';
import { notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

const { confirm } = Modal;

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const storedAuthData = localStorage.getItem('authData');
    const parsed = JSON.parse(storedAuthData);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getHistoryApi(parsed.user.CCCD);
            if (res.redirect) {
                navigate(res.redirect);
            }
            if (!res?.message) {
                const sorted = res.sort((a, b) => {
                    const dateA = new Date(
                        a.Borrowed_Date + 'T' + a.Borrowed_Time
                    );
                    const dateB = new Date(
                        b.Borrowed_Date + 'T' + b.Borrowed_Time
                    );
                    return dateB - dateA;
                });
                setHistory(sorted);
            } else {
                notification.error({
                    message: 'Unautherized',
                    description: res.message,
                });
            }
        };
        fetchDetail();
    }, []);

    const formatDateWithDay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        return dayjs.utc(timeStr).format('HH:mm');
    };

    const getRoomStatus = (borrowedDate, borrowedTime, expectedReturnTime) => {
        const today = dayjs().startOf('day');
        const nowTime = dayjs().format('HH:mm');
        const borrowedDateObj = dayjs(borrowedDate).startOf('day');
        const borrowedTimeObj = formatTime(borrowedTime);
        const expectedReturnTimeObj = formatTime(expectedReturnTime);

        let isBeforeBorrow = false;
        let isDuringBorrow = false;
        let isAfterReturn = false;

        // So sánh ngày trước
        if (today.isBefore(borrowedDateObj)) {
            isBeforeBorrow = true;
        } else if (today.isAfter(borrowedDateObj)) {
            isAfterReturn = true;
        } else {
            // Cùng ngày
            if (nowTime < borrowedTimeObj) {
                isBeforeBorrow = true;
            } else if (
                nowTime >= borrowedTimeObj &&
                nowTime < expectedReturnTimeObj
            ) {
                isDuringBorrow = true;
            } else if (nowTime >= expectedReturnTimeObj) {
                isAfterReturn = true;
            }
        }

        return { isBeforeBorrow, isDuringBorrow, isAfterReturn };
    };

    const handleCancel = (ticketId) => {
        confirm({
            title: 'Bạn có chắc muốn hủy đặt phòng?',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    const res = await cancelTicketApi(ticketId);
                    if (res.success) {
                        notification.success({
                            message: 'Hủy đặt thành công',
                        });
                        setHistory((prev) =>
                            prev.map((item) =>
                                item.TicketID === ticketId
                                    ? {
                                          ...item,
                                          TicketStatus: 'CANCEL',
                                          Actual_Return_Time:
                                              new Date().toISOString(),
                                      }
                                    : item
                            )
                        );
                    } else {
                        notification.error({
                            message: 'Hủy đặt thất bại',
                            description: res.message,
                        });
                    }
                } catch (err) {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: err.message,
                    });
                }
            },
            okText: 'Xác nhận',
            cancelText: 'Hủy',
        });
    };

    const handleReturn = (room) => {
        confirm({
            title: 'Bạn có chắc muốn trả phòng?',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
                    // eslint-disable-next-line no-unused-vars
                    const { isBeforeBorrow, isDuringBorrow, isAfterReturn } =
                        getRoomStatus(
                            room.Borrowed_Date,
                            room.Borrowed_Time,
                            room.Expected_Return_Time
                        );
                    let action = '';
                    if (isDuringBorrow) {
                        action = 'PAID';
                    } else if (isAfterReturn) {
                        action = 'LATE';
                    } else {
                        notification.error({
                            message: 'Không thể trả phòng',
                            description:
                                'Chưa tới giờ mượn hoặc sai thời điểm.',
                        });
                        return;
                    }

                    const res = await returnTicketApi(
                        room.TicketID,
                        action,
                        now
                    );

                    if (res.success) {
                        notification.success({
                            message: 'Trả phòng thành công',
                        });
                        setHistory((prev) =>
                            prev.map((item) =>
                                item.TicketID === room.TicketID
                                    ? {
                                          ...item,
                                          TicketStatus: action,
                                          Actual_Return_Time:
                                              new Date().toISOString(),
                                      }
                                    : item
                            )
                        );
                    } else {
                        notification.error({
                            message: 'Trả phòng thất bại',
                            description: res.message,
                        });
                    }
                } catch (err) {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: err.message,
                    });
                }
            },
            okText: 'Xác nhận',
            cancelText: 'Hủy',
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-5">
            <div className="font-bold text-3xl pb-10">
                Lịch sử đặt phòng của bạn
            </div>

            {history.map((room) => {
                const { isBeforeBorrow, isDuringBorrow, isAfterReturn } =
                    getRoomStatus(
                        room.Borrowed_Date,
                        room.Borrowed_Time,
                        room.Expected_Return_Time
                    );

                return (
                    <div
                        key={room.TicketID}
                        className="relative bg-white rounded border-[0.5px] border-[#f0f0f0] p-4 flex flex-col md:flex-row gap-4 items-center shadow-md mb-6 overflow-hidden"
                    >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                            <span
                                className={`text-4xl md:text-5xl font-bold opacity-10 uppercase transform rotate-12
                                    ${
                                        room.TicketStatus === 'CANCEL'
                                            ? 'text-red-500'
                                            : room.TicketStatus === 'PAID'
                                            ? 'text-green-500'
                                            : room.TicketStatus === 'LATE'
                                            ? 'text-orange-500'
                                            : 'text-yellow-500 animate-pulse'
                                    }
                                `}
                            >
                                {room.TicketStatus || 'PENDING'}
                            </span>
                        </div>

                        <img
                            src={img1}
                            alt="Phòng học"
                            className="w-full md:w-60 h-40 object-cover rounded"
                        />

                        <div className="flex-1 w-full">
                            <div className="flex mb-2 pb-8">
                                <h2 className="text-base font-bold">
                                    {room.RoomType} - {room.RoomName}
                                </h2>
                            </div>
                            <div className="font-bold">
                                {formatDateWithDay(room.Borrowed_Date)}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Giờ bắt đầu:{' '}
                                        {formatTime(room.Borrowed_Time)}
                                    </p>
                                </div>
                                <div className="hidden md:block border-l border-[#f0f0f0] h-12 mx-2"></div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Giờ kết thúc:{' '}
                                        {formatTime(room.Expected_Return_Time)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${room.TicketID}`}
                                    alt="QR Code"
                                    className="w-28 h-28"
                                />
                            </div>
                            <a
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${room.TicketID}`}
                                download
                                className="inline-flex items-center text-gray-800 font-semibold hover:underline mb-6"
                            >
                                <DownloadOutlined className="mr-2 " />
                                Tải QR
                            </a>

                            {!['CANCEL', 'PAID', 'LATE'].includes(
                                room.TicketStatus
                            ) && (
                                <div className="flex gap-2 mt-2">
                                    {isBeforeBorrow && (
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded"
                                            onClick={() =>
                                                handleCancel(room.TicketID)
                                            }
                                        >
                                            Hủy đặt
                                        </button>
                                    )}

                                    {isDuringBorrow && (
                                        <>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded"
                                                onClick={() =>
                                                    handleCancel(room.TicketID)
                                                }
                                            >
                                                Hủy đặt
                                            </button>
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded"
                                                onClick={() =>
                                                    handleReturn(room)
                                                }
                                            >
                                                Trả phòng
                                            </button>
                                        </>
                                    )}

                                    {isAfterReturn &&
                                        !room.Actual_Return_Time && (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded"
                                                onClick={() =>
                                                    handleReturn(room)
                                                }
                                            >
                                                Trả phòng
                                            </button>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Ghi chú */}
            <div className="max-w-2xl mx-auto text-center px-4 py-8">
                <div className="text-left mt-6">
                    <h3 className="font-bold text-lg mb-2">
                        Lưu ý khi sử dụng phòng
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                        <li>
                            <b>Thời gian hoạt động:</b> Phòng mở cửa từ 8:00 đến
                            17:00 hằng ngày.
                        </li>
                        <li>
                            <b>Số lượng người:</b> Không vượt quá sức chứa tối
                            đa của phòng.
                        </li>
                        <li>
                            <b>Giữ trật tự:</b> Tránh gây ồn ào, nói chuyện to.
                        </li>
                        <li>
                            <b>Vệ sinh:</b> Dọn dẹp gọn gàng, giữ vệ sinh chung.
                        </li>
                        <li>
                            <b>Thiết bị:</b> Báo quản lý khi gặp sự cố.
                        </li>
                        <li>
                            <b>Cấm ăn uống:</b> Không mang thức ăn, nước uống
                            vào phòng.
                        </li>
                        <li>
                            <b>Trách nhiệm:</b> Người đặt phòng chịu trách nhiệm
                            về hư hỏng/mất mát.
                        </li>
                        <li>
                            <b>Tuân thủ:</b> Chấp hành nội quy phòng học nhóm.
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default History;
