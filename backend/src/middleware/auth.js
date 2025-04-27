const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    const white_lists = ['/', '/login', '/register', '/write'];

    // Kiểm tra nếu URL thuộc white list thì cho phép truy cập mà không cần token
    if (white_lists.find((item) => '/v1/api' + item === req.originalUrl)) {
        return next();
    }

    // Kiểm tra token trong header
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        // Xác thực token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                email: decoded.email,
                name: decoded.name,
                role: decoded.role,
                CCCD: decoded.CCCD,
                id: decoded.id,
                createdBy: 'duckphuong',
            };
            console.log('decoded', decoded);

            // Phân quyền dựa trên role và URL
            const url = req.originalUrl.replace('/v1/api', ''); // Chuẩn hóa URL

            if (req.user.role === 'admin') {
                if (url === '/history') {
                    // Trả về JSON để frontend xử lý redirect
                    return res.status(200).json({
                        redirect: '/historyall',
                    });
                }
                // Admin được phép truy cập tất cả các route, bao gồm /user và /historyall
                return next();
            }

            if (url === '/user') {
                return res.status(403).json({
                    message:
                        'Bạn không có quyền truy cập route này! (Chỉ dành cho admin)',
                    redirect: '/profile',
                });
            }

            if (url === '/historyall') {
                return res.status(403).json({
                    message:
                        'Bạn không có quyền truy cập route này! (Chỉ dành cho admin)',
                    redirect: '/history',
                });
            }

            // Các role khác được phép truy cập các route còn lại (bao gồm /history)
            return next();
        } catch (error) {
            return res.status(401).json({
                message: 'Token bị hết hạn/ không hợp lệ',
            });
        }
    }

    // Nếu không có token trong header
    return res.status(401).json({
        message: 'Bạn chưa truyền access token ở header/Token bị hết hạn',
    });
};

module.exports = auth;
