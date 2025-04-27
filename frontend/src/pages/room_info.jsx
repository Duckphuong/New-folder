import React from 'react';
import {
    EnvironmentOutlined,
    UserOutlined,
    WifiOutlined,
    FundProjectionScreenOutlined,
} from '@ant-design/icons';
import { Carousel, Spin } from 'antd';
import img1 from '../assets/slide/sanbong.jpeg';
import img2 from '../assets/slide/slbk.jpg';
import img3 from '../assets/slide/slbktv.jpg';
import { useNavigate, useLocation } from 'react-router-dom';

const RoomDetail = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const room = React.useMemo(() => state?.room || {}, [state]);
    console.log('check id', room.RoomID);

    if (!room) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-5">
            <div className="hidden md:grid md:grid-cols-3 gap-4">
                <img
                    src={img1}
                    alt="Room view"
                    className="row-span-3 md:col-span-2 rounded-xl object-cover h-60 w-full"
                />
                <img
                    src={img2}
                    alt="Room view 2"
                    className="rounded-xl object-cover h-28 w-full"
                />
                <img
                    src={img3}
                    alt="Room view 3"
                    className="rounded-xl object-cover h-28 w-full"
                />
            </div>
            <div className="md:hidden">
                <Carousel
                    autoplay
                    className="rounded-xl overflow-hidden shadow-md"
                >
                    <img src={img1} className="w-full h-64 object-cover" />
                    <img src={img2} className="w-full h-64 object-cover" />
                    <img src={img3} className="w-full h-64 object-cover" />
                </Carousel>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="md:col-span-2">
                    <h1 className="text-2xl font-bold">
                        {room.RoomType} {room.RoomName}
                    </h1>
                    <div className="flex items-center text-gray-600 font-bold my-2">
                        <EnvironmentOutlined className="mr-1" />
                        {room.RoomName || 'Không rõ vị trí'} - Cơ sở 2
                    </div>

                    <p className="text-gray-700 text-justify my-6">
                        Phòng tự học H6-602 là không gian lý tưởng cho các bạn
                        sinh viên tìm kiếm môi trường yên tĩnh để tập trung học
                        tập và làm việc nhóm. Nằm trên tầng 6 của tòa nhà H6,
                        phòng được thiết kế hiện đại với sức chứa lên đến 15
                        người. Hệ thống ánh sáng và điều hòa được bố trí hợp lý,
                        tạo cảm giác thoải mái và dễ chịu trong suốt quá trình
                        học tập. Bàn ghế được sắp xếp khoa học, đảm bảo đủ không
                        gian cho từng người, đồng thời cho phép linh hoạt thay
                        đổi theo nhu cầu sử dụng.
                    </p>
                    <p className="text-gray-700 text-justify">
                        Phòng H6-602 còn được trang bị mạng Wi-Fi tốc độ cao,
                        thuận tiện cho việc tra cứu tài liệu và làm việc trực
                        tuyến. Ngoài ra, hệ thống bàn ghế và máy chiếu sẵn có
                        giúp hỗ trợ hiệu quả cho các buổi thảo luận và trình bày
                        nhóm. Không gian yên tĩnh, cùng với thiết kế thân thiện
                        với người dùng, giúc lưu giữ năng lượng cao hiệu quả và
                        tập trung tối đa cho việc học.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() =>
                            navigate(`/booking/${room.RoomID}`, {
                                state: { room },
                            })
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        Xem thời gian phòng trống
                    </button>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">
                            Thông tin
                        </h2>
                        <div className="flex items-start gap-2 text-gray-700 mb-1">
                            <EnvironmentOutlined className="w-4 h-4 mt-1" />
                            <span>{room.RoomName || 'Không rõ vị trí'}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-700 mb-1">
                            <UserOutlined className="w-4 h-4 mt-1" />
                            <span>
                                Sức chứa:{' '}
                                {room.RoomCapacity || 'Không giới hạn'} sinh
                                viên
                            </span>
                        </div>

                        <div className="flex items-start gap-2 text-gray-700 mb-1">
                            <FundProjectionScreenOutlined className="w-4 h-4 mt-1" />
                            {room.HasProjector ? 'Có' : 'Không'}
                            <span>trang bị máy chiếu</span>
                        </div>

                        <div className="flex items-start gap-2 text-gray-700">
                            <WifiOutlined className="w-4 h-4 mt-1" />
                            <span>Có trang bị wifi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
