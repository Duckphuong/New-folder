// RoomBookingCalendar.jsx
import React, { useState } from 'react';
import { Button, Tooltip, Card } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';

const hours = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`);
const today = dayjs();
const days = Array.from({ length: 5 }, (_, i) => {
    const date = today.add(i, 'day');
    return {
        label: date.format('ddd DD'), // dùng để hiển thị
        date: date.format('YYYY-MM-DD'), // dùng để so sánh
    };
});

const todayStr = today.format('YYYY-MM-DD');
const RoomBookingCalendar = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const isBooked = (day, hour) => {
        // Giả lập slot đã đặt (ví dụ dữ liệu từ DB)
        const bookedSlots = [
            { day: 'Wed 26', hour: '9:00' },
            { day: 'Fri 28', hour: '12:00' },
        ];
        return bookedSlots.some((s) => s.day === day && s.hour === hour);
    };

    const handleSelect = (day, hour) => {
        if (!isBooked(day, hour)) {
            setSelectedSlot({ day, hour });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-5">
            {/* Lịch */}
            <div className="flex gap-4 max-w-4xl pb-6">
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
                            <div className="text-right pr-2">{hour}</div>
                            {days.map((day) => {
                                const isSelected =
                                    selectedSlot?.day === day &&
                                    selectedSlot?.hour === hour;
                                const booked = isBooked(day, hour);
                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        onClick={() => handleSelect(day, hour)}
                                        className={clsx(
                                            'w-20 h-10 m-0.5 rounded cursor-pointer',
                                            booked && 'bg-gray-500',
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

                {/* Thông tin phòng */}
                <div className="w-64 pt-4">
                    <Card>
                        <p>📍 Phòng 602, Tòa H6, Cơ sở 2</p>
                        <p>👥 Sức chứa: 15 Sinh viên</p>
                        <p>💻 Có trang bị máy chiếu</p>
                        <p>📶 Có trang bị wifi</p>
                    </Card>
                    <div className='py-3'></div>
                    <Card>
                        <div className=" text-sm">
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
                    <Button type="primary" className="mt-4 w-full">
                        Xác nhận đặt phòng
                    </Button>
                </div>
            </div>

            <div class="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h2 class="text-2xl font-bold mb-4 text-blue-700">
                    Hướng dẫn đặt phòng
                </h2>

                <ol class="list-decimal space-y-4 pl-5">
                    <li>
                        <p class="font-semibold">Chọn khung giờ:</p>
                        <ul class="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                            <li>
                                Mở lịch đặt phòng và chọn các ô giờ bạn muốn đặt
                                (mỗi ô tương ứng với 30 phút).
                            </li>
                            <li>
                                Bạn có thể đặt tối đa 5 tiếng liên tục trong
                                khung giờ hoạt động từ 8:00 đến 17:00.
                            </li>
                            <li>
                                Không thể đặt ngắt quãng trong cùng một lần đặt.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p class="font-semibold">Xác nhận đặt phòng:</p>
                        <ul class="list-disc pl-5 mt-1 space-y-1 text-gray-700">
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
                        <p class="font-semibold">Lưu ý khi đặt phòng:</p>
                        <ul class="list-disc pl-5 mt-1 space-y-1 text-gray-700">
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

                <h2 class="text-2xl font-bold mt-10 mb-4 text-green-700">
                    Lưu ý khi sử dụng phòng
                </h2>

                <ol class="list-decimal space-y-4 pl-5" start="4">
                    <li>
                        <span class="font-semibold">Thời gian hoạt động:</span>{' '}
                        Phòng mở cửa từ 8:00 đến 17:00 hằng ngày.
                    </li>
                    <li>
                        <span class="font-semibold">Số lượng người:</span> Không
                        vượt quá sức chứa tối đa của phòng.
                    </li>
                    <li>
                        <span class="font-semibold">Giữ trật tự:</span> Tránh
                        nói chuyện to hoặc gây ồn ào, ảnh hưởng đến người khác.
                    </li>
                    <li>
                        <span class="font-semibold">Vệ sinh:</span> Dọn dẹp gọn
                        gàng và giữ gìn vệ sinh chung sau khi sử dụng.
                    </li>
                    <li>
                        <span class="font-semibold">Thiết bị:</span> Sử dụng
                        thiết bị đúng cách, bảo quản khi phát sinh sự cố.
                    </li>
                    <li>
                        <span class="font-semibold">Cấm ăn uống:</span> Không
                        mang thức ăn, nước uống vào phòng để tránh gây bẩn.
                    </li>
                    <li>
                        <span class="font-semibold">Trách nhiệm:</span> Người
                        đặt phòng chịu trách nhiệm về mọi hư hỏng hoặc mất mát
                        trong thời gian sử dụng.
                    </li>
                    <li>
                        <span class="font-semibold">Tuân thủ:</span> Thực hiện
                        đúng các nội dung đã đăng ký và tuân thủ nội quy phòng.
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default RoomBookingCalendar;
