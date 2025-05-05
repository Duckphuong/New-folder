import { useEffect, useState } from 'react';
import {
    WifiOutlined,
    CommentOutlined,
    DesktopOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import img1 from '../assets/slide/sanbong.jpeg';
import { getAllRoomsApi } from '../util/api';

const ListRoom = ({ filters }) => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getAllRoomsApi();
            console.log('check res>>>>> ', res);

            if (!res?.message) {
                setRooms(res);
            }
        };
        fetchUser();
    }, []);

    const filteredRooms = Array.isArray(rooms)
        ? rooms.filter((room) => {
              if (filters.roomType && room.RoomType !== filters.roomType)
                  return false;
              return true;
          })
        : [];

    return (
        <div className="max-w-5xl mx-auto p-5">
            <div className="font-bold text-3xl pb-10">Danh sách phòng học</div>

            {filteredRooms.map((room) => (
                <div
                    key={room.RoomID}
                    className="bg-white rounded border-[0.5px] border-[#f0f0f0] p-4 flex flex-col md:flex-row gap-4 items-center shadow-md mb-4"
                >
                    <img
                        src={img1}
                        alt="Phòng học"
                        className="w-full md:w-60 h-50 object-cover rounded"
                    />
                    <div className="flex flex-row w-full">
                        <div className="flex-1">
                            <h2 className="text-base font-bold">
                                {room.RoomType} - {room.RoomName}
                            </h2>
                            <div className="py-3">
                                <span className="text-yellow-500 pr-1">
                                    <UserOutlined />
                                </span>
                                {room.RoomCapacity
                                    ? `${room.RoomCapacity} sinh viên`
                                    : 'Không giới hạn'}
                            </div>
                            <div>
                                Phòng được trang bị Wi-Fi tốc độ cao, bảng trắng
                                và máy chiếu, hỗ trợ hiệu quả cho việc học tập
                                cá nhân và làm việc nhóm. Môi trường yên tĩnh và
                                tiện nghi giúp sinh viên tập trung tối đa vào
                                việc học.
                            </div>
                            <div className="pt-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        navigate(`/room/${room.RoomID}`, {
                                            state: { room },
                                        })
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(`/booking/${room.RoomID}`, {
                                            state: { room },
                                        })
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                                >
                                    Đặt phòng
                                </button>
                            </div>
                        </div>
                        <div className="w-12 flex justify-end items-start">
                            <div className="flex gap-2 text-yellow-500 text-xl">
                                <WifiOutlined />
                                <CommentOutlined />
                                <DesktopOutlined />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ListRoom;
