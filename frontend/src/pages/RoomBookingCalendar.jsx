import React, { useEffect, useState } from 'react';
import { Button, Card, Select, Space, message, notification } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../util/axios.customize';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const hours = Array.from({ length: 12 }, (_, i) =>
    dayjs()
        .hour(6 + i)
        .minute(0)
        .format('HH:mm')
);
const today = dayjs();
const days = Array.from({ length: 5 }, (_, i) => {
    const date = today.add(i, 'day');
    return {
        label: date.format('ddd DD'),
        date: date.format('YYYY-MM-DD'),
    };
});
const todayStr = today.format('YYYY-MM-DD');

const maxSelectionMap = {
    personal: 5,
    presentation: 2,
    group: 3,
};

const postBookingApi = async (RoomID, bookingData) => {
    const URL_API = `/v1/api/booking/${RoomID}`;
    try {
        const response = await axios.post(URL_API, bookingData);
        return response.bookingData;
    } catch (error) {
        console.error('API Error: 1', error);
        throw error.response?.data?.error || 'Đặt phòng thất bại.';
    }
};

const RoomBookingCalendar = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const room = React.useMemo(() => state?.room || {}, [state]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [socketQuantity, setSocketQuantity] = useState('1');
    const [loading, setLoading] = useState(false);

    const getRoomTypeKey = (type) => {
        const map = {
            'Phòng học cá nhân': 'personal',
            'Phòng thuyết trình': 'presentation',
            'Phòng học nhóm': 'group',
        };
        return map[type] || 'group';
    };

    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const response = await axios.get(
                    `/v1/api/booking/${room.RoomID}`
                );
                // console.log('res>>>>>>>>>>', response);
                const data = response;
                // console.log('data', data);
                const slots = [];
                for (let row of data) {
                    const startHour = new Date(row.Borrowed_Time).getUTCHours();
                    const numHours = row.Duration / 60;
                    for (let i = 0; i < numHours; i++) {
                        const slotHour = dayjs()
                            .hour(startHour + i)
                            .minute(0)
                            .format('HH:mm');
                        const dayLabel = dayjs(row.date).format('ddd DD');
                        slots.push({ day: dayLabel, hour: slotHour });
                    }
                }
                // console.log(slots);
                setBookedSlots(slots);
            } catch (err) {
                console.error('Lỗi khi lấy booked slots:', err);
            }
        };

        if (room.RoomID) fetchBookedSlots();
    }, [room.RoomID]);
    // Tính các slot đã bị đặt

    const isBooked = (day, hour) => {
        return bookedSlots.some(
            (s) =>
                // console.log(s.day, day, s.hour, hour) ||
                s.day === day && s.hour === hour
        );
    };

    console.log('bookedSlots', bookedSlots);

    const hourToInt = (h) => parseInt(h.split(':')[0], 10);

    const handleSelect = (day, hour) => {
        const isSameDay =
            selectedSlots.length === 0 || selectedSlots[0].day === day;
        if (!isSameDay) {
            setSelectedSlots([{ day, hour }]);
            return;
        }

        if (selectedSlots.some((s) => s.day === day && s.hour === hour)) {
            setSelectedSlots(
                selectedSlots.filter((s) => !(s.day === day && s.hour === hour))
            );
            return;
        }

        const newSlot = { day, hour };
        const newSlots = [...selectedSlots, newSlot].sort(
            (a, b) => hourToInt(a.hour) - hourToInt(b.hour)
        );

        const hoursInDay = newSlots.map((s) => hourToInt(s.hour));
        const isContinuous = hoursInDay.every(
            (h, i, arr) => i === 0 || h - arr[i - 1] === 1
        );

        if (
            newSlots.length <= maxSelectionMap[getRoomTypeKey(room.RoomType)] &&
            isContinuous
        ) {
            setSelectedSlots(newSlots);
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSlots.length === 0) {
            message.error('Vui lòng chọn ít nhất một khung giờ.');
            return;
        }

        const storedAuthData = localStorage.getItem('authData');
        const parsed = JSON.parse(storedAuthData);

        if (parsed.user.SoLanPhat > 0) {
            notification.error({
                message: 'Không thể đặt phòng',
                description:
                    'Bạn đang có vi phạm, vui lòng liên hệ quản trị viên để được hỗ trợ.',
            });
            return;
        }

        setLoading(true);
        try {
            const storedAuthData = localStorage.getItem('authData');
            const parsed = JSON.parse(storedAuthData);
            const cccd = parsed.user.CCCD || '333333333333';
            const selectedDay = days.find(
                (d) => d.label === selectedSlots[0].day
            );
            const borrowedDate = selectedDay.date;
            const startHour = selectedSlots[0].hour;
            const endHour = selectedSlots[selectedSlots.length - 1].hour;
            const duration =
                (hourToInt(endHour) - hourToInt(startHour) + 1) * 60;

            const borrowedTime = `${startHour}:00`; // e.g., "09:00:00"

            const bookingData = {
                RoomID: room.RoomID,
                DeviceID: socketQuantity > 0 ? 'DEVICE0005' : null,
                Quantity: socketQuantity > 0 ? parseInt(socketQuantity) : null,
                Borrowed_Date: borrowedDate,
                Borrowed_Time: borrowedTime,
                Duration: duration,
                Actual_Return_Time: null,
                TicketStatus: 'PENDING',
                CCCD: cccd,
            };
            await postBookingApi(room.RoomID, bookingData);
            message.success('Đặt phòng thành công!');
            navigate('/history');
        } catch (error) {
            console.log('error   ', error);
            message.error(error.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5">
            <div className="flex gap-4 max-w-5xl pb-6 mx-auto">
                <div className="grid grid-cols-[200px_repeat(5,1fr)]">
                    <div></div>

                    {days.map((day) => (
                        <div
                            key={day.date}
                            className={clsx(
                                'text-center font-semibold py-2',
                                day.date === todayStr && 'bg-yellow-400 rounded'
                            )}
                        >
                            {day.label}
                        </div>
                    ))}

                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="text-right pr-2 ">{hour}</div>

                            {days.map((day) => {
                                const isSelected = selectedSlots.some(
                                    (s) =>
                                        s.day === day.label && s.hour === hour
                                );

                                const booked = isBooked(day.label, hour);

                                return (
                                    <div
                                        key={`${day.label}-${hour}`}
                                        onClick={() =>
                                            !booked &&
                                            handleSelect(day.label, hour)
                                        }
                                        className={clsx(
                                            'w-20 h-10 m-0.5 rounded cursor-pointer',
                                            booked &&
                                                'bg-gray-500 cursor-not-allowed',
                                            isSelected && 'bg-blue-500',
                                            !booked &&
                                                !isSelected &&
                                                'bg-gray-200 hover:bg-gray-300'
                                        )}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                <div className="w-72 pt-4 rounded-2xl shadow-lg bg-white p-4">
                    <Card>
                        <p>
                            📍 {room.RoomName || 'Không rõ vị trí'} -{' '}
                            {room.RoomType}
                        </p>
                        <p>👥 Sức chứa: {room.RoomCapacity || '1'} sinh viên</p>
                        <p>
                            💻{' '}
                            {room.HasProjector
                                ? 'Có trang bị máy chiếu'
                                : 'Không có máy chiếu'}
                        </p>
                        <p>📶 Có trang bị wifi</p>
                    </Card>
                    <div className="py-3"></div>

                    <Card>
                        <div className="space-y-1 text-sm">
                            <div>
                                <span className="inline-block w-4 h-4 bg-gray-200 rounded-sm mr-2" />{' '}
                                Có thể đặt
                            </div>
                            <div>
                                <span className="inline-block w-4 h-4 bg-gray-500 rounded-sm mr-2" />{' '}
                                Không thể đặt
                            </div>
                            <div>
                                <span className="inline-block w-4 h-4 bg-blue-500 rounded-sm mr-2" />{' '}
                                Khung giờ đặt
                            </div>
                        </div>
                    </Card>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="py-3">Mượn ổ cắm</div>
                        <Select
                            value={socketQuantity}
                            onChange={setSocketQuantity}
                            style={{ width: 80 }}
                            options={[
                                { value: '0', label: '0' },
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                            ]}
                        />
                    </div>
                    <Button
                        onClick={handleConfirmBooking}
                        type="primary"
                        className="mt-4 w-full"
                        loading={loading}
                    >
                        Xác nhận đặt phòng
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                    Hướng dẫn đặt phòng
                </h2>

                <ol className="list-decimal space-y-4 pl-5">
                    <li>
                        <p className="font-semibold">Chọn khung giờ:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                            <li>
                                Mở lịch đặt phòng và chọn các ô giờ bạn muốn đặt
                                (mỗi ô tương ứng với 60 phút).
                            </li>
                            <li>
                                Bạn có thể đặt tối đa 5 tiếng liên tục trong
                                khung giờ hoạt động từ 6:00 đến 18:00.
                            </li>
                            <li>
                                Không thể đặt ngắt quãng trong cùng một lần đặt.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p className="font-semibold">Xác nhận đặt phòng:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                            <li>
                                Sau khi chọn khung giờ mong muốn, nhấn "Xác nhận
                                đặt phòng".
                            </li>
                            <li>
                                Mã QR để check-in vào phòng sẽ được gửi vào hộp
                                thông báo (bấm vào logo cá nhân trên thanh công
                                cụ để xem).
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p className="font-semibold">Lưu ý khi đặt phòng:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                            <li>
                                Bạn chỉ được đặt phòng trước tối đa 5 ngày kể từ
                                ngày hiện tại.
                            </li>
                            <li>
                                Mỗi tài khoản chỉ được có 1 lịch đặt tại một
                                thời điểm.
                            </li>
                            <li>
                                Nếu bạn muốn thay đổi lịch đặt, hãy huỷ lịch
                                hiện tại trước khi đặt mới.
                            </li>
                        </ul>
                    </li>
                </ol>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-green-700">
                    Lưu ý khi sử dụng phòng
                </h2>

                <ol className="list-decimal space-y-4 pl-5" start="4">
                    <li>
                        <span className="font-semibold">
                            Thời gian hoạt động:
                        </span>{' '}
                        Phòng mở cửa từ 6:00 đến 18:00 hằng ngày.
                    </li>
                    <li>
                        <span className="font-semibold">Số lượng người:</span>{' '}
                        Không vượt quá sức chứa tối đa của phòng.
                    </li>
                    <li>
                        <span className="font-semibold">Giữ trật tự:</span>{' '}
                        Tránh nói chuyện to hoặc gây ồn ào, ảnh hưởng đến người
                        khác.
                    </li>
                    <li>
                        <span className="font-semibold">Vệ sinh:</span> Dọn dẹp
                        gọn gàng và giữ gìn vệ sinh chung sau khi sử dụng.
                    </li>
                    <li>
                        <span className="font-semibold">Thiết bị:</span> Sử dụng
                        thiết bị đúng cách, bảo quản khi phát sinh sự cố.
                    </li>
                    <li>
                        <span className="font-semibold">Cấm ăn uống:</span>{' '}
                        Không mang thức ăn, nước uống vào phòng để tránh gây
                        bẩn.
                    </li>
                    <li>
                        <span className="font-semibold">Trách nhiệm:</span>{' '}
                        Người đặt phòng chịu trách nhiệm về mọi hư hỏng hoặc mất
                        mát trong thời gian sử dụng.
                    </li>
                    <li>
                        <span className="font-semibold">Tuân thủ:</span> Thực
                        hiện đúng các nội dung đã đăng ký và tuân thủ nội quy
                        phòng.
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default RoomBookingCalendar;
