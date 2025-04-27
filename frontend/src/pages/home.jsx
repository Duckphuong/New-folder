import SearchBar from '../components/layout/search_bar';
import ScrollToTop from '../components/layout/scroll_to_top';
import { Carousel } from 'antd';
import img1 from '../assets/slide/sanbong.jpeg';
import img2 from '../assets/slide/slbk.jpg';
import img3 from '../assets/slide/slbktv.jpg';
import ListRoom from './list_room';

function HomePage() {
    return (
        <div className="p-3 h-100vh bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <Carousel
                    autoplay
                    className="rounded-xl overflow-hidden shadow-md"
                >
                    <img src={img1} className="w-full h-64 object-cover" />
                    <img src={img2} className="w-full h-64 object-cover" />
                    <img src={img3} className="w-full h-64 object-cover" />
                </Carousel>
            </div>

            <div className="flex justify-center items-center absolute top-[-80px] left-0 right-0 bottom-0">
                <SearchBar />
            </div>

            <div className=" text-gray-800 p-8 pt-20 ">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-10 pt-12">
                    <h2 className="text-2xl font-bold mb-4">
                        Hướng dẫn Tìm phòng tự học
                    </h2>
                    <ol className="list-decimal space-y-3 pl-6">
                        <li>
                            <span className="font-semibold">Chọn Cơ sở</span>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
                                <li>Chọn cơ sở của trường phù hợp với bạn.</li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">Chọn Ngày</span>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
                                <li>
                                    Xác định ngày mà bạn muốn đặt phòng tự học.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">
                                Chọn Giờ bắt đầu & kết thúc
                            </span>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
                                <li>
                                    Xác định khoảng thời gian mà bạn muốn lọc
                                    tìm kiếm những phòng tự học còn trống.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">
                                Chọn Loại phòng
                            </span>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
                                <li>Xác định Loại phòng mà bạn muốn đặt.</li>
                            </ul>
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold mt-10 mb-4">
                        Nội quy phòng tự học
                    </h2>
                    <ol className="list-decimal pl-6 space-y-2" start="5">
                        <li>
                            <span className="font-semibold">
                                Thời gian hoạt động:
                            </span>{' '}
                            Phòng mở cửa từ 8:00 đến 17:00 hằng ngày.
                        </li>
                        <li>
                            <span className="font-semibold">
                                Số lượng người:
                            </span>{' '}
                            Không vượt quá sức chứa tối đa của phòng.
                        </li>
                        <li>
                            <span className="font-semibold">Giữ trật tự:</span>{' '}
                            Tránh nói chuyện to hoặc gây ồn ào, ảnh hưởng đến
                            người khác.
                        </li>
                        <li>
                            <span className="font-semibold">Vệ sinh:</span> Dọn
                            dẹp gọn gàng và giữ gìn vệ sinh chung sau khi sử
                            dụng.
                        </li>
                        <li>
                            <span className="font-semibold">Thiết bị:</span> Sử
                            dụng thiết bị đúng cách, báo ngay khi phát sinh sự
                            cố.
                        </li>
                        <li>
                            <span className="font-semibold">Cấm ăn uống:</span>{' '}
                            Không mang thức ăn, nước uống vào phòng để tránh gây
                            bẩn.
                        </li>
                        <li>
                            <span className="font-semibold">Trách nhiệm:</span>{' '}
                            Người đặt phòng chịu trách nhiệm về mọi hư hỏng hoặc
                            mất mát trong thời gian sử dụng.
                        </li>
                        <li>
                            <span className="font-semibold">Tuân thủ:</span>{' '}
                            Thực hiện đúng các quy định và hướng dẫn từ quản lý
                            phòng.
                        </li>
                    </ol>
                </div>
            </div>
            <ListRoom />
            <ScrollToTop />
        </div>
    );
}

export default HomePage;
