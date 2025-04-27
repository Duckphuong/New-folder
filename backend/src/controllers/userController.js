const {
    createUserService,
    loginService,
    getUsersService,
    getUserService,
    deleteUser,
    createMessService,
    getBlogService,
    getAllRoomsService,
    getRoomService,
    postBookingService,
    getBookedSlotsService,
    getHistoryService,
    getHistoryAllService,
    getViolateAllService,
    postStatusService,
    updateUserService,
} = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const { name, email, password, LName, FName, CCCD, BDate } = req.body;
        const data = await createUserService(
            name,
            email,
            password,
            LName,
            FName,
            CCCD,
            BDate
        );
        return res.status(200).json({ status: 200, data });
    } catch (e) {
        res.status(400).json({
            error: e.message,
        });
    }
};

const handleLogin = async (req, res) => {
    const { email, password, role } = req.body;
    const data = await loginService(email, password, role);
    return res.status(200).json(data);
};

const getUsers = async (req, res) => {
    const data = await getUsersService();
    return res.status(200).json(data);
};

const getUser = async (req, res) => {
    const { id } = req.params;
    const data = await getUserService(id);
    return res.status(200).json(data);
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};

const handleDeleteUser = async (req, res) => {
    await deleteUser(req, res);
};

const createMess = async (req, res) => {
    try {
        const { name, email, mess } = req.body;
        const data = await createMessService(name, email, mess);
        return res.status(200).json({ status: 200, data });
    } catch (e) {
        res.status(400).json({
            error: e.message,
        });
    }
};

const getBlog = async (req, res) => {
    const data = await getBlogService();
    return res.status(200).json(data);
};

const getAllRooms = async (req, res) => {
    const data = await getAllRoomsService();
    return res.status(200).json(data);
};

const getRoom = async (req, res) => {
    const { roomID } = req.params;
    const data = await getRoomService(roomID);
    return res.status(200).json(data);
};

const createBooking = async (req, res) => {
    try {
        const { roomID, bookingData } = req.body;
        const data = await postBookingService(roomID, bookingData);
        return res.status(200).json({ status: 200, data });
    } catch (e) {
        res.status(400).json({
            error: e.message,
        });
    }
};

const getBookedSlots = async (req, res) => {
    const { roomID } = req.params;
    try {
        const data = await getBookedSlotsService(roomID);
        return res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            error: e.message,
        });
    }
};

const getHistory = async (req, res) => {
    const CCCD = req.user.CCCD;
    console.log('CCCD:', CCCD);

    try {
        const data = await getHistoryService(CCCD);
        return res.status(200).json(data);
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Lỗi khi truy xuất lịch sử' });
    }
};

const getHistoryAll = async (req, res) => {
    const data = await getHistoryAllService();
    return res.status(200).json(data);
};

const getViolateAll = async (req, res) => {
    const data = await getViolateAllService();
    return res.status(200).json(data);
};

const postCancel = async (req, res) => {
    const { TicketID } = req.params;
    const { action, daytime } = req.body;

    try {
        const result = await postStatusService(TicketID, action, daytime);
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await updateUserService(id, data);
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUser,
    handleLogin,
    getUsers,
    getUser,
    getAccount,
    handleDeleteUser,
    createMess,
    getBlog,
    getAllRooms,
    getRoom,
    createBooking,
    getBookedSlots,
    getHistory,
    getHistoryAll,
    getViolateAll,
    postCancel,
    updateUser,
};
